import React from 'react';
import { BadgeTone } from './badgeTone';

type Tone = BadgeTone;

const tones: Record<Tone, string> = {
  neutral: 'bg-ink-900/5 text-ink-700 ring-ink-900/10',
  success: 'bg-[#b7fbca] text-[#1b6736] ring-[#1b6736]/20',
  warning: 'bg-amber-400 text-amber-900 ring-amber-500/20',
  danger: 'bg-[#ffe6e9] text-[#e1000f] ring-[#e1000f]/20',
  info: 'bg-brand-50 text-brand-700 ring-brand-600/20'
};

interface BadgeProps {
  children: React.ReactNode;
  tone?: Tone;
}

export function Badge({ children, tone = 'neutral' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${tones[tone]}`}>
      {children}
    </span>
  );
}