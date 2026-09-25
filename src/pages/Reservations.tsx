import { useState } from 'react';
import { PlusIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { NewReservationModal } from '../components/modals/NewReservationModal';
import { creneaux, datesSemaine, joursSemaine } from '../data/reservations';
import { moniteurs } from '../data/moniteurs';
import { useAppContext } from '../hooks/useAppContext';
import type { Reservation } from '../types';

const typeStyles: Record<string, string> = {
  'Leçon de conduite': 'border-brand-600 bg-brand-50 text-brand-700',
  'Conduite accompagnée': 'border-ok-600 bg-ok-50 text-ok-700',
  'Examen blanc': 'border-warn-700 bg-warn-50 text-warn-700',
  'Examen pratique': 'border-sky-600 bg-sky-50 text-sky-700',
  'Cours de code': 'border-ink-500 bg-ink-900/5 text-ink-800'
};

const heureIndex = (h: string) => creneaux.indexOf(h);

export function Reservations() {
  const [moniteur, setMoniteur] = useState('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const { reservations, updateReservation } = useAppContext();

  const visibles = reservations.filter(
    (r) => (moniteur === 'Tous' || r.moniteur === moniteur) && r.statut !== 'Annulée'
  );
  const annulees = reservations.filter((r) => r.statut === 'Annulée');
  const aConfirmer = reservations.filter((r) => r.statut === 'À confirmer');

  return (
    <>
      <PageHeader
        title="Réservations de date d'examen"
        description="Du 8 au 15 septembre 2026"
        crumbs={[{ label: 'Planning' }, { label: '8–15 septembre' }]}
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Nouveau créneau
          </button>
        }
      />

      <NewReservationModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-ink-500">Inspecteur:</span>
        {['Tous', ...moniteurs.map((m) => m.nom)].map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMoniteur(m)}
            aria-pressed={moniteur === m}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-150 ${
              moniteur === m
                ? 'bg-navy-800 text-white'
                : 'border border-line bg-white text-ink-700 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[1180px]">
            <div className="grid grid-cols-[80px_repeat(8,1fr)] border-b border-line bg-canvas">
              <div />
              {joursSemaine.map((j, i) => (
                <div key={j} className="border-l border-line px-3 py-3 text-center">
                  <p className="text-sm font-semibold text-ink-900">{j}</p>
                  <p className="date-value text-xs text-ink-500">{datesSemaine[i]}</p>
                </div>
              ))}
            </div>

            <div className="relative grid grid-cols-[80px_repeat(8,1fr)]">
              <div>
                {creneaux.map((c) => (
                  <div key={c} className="h-16 border-b border-line pr-3 pt-1 text-right text-xs tabular-nums text-ink-400">
                    {c}
                  </div>
                ))}
              </div>

              {joursSemaine.map((jour, jourIdx) => (
                <div key={jour} className="relative border-l border-line">
                  {creneaux.map((c) => (
                    <div key={c} className="h-16 border-b border-line" />
                  ))}
                  {visibles
                    .filter((r) => r.jour === jourIdx)
                    .map((r) => {
                      const start = heureIndex(r.debut);
                      const end = heureIndex(r.fin);
                      const span = Math.max(end - start, 1);
                      return (
                        <article
                          key={r.id}
                          className={`absolute inset-x-1.5 overflow-hidden rounded-md border-l-[3px] px-2.5 py-1.5 text-left ${typeStyles[r.type]}`}
                          style={{ top: start * 64 + 4, height: span * 64 - 8 }}
                        >
                          <div className="flex items-center gap-2">
                            <p className="truncate text-xs font-semibold">
                              <InlineEditableField value={r.candidat} onSave={(next) => updateReservation(r.id, { candidat: next })} className="inline-block text-xs font-semibold" />
                            </p>
                            {r.categorie && <CategoryBadge category={r.categorie} />}
                          </div>
                          <p className="truncate text-[11px] opacity-80">
                              <InlineEditableField value={r.type} onSave={(next) => updateReservation(r.id, { type: next as Reservation['type'] })} type="select" options={['Leçon de conduite', 'Conduite accompagnée', 'Examen blanc', 'Examen pratique', 'Cours de code']} className="inline-block text-[11px] opacity-80" />
                          </p>
                          <p className="truncate text-[11px] opacity-70">
                            <InlineEditableField
                              value={r.debut}
                              onSave={(nextDebut) => updateReservation(r.id, { debut: nextDebut })}
                              className="inline-block text-[11px] opacity-70"
                            />
                            –
                            <InlineEditableField
                              value={r.fin}
                              onSave={(nextFin) => updateReservation(r.id, { fin: nextFin })}
                              className="inline-block text-[11px] opacity-70"
                            />
                            · <InlineEditableField value={r.vehicule} onSave={(next) => updateReservation(r.id, { vehicule: next })} className="inline-block text-[11px] opacity-70" />
                          </p>
                        </article>
                      );
                    })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <header className="border-b border-line px-6 py-4">
            <h2 className="text-base font-semibold text-ink-900">Créneaux à confirmer</h2>
          </header>
          <ul className="divide-y divide-line">
            {aConfirmer.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                <div className="min-w-[180px] flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink-900">
                      <InlineEditableField value={r.candidat} onSave={(next) => updateReservation(r.id, { candidat: next })} className="inline-block text-sm font-semibold text-ink-900" />
                    </p>
                    {r.categorie && <CategoryBadge category={r.categorie} />}
                  </div>
                  <p className="text-xs text-ink-500">
                    {joursSemaine[r.jour]} <InlineEditableField value={r.debut} onSave={(nextDebut) => updateReservation(r.id, { debut: nextDebut })} className="inline-block text-xs text-ink-500" />–<InlineEditableField value={r.fin} onSave={(nextFin) => updateReservation(r.id, { fin: nextFin })} className="inline-block text-xs text-ink-500" /> · <InlineEditableField value={r.moniteur} onSave={(next) => updateReservation(r.id, { moniteur: next })} className="inline-block text-xs text-ink-500" />
                  </p>
                </div>
                <InlineEditableField
                  value={r.statut}
                  onSave={(next) => updateReservation(r.id, { statut: next as Reservation['statut'] })}
                  type="select"
                  options={['Confirmée', 'À confirmer', 'Annulée']}
                  className="inline-block"
                />
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <header className="border-b border-line px-6 py-4">
            <h2 className="text-base font-semibold text-ink-900">Annulations de la semaine</h2>
          </header>
          {annulees.length === 0 ? (
            <p className="px-6 py-8 text-sm text-ink-500">Aucune annulation.</p>
          ) : (
            <ul className="divide-y divide-line">
              {annulees.map((r) => (
                <li key={r.id} className="flex flex-wrap items-center gap-3 px-6 py-4">
                  <div className="min-w-[180px] flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-900">
                        <InlineEditableField value={r.candidat} onSave={(next) => updateReservation(r.id, { candidat: next })} className="inline-block text-sm font-semibold text-ink-900" />
                      </p>
                      {r.categorie && <CategoryBadge category={r.categorie} />}
                    </div>
                    <p className="text-xs text-ink-500">
                      {joursSemaine[r.jour]} <InlineEditableField value={r.debut} onSave={(nextDebut) => updateReservation(r.id, { debut: nextDebut })} className="inline-block text-xs text-ink-500" />–<InlineEditableField value={r.fin} onSave={(nextFin) => updateReservation(r.id, { fin: nextFin })} className="inline-block text-xs text-ink-500" /> · <InlineEditableField value={r.moniteur} onSave={(next) => updateReservation(r.id, { moniteur: next })} className="inline-block text-xs text-ink-500" />
                    </p>
                  </div>
                  <InlineEditableField
                    value={r.statut}
                    onSave={(next) => updateReservation(r.id, { statut: next as Reservation['statut'] })}
                    type="select"
                    options={['Confirmée', 'À confirmer', 'Annulée']}
                    className="inline-block"
                  />
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}