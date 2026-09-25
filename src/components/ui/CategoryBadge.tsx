import { Categorie } from '../../types';

interface CategoryBadgeProps {
  category: Categorie;
  className?: string;
}

export function CategoryBadge({ category, className = '' }: CategoryBadgeProps) {
  if (category === 'A' || category === 'B') {
    return (
      <span
        aria-label={`Catégorie ${category}`}
        className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
          category === 'B' ? 'bg-brand-600' : 'bg-navy-800'
        } text-sm font-bold text-white shadow-sm ${className}`}
      >
        {category}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-canvas px-2.5 py-1 text-xs font-semibold text-ink-700 ${className}`}>
      {category}
    </span>
  );
}
