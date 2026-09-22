import { useState } from 'react';
import { X } from 'lucide-react';
import { moniteurs } from '../../data/moniteurs';
import { creneaux, joursSemaine } from '../../data/reservations';
import { useAppContext } from '../../hooks/useAppContext';


interface NewReservationModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewReservationModal({ open, onClose }: NewReservationModalProps) {
  const { addReservation, candidats } = useAppContext();
  const [candidatId, setCandidatId] = useState(candidats[0]?.id ?? '');
  const [jour, setJour] = useState('0');
  const [debut, setDebut] = useState(creneaux[0] ?? '08:00');
  const [fin, setFin] = useState(() => creneaux[1] ?? creneaux[0] ?? '09:00');
  const [moniteur, setMoniteur] = useState(moniteurs[0]?.nom || '');
  const [type, setType] = useState<'Leçon de conduite' | 'Conduite accompagnée' | 'Examen blanc' | 'Examen pratique' | 'Cours de code'>('Leçon de conduite');
  const [categorie, setCategorie] = useState<'A' | 'B'>('B');
  const [error, setError] = useState('');

  const parseTime = (t: string) => {
    const [hh, mm] = t.split(':').map(Number);
    return hh * 60 + mm;
  };

  const minutesBetween = (a: string, b: string) => parseTime(b) - parseTime(a);

  const maxDurationForType = (ty: typeof type) => (ty === 'Examen blanc' || ty === 'Examen pratique' ? 35 : 24 * 60);

  const getAllowedEndSlots = (start: string, ty: typeof type) => {
    const max = maxDurationForType(ty);
    return creneaux.filter((c) => {
      const diff = minutesBetween(start, c);
      return diff > 0 && diff <= max;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatId) {
      setError('Veuillez sélectionner un candidat.');
      return;
    }
    if (!moniteur) {
      setError('Veuillez sélectionner un moniteur.');
      return;
    }

    // Validate duration limit for types (e.g. Examen blanc max 35 minutes)
    const max = maxDurationForType(type);
    const duration = minutesBetween(debut, fin);
    if (duration <= 0) {
      setError('La date de fin doit être après le début.');
      return;
    }
    if (duration > max) {
      setError(`Durée maximale pour "${type}" : ${max} minutes.`);
      return;
    }

    const selectedCandidat = candidats.find((candidate) => candidate.id === candidatId);
    if (!selectedCandidat) {
      setError('Candidat introuvable.');
      return;
    }

    const moniteurProfile = moniteurs.find((person) => person.nom === moniteur);
    const reservation = {
      id: `r-${Date.now()}`,
      candidat: `${selectedCandidat.prenom} ${selectedCandidat.nom}`,
      candidatId: selectedCandidat.id,
      moniteur,
      vehicule: moniteurProfile?.vehicule ?? 'Véhicule de cours',
      type,
      categorie,
      jour: Number(jour),
      debut,
      fin,
      statut: 'À confirmer' as const,
    };

    addReservation(reservation);
    setError('');
    onClose();
    setCandidatId(candidats[0]?.id ?? '');
    setJour('0');
    setDebut(creneaux[0] ?? '08:00');
    setFin(creneaux[1] ?? creneaux[0] ?? '09:00');
    setMoniteur(moniteurs[0]?.nom || '');
    setType('Leçon de conduite');
    setCategorie('B');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink-900">Nouvelle réservation</h2>
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
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
            >
              {candidats.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.prenom} {candidate.nom}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Jour</label>
              <select
                value={jour}
                onChange={(e) => setJour(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
                {joursSemaine.map((j, i) => (
                  <option key={i} value={i}>{j}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Type</label>
              <select
                value={type}
                onChange={(e) => {
                  const newType = e.target.value as typeof type;
                  setType(newType);
                  const allowed = getAllowedEndSlots(debut, newType);
                  if (!allowed.includes(fin)) {
                    setFin(allowed[0] ?? fin);
                  }
                }}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
                <option value="Leçon de conduite">Leçon de conduite</option>
                <option value="Conduite accompagnée">Conduite accompagnée</option>
                <option value="Examen blanc">Examen blanc</option>
                <option value="Examen pratique">Examen pratique</option>
                <option value="Cours de code">Cours de code</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-900">Catégorie *</label>
            <select
              value={categorie}
              onChange={(e) => setCategorie(e.target.value as 'A' | 'B')}
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
            >
              <option value="A">Catégorie A</option>
              <option value="B">Catégorie B</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Début</label>
              <select
                value={debut}
                onChange={(e) => {
                  const newStart = e.target.value;
                  setDebut(newStart);
                  const allowed = getAllowedEndSlots(newStart, type);
                  if (!allowed.includes(fin)) {
                    setFin(allowed[0] ?? fin);
                  }
                }}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
                {creneaux.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Fin</label>
              <select
                value={fin}
                onChange={(e) => setFin(e.target.value)}
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
                {getAllowedEndSlots(debut, type).map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-900">Moniteur</label>
            <select
              value={moniteur}
              onChange={(e) => setMoniteur(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
              {moniteurs.map((m) => (
                <option key={m.id} value={m.nom}>{m.nom}</option>
              ))}
            </select>
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
              Créer la réservation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
