import { useEffect } from 'react';

const STORAGE_KEY = 'speedpermis_global_text_edits';
const INTERACTIVE = 'input, textarea, select, button, a, [contenteditable="true"], [data-no-global-edit], [data-inline-editing]';

function loadEdits(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch {
    return {};
  }
}

function getPath(element: Element): string {
  const parts: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    const parent: HTMLElement | null = current.parentElement;
    if (!parent) break;
    const index = Array.from(parent.children).indexOf(current);
    parts.unshift(`${current.tagName.toLowerCase()}:${index}`);
    current = parent;
  }
  return parts.join('/');
}

function isEditableTarget(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.matches(INTERACTIVE) || element.closest(INTERACTIVE)) return false;
  if (element.closest('[data-inline-editing="true"]')) return false;
  if (element.closest('svg')) return false;
  if (!element.textContent?.trim()) return false;
  // Only plain-text elements are handled here. Existing InlineEditableField
  // components continue to own structured/data editing.
  return Array.from(element.childNodes).every((node) => node.nodeType === Node.TEXT_NODE);
}


export function GlobalEditableText() {
  useEffect(() => {
    const edits = loadEdits();
    let observer: MutationObserver | undefined;
    let applying = false;

    const prepare = () => {
      if (applying) return;
      applying = true;
      document.querySelectorAll<HTMLElement>('body *').forEach((element) => {
        if (!isEditableTarget(element)) return;
        const path = getPath(element);
        element.dataset.globalEditPath = path;
        element.dataset.globalEditable = 'true';
        element.style.cursor = 'pointer';
        if (edits[path] !== undefined && document.activeElement !== element) {
          element.textContent = edits[path];
        }
      });
      applying = false;
    };

    const beginEdit = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const element = target?.closest<HTMLElement>('[data-global-editable="true"]');
      if (!element || !isEditableTarget(element)) return;
      if (element.isContentEditable) return;

      event.preventDefault();
      event.stopPropagation();
      element.dataset.globalEditing = 'true';
      element.contentEditable = 'true';
      element.style.cursor = 'text';
      element.dataset.noGlobalEdit = 'true';
      element.focus();

      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      selection?.removeAllRanges();
      selection?.addRange(range);
    };

    const finishEdit = (event: FocusEvent) => {
      const element = event.target as HTMLElement;
      if (!element?.matches?.('[data-global-editing="true"]')) return;
      const path = element.dataset.globalEditPath;
      if (path) {
        edits[path] = element.textContent?.trim() || '';
        localStorage.setItem(STORAGE_KEY, JSON.stringify(edits));
      }
      element.contentEditable = 'false';
      delete element.dataset.globalEditing;
      delete element.dataset.noGlobalEdit;
      element.style.cursor = 'pointer';
    };

    const cancelOrCommit = (event: KeyboardEvent) => {
      const element = event.target as HTMLElement;
      if (!element?.matches?.('[data-global-editing="true"]')) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        const path = element.dataset.globalEditPath;
        element.textContent = path && edits[path] !== undefined ? edits[path] : element.textContent;
        element.blur();
      } else if (event.key === 'Enter') {
        event.preventDefault();
        element.blur();
      }
    };

    prepare();
    document.addEventListener('click', beginEdit, true);
    document.addEventListener('focusout', finishEdit, true);
    document.addEventListener('keydown', cancelOrCommit, true);
    observer = new MutationObserver(() => {
      if (!applying) prepare();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener('click', beginEdit, true);
      document.removeEventListener('focusout', finishEdit, true);
      document.removeEventListener('keydown', cancelOrCommit, true);
      observer?.disconnect();
    };
  }, []);

  return null;
}
