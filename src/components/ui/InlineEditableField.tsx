import { KeyboardEvent, useEffect, useState } from 'react';

interface InlineEditableFieldProps {
  value: string;
  onSave: (nextValue: string) => void;
  className?: string;
  inputClassName?: string;
  placeholder?: string;
  type?: 'text' | 'select';
  options?: string[];
}

export function InlineEditableField({
  value,
  onSave,
  className = '',
  inputClassName = '',
  placeholder = '—',
  type = 'text',
  options = [],
}: InlineEditableFieldProps) {
  const [draft, setDraft] = useState(value);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const commit = (nextValue: string) => {
    const normalized = nextValue.trim();
    const finalValue = normalized || placeholder;
    if (finalValue !== value) {
      onSave(finalValue === placeholder ? '' : finalValue);
    }
    setEditing(false);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement | HTMLSelectElement | HTMLSpanElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      commit(draft);
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      setDraft(value);
      setEditing(false);
    }
      };

  if (editing) {
    if (type === 'select') {
      return (
        <select
          data-inline-editing="true"
          autoFocus
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onBlur={() => commit(draft)}
          onKeyDown={handleKeyDown}
          className={`min-w-[80px] rounded-md border border-sky-300 bg-white px-1.5 py-0.5 text-left text-inherit outline-none ring-0 transition ${inputClassName}`}
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        data-inline-editing="true"
        autoFocus
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`w-full min-w-[90px] rounded-md border border-sky-300 bg-white px-1.5 py-0.5 text-left text-inherit outline-none ring-0 transition ${inputClassName}`}
      />
    );
  }

  return (
    <span
      tabIndex={0}
      role="textbox"
      aria-label="Champ modifiable"
      onClick={() => setEditing(true)}
      onKeyDown={handleKeyDown}
      data-inline-editing="false"
      className={`cursor-pointer rounded-sm px-0.5 py-0.5 text-left outline-none transition focus:bg-sky-50/60 ${className}`}
    >
      {value || placeholder}
    </span>
  );
}
