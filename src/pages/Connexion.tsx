import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { EyeIcon, EyeOffIcon, Loader2Icon, LockIcon } from 'lucide-react';

const ROUTE_IMG = "/8e0de3b1-70b5-4f0f-9f93-96651c161b45.jpg";


interface ConnexionProps {
  onLogin: () => void;
}

export function Connexion({ onLogin }: ConnexionProps) {
  const [identifiant, setIdentifiant] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [erreur, setErreur] = useState('');
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifiant.trim() || !motDePasse.trim()) {
      setErreur('Veuillez renseigner votre identifiant et votre mot de passe.');
      return;
    }
    setErreur('');
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onLogin();
      navigate('/');
    }, 700);
  };

  return (
    <div className="relative flex min-h-full w-full items-center justify-center overflow-hidden bg-navy-900 px-4 py-10">
      <img
        src={ROUTE_IMG}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-40" />
      
      <div className="absolute inset-0 bg-navy-900/75" />

      <div className="relative z-10 grid w-full max-w-5xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <span className="mx-auto grid h-16 w-16 place-items-center rounded-xl border-2 border-white/85 text-lg font-extrabold text-white lg:mx-0">
            SP
          </span>
          <h1 className="mt-6 text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl">
            Portail
            <br />
            Auto-école
          </h1>
          <p className="mt-4 text-lg text-white/70">Espace professionnel</p>
          <p className="mt-8 max-w-sm text-sm leading-relaxed text-white/60 lg:mx-0 mx-auto">
            Gérez vos candidats, vos réservations d’examen et vos résultats en lien direct avec le
            service national du permis de conduire.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-2xl bg-white p-8 shadow-pop sm:p-10">
          
          <h2 className="text-3xl font-bold tracking-tight text-ink-900">Connexion</h2>
          <p className="mt-2 text-sm text-ink-500">Accédez à votre espace professionnel</p>

          <form onSubmit={submit} className="mt-8 space-y-5" noValidate>
            <div>
              <label htmlFor="identifiant" className="block text-sm font-semibold text-ink-900">
                Identifiant
              </label>
              <input
                id="identifiant"
                type="text"
                autoComplete="username"
                value={identifiant}
                onChange={(e) => setIdentifiant(e.target.value)}
                className="mt-2 h-12 w-full rounded-lg border border-line px-4 text-sm text-ink-900 transition-colors duration-150 focus:border-brand-600 focus:outline-none" />
              
            </div>

            <div>
              <label htmlFor="motdepasse" className="block text-sm font-semibold text-ink-900">
                Mot de passe
              </label>
              <div className="relative mt-2">
                <input
                  id="motdepasse"
                  type={visible ? 'text' : 'password'}
                  autoComplete="current-password"
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                  className="h-12 w-full rounded-lg border border-line px-4 pr-12 text-sm text-ink-900 transition-colors duration-150 focus:border-brand-600 focus:outline-none" />
                
                <button
                  type="button"
                  onClick={() => setVisible((v) => !v)}
                  aria-label={visible ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-ink-500 transition-colors duration-150 hover:text-ink-900">
                  
                  {visible ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                </button>
              </div>
            </div>

            {erreur &&
            <p role="alert" className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">
                {erreur}
              </p>
            }

            <a
              href="#reinitialisation"
              className="inline-block text-sm font-medium text-brand-600 underline transition-colors duration-150 hover:text-brand-700">
              
              Mot de passe oublié ?
            </a>

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-700 text-base font-semibold text-white transition-colors duration-150 hover:bg-brand-600 disabled:opacity-70">
              
              {loading ?
              <>
                  <Loader2Icon className="h-5 w-5 animate-spin" aria-hidden="true" />
                  Connexion…
                </> :

              'Se connecter'
              }
            </button>

            <p className="flex items-center justify-center gap-1.5 text-xs text-ink-400">
              <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Connexion sécurisée — service national du permis de conduire
            </p>
          </form>
        </motion.div>
      </div>

      <p className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-sm text-white/60">Version 2.4.1</p>
    </div>);

}