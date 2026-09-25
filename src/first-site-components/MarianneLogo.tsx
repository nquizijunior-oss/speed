import React from 'react';

interface MarianneLogoProps {
  lines?: string[];
  className?: string;
}

export function MarianneLogo({
  lines = ['GOUVERNEMENT'],
  className = ''
}: MarianneLogoProps) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      <svg
        viewBox="0 0 48 16"
        aria-hidden="true"
        className="h-4 w-12"
        focusable="false">
        
        <path d="M0 8C6 1 10 15 16 8V16H0Z" fill="#000091" />
        <path d="M16 8C22 1 26 15 32 8V16H16Z" fill="#ffffff" />
        <path d="M32 8C38 1 42 15 48 8V16H32Z" fill="#e1000f" />
      </svg>
      <span className="font-display text-[15px] font-bold leading-[1.1] tracking-tight text-ink">
        {lines.map((line) =>
        <span key={line} className="block whitespace-nowrap">
            {line}
          </span>
        )}
      </span>
      <span className="font-serif text-[9px] italic leading-[1.15] text-ink">
        Liberté
        <br />
        Égalité
        <br />
        Fraternité
      </span>
    </div>);

}