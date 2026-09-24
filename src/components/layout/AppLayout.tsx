import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useAppContext } from '../../hooks/useAppContext';

interface AppLayoutProps {
  onLogout: () => void;
}

export function AppLayout({ onLogout }: AppLayoutProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { messages } = useAppContext();
  const unread = messages.filter((m) => m.nonLu).length;

  return (
    <div className="min-h-full w-full bg-canvas">
      <Sidebar
        onLogout={onLogout}
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        unread={unread} />

      <div className="lg:pl-[272px]">
        <Topbar onOpenMenu={() => setMenuOpen(true)} unread={unread} />
        <main className="mx-auto w-full max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}