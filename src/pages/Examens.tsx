import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlusIcon, ChevronRightIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { ReserveExamModal } from '../components/modals/ReserveExamModal';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { ResultatExamen } from '../types';
import { useAppContext } from '../hooks/useAppContext';

const filtres: Array<ResultatExamen | 'Tous' | 'Éliminatoire'> = ['Tous', 'En attente', 'Favorable', 'Éliminatoire'];

export function Examens() {
  const [filtre, setFiltre] = useState<ResultatExamen | 'Tous' | 'Éliminatoire'>('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const { examens, updateExamen } = useAppContext();

  const liste = useMemo(
    () => (filtre === 'Tous' ? examens : examens.filter((e) => (filtre === 'Éliminatoire' ? e.resultat === 'Défavorable' : e.resultat === filtre))),
    [examens, filtre]
  );

  const aVenir = examens.filter((e) => e.resultat === 'En attente').length;
  const favorables = examens.filter((e) => e.resultat === 'Favorable').length;
  const realises = examens.filter((e) => e.resultat !== 'En attente').length;

  return (
    <>
      <PageHeader
        title="Examens"
        description={`${aVenir} épreuves programmées · ${favorables}/${realises} favorables sur la période`}
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
          >
            <CalendarPlusIcon className="h-4 w-4" aria-hidden="true" />
            Réserver une place
          </button>
        }
      />

      <ReserveExamModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Card>
        <div className="flex flex-wrap gap-1.5 border-b border-line px-6 py-4" role="group" aria-label="Filtrer par résultat">
          {filtres.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFiltre(f)}
              aria-pressed={filtre === f}
              className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
                filtre === f ? 'bg-navy-800 text-white' : 'bg-canvas text-ink-700 hover:bg-brand-50 hover:text-brand-700'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                <th scope="col" className="px-6 py-3 font-semibold">Candidat</th>
                <th scope="col" className="px-6 py-3 font-semibold">Type</th>
                <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                <th scope="col" className="px-6 py-3 font-semibold">Centre</th>
                <th scope="col" className="px-6 py-3 font-semibold">Score</th>
                <th scope="col" className="px-6 py-3 font-semibold">Résultat</th>
                <th scope="col" className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {liste.map((e) => (
                <tr key={e.id} className="transition-colors duration-150 hover:bg-canvas">
                  <td className="px-6 py-4">
                    <Link
                      to={`/candidats/${e.candidatId}`}
                      className="font-semibold text-ink-900 transition-colors duration-150 hover:text-brand-600"
                    >
                      {e.candidat}
                    </Link>
                    <p className="text-xs text-ink-500">Dossier n° {e.dossier}</p>
                  </td>
                  <td className="px-6 py-4 text-ink-700">{e.type}</td>
                  <td className="px-6 py-4 tabular-nums text-ink-700">
                    <InlineEditableField
                      value={e.date}
                      onSave={(nextDate) => updateExamen(e.id, { date: nextDate })}
                      className="block text-inherit"
                    />
                    <InlineEditableField
                      value={e.heure}
                      onSave={(nextHeure) => updateExamen(e.id, { heure: nextHeure })}
                      className="mt-1 block text-xs text-ink-400"
                    />
                  </td>
                  <td className="px-6 py-4 text-ink-700">{e.centre}</td>
                  <td className="px-6 py-4 tabular-nums text-ink-700">
                    {e.resultat === 'En attente' ? '—' : `${e.points} / ${e.total}`}
                  </td>
                  <td className="px-6 py-4">
                    <InlineEditableField
                      value={e.resultat}
                      onSave={(next) => updateExamen(e.id, { resultat: next as ResultatExamen })}
                      type="select"
                      options={['En attente', 'Favorable', 'Défavorable']}
                      className={`inline-block rounded-md px-2.5 py-1 text-xs font-semibold ${
                        e.resultat === 'Favorable'
                          ? 'bg-ok-100 text-ok-700'
                          : e.resultat === 'Défavorable'
                            ? 'bg-danger-50 text-danger-700'
                            : 'bg-warn-50 text-warn-700'
                      }`}
                    />
                  </td>
                  <td className="px-6 py-4 text-right">
                    {e.resultat !== 'En attente' && (
                      <Link
                        to={`/examens/${e.id}/resultat`}
                        className="inline-flex items-center gap-1 text-sm font-semibold text-brand-600 transition-colors duration-150 hover:text-brand-700"
                      >
                        Détail
                        <ChevronRightIcon className="h-4 w-4" aria-hidden="true" />
                      </Link>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}