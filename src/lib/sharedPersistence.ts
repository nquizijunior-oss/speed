const TABLE = 'app_shared_edits';
const SYNC_EVENT = 'speedpermis:shared-edit';
const KNOWN_KEYS = 'speedpermis_shared_known_keys';
const SOURCE_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
const POLL_MS = 2000;

let ready = false;
let endpoint = '';
let publicKey = '';
let originalSetItem: Storage['setItem'] | null = null;
let originalRemoveItem: Storage['removeItem'] | null = null;
let applyingRemote = false;
let timer: number | undefined;

function config() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

function isInternal(key: string) {
  return key === KNOWN_KEYS;
}

function safeSet(key: string, value: string) {
  try { (originalSetItem || Storage.prototype.setItem).call(window.localStorage, key, value); } catch { /* ignore */ }
}

function emit(key: string, value?: string) {
  window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key, value, source: SOURCE_ID } }));
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

      // Only delete keys that this app previously knew were shared. This prevents
      // unrelated browser localStorage entries from being deleted.
      for (const key of knownKeys) {
        if (!remoteKeys.has(key) && window.localStorage.getItem(key) !== null) {
          (originalRemoveItem || Storage.prototype.removeItem).call(window.localStorage, key);
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

export async function initSharedPersistence() {
  if (typeof window === 'undefined' || ready) return;
  const cfg = config();
  if (!cfg) {
    ready = true;
    return;
  }

  endpoint = cfg.url;
  publicKey = cfg.key;
  originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  const existingLocal = Object.entries(window.localStorage).filter(([key]) => !isInternal(key));

  try {
    const rows = await fetchRows();
    if (rows.length) {
      applyingRemote = true;
      for (const row of rows) {
        if (!isInternal(row.key)) safeSet(row.key, row.value);
      }
      safeSet(KNOWN_KEYS, JSON.stringify(rows.map(row => row.key).filter(key => !isInternal(key))));
      applyingRemote = false;
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
  timer = window.setInterval(() => void syncFromServer(), POLL_MS);
}

export function hasSharedPersistence() {
  return Boolean(config());
}

export function stopSharedPersistence() {
  if (timer) window.clearInterval(timer);
  timer = undefined;
}
