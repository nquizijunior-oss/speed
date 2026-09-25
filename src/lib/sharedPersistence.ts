const TABLE = 'app_shared_edits';
const SYNC_EVENT = 'speedpermis:shared-edit';
const REALTIME_STATUS_EVENT = 'speedpermis:realtime-status';
const KNOWN_KEYS = 'speedpermis_shared_known_keys';
const AUTH_KEY = 'speedpermis_authenticated';
const SOURCE_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const RECONNECT_MS = 2500;

let ready = false;
let endpoint = '';
let publicKey = '';
let originalSetItem: Storage['setItem'] | null = null;
let originalRemoveItem: Storage['removeItem'] | null = null;
let applyingRemote = false;
let socket: WebSocket | null = null;
let reconnectTimer: number | undefined;
let heartbeatTimer: number | undefined;
let joinRef = 0;
let realtimeConnected = false;
let stopped = false;

function config() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

function isInternal(key: string) {
  return key === KNOWN_KEYS || key === AUTH_KEY;
}

function safeSet(key: string, value: string) {
  try { (originalSetItem || Storage.prototype.setItem).call(window.localStorage, key, value); } catch { /* ignore */ }
}

function safeRemove(key: string) {
  try { (originalRemoveItem || Storage.prototype.removeItem).call(window.localStorage, key); } catch { /* ignore */ }
}

function emit(key: string, value?: string) {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value, source: SOURCE_ID } }));
}

function emitRealtimeStatus(status: 'connecting' | 'connected' | 'disconnected') {
  realtimeConnected = status === 'connected';
  window.dispatchEvent(new CustomEvent(REALTIME_STATUS_EVENT, { detail: { status } }));
}

async function request(path = '', init: RequestInit = {}) {
  return fetch(`${endpoint}/rest/v1/${TABLE}${path}`, {
    ...init,
    headers: {
      apikey: publicKey,
      Authorization: `Bearer ${publicKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function upsert(key: string, value: string) {
  if (!ready || applyingRemote || isInternal(key)) return;
  try {
    const response = await request('', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ key, value, updated_by: SOURCE_ID }),
    });
    if (!response.ok) console.warn(`Could not sync "${key}":`, await response.text());
  } catch (error) {
    console.warn(`Could not sync "${key}" to Supabase:`, error);
  }
}

async function removeRemote(key: string) {
  if (!ready || applyingRemote || isInternal(key)) return;
  try {
    const response = await request(`?key=eq.${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (!response.ok) console.warn(`Could not remove "${key}":`, await response.text());
  } catch (error) {
    console.warn(`Could not remove "${key}" from Supabase:`, error);
  }
}

async function fetchRows() {
  const response = await request('?select=key,value,updated_by,updated_at');
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return await response.json() as Array<{ key: string; value: string; updated_by?: string; updated_at?: string }>;
}

async function syncFromServer() {
  if (!ready) return;
  try {
    const rows = await fetchRows();
    const remoteKeys = new Set(rows.map(row => row.key).filter(key => !isInternal(key)));
    const knownKeys = new Set<string>(JSON.parse(window.localStorage.getItem(KNOWN_KEYS) || '[]'));

    applyingRemote = true;
    try {
      for (const row of rows) {
        if (isInternal(row.key)) continue;
        if (window.localStorage.getItem(row.key) !== row.value) {
          safeSet(row.key, row.value);
          emit(row.key, row.value);
        }
      }

      for (const key of knownKeys) {
        if (!remoteKeys.has(key) && window.localStorage.getItem(key) !== null) {
          safeRemove(key);
          emit(key);
        }
      }

      safeSet(KNOWN_KEYS, JSON.stringify([...remoteKeys]));
    } finally {
      applyingRemote = false;
    }
  } catch (error) {
    console.warn('Supabase shared-state sync failed:', error);
  }
}

function realtimeUrl() {
  const wsBase = endpoint.replace(/^http/, 'ws');
  return `${wsBase}/realtime/v1/websocket?apikey=${encodeURIComponent(publicKey)}&vsn=1.0.0`;
}

function sendRealtime(event: string, payload: unknown, ref?: string) {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify({
    topic: `realtime:${TABLE}`,
    event,
    payload,
    ref: ref ?? String(++joinRef),
  }));
}

function clearRealtimeTimers() {
  if (reconnectTimer) window.clearTimeout(reconnectTimer);
  if (heartbeatTimer) window.clearInterval(heartbeatTimer);
  reconnectTimer = undefined;
  heartbeatTimer = undefined;
}

function scheduleReconnect() {
  if (stopped || reconnectTimer || !ready) return;
  reconnectTimer = window.setTimeout(() => {
    reconnectTimer = undefined;
    connectRealtime();
  }, RECONNECT_MS);
}

function handleRealtimeChange(data: any) {
  const change = data?.data ?? data;
  const record = change?.record as { key?: string; value?: string; updated_by?: string } | undefined;
  const oldRecord = change?.old_record as { key?: string } | undefined;
  const eventType = change?.type;

  if (eventType === 'DELETE') {
    const key = oldRecord?.key;
    if (!key || isInternal(key)) return;
    if (window.localStorage.getItem(key) !== null) {
      applyingRemote = true;
      try { safeRemove(key); } finally { applyingRemote = false; }
      emit(key);
    }
    return;
  }

  const key = record?.key;
  if (!key || isInternal(key) || typeof record?.value !== 'string') return;
  if (record.updated_by === SOURCE_ID) return;

  if (window.localStorage.getItem(key) !== record.value) {
    applyingRemote = true;
    try { safeSet(key, record.value); } finally { applyingRemote = false; }
    emit(key, record.value);
  }
}

function connectRealtime() {
  if (stopped || !ready || typeof WebSocket === 'undefined') return;
  clearRealtimeTimers();
  try { socket?.close(); } catch { /* ignore */ }

  emitRealtimeStatus('connecting');
  const ws = new WebSocket(realtimeUrl());
  socket = ws;

  ws.onopen = () => {
    if (socket !== ws) return;
    sendRealtime('phx_join', {
      config: {
        broadcast: { ack: false, self: false },
        presence: { key: '' },
        postgres_changes: [{ event: '*', schema: 'public', table: TABLE }],
      },
      access_token: publicKey,
    }, String(++joinRef));

    heartbeatTimer = window.setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        sendRealtime('heartbeat', {}, String(++joinRef));
      }
    }, 25_000);
  };

  ws.onmessage = (message) => {
    try {
      const parsed = JSON.parse(message.data);
      if (parsed.event === 'phx_reply' && parsed.payload?.status === 'ok') {
        emitRealtimeStatus('connected');
        void syncFromServer();
        return;
      }
      if (parsed.event === 'postgres_changes') {
        handleRealtimeChange(parsed.payload);
        return;
      }
      if (parsed.event === 'system_error' || parsed.event === 'phx_error') {
        console.warn('Supabase Realtime error:', parsed.payload);
      }
    } catch (error) {
      console.warn('Could not process Supabase Realtime message:', error);
    }
  };

  ws.onerror = () => {
    emitRealtimeStatus('disconnected');
  };

  ws.onclose = () => {
    if (socket !== ws) return;
    socket = null;
    clearRealtimeTimers();
    emitRealtimeStatus('disconnected');
    scheduleReconnect();
  };
}

export async function initSharedPersistence() {
  if (typeof window === 'undefined' || ready) return;
  const cfg = config();
  if (!cfg) {
    ready = true;
    return;
  }

  stopped = false;
  endpoint = cfg.url;
  publicKey = cfg.key;
  originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  const existingLocal = Object.entries(window.localStorage).filter(([key]) => !isInternal(key));

  try {
    const rows = await fetchRows();
    if (rows.length) {
      applyingRemote = true;
      try {
        for (const row of rows) {
          if (!isInternal(row.key)) safeSet(row.key, row.value);
        }
        safeSet(KNOWN_KEYS, JSON.stringify(rows.map(row => row.key).filter(key => !isInternal(key))));
      } finally {
        applyingRemote = false;
      }
    } else if (existingLocal.length) {
      const payload = existingLocal.map(([key, value]) => ({ key, value, updated_by: SOURCE_ID }));
      const response = await request('', {
        method: 'POST',
        headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) console.warn('Could not seed Supabase from existing local data:', await response.text());
    }
  } catch (error) {
    console.warn('Supabase shared-state bootstrap failed:', error);
  }

  window.localStorage.setItem = (key: string, value: string) => {
    originalSetItem!.call(window.localStorage, key, value);
    if (!applyingRemote) void upsert(key, value);
  };

  window.localStorage.removeItem = (key: string) => {
    originalRemoveItem!.call(window.localStorage, key);
    if (!applyingRemote) void removeRemote(key);
  };

  ready = true;
  void syncFromServer();
  connectRealtime();
}

export function hasSharedPersistence() {
  return Boolean(config());
}

export function isRealtimeConnected() {
  return realtimeConnected;
}

export function stopSharedPersistence() {
  stopped = true;
  clearRealtimeTimers();
  try { socket?.close(); } catch { /* ignore */ }
  socket = null;
  emitRealtimeStatus('disconnected');
}
