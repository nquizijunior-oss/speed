const TABLE = 'app_shared_edits';
const SYNC_EVENT = 'speedpermis:shared-edit';
const SOURCE_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`;

let ready = false;
let timer: number | undefined;
let endpoint = '';
let anonKey = '';
let originalSetItem: Storage['setItem'] | null = null;
let originalRemoveItem: Storage['removeItem'] | null = null;
let applyingRemote = false;

function config() {
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
  if (!url || !key) return null;
  return { url: url.replace(/\/$/, ''), key };
}

function safeSet(key: string, value: string) {
  try { (originalSetItem || Storage.prototype.setItem).call(window.localStorage, key, value); } catch { /* ignore */ }
}

async function request(path: string, init: RequestInit = {}) {
  return fetch(`${endpoint}/rest/v1/${TABLE}${path}`, {
    ...init,
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${anonKey}`,
      'Content-Type': 'application/json',
      ...(init.headers || {}),
    },
  });
}

async function fetchSharedRows() {
  const response = await request('?select=key,value,updated_by');
  if (!response.ok) throw new Error(`${response.status} ${await response.text()}`);
  return await response.json() as Array<{ key: string; value: string; updated_by?: string }>;
}

async function syncKey(key: string, value: string) {
  if (!ready || applyingRemote) return;
  try {
    const response = await request('', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
      body: JSON.stringify({ key, value, updated_by: SOURCE_ID }),
    });
    if (!response.ok) console.warn(`Could not sync "${key}":`, await response.text());
  } catch (error) {
    console.warn(`Could not sync "${key}" to the shared database:`, error);
  }
}

async function removeKey(key: string) {
  if (!ready || applyingRemote) return;
  try {
    const response = await request(`?key=eq.${encodeURIComponent(key)}`, { method: 'DELETE' });
    if (!response.ok) console.warn(`Could not remove "${key}":`, await response.text());
  } catch (error) {
    console.warn(`Could not remove "${key}" from the shared database:`, error);
  }
}

async function poll() {
  if (!ready) return;
  try {
    const rows = await fetchSharedRows();
    const remoteKeys = new Set(rows.map(row => row.key));
    applyingRemote = true;
    for (const row of rows) {
      const current = window.localStorage.getItem(row.key);
      if (current !== row.value) {
        safeSet(row.key, row.value);
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key: row.key } }));
      }
    }
    // Only remove locally persisted edit keys that the shared database explicitly removed.
    // This avoids touching unrelated browser data.
    const knownKeys = JSON.parse(window.localStorage.getItem('speedpermis_shared_known_keys') || '[]') as string[];
    for (const key of knownKeys) {
      if (!remoteKeys.has(key) && window.localStorage.getItem(key) !== null) {
        (originalRemoveItem || Storage.prototype.removeItem).call(window.localStorage, key);
        window.dispatchEvent(new CustomEvent(SYNC_EVENT, { detail: { key } }));
      }
    }
    safeSet('speedpermis_shared_known_keys', JSON.stringify([...remoteKeys]));
  } catch (error) {
    console.warn('Shared persistence sync failed:', error);
  } finally {
    applyingRemote = false;
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
  anonKey = cfg.key;

  originalSetItem = window.localStorage.setItem.bind(window.localStorage);
  originalRemoveItem = window.localStorage.removeItem.bind(window.localStorage);

  const existingLocal = Object.fromEntries(Object.entries(window.localStorage));
  try {
    const rows = await fetchSharedRows();
    if (rows.length) {
      for (const row of rows) safeSet(row.key, row.value);
      safeSet('speedpermis_shared_known_keys', JSON.stringify(rows.map(row => row.key)));
    } else {
      // First deployment: migrate existing browser edits to the shared database.
      const candidates = Object.entries(existingLocal)
        .filter(([key]) => key !== 'speedpermis_shared_known_keys')
        .map(([key, value]) => ({ key, value, updated_by: SOURCE_ID }));
      if (candidates.length) {
        const response = await request('', {
          method: 'POST',
          headers: { Prefer: 'resolution=merge-duplicates,return=minimal' },
          body: JSON.stringify(candidates),
        });
        if (!response.ok) console.warn('Could not migrate existing browser edits:', await response.text());
      }
    }
  } catch (error) {
    console.warn('Shared persistence bootstrap failed:', error);
  }

  window.localStorage.setItem = (key: string, value: string) => {
    originalSetItem!.call(window.localStorage, key, value);
    void syncKey(key, value);
  };
  window.localStorage.removeItem = (key: string) => {
    originalRemoveItem!.call(window.localStorage, key);
    void removeKey(key);
  };

  ready = true;
  void poll();
  timer = window.setInterval(() => void poll(), 5000);
}

export function hasSharedPersistence() {
  return Boolean(config());
}
