import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';

interface ReserveExamModalProps {
  open: boolean;
  onClose: () => void;
}

export function ReserveExamModal({ open, onClose }: ReserveExamModalProps) {
  const { addExamen, candidats } = useAppContext();
  const [candidatId, setCandidatId] = useState(candidats[0]?.id ?? '');
  const [type, setType] = useState('Examen pratique');
  const [centre, setCentre] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatId || !centre.trim() || !date) {
      setError('Veuillez remplir tous les champs requis.');
      return;
    }

    const selectedCandidat = candidats.find((candidate) => candidate.id === candidatId);
    if (!selectedCandidat) {
      setError('Candidat introuvable.');
      return;
    }

    const examen = {
      id: `e-${Date.now()}`,
      dossier: `EX-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      candidatId: selectedCandidat.id,
      candidat: `${selectedCandidat.prenom} ${selectedCandidat.nom}`.toUpperCase(),
      categorie: selectedCandidat.categorie,
      type: type as 'Examen pratique' | 'Épreuve théorique (ETG)',
      date: new Date(date).toLocaleDateString('fr-FR'),
      heure: '09:30',
      centre,
      resultat: 'En attente' as const,
      points: 0,
      total: type === 'Épreuve théorique (ETG)' ? 40 : 31,
      inspecteur: 'À désigner',
      numeroInspecteur: '—',
      datePublication: '—',
      appreciation: [],
      duree: '—',
      kilometres: '—',
      circulation: '—',
      meteo: '—',
      competences: [],
    };

    addExamen(examen);
    setError('');
    onClose();
    setCandidatId(candidats[0]?.id ?? '');
    setCentre('');
    setDate('');
    setType('Examen pratique');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink-900">Réserver une place d'examen</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-canvas hover:text-ink-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</p>}

          <div>
            <label className="block text-sm font-semibold text-ink-900">Candidat *</label>
            <select
              value={candidatId}
              onChange={(e) => setCandidatId(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
              {candidats.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.prenom} {candidate.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-900">Type d'examen</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
              <option>Examen pratique</option>
              <option>Épreuve théorique (ETG)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-900">Centre d'examen *</label>
            <input
              type="text"
              value={centre}
              onChange={(e) => setCentre(e.target.value)}
              placeholder="ex: Marseille Nord"
              required
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-900">Date d'examen *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-canvas">
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Réserver
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
