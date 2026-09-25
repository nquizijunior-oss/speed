import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRightIcon } from 'lucide-react';

interface Crumb {
  label: string;
  to?: string;
}

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  crumbs?: Crumb[];
  action?: React.ReactNode;
}

export function PageHeader({ title, description, crumbs, action }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {crumbs && crumbs.length > 0 &&
      <nav aria-label="Fil d’Ariane" className="mb-3 flex items-center gap-1.5 text-sm">
          {crumbs.map((c, i) =>
        <span key={c.label} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRightIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />}
              {c.to ?
          <Link
            to={c.to}
            className="text-brand-600 transition-colors duration-150 hover:text-brand-700 hover:underline">
            
                  {c.label}
                </Link> :

          <span className="text-ink-500">{c.label}</span>
          }
            </span>
        )}
        </nav>
      }
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[28px] font-bold leading-tight tracking-tight text-ink-900">{title}</h1>
          {description && <p className="mt-1 text-sm text-ink-500">{description}</p>}
        </div>
        {action}
      </div>
    </div>);

}