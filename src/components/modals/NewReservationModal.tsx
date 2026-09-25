import { useEffect, useMemo, useState } from 'react';
import { X } from 'lucide-react';
import { moniteurs } from '../../data/moniteurs';
import { getCurrentWeekDays } from '../../data/reservations';
import { useAppContext } from '../../hooks/useAppContext';
import type { Reservation } from '../../types';

interface NewReservationModalProps {
  open: boolean;
  onClose: () => void;
  initialDate?: string;
  initialStart?: string;
  initialEnd?: string;
  initialMoniteur?: string;
  initialStatus?: Reservation['statut'];
  reservationToEdit?: Reservation | null;
}

const pad = (n: number) => String(n).padStart(2, '0');
const todayIso = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};
const minutes = (value: string) => {
  const [h, m] = value.split(':').map(Number);
  return h * 60 + m;
};
const overlaps = (aStart: string, aEnd: string, bStart: string, bEnd: string) => minutes(aStart) < minutes(bEnd) && minutes(aEnd) > minutes(bStart);
const allowedStart = (value: string) => { const m = minutes(value); return (m >= 480 && m < 720) || (m >= 840 && m < 960); };
const plus30 = (value: string) => { const [h,m] = value.split(':').map(Number); const total=h*60+m+30; return `${String(Math.floor(total/60)).padStart(2,'0')}:${String(total%60).padStart(2,'0')}`; };

export function NewReservationModal({ open, onClose, initialDate, initialStart, initialEnd, initialMoniteur, initialStatus = 'À confirmer', reservationToEdit = null }: NewReservationModalProps) {
  const { addReservation, updateReservation, candidats, reservations } = useAppContext();
  const weekDays = useMemo(() => getCurrentWeekDays(), []);
  const [candidatId, setCandidatId] = useState('');
  const [date, setDate] = useState(initialDate ?? weekDays[0]?.iso ?? todayIso());
  const [debut, setDebut] = useState(initialStart ?? '08:00');
  const [fin, setFin] = useState(initialEnd ?? '08:30');
  const [moniteur, setMoniteur] = useState(initialMoniteur ?? moniteurs[0]?.nom ?? '');
  const [type, setType] = useState<Reservation['type']>('Leçon de conduite');
  const [categorie, setCategorie] = useState<'A' | 'B'>('B');
  const [statut, setStatut] = useState<Reservation['statut']>(initialStatus);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setCandidatId(reservationToEdit?.candidatId ?? candidats[0]?.id ?? '');
    setDate(reservationToEdit?.date ?? initialDate ?? weekDays[0]?.iso ?? todayIso());
    setDebut(reservationToEdit?.debut ?? initialStart ?? '08:00');
    setFin(reservationToEdit?.fin ?? initialEnd ?? '08:30');
    setMoniteur(reservationToEdit?.moniteur ?? initialMoniteur ?? moniteurs[0]?.nom ?? '');
    setType(reservationToEdit?.type ?? 'Leçon de conduite');
    setCategorie(reservationToEdit?.categorie ?? 'B');
    setStatut(reservationToEdit?.statut ?? initialStatus);
    setError('');
  }, [open, initialDate, initialStart, initialEnd, initialMoniteur, initialStatus, candidats, weekDays, reservationToEdit]);

  const selectedCandidat = candidats.find((candidate) => candidate.id === candidatId);
  const dayIndex = useMemo(() => Math.max(0, weekDays.findIndex((day) => day.iso === date)), [date, weekDays]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    if (!selectedCandidat) return setError('Veuillez sélectionner un candidat.');
    if (!date) return setError('Veuillez sélectionner une date.');
    if (!moniteur) return setError('Veuillez sélectionner un moniteur.');
    if (!allowedStart(debut)) return setError('Les réservations sont disponibles uniquement de 08:00 à 12:00 et de 14:00 à 16:00.');
    if (fin !== plus30(debut)) return setError('Chaque réservation doit durer exactement 30 minutes.');

    const conflict = reservations.find((r) =>
      r.id !== reservationToEdit?.id &&
      r.statut !== 'Annulée' &&
      r.date === date &&
      (r.moniteur === moniteur || r.candidatId === candidatId) &&
      overlaps(debut, fin, r.debut, r.fin)
    );
    if (conflict) {
      const who = conflict.moniteur === moniteur ? `le moniteur ${moniteur}` : `le candidat ${conflict.candidat}`;
      return setError(`Conflit détecté : ${who} a déjà une réservation de ${conflict.debut} à ${conflict.fin}.`);
    }

    const profile = moniteurs.find((person) => person.nom === moniteur);
    if (reservationToEdit) {
      updateReservation(reservationToEdit.id, { date, debut, fin, moniteur, vehicule: profile?.vehicule ?? reservationToEdit.vehicule, type, categorie, statut });
      onClose();
      return;
    }
    addReservation({
      id: `r-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      candidat: `${selectedCandidat.prenom} ${selectedCandidat.nom}`,
      candidatId: selectedCandidat.id,
      moniteur,
      vehicule: profile?.vehicule ?? 'Véhicule de cours',
      type,
      categorie,
      jour: dayIndex,
      date,
      debut,
      fin,
      statut,
    });
    onClose();
  };

  if (!open) return null;

  const field = 'mt-1 h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900 outline-none transition focus:border-brand-600 focus:ring-2 focus:ring-brand-50';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" role="dialog" aria-modal="true" aria-label="Nouvelle réservation">
      <div className="w-full max-w-2xl overflow-hidden rounded-xl bg-white shadow-pop">
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div><h2 className="text-base font-semibold text-ink-900">{reservationToEdit ? 'Modifier la réservation' : 'Nouvelle réservation'}</h2><p className="mt-0.5 text-xs text-ink-500">Un créneau = 30 minutes · 08:00–12:00 et 14:00–16:00.</p></div>
          <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-canvas hover:text-ink-900"><X className="h-5 w-5" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <p role="alert" className="rounded-lg border border-danger-100 bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</p>}
          <div>
            <label className="block text-sm font-semibold text-ink-900">Candidat *</label>
            <select value={candidatId} onChange={(e) => setCandidatId(e.target.value)} className={field}>
              {candidats.length === 0 ? <option value="">Aucun candidat disponible</option> : candidats.map((c) => <option key={c.id} value={c.id}>{c.prenom} {c.nom} — NEPH {c.neph}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="block text-sm font-semibold text-ink-900">Date *</label><input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={field} /></div>
            <div><label className="block text-sm font-semibold text-ink-900">Type</label><select value={type} onChange={(e) => setType(e.target.value as Reservation['type'])} className={field}><option>Leçon de conduite</option><option>Conduite accompagnée</option><option>Examen blanc</option><option>Examen pratique</option><option>Cours de code</option></select></div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div><label className="block text-sm font-semibold text-ink-900">Créneau *</label><select value={debut} onChange={(e) => { setDebut(e.target.value); setFin(plus30(e.target.value)); }} className={field}>{['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30'].map((t)=><option key={t} value={t}>{t} – {plus30(t)}</option>)}</select></div>
            <div><label className="block text-sm font-semibold text-ink-900">Durée</label><div className={field+" flex items-center bg-canvas font-semibold"}>30 minutes</div></div>
            <div><label className="block text-sm font-semibold text-ink-900">Catégorie</label><select value={categorie} onChange={(e) => setCategorie(e.target.value as 'A' | 'B')} className={field}><option value="A">Permis A</option><option value="B">Permis B</option></select></div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div><label className="block text-sm font-semibold text-ink-900">Moniteur *</label><select value={moniteur} onChange={(e) => setMoniteur(e.target.value)} className={field}>{moniteurs.map((m) => <option key={m.id} value={m.nom}>{m.nom} — {m.vehicule}</option>)}</select></div>
            <div><label className="block text-sm font-semibold text-ink-900">Statut</label><select value={statut} onChange={(e) => setStatut(e.target.value as Reservation['statut'])} className={field}><option value="À confirmer">À confirmer</option><option value="Confirmée">Confirmée</option><option value="Annulée">Annulée</option></select></div>
          </div>
          <div className="flex gap-3 border-t border-line pt-4">
            <button type="button" onClick={onClose} className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-canvas">Annuler</button>
            <button type="submit" disabled={!candidats.length} className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50">{reservationToEdit ? 'Enregistrer les modifications' : 'Créer la réservation'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
