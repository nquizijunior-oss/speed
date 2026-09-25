import { useEffect } from 'react';

const INTERACTIVE_SELECTOR = 'button, a, [role="button"], [role="tab"], [role="menuitem"]';
const EXCLUDED_SELECTOR = [
  'input', 'textarea', 'select', 'option', 'script', 'style', 'svg',
  '[contenteditable="true"]', '[data-inline-editing]', '[data-no-global-edit]',
  '[data-global-editor]'
].join(',');

function isExcluded(node: Node) {
  const el = node.nodeType === Node.ELEMENT_NODE ? node as Element : node.parentElement;
  return !!el && (el.matches(EXCLUDED_SELECTOR) || !!el.closest(EXCLUDED_SELECTOR));
}

function siblingIndex(element: Element) {
  let index = 0;
  let sibling = element.previousElementSibling;
  while (sibling) { index += 1; sibling = sibling.previousElementSibling; }
  return index;
}

function elementPath(element: Element) {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body && current !== document.documentElement) {
    const identity = current.id ? `#${current.id}` : `${current.tagName.toLowerCase()}:${siblingIndex(current)}`;
    parts.unshift(identity);
    current = current.parentElement;
  }
  return parts.join('/');
}

function textNodeIndex(node: Text) {
  const parent = node.parentElement;
  if (!parent) return 0;
  let index = 0;
  for (const child of Array.from(parent.childNodes)) {
    if (child === node) return index;
    if (child.nodeType === Node.TEXT_NODE) index += 1;
  }
  return index;
}

function keyForTextNode(node: Text) {
  const parent = node.parentElement;
  if (!parent) return '';
  return `ui:${elementPath(parent)}:text:${textNodeIndex(node)}`;
}

function textNodeAtPoint(x: number, y: number): Text | null {
  const doc = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range; caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } };
  if (doc.caretRangeFromPoint) {
    const range = doc.caretRangeFromPoint(x, y);
    if (range && range.startContainer.nodeType === Node.TEXT_NODE) return range.startContainer as Text;
  }
  if (doc.caretPositionFromPoint) {
    const position = doc.caretPositionFromPoint(x, y);
    if (position && position.offsetNode.nodeType === Node.TEXT_NODE) return position.offsetNode as Text;
  }
  return null;
}

function isEditableTextNode(node: Node): node is Text {
  if (node.nodeType !== Node.TEXT_NODE) return false;
  const text = node.textContent?.trim();
  if (!text || isExcluded(node)) return false;
  const parent = node.parentElement;
  if (!parent) return false;
  if (parent.closest('input, textarea, select, option, script, style, svg')) return false;
  return true;
}

function textNodes(root: ParentNode = document.body) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const result: Text[] = [];
  let node: Node | null;
  while ((node = walker.nextNode())) {
    if (isEditableTextNode(node)) result.push(node as Text);
  }
  return result;
}

function applySavedEdits(edits: Record<string, string>) {
  for (const node of textNodes()) {
    const key = keyForTextNode(node);
    const saved = edits[key];
    if (saved !== undefined && node.textContent?.trim() !== saved) {
      node.textContent = saved;
    }
    if (node.parentElement) {
      node.parentElement.dataset.globalEditKey = key;
      node.parentElement.style.cursor = 'pointer';
    }
  }
}

function loadEdits(): Record<string, string> {
  try {
    const raw = localStorage.getItem('speedpermis_global_text_edits');
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch { return {}; }
}

function saveEdits(edits: Record<string, string>) {
  localStorage.setItem('speedpermis_global_text_edits', JSON.stringify(edits));
}

function openEditor(node: Text, initial: string, save: (value: string) => void, cancel: () => void) {
  const parent = node.parentElement;
  if (!parent) return;
  const rect = parent.getBoundingClientRect();
  const input = document.createElement('input');
  input.type = 'text';
  input.value = initial;
  input.dataset.globalEditor = 'true';
  Object.assign(input.style, {
    position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`,
    width: `${Math.max(rect.width, 90)}px`, height: `${Math.max(rect.height, 28)}px`,
    zIndex: '2147483647', margin: '0', boxSizing: 'border-box',
    font: getComputedStyle(parent).font, color: getComputedStyle(parent).color,
    background: '#fff', border: '2px solid #2563eb', borderRadius: '4px',
    padding: '2px 6px', outline: 'none',
  });
  document.body.appendChild(input);
  input.focus();
  input.select();

  let finished = false;
  const finish = (shouldSave: boolean) => {
    if (finished) return;
    finished = true;
    const value = input.value.trim() || initial;
    input.remove();
    if (shouldSave) save(value); else cancel();
  };
  input.addEventListener('keydown', event => {
    if (event.key === 'Enter') { event.preventDefault(); finish(true); }
    if (event.key === 'Escape') { event.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
}

export function GlobalEditableText() {
  useEffect(() => {
    let disposed = false;
    let scheduled = false;
    const edits = loadEdits();
    const pendingClicks = new Map<HTMLElement, number>();

    const prepare = () => {
      if (disposed) return;
      applySavedEdits(edits);
    };

    const schedule = () => {
      if (scheduled || disposed) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; prepare(); });
    };

    const handlePlainClick = (event: MouseEvent) => {
      if (event.button !== 0 || event.detail !== 1) return;
      const target = event.target as Element | null;
      if (!target || isExcluded(target)) return;
      if (target.closest(INTERACTIVE_SELECTOR)) return;
      const node = textNodeAtPoint(event.clientX, event.clientY) || (target.textContent ? Array.from(target.childNodes).find(child => child.nodeType === Node.TEXT_NODE) as Text | undefined : undefined) || null;
      if (!node || !isEditableTextNode(node)) return;
      const parent = node.parentElement;
      if (!parent) return;
      event.preventDefault();
      event.stopPropagation();
      const key = keyForTextNode(node);
      const initial = node.textContent?.trim() || '';
      parent.style.cursor = 'text';
      openEditor(node, edits[key] ?? initial, value => {
        edits[key] = value;
        saveEdits(edits);
        node.textContent = value;
        parent.style.cursor = 'pointer';
      }, () => { parent.style.cursor = 'pointer'; });
    };

    const handleInteractive = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const element = (event.target as Element | null)?.closest?.(INTERACTIVE_SELECTOR) as HTMLElement | null;
      if (!element || isExcluded(element)) return;

      if (event.detail === 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const old = pendingClicks.get(element);
        if (old) window.clearTimeout(old);
        const timer = window.setTimeout(() => {
          pendingClicks.delete(element);
          element.click();
        }, 260);
        pendingClicks.set(element, timer);
        return;
      }

      if (event.detail < 2) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const timer = pendingClicks.get(element);
      if (timer) window.clearTimeout(timer);
      pendingClicks.delete(element);

      const node = textNodes(element)[0];
      if (!node) return;
      const key = keyForTextNode(node);
      const initial = node.textContent?.trim() || '';
      openEditor(node, edits[key] ?? initial, value => {
        edits[key] = value;
        saveEdits(edits);
        node.textContent = value;
        element.style.cursor = 'pointer';
      }, () => { element.style.cursor = 'pointer'; });
    };

    prepare();
    document.addEventListener('click', handleInteractive, true);
    document.addEventListener('click', handlePlainClick, true);
    const sharedListener = (event: Event) => {
      const detail = (event as CustomEvent).detail as { key?: string; value?: string } | undefined;
      if (!detail?.key) return;
      if (detail.key === 'speedpermis_global_text_edits') {
        Object.assign(edits, loadEdits());
        schedule();
      }
    };
    window.addEventListener('speedpermis:shared-edit', sharedListener);
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      document.removeEventListener('click', handleInteractive, true);
      document.removeEventListener('click', handlePlainClick, true);
      window.removeEventListener('speedpermis:shared-edit', sharedListener);
      pendingClicks.forEach(timer => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, []);

  return null;
}
