import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  CalendarCheckIcon,
  CarFrontIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  MailIcon,
  ReceiptEuroIcon,
  ScrollTextIcon,
  SettingsIcon,
  UsersIcon,
  XIcon } from
'lucide-react';

interface SidebarProps {
  onLogout: () => void;
  open: boolean;
  onClose: () => void;
  unread: number;
}

const nav = [
{ to: '/', label: 'Tableau de bord', icon: LayoutDashboardIcon, end: true },
{ to: '/candidats', label: 'Candidats', icon: UsersIcon },
{ to: '/examens', label: 'Examens', icon: ScrollTextIcon },
{ to: '/reservations', label: 'Réservations', icon: CalendarCheckIcon },
{ to: '/facturation', label: 'Facturation', icon: ReceiptEuroIcon },
{ to: '/documents', label: 'Documents', icon: FileTextIcon },
{ to: '/messages', label: 'Messages', icon: MailIcon },
{ to: '/flotte', label: 'Moniteurs & flotte', icon: CarFrontIcon },
{ to: '/parametres', label: 'Paramètres', icon: SettingsIcon }];


export function Sidebar({ onLogout, open, onClose, unread }: SidebarProps) {
  const navigate = useNavigate();

  return (
    <>
      {open &&
      <button
        type="button"
        aria-label="Fermer le menu"
        onClick={onClose}
        className="fixed inset-0 z-30 bg-navy-950/50 lg:hidden" />

      }
      <div
        className={`fixed inset-y-0 left-0 z-40 flex w-[272px] flex-col bg-sky-600 text-white transition-transform duration-200 ease-out lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'}`
        }>
        
        <div className="flex items-center gap-3 px-5 py-5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border-2 border-white/85 text-sm font-extrabold tracking-tight text-white">
           SP
          </span>
          <span className="text-[13px] font-bold uppercase leading-tight tracking-[0.06em] text-white">
            Portail
            <br />
            Auto-école
          </span>
          <button
            type="button"
            onClick={onClose}
            className="ml-auto rounded-md p-1.5 text-white/70 transition-colors duration-150 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Fermer le menu">
            
            <XIcon className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-2 flex-1 space-y-1 overflow-y-auto px-3 pb-4" aria-label="Navigation principale">
          {nav.map(({ to, label, icon: Icon, end }) =>
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}
            className={({ isActive }) =>
            `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors duration-150 ${
            isActive ?
            'bg-sky-700 text-white' :
            'text-white/85 hover:bg-sky-500/20 hover:text-white'}`

            }>
            
              <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
              <span className="truncate">{label}</span>
              {to === '/messages' && unread > 0 &&
            <span className="ml-auto rounded-full bg-white/15 px-2 py-0.5 text-[11px] font-semibold text-white">
                  {unread}
                </span>
            }
            </NavLink>
          )}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => {
              onLogout();
              navigate('/connexion');
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium text-white/75 transition-colors duration-150 hover:bg-white/10 hover:text-white">
            
            <LogOutIcon className="h-[18px] w-[18px]" aria-hidden="true" />
            Déconnexion
          </button>
        </div>
      </div>
    </>);

}