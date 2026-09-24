import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExternalLinkIcon } from 'lucide-react';
import { InlineEditableField } from '../components/ui/InlineEditableField';

interface ConnectBlockProps {
  title: string;
  subtitle: string;
  ctaLabel?: string;
}

export function ConnectBlock({ title, subtitle, ctaLabel = 'JE ME CONNECTE' }: ConnectBlockProps) {
  const [editableTitle, setEditableTitle] = useState(() => localStorage.getItem(`connectBlockTitle:${title}`) ?? title);
  const [editableSubtitle, setEditableSubtitle] = useState(() => localStorage.getItem(`connectBlockSubtitle:${title}`) ?? subtitle);
  const [editableCta, setEditableCta] = useState(() => localStorage.getItem(`connectBlockCta:${title}`) ?? ctaLabel);

  useEffect(() => {
    try {
      localStorage.setItem(`connectBlockTitle:${title}`, editableTitle);
      localStorage.setItem(`connectBlockSubtitle:${title}`, editableSubtitle);
      localStorage.setItem(`connectBlockCta:${title}`, editableCta);
    } catch {
      // ignore
    }
  }, [editableTitle, editableSubtitle, editableCta, title]);

  return (
    <div className="flex h-full flex-col py-8 text-center">
      <h3 className="font-display text-[28px] font-bold leading-tight text-ink sm:text-[32px]">
        <InlineEditableField value={editableTitle} onSave={setEditableTitle} className="inline-block" />
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-muted"><InlineEditableField value={editableSubtitle} onSave={setEditableSubtitle} className="inline-block" /></p>
      <div className="mt-auto flex justify-center pt-6">
        <Link
          to="/connexion"
          className="inline-flex items-center gap-3 border border-rule bg-white px-10 py-4 font-display text-[13px] font-bold tracking-wide text-ink underline decoration-1 underline-offset-4 shadow-[6px_6px_0_rgba(0,0,0,0.08)] transition-[transform,box-shadow,color] duration-150 ease-out hover:-translate-y-0.5 hover:text-gov-blue hover:shadow-[8px_8px_0_rgba(0,0,0,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:ring-offset-2">
          <InlineEditableField value={editableCta} onSave={setEditableCta} className="inline-block" />
          <ExternalLinkIcon className="h-4 w-4 text-gov-blue" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}