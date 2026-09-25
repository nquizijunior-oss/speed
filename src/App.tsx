import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { AppContextProvider } from './context/AppContext';
import { Connexion as SpeedPermisConnexion } from './pages/Connexion';
import { FirstSiteConnexion } from './pages/FirstSiteConnexion';
import { ReserverEnLigne } from './pages/ReserverEnLigne';
import { SiteHeader } from './first-site-components/SiteHeader';
import { SiteFooter } from './first-site-components/SiteFooter';
import { Dashboard } from './pages/Dashboard';
import { Candidats } from './pages/Candidats';
import { CandidatDetail } from './pages/CandidatDetail';
import { Examens } from './pages/Examens';
import { ExamenResultat } from './pages/ExamenResultat';
import { ExamenEvaluation } from './pages/ExamenEvaluation';
import { ExamenSucces } from './pages/ExamenSucces';
import { Reservations } from './pages/Reservations';
import { Facturation } from './pages/Facturation';
import { Documents } from './pages/Documents';
import { Messages } from './pages/Messages';
import { Flotte } from './pages/Flotte';
import { Parametres } from './pages/Parametres';
import { GlobalEditableText } from './components/ui/GlobalEditableText';

function LandingPage() {
  return (
    <div className="flex min-h-full w-full flex-col bg-white font-sans text-ink">
      <SiteHeader />
      <ReserverEnLigne />
      <SiteFooter />
    </div>
  );
}

export function App() {
  const AUTH_KEY = 'speedpermis_authenticated';
  const [authentifie, setAuthentifie] = useState(() => {
    try { return window.localStorage.getItem(AUTH_KEY) === '1'; } catch { return false; }
  });

  return (
    <AppContextProvider>
      <GlobalEditableText />
      <BrowserRouter>
        <Routes>
          {!authentifie ? (
            <>
              {/* First site remains the public landing page. */}
              <Route path="/" element={<LandingPage />} />
              {/* First site's login comes BEFORE the SpeedPermis login. */}
              <Route path="/connexion" element={<FirstSiteConnexion />} />
              {/* After the first login, the user reaches the original SpeedPermis login. */}
              <Route
                path="/speedpermis/connexion"
                element={<SpeedPermisConnexion onLogin={() => { window.localStorage.setItem(AUTH_KEY, '1'); setAuthentifie(true); }} />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            <Route element={<AppLayout onLogout={() => { window.localStorage.removeItem(AUTH_KEY); setAuthentifie(false); }} />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/candidats" element={<Candidats />} />
              <Route path="/candidats/:id" element={<CandidatDetail />} />
              <Route path="/examens" element={<Examens />} />
              <Route path="/examens/:id/resultat" element={<ExamenResultat />} />
              <Route path="/examens/:id/detail" element={<ExamenEvaluation />} />
              <Route path="/examens/:id/succes" element={<ExamenSucces />} />
              <Route path="/reservations" element={<Reservations />} />
              <Route path="/facturation" element={<Facturation />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/messages" element={<Messages />} />
              <Route path="/flotte" element={<Flotte />} />
              <Route path="/parametres" element={<Parametres />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          )}
        </Routes>
      </BrowserRouter>
    </AppContextProvider>
  );
}
