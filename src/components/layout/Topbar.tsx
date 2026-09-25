import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { BellIcon, MenuIcon, SearchIcon, UserRoundIcon } from 'lucide-react';
import { candidats } from '../../data/candidats';
import { useAppContext } from '../../hooks/useAppContext';
import { InlineEditableField } from '../ui/InlineEditableField';

interface TopbarProps {
  onOpenMenu: () => void;
  unread: number;
}

export function Topbar({ onOpenMenu, unread }: TopbarProps) {
  const [query, setQuery] = useState('');
  const [openNotif, setOpenNotif] = useState(false);
  const [schoolName, setSchoolName] = useState(() => {
    try {
      return localStorage.getItem('schoolName') ?? 'Auto-école SPEED PERMIS';
    } catch {
      return 'Auto-école SPEED PERMIS';
    }
  });
  const navigate = useNavigate();
  const { messages, updateMessage } = useAppContext();

  useEffect(() => {
    try {
      localStorage.setItem('schoolName', schoolName);
    } catch {
      // ignore
    }
  }, [schoolName]);

  const notifications = messages
    .slice(0, 3)
    .map((message) => ({
      id: message.id,
      titre: message.objet,
      detail: `${message.expediteur} · ${message.extrait}`,
      temps: message.date,
      unread: message.nonLu,
    }));

  const results =
    query.trim().length > 1
      ? candidats
          .filter((c) => `${c.prenom} ${c.nom} ${c.neph}`.toLowerCase().includes(query.trim().toLowerCase()))
          .slice(0, 5)
      : [];

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-sky-500/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onOpenMenu}
        className="rounded-md p-2 text-ink-700 transition-colors duration-150 hover:bg-canvas lg:hidden"
        aria-label="Ouvrir le menu"
      >
        <MenuIcon className="h-5 w-5" />
      </button>

      <div className="relative hidden max-w-md flex-1 sm:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Rechercher un candidat, un n° NEPH…"
          className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors duration-150 focus:border-brand-600 focus:bg-white focus:outline-none"
          aria-label="Rechercher un candidat"
        />

        <AnimatePresence>
          {results.length > 0 && (
            <motion.ul
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="absolute left-0 right-0 top-12 overflow-hidden rounded-lg border border-line bg-white shadow-pop"
            >
              {results.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      navigate(`/candidats/${c.id}`);
                      setQuery('');
                    }}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 hover:bg-canvas"
                  >
                    <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                      {c.initiales}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-semibold text-ink-900">
                        {c.prenom} {c.nom.toUpperCase()}
                      </span>
                      <span className="block truncate text-xs text-ink-500">NEPH {c.neph}</span>
                    </span>
                  </button>
                </li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>

      <div className="ml-auto flex items-center gap-2 sm:gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpenNotif((v) => !v)}
            className="relative rounded-full p-2 text-ink-700 transition-colors duration-150 hover:bg-canvas"
            aria-label={`Notifications (${unread} non lues)`}
            aria-expanded={openNotif}
          >
            <BellIcon className="h-5 w-5" />
            {unread > 0 && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-danger-600 ring-2 ring-white" />}
          </button>

          <AnimatePresence>
            {openNotif && (
              <motion.div
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -6, scale: 0.98 }}
                transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
                className="absolute right-0 top-12 w-80 overflow-hidden rounded-xl border border-line bg-white shadow-pop"
              >
                <p className="border-b border-line px-4 py-3 text-sm font-semibold text-ink-900">Notifications</p>
                <ul>
                  {notifications.length === 0 ? (
                    <li className="px-4 py-4 text-sm text-ink-500">Aucune notification.</li>
                  ) : (
                    notifications.map((n) => (
                      <li key={n.id} className="border-b border-line px-4 py-3 last:border-0">
                        <button
                          type="button"
                          onClick={() => {
                            updateMessage(n.id, { nonLu: false });
                            navigate(`/messages?message=${encodeURIComponent(n.id)}`);
                            setOpenNotif(false);
                          }}
                          className="flex w-full items-start gap-2 text-left"
                        >
                          {n.unread && <span className="mt-1.5 h-2 w-2 rounded-full bg-brand-600" />}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-ink-900">{n.titre}</p>
                            <p className="mt-0.5 line-clamp-2 text-xs text-ink-500">{n.detail}</p>
                            <p className="mt-1 text-[11px] uppercase tracking-wide text-ink-400">{n.temps}</p>
                          </div>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="hidden text-sm font-medium text-ink-800 md:block">
            <InlineEditableField
              value={schoolName}
              onSave={setSchoolName}
              className="w-auto truncate text-sm font-medium text-ink-900"
              placeholder="Nom de l'auto-école"
            />
          </span>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-brand-600 text-white">
            <UserRoundIcon className="h-[18px] w-[18px]" aria-hidden="true" />
          </span>
        </div>
      </div>
    </header>
  );
}