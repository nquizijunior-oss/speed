import { Check, X } from 'lucide-react';

interface ResultBadgeProps {
  result: string;
  className?: string;
}

export function ResultBadge({ result, className = '' }: ResultBadgeProps) {
  const favorable = result === 'Favorable';
  const negative = result === 'Défavorable' || result === 'Éliminatoire';

  if (!favorable && !negative) {
    return (
      <span className={`inline-flex items-center rounded-md bg-amber-400 px-2.5 py-1 text-xs font-semibold text-amber-900 ${className}`}>
        {result}
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-extrabold uppercase tracking-wide ${
        favorable ? 'bg-[#b7fbca] text-[#1b6736]' : 'bg-[#ffe6e9] text-[#e1000f]'
      } ${className}`}
    >
      {favorable ? (
        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-[#1b6736]">
          <Check className="h-4 w-4 text-white" strokeWidth={3} aria-hidden="true" />
        </span>
      ) : (
        <span
          className="grid h-6 w-6 shrink-0 place-items-center bg-[#e1000f] text-white"
          style={{ clipPath: 'polygon(25% 6%, 75% 6%, 100% 50%, 75% 94%, 25% 94%, 0 50%)' }}
        >
          <X className="h-4 w-4" strokeWidth={3.5} aria-hidden="true" />
        </span>
      )}
      <span>{favorable ? 'Favorable' : 'Éliminatoire'}</span>
    </span>
  );
}
