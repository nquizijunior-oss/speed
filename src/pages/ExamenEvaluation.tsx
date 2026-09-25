import { Link, useParams } from 'react-router-dom';
import { CheckIcon, ArrowRightIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { ResultBadge } from '../components/ui/ResultBadge';
import { noteLabel } from '../data/examens';
import { useAppContext } from '../hooks/useAppContext';
import { Competence } from '../types';

function NoteMark({ note }: {note: Competence['note'];}) {
  const label = noteLabel[String(note)];

  if (note === 'E') {
    return (
      <span
        title={label}
        className="grid h-6 w-6 place-items-center rounded border border-ink-400 text-[11px] font-bold text-ink-700">
        
        <span className="sr-only">{label}</span>
        <span aria-hidden="true">E</span>
      </span>);

  }

  if (note === 3) {
    return (
      <span title={label} className="grid h-6 w-6 place-items-center rounded-full bg-ok-600 text-white">
        <span className="sr-only">{label}</span>
        <CheckIcon className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
      </span>);

  }

  const tone =
  note === 2 ? 'bg-warn-100 text-warn-700 ring-warn-700/25' : 'bg-danger-100 text-danger-700 ring-danger-600/25';

  return (
    <span
      title={label}
      className={`grid h-6 w-6 place-items-center rounded-full text-[11px] font-bold ring-1 ring-inset ${tone}`}>
      
      <span className="sr-only">{label}</span>
      <span aria-hidden="true">{note}</span>
    </span>);

}

export function ExamenEvaluation() {
  const { id = '' } = useParams();
  const { examens } = useAppContext();
  const examen = examens.find((item) => item.id === id);

  if (!examen || examen.competences.length === 0) {
    return (
      <Card className="px-6 py-20 text-center">
        <h1 className="text-lg font-semibold text-ink-900">Évaluation non disponible</h1>
        <p className="mt-2 text-sm text-ink-500">
          Le bilan de compétences est publié après le passage de l’épreuve.
        </p>
        <Link to="/examens" className="mt-4 inline-block text-sm font-semibold text-brand-600">
          Retour aux examens
        </Link>
      </Card>);

  }

  const favorable = examen.resultat === 'Favorable';

  return (
    <>
      <PageHeader
        title="Détail de l’évaluation"
        crumbs={[
        { label: 'Examens', to: '/examens' },
        { label: `Dossier ${examen.dossier}`, to: `/examens/${examen.id}/resultat` },
        { label: 'Évaluation' }]
        } />
      

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader title="Bilan des compétences" description={`${examen.candidat} · ${examen.date}`} />
          <ul className="divide-y divide-line">
            {examen.competences.map((c) =>
            <li key={c.libelle} className="flex items-center gap-4 px-6 py-3.5">
                <span className="flex-1 text-sm text-ink-800">{c.libelle}</span>
                <NoteMark note={c.note} />
              </li>
            )}
          </ul>
          <p className="border-t border-line px-6 py-4 text-xs text-ink-500">
            Barème : 3 compétence acquise · 2 en cours d’acquisition · 1 non acquise · E non évaluable.
          </p>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader title="Résultat de l’évaluation" />
            <div className="p-6">
              <div
                className={`rounded-lg border p-5 ${
                favorable ? 'border-[#b7fbca] bg-[#f4fef3]' : 'border-[#ffe6e9] bg-[#fff6f7]'}`
                }>
                
                <ResultBadge result={examen.resultat} />
                <p className="mt-1 text-lg font-semibold tabular-nums text-ink-800">
                  {examen.points} / {examen.total} points
                </p>
              </div>
            </div>
          </Card>

          <Card>
            <CardHeader title="Appréciation de l’inspecteur" />
            <div className="space-y-2 p-6 text-sm leading-relaxed text-ink-800">
              {examen.appreciation.map((a) =>
              <p key={a}>{a}</p>
              )}
            </div>
          </Card>

          <Card>
            <CardHeader title="Informations complémentaires" />
            <dl className="divide-y divide-line">
              {[
              { t: 'Durée de l’examen', v: examen.duree },
              { t: 'Kilomètres parcourus', v: examen.kilometres },
              { t: 'Circulation', v: examen.circulation },
              { t: 'Conditions météo', v: examen.meteo }].
              map((row) =>
              <div key={row.t} className="flex items-center justify-between px-6 py-3.5">
                  <dt className="text-sm text-ink-500">{row.t}</dt>
                  <dd className="text-sm font-semibold text-ink-900">{row.v}</dd>
                </div>
              )}
            </dl>
          </Card>
        </div>

        <div className="mt-6 flex gap-3 sm:flex-row flex-col">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-semibold text-ink-800 transition-colors duration-150 hover:bg-canvas">
            
            Retour
          </button>
          <Link
            to={`/examens/${examen.id}/succes`}
            className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-700 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600"
          >
            <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
            Télécharger le CEPC
          </Link>
        </div>
      </div>
    </>);

}