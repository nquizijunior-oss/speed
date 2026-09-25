import { useEffect, useMemo, useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, CircleCheck, Pencil, Plus, RefreshCw, Trash2, X } from 'lucide-react';
import { NewReservationModal } from '../components/modals/NewReservationModal';
import { getCurrentWeekDays, type WeekDay } from '../data/reservations';
import { useAppContext } from '../hooks/useAppContext';
import { isRealtimeConnected } from '../lib/sharedPersistence';
import type { Reservation } from '../types';

const TIME_SLOTS = ['08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30','14:00','14:30','15:00','15:30'];
const pad = (n: number) => String(n).padStart(2, '0');
const isoLocal = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const plus30 = (start: string) => { const [h, m] = start.split(':').map(Number); const total = h * 60 + m + 30; return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`; };
const weekTitle = (week: WeekDay[]) => {
  if (!week.length) return '';
  const first = new Date(`${week[0].iso}T12:00:00`);
  const last = new Date(`${week[week.length - 1].iso}T12:00:00`);
  const f = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long' }).format(first);
  const l = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' }).format(last);
  return `${f} – ${l}`;
};
const shortDate = (iso: string) => {
  const d = new Date(`${iso}T12:00:00`);
  const day = new Intl.DateTimeFormat('fr-FR', { weekday: 'long' }).format(d);
  const date = new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit' }).format(d);
  return `${day} ${date}`;
};
const mondayOfCurrentWeek = () => {
  const now = new Date(); const day = now.getDay(); const diff = day === 0 ? -6 : 1 - day;
  now.setDate(now.getDate() + diff); return isoLocal(now);
};

export function Reservations() {
  const { reservations, updateReservation, deleteReservation: removeReservation, candidats } = useAppContext();
  const [weekStart, setWeekStart] = useState(mondayOfCurrentWeek);
  const [modal, setModal] = useState<{ open: boolean; date?: string; start?: string; reservation?: Reservation | null }>({ open: false });
  const [selected, setSelected] = useState<Reservation | null>(null);
  const [realtime, setRealtime] = useState<'connected' | 'connecting' | 'disconnected'>(isRealtimeConnected() ? 'connected' : 'connecting');
  const [refresh, setRefresh] = useState(0);

  const week = useMemo(() => getCurrentWeekDays(new Date(`${weekStart}T12:00:00`)), [weekStart, refresh]);
  const rows = useMemo(() => week.flatMap((day) => TIME_SLOTS.map((start) => ({ day, start, reservation: reservations.find((r) => r.date === day.iso && r.debut === start) }))), [week, reservations]);
  const booked = rows.filter((r) => r.reservation && r.reservation.statut !== 'Annulée').length;
  const free = rows.length - booked;

  useEffect(() => {
    const handler = (e: Event) => { const status = (e as CustomEvent<{ status?: 'connected'|'connecting'|'disconnected' }>).detail?.status; if (status) setRealtime(status); };
    window.addEventListener('speedpermis:realtime-status', handler); return () => window.removeEventListener('speedpermis:realtime-status', handler);
  }, []);

  const moveWeek = (amount: number) => { const d = new Date(`${weekStart}T12:00:00`); d.setDate(d.getDate() + amount * 7); setWeekStart(isoLocal(d)); };
  const openNew = (date: string, start: string) => setModal({ open: true, date, start, reservation: null });
  const openEdit = (reservation: Reservation) => setModal({ open: true, date: reservation.date, start: reservation.debut, reservation });
  const statusText = realtime === 'connected' ? 'Temps réel connecté' : realtime === 'connecting' ? 'Connexion temps réel…' : 'Reconnexion…';
  const statusDot = realtime === 'connected' ? 'bg-ok-500' : realtime === 'connecting' ? 'bg-warn-500' : 'bg-danger-500';

  const cancel = (r: Reservation) => { if (window.confirm(`Annuler la réservation de ${r.candidat} ?`)) { updateReservation(r.id, { statut: 'Annulée' }); setSelected(null); } };
  const remove = (r: Reservation) => { if (window.confirm(`Supprimer définitivement la réservation de ${r.candidat} ?`)) { removeReservation(r.id); setSelected(null); } };

  return (
    <div className="space-y-3">
      <section className="rounded-xl border border-line bg-white shadow-card">
        <div className="flex flex-col gap-3 border-b border-line px-4 py-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700"><CalendarDays className="h-5 w-5" /></div>
            <div><h1 className="text-lg font-extrabold text-ink-900">Réservations</h1><p className="text-xs text-ink-500">Planning hebdomadaire · créneaux de 30 minutes</p></div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs font-semibold text-ink-600"><span className={`h-2 w-2 rounded-full ${statusDot}`} />{statusText}</span>
            <button type="button" onClick={() => setRefresh(v => v + 1)} className="rounded-lg border border-line bg-white p-2 text-ink-500 hover:bg-canvas" title="Actualiser"><RefreshCw className="h-4 w-4" /></button>
            <button type="button" onClick={() => openNew(week[0]?.iso ?? weekStart, '08:00')} className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-xs font-bold text-white hover:bg-brand-700"><Plus className="h-4 w-4" /> Nouvelle réservation</button>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5">
            <button type="button" onClick={() => moveWeek(-1)} className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:bg-canvas"><ChevronLeft className="h-4 w-4" /> Semaine précédente</button>
            <button type="button" onClick={() => setWeekStart(mondayOfCurrentWeek())} className="rounded-lg border border-brand-100 bg-brand-50 px-2.5 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100">Aujourd'hui</button>
            <button type="button" onClick={() => moveWeek(1)} className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-1.5 text-xs font-bold text-ink-700 hover:bg-canvas">Semaine suivante <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="text-sm font-extrabold text-ink-900">Semaine du {weekTitle(week)}</div>
          <div className="text-xs font-semibold text-ink-500">{booked} réservées · {free} créneaux libres</div>
        </div>
      </section>

      <section className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px] border-collapse text-left">
            <thead>
              <tr className="bg-[#f1f3f7] text-xs font-extrabold uppercase tracking-wide text-ink-600">
                <th className="w-[112px] border-b border-line px-3 py-2.5">Date &amp; jour</th>
                <th className="w-[118px] border-b border-line px-3 py-2.5">Créneau</th>
                <th className="w-[132px] border-b border-line px-3 py-2.5">N° NEPH</th>
                <th className="min-w-[155px] border-b border-line px-3 py-2.5">Candidat(e)</th>
                <th className="min-w-[150px] border-b border-line px-3 py-2.5">Type d'épreuve</th>
                <th className="w-[70px] border-b border-line px-3 py-2.5">Permis</th>
                <th className="min-w-[190px] border-b border-line px-3 py-2.5">Moniteur &amp; véhicule</th>
                <th className="min-w-[125px] border-b border-line px-3 py-2.5">Statut</th>
                <th className="w-[105px] border-b border-line px-3 py-2.5">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(({ day, start, reservation }, index) => {
                const first = index === 0 || rows[index - 1].day.iso !== day.iso;
                const cancelled = reservation?.statut === 'Annulée';
                return (
                  <tr key={`${day.iso}-${start}`} className={`${first ? 'border-t-2 border-t-slate-200' : ''} ${cancelled ? 'bg-danger-50/30' : !reservation ? 'bg-slate-50/60' : 'bg-white'} hover:bg-brand-50/25`}>
                    <td className="border-b border-line px-3 py-2.5 align-middle whitespace-nowrap"><span className="text-xs font-bold text-ink-800">{shortDate(day.iso)}</span></td>
                    <td className="border-b border-line px-3 py-2.5 align-middle whitespace-nowrap"><span className="font-mono text-xs font-bold text-ink-800">{start} – {plus30(start)}</span></td>
                    <td className="border-b border-line px-3 py-2.5 align-middle font-mono text-xs font-semibold text-ink-600">{reservation ? (candidats.find(c => c.id === reservation.candidatId)?.neph ?? reservation.candidatId) : '—'}</td>
                    <td className="border-b border-line px-3 py-2.5 align-middle">
                      {reservation ? <button type="button" onClick={() => setSelected(reservation)} className={`text-left text-sm font-bold ${cancelled ? 'text-ink-500 line-through' : 'text-ink-900 hover:text-brand-700'}`}>{reservation.candidat}</button> : <button type="button" onClick={() => openNew(day.iso, start)} className="text-sm font-semibold text-ink-500 hover:text-brand-700">⚪ CRÉNEAU DISPONIBLE</button>}
                    </td>
                    <td className="border-b border-line px-3 py-2.5 align-middle text-xs font-medium text-ink-600">{reservation?.type ?? '—'}</td>
                    <td className="border-b border-line px-3 py-2.5 align-middle text-xs font-bold text-ink-700">{reservation?.categorie ? `B${reservation.categorie === 'B' ? '' : ' / A'}` : '—'}</td>
                    <td className="border-b border-line px-3 py-2.5 align-middle text-xs text-ink-700">{reservation ? <>{reservation.moniteur}<span className="block truncate text-[11px] text-ink-500">{reservation.vehicule}</span></> : '—'}</td>
                    <td className="border-b border-line px-3 py-2.5 align-middle">{reservation ? <StatusBadge status={reservation.statut} /> : <StatusBadge status="Disponible" />}</td>
                    <td className="border-b border-line px-3 py-2.5 align-middle">{reservation ? <ActionButtons onEdit={() => openEdit(reservation)} onOpen={() => setSelected(reservation)} /> : <button type="button" onClick={() => openNew(day.iso, start)} className="inline-flex items-center gap-1 rounded-md border border-brand-200 bg-brand-50 px-2 py-1.5 text-xs font-bold text-brand-700 hover:bg-brand-100"><Plus className="h-3 w-3" /> Assigner</button>}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-line bg-canvas px-4 py-2.5 text-xs font-semibold text-ink-600">
          <span className="font-extrabold text-ink-800">Légende</span><StatusBadge status="Confirmée" /><StatusBadge status="À confirmer" /><StatusBadge status="Annulée" /><StatusBadge status="Disponible" />
        </div>
      </section>

      {selected && <ReservationPopup reservation={selected} onClose={() => setSelected(null)} onEdit={() => { const r = selected; setSelected(null); openEdit(r); }} onCancel={() => cancel(selected)} onDelete={() => remove(selected)} onConfirm={() => { updateReservation(selected.id, { statut: 'Confirmée' }); setSelected(null); }} />}
      <NewReservationModal open={modal.open} onClose={() => setModal({ open: false })} initialDate={modal.date} initialStart={modal.start} initialEnd={modal.start ? plus30(modal.start) : '08:30'} reservationToEdit={modal.reservation ?? null} />
    </div>
  );
}

function StatusBadge({ status }: { status: Reservation['statut'] | 'Disponible' }) {
  if (status === 'Confirmée') return <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Confirmé</span>;
  if (status === 'À confirmer') return <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700"><span className="h-2 w-2 rounded-full bg-amber-500" /> En attente</span>;
  if (status === 'Annulée') return <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-2.5 py-1 text-xs font-bold text-red-700"><span className="h-2 w-2 rounded-full bg-red-500" /> Place libérée</span>;
  return <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-bold text-slate-600"><span className="h-2 w-2 rounded-full bg-slate-300" /> Disponible</span>;
}

function ActionButtons({ onEdit, onOpen }: { onEdit: () => void; onOpen: () => void }) {
  return <div className="flex items-center gap-1"><button type="button" onClick={onOpen} className="rounded-md border border-line p-1.5 text-ink-500 hover:bg-canvas" title="Voir"><span className="text-[10px] font-extrabold">•••</span></button><button type="button" onClick={onEdit} className="rounded-md border border-line p-1.5 text-ink-500 hover:bg-canvas" title="Modifier"><Pencil className="h-3 w-3" /></button></div>;
}

function ReservationPopup({ reservation, onClose, onEdit, onCancel, onDelete, onConfirm }: { reservation: Reservation; onClose: () => void; onEdit: () => void; onCancel: () => void; onDelete: () => void; onConfirm: () => void }) {
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true"><button type="button" aria-label="Fermer" className="absolute inset-0" onClick={onClose} /><div className="relative w-full max-w-md rounded-xl border border-line bg-white p-5 shadow-pop"><div className="flex items-start justify-between border-b border-line pb-4"><div><p className="text-xs font-semibold text-brand-600">{reservation.debut} – {reservation.fin}</p><h2 className="mt-1 text-lg font-bold text-ink-900">{reservation.candidat}</h2><p className="text-xs text-ink-500">N° NEPH : {reservation.candidatId}</p></div><button type="button" onClick={onClose} className="rounded-lg p-2 text-ink-400 hover:bg-canvas"><X className="h-5 w-5" /></button></div><div className="mt-4 grid grid-cols-2 gap-2"><Info label="Épreuve" value={reservation.type} /><Info label="Permis" value={reservation.categorie ? `Catégorie ${reservation.categorie}` : '—'} /><Info label="Moniteur" value={reservation.moniteur} /><Info label="Véhicule" value={reservation.vehicule} /></div><div className="mt-4 flex flex-wrap gap-2 border-t border-line pt-4"><button type="button" onClick={onEdit} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-bold text-ink-700 hover:bg-canvas"><Pencil className="h-4 w-4" /> Modifier</button>{reservation.statut === 'À confirmer' && <button type="button" onClick={onConfirm} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-ok-600 px-3 py-2 text-sm font-bold text-white"><CircleCheck className="h-4 w-4" /> Confirmer</button>}{reservation.statut !== 'Annulée' && <button type="button" onClick={onCancel} className="rounded-lg border border-warn-100 bg-warn-50 px-3 py-2 text-sm font-bold text-warn-700">Annuler</button>}<button type="button" onClick={onDelete} className="inline-flex items-center gap-2 rounded-lg border border-danger-100 bg-danger-50 px-3 py-2 text-sm font-bold text-danger-700"><Trash2 className="h-4 w-4" /> Supprimer</button></div></div></div>;
}
function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-line bg-canvas p-2.5"><p className="text-[9px] font-bold uppercase tracking-wide text-ink-400">{label}</p><p className="mt-0.5 truncate text-xs font-semibold text-ink-800">{value}</p></div>; }
