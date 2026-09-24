import { useEffect } from 'react';

const STORAGE_KEY = 'speedpermis_global_text_edits';

// Interactive controls keep their normal single-click behavior. Their visible
// text can be edited with a double-click using a temporary inline editor.
const INTERACTIVE_SELECTOR = 'button, a, [role="button"], [role="tab"], [role="menuitem"]';
const EXCLUDED_SELECTOR = [
  'input', 'textarea', 'select', 'option', 'script', 'style', 'svg',
  '[contenteditable="true"]', '[data-inline-editing]', '[data-no-global-edit]',
].join(',');

function loadEdits(): Record<string, string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

function saveEdits(edits: Record<string, string>) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(edits)); } catch { /* ignore */ }
}

function getPath(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    const parent = current.parentElement;
    if (!parent) break;
    parts.unshift(`${current.tagName.toLowerCase()}:${Array.prototype.indexOf.call(parent.children, current)}`);
    current = parent;
  }
  return parts.join('/');
}

function isExcluded(element: Element) {
  return element.matches(EXCLUDED_SELECTOR) || !!element.closest(EXCLUDED_SELECTOR);
}

function isPlainTextLeaf(element: Element): element is HTMLElement {
  if (!(element instanceof HTMLElement) || isExcluded(element)) return false;
  if (element.closest(INTERACTIVE_SELECTOR)) return false;
  if (!element.textContent?.trim()) return false;
  return element.children.length === 0 && Array.from(element.childNodes).every(n => n.nodeType === Node.TEXT_NODE);
}

function findPlainTextTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  let current: Element | null = target;
  while (current && current !== document.body) {
    if (isPlainTextLeaf(current)) return current;
    current = current.parentElement;
  }
  return null;
}

function findInteractiveTarget(target: EventTarget | null): HTMLElement | null {
  if (!(target instanceof Element)) return null;
  const interactive = target.closest(INTERACTIVE_SELECTOR);
  return interactive instanceof HTMLElement ? interactive : null;
}

function makeEditor(target: HTMLElement, initialValue: string, onSave: (value: string) => void, onCancel: () => void) {
  const rect = target.getBoundingClientRect();
  const input = document.createElement('input');
  input.type = 'text';
  input.value = initialValue;
  input.setAttribute('aria-label', 'Modifier le texte');
  input.dataset.globalEditor = 'true';
  Object.assign(input.style, {
    position: 'fixed', left: `${rect.left}px`, top: `${rect.top}px`,
    width: `${Math.max(rect.width, 80)}px`, height: `${Math.max(rect.height, 28)}px`,
    zIndex: '2147483647', margin: '0', boxSizing: 'border-box',
    font: getComputedStyle(target).font,
    color: getComputedStyle(target).color,
    background: '#fff', border: '2px solid #2563eb', borderRadius: '4px',
    padding: '2px 6px', outline: 'none',
  });
  document.body.appendChild(input);
  input.focus();
  input.select();

  let finished = false;
  const finish = (save: boolean) => {
    if (finished) return;
    finished = true;
    const value = input.value.trim();
    input.remove();
    target.style.cursor = 'pointer';
    if (save && value && value !== initialValue) onSave(value);
    else if (save && !value) onSave(initialValue);
    else onCancel();
  };
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') { e.preventDefault(); finish(true); }
    if (e.key === 'Escape') { e.preventDefault(); finish(false); }
  });
  input.addEventListener('blur', () => finish(true));
  return input;
}

export function GlobalEditableText() {
  useEffect(() => {
    const edits = loadEdits();
    let disposed = false;
    let scheduled = false;

    const prepare = () => {
      if (disposed) return;
      document.querySelectorAll<HTMLElement>('body *').forEach(element => {
        if (element.dataset.globalEditor === 'true' || isExcluded(element)) return;
        const interactive = element.matches(INTERACTIVE_SELECTOR);
        if (!interactive && !isPlainTextLeaf(element)) return;
        if (!element.textContent?.trim()) return;

        const path = getPath(element);
        element.dataset.globalEditPath = path;
        element.dataset.globalEditable = 'true';
        element.style.cursor = 'pointer';
        if (!element.title) element.title = interactive ? 'Double-cliquer pour modifier' : 'Cliquer pour modifier';

        const saved = edits[path];
        if (saved !== undefined && saved !== element.textContent.trim() && !element.matches(':focus')) {
          if (interactive) {
            // Do not overwrite interactive React nodes. Their own editable fields
            // or data state should remain authoritative.
            return;
          }
          element.textContent = saved;
        }
      });
    };

    const schedule = () => {
      if (scheduled || disposed) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; prepare(); });
    };

    const editPlainText = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const target = findPlainTextTarget(event.target);
      if (!target || target.closest(INTERACTIVE_SELECTOR)) return;
      if (target.dataset.globalEditing === 'true') return;
      event.preventDefault();
      event.stopPropagation();
      const path = target.dataset.globalEditPath || getPath(target);
      const initial = target.textContent?.trim() || '';
      target.dataset.globalEditing = 'true';
      target.style.cursor = 'text';
      target.contentEditable = 'true';
      target.focus();
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(target); range.collapse(false);
      selection?.removeAllRanges(); selection?.addRange(range);

      const finish = () => {
        const value = target.textContent?.trim() || initial;
        if (value !== initial) { edits[path] = value; saveEdits(edits); }
        target.contentEditable = 'false';
        delete target.dataset.globalEditing;
        target.style.cursor = 'pointer';
        schedule();
      };
      target.onblur = finish;
      target.onkeydown = e => {
        if (e.key === 'Enter') { e.preventDefault(); target.blur(); }
        if (e.key === 'Escape') { e.preventDefault(); target.textContent = initial; target.blur(); }
      };
    };

    const pending = new Map<HTMLElement, number>();
    let replaying = false;

    const editInteractive = (event: MouseEvent) => {
      if (event.button !== 0) return;
      const target = findInteractiveTarget(event.target);
      if (!target || target.dataset.globalEditing === 'true') return;

      // Delay a normal click very briefly so a second click can become an edit
      // gesture. The delayed click is replayed once, with the global handler
      // temporarily bypassed, so the control keeps its original functionality.
      if (event.detail === 1) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const existing = pending.get(target);
        if (existing) window.clearTimeout(existing);
        const timer = window.setTimeout(() => {
          pending.delete(target);
          replaying = true;
          target.click();
          replaying = false;
        }, 280);
        pending.set(target, timer);
        return;
      }

      if (event.detail < 2) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      const timer = pending.get(target);
      if (timer) window.clearTimeout(timer);
      pending.delete(target);

      const path = target.dataset.globalEditPath || getPath(target);
      const initial = target.textContent?.trim() || '';
      if (!initial) return;
      target.style.cursor = 'text';
      makeEditor(target, edits[path] ?? initial, value => {
        edits[path] = value;
        saveEdits(edits);
        const textNodes: Text[] = [];
        const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT);
        let node: Node | null;
        while ((node = walker.nextNode())) textNodes.push(node as Text);
        if (textNodes.length) {
          textNodes[textNodes.length - 1].textContent = value;
        } else {
          target.appendChild(document.createTextNode(value));
        }
        target.style.cursor = 'pointer';
      }, () => { target.style.cursor = 'pointer'; });
    };

    prepare();
    document.addEventListener('click', editPlainText, true);
    const interactiveClickHandler = (event: MouseEvent) => {
      if (replaying) return;
      editInteractive(event);
    };
    document.addEventListener('click', interactiveClickHandler, true);
    const observer = new MutationObserver(() => schedule());
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      document.removeEventListener('click', editPlainText, true);
      document.removeEventListener('click', interactiveClickHandler, true);
      pending.forEach(timer => window.clearTimeout(timer));
      pending.clear();
      observer.disconnect();
    };
  }, []);

  return null;
}
