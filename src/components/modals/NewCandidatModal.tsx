import { useState } from 'react';
import { X } from 'lucide-react';
import { Candidat, Categorie, StatutCandidat } from '../../types';
import { useAppContext } from '../../hooks/useAppContext';

interface NewCandidatModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewCandidatModal({ open, onClose }: NewCandidatModalProps) {
  const { addCandidat, candidats } = useAppContext();
  const [prenom, setPrenom] = useState('');
  const [nom, setNom] = useState('');
  const [email, setEmail] = useState('');
  const [telephone, setTelephone] = useState('');
  const [dateNaissance, setDateNaissance] = useState('');
  const [categorie, setCategorie] = useState<Categorie>('B');
  const [genre, setGenre] = useState<'M' | 'F'>('M');
  const [ecole, setEcole] = useState('SPEED PERMIS');
  const [moniteur, setMoniteur] = useState('');
  const [ville, setVille] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prenom.trim() || !nom.trim() || !email.trim()) {
      setError('Veuillez remplir les champs obligatoires.');
      return;
    }

    const parsedDate = new Date(dateNaissance);
    const age = Number.isNaN(parsedDate.getTime()) ? 0 : new Date().getFullYear() - parsedDate.getFullYear();
    const initiales = `${prenom[0]}${nom[0]}`.toUpperCase();
    const newId = String(Math.max(...candidats.map((c: Candidat) => parseInt(c.id) || 0), 0) + 1);
    const neph = `${String(Math.random()).slice(2, 11).padEnd(12, '0')}`;

    const newCandidat: Candidat = {
      id: newId,
      neph,
      prenom: prenom.trim(),
      nom: nom.trim(),
      initiales,
      genre,
      categorie,
      dateNaissance,
      age,
      telephone,
      email: email.trim(),
      dateInscription: new Date().toLocaleDateString('fr-FR'),
      ecole: ecole.trim() || 'SPEED PERMIS',
      statut: 'En attente' as StatutCandidat,
      heuresEffectuees: 0,
      heuresPrevues: 30,
      codeObtenu: false,
      moniteur: moniteur.trim() || 'Non attribué',
      ville: ville.trim() || 'Non renseignée',
      soldeDu: 0,
    };

    addCandidat(newCandidat);
    setError('');
    onClose();
    setPrenom('');
    setNom('');
    setEmail('');
    setTelephone('');
    setDateNaissance('');
    setCategorie('B');
    setGenre('M');
    setEcole('SPEED PERMIS');
    setMoniteur('');
    setVille('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink-900">Nouveau candidat</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-canvas hover:text-ink-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-6">
          {error && (
            <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Prénom *</label>
              <input
                type="text"
                value={prenom}
                onChange={(e) => setPrenom(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Nom *</label>
              <input
                type="text"
                value={nom}
                onChange={(e) => setNom(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-900">E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Téléphone</label>
              <input
                type="tel"
                value={telephone}
                onChange={(e) => setTelephone(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Date de naissance</label>
              <input
                type="date"
                value={dateNaissance}
                onChange={(e) => setDateNaissance(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Catégorie</label>
              <select
                value={categorie}
                onChange={(e) => setCategorie(e.target.value as Categorie)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
                <option value="A2">A2</option>
                <option value="B">B</option>
                <option value="BE">BE</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Genre</label>
              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value as 'M' | 'F')}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
                <option value="M">Homme</option>
                <option value="F">Femme</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Moniteur</label>
              <input
                type="text"
                value={moniteur}
                onChange={(e) => setMoniteur(e.target.value)}
                placeholder="ex: Karim Belhaj"
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Auto-école</label>
              <input
                type="text"
                value={ecole}
                onChange={(e) => setEcole(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Ville</label>
              <input
                type="text"
                value={ville}
                onChange={(e) => setVille(e.target.value)}
                placeholder="ex: Marseille (13)"
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-line pt-5">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-canvas">
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Créer le candidat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
