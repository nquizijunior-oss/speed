import { useEffect, useState } from 'react';
import {
  ChevronDownIcon,
  MenuIcon,
  SearchIcon,
  ShoppingCartIcon,
  XIcon } from
'lucide-react';
import { MarianneLogo } from './MarianneLogo';
import { primaryNav, secondaryNav, NavItem } from '../first-site-data/navigation';
import { InlineEditableField } from '../components/ui/InlineEditableField';

function NavButton({ item }: {item: NavItem;}) {
  const [open, setOpen] = useState(false);

  return (
    <li
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}>
      
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
        className="flex items-center gap-2 py-2 font-display text-[13px] font-semibold tracking-wide text-ink transition-colors duration-150 ease-out hover:text-gov-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue focus-visible:ring-offset-2">
        
        {item.label}
        <ChevronDownIcon
          className={`h-3.5 w-3.5 text-gov-red transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`}
          aria-hidden="true" />
        
      </button>
      {open &&
      <ul className="absolute left-0 top-full z-20 w-64 border-t-2 border-gov-red bg-white py-2 shadow-lg">
          {item.items.map((child) =>
        <li key={child}>
              <a
            href="#"
            className="block px-4 py-2 text-[14px] text-muted transition-colors duration-150 ease-out hover:bg-neutral-50 hover:text-gov-blue">
            
                {child}
              </a>
            </li>
        )}
        </ul>
      }
    </li>);

}

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [brandText, setBrandText] = useState(() => {
    try {
      return localStorage.getItem('siteBrandText') ?? 'SÉCURITÉ ROUTIÈRE VIVRE, ENSEMBLE';
    } catch {
      return 'SÉCURITÉ ROUTIÈRE VIVRE, ENSEMBLE';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('siteBrandText', brandText);
    } catch {
      // ignore
    }
  }, [brandText]);

  const allNav = [...primaryNav, ...secondaryNav];

  return (
    <header className="w-full border-b border-rule bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-5">
        <a href="#" className="flex shrink-0 items-center gap-6">
          <MarianneLogo />
          <span className="sr-only">Sécurité routière — Vivre, ensemble</span>
          <span aria-hidden="true" className="hidden font-display text-[17px] font-bold leading-[1.05] tracking-tight text-ink sm:block">
            <span className="block">SÉCURITÉ</span>
            <span className="block">
              <InlineEditableField value={brandText} onSave={setBrandText} className="inline-block" inputClassName="min-w-[220px]" />
            </span>
          </span>
        </a>

        <nav
          aria-label="Navigation principale"
          className="ml-auto hidden flex-col items-end gap-1 lg:flex">
          
          <ul className="flex items-center gap-7">
            {primaryNav.map((item) =>
            <NavButton key={item.label} item={item} />
            )}
          </ul>
          <ul className="flex items-center gap-10">
            {secondaryNav.map((item) =>
            <NavButton key={item.label} item={item} />
            )}
          </ul>
        </nav>

        <div className="ml-auto flex items-center gap-4 lg:ml-6">
          <button
            type="button"
            aria-label="Rechercher"
            className="p-1 text-ink transition-colors duration-150 ease-out hover:text-gov-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue">
            
            <SearchIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Mon panier"
            className="p-1 text-ink transition-colors duration-150 ease-out hover:text-gov-blue focus:outline-none focus-visible:ring-2 focus-visible:ring-gov-blue">
            
            <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label={mobileOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((value) => !value)}
            className="p-1 text-ink lg:hidden">
            
            {mobileOpen ?
            <XIcon className="h-6 w-6" aria-hidden="true" /> :

            <MenuIcon className="h-6 w-6" aria-hidden="true" />
            }
          </button>
        </div>
      </div>

      {mobileOpen &&
      <nav
        aria-label="Navigation mobile"
        className="border-t border-rule bg-white px-5 py-3 lg:hidden">
        
          <ul className="divide-y divide-rule">
            {allNav.map((item) =>
          <li key={item.label}>
                <a
              href="#"
              className="block py-3 font-display text-[13px] font-semibold tracking-wide text-ink">
              
                  {item.label}
                </a>
              </li>
          )}
          </ul>
        </nav>
      }
    </header>);

}