import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CheckIcon, FileSearchIcon, XIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { useAppContext } from '../hooks/useAppContext';
import { ResultatExamen } from '../types';

export function ExamenResultat() {
  const { id = '' } = useParams();
  const { examens, updateExamen } = useAppContext();
  const examen = examens.find((item) => item.id === id);
  const navigate = useNavigate();
  const getStoredString = (key: string, fallback: string) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const [copy, setCopy] = useState(() => ({
    notFoundTitle: getStoredString('examenResultatNotFoundTitle', 'Examen introuvable'),
    backToExams: getStoredString('examenResultatBackToExams', 'Retour aux examens'),
    title: getStoredString('examenResultatTitle', 'Résultat de l’examen pratique'),
    examsCrumb: getStoredString('examenResultatExamsCrumb', 'Examens'),
    dossierPrefix: getStoredString('examenResultatDossierPrefix', 'Dossier'),
    resultLabel: getStoredString('examenResultatResultLabel', 'Résultat'),
    favorableMessage: getStoredString('examenResultatFavorableMessage', 'Félicitations ! Le candidat a réussi son examen pratique.'),
    negativeMessage: getStoredString('examenResultatNegativeMessage', 'Le candidat devra se représenter à une prochaine session.'),
    pointsLabel: getStoredString('examenResultatPointsLabel', 'points'),
    candidateLabel: getStoredString('examenResultatCandidateLabel', 'Candidat'),
    categoryLabel: getStoredString('examenResultatCategoryLabel', 'Catégorie'),
    examDateLabel: getStoredString('examenResultatExamDateLabel', 'Date de l’examen'),
    examCentreLabel: getStoredString('examenResultatExamCentreLabel', 'Centre d’examen'),
    inspectorLabel: getStoredString('examenResultatInspectorLabel', 'Inspecteur'),
    inspectorNumberLabel: getStoredString('examenResultatInspectorNumberLabel', 'N° d’inspecteur'),
    publicationDateLabel: getStoredString('examenResultatPublicationDateLabel', 'Date de publication'),
    dossierNumberLabel: getStoredString('examenResultatDossierNumberLabel', 'N° de dossier'),
    carLabel: getStoredString('examenResultatCarLabel', 'Voiture'),
    backToCandidate: getStoredString('examenResultatBackToCandidate', 'Retour au dossier'),
    evaluationDetail: getStoredString('examenResultatEvaluationDetail', 'Détail de l’évaluation'),
    downloadCecp: getStoredString('examenResultatDownloadCecp', 'Télécharger le CEPC'),
  }));

  useEffect(() => {
    try {
      Object.entries(copy).forEach(([key, value]) => localStorage.setItem(`examenResultat${key[0].toUpperCase()}${key.slice(1)}`, value));
    } catch {
      // ignore localStorage errors
    }
  }, [copy]);

  const editCopy = (key: keyof typeof copy) => (value: string) => setCopy((current) => ({ ...current, [key]: value }));

  if (!examen) {
    return (
      <Card className="px-6 py-20 text-center">
        <h1 className="text-lg font-semibold text-ink-900"><InlineEditableField value={copy.notFoundTitle} onSave={editCopy('notFoundTitle')} className="inline-block" /></h1>
        <Link to="/examens" className="mt-3 inline-block text-sm font-semibold text-brand-600">
          <InlineEditableField value={copy.backToExams} onSave={editCopy('backToExams')} className="inline-block" />
        </Link>
      </Card>);

  }

  const favorable = examen.resultat === 'Favorable';
  const editExamen = (updates: Parameters<typeof updateExamen>[1]) => updateExamen(examen.id, updates);

  return (
    <>
      <PageHeader
        title={<InlineEditableField value={copy.title} onSave={editCopy('title')} className="inline-block" />}
        crumbs={[
        { label: <InlineEditableField value={copy.examsCrumb} onSave={editCopy('examsCrumb')} className="inline-block" />, to: '/examens' },
        { label: <><InlineEditableField value={copy.dossierPrefix} onSave={editCopy('dossierPrefix')} className="inline-block" />{' '}<InlineEditableField value={examen.dossier} onSave={(next) => editExamen({ dossier: next })} className="inline-block" /></> }]
        } />
      

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
        className={`flex flex-wrap items-center gap-6 rounded-xl border p-6 sm:p-8 ${
        favorable ? 'border-[#b7fbca] bg-[#f4fef3]' : 'border-[#ffe6e9] bg-[#fff6f7]'}`
        }>
        
        <span
          className={`grid h-16 w-16 shrink-0 place-items-center text-white ${
          favorable ? 'rounded-full bg-[#1b6736]' : 'bg-[#e1000f]'}`}
          style={favorable ? undefined : { clipPath: 'polygon(25% 4%, 75% 4%, 100% 50%, 75% 96%, 25% 96%, 0 50%)' }}
          >
          
          {favorable ?
          <CheckIcon className="h-9 w-9" strokeWidth={3} aria-hidden="true" /> :

          <XIcon className="h-9 w-9" strokeWidth={3} aria-hidden="true" />
          }
        </span>
        <div className="min-w-[220px] flex-1">
          <p className="text-sm font-semibold uppercase tracking-wide text-ink-500"><InlineEditableField value={copy.resultLabel} onSave={editCopy('resultLabel')} className="inline-block" /></p>
          <p
            className={`text-4xl font-extrabold uppercase tracking-tight ${
            favorable ? 'text-[#1b6736]' : 'text-[#e1000f]'}`
            }>
            
            <InlineEditableField
              value={examen.resultat}
              onSave={(next) => editExamen({ resultat: next as ResultatExamen })}
              type="select"
              options={['En attente', 'Favorable', 'Défavorable']}
              className="inline-block"
            />
          </p>
          <p className="mt-2 text-sm text-ink-700">
            <InlineEditableField value={favorable ? copy.favorableMessage : copy.negativeMessage} onSave={editCopy(favorable ? 'favorableMessage' : 'negativeMessage')} className="inline-block" />
          </p>
        </div>
        <p className="text-right">
          <span
            className={`text-5xl font-extrabold tabular-nums ${
            favorable ? 'text-[#1b6736]' : 'text-[#e1000f]'}`
            }>
            
            <InlineEditableField value={String(examen.points)} onSave={(next) => editExamen({ points: Number(next) || 0 })} className="inline-block" />
          </span>
          <span className="text-2xl font-semibold text-ink-500"> / <InlineEditableField value={String(examen.total)} onSave={(next) => editExamen({ total: Number(next) || 0 })} className="inline-block" /></span>
          <span className="mt-1 block text-sm text-ink-500"><InlineEditableField value={copy.pointsLabel} onSave={editCopy('pointsLabel')} className="inline-block" /></span>
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[
        [
        { key: 'candidateLabel', t: copy.candidateLabel, v: examen.candidat, field: 'candidat' },
        { key: 'categoryLabel', t: copy.categoryLabel, v: examen.categorie, field: 'categorie' },
        { key: 'examDateLabel', t: copy.examDateLabel, v: examen.date, field: 'date' },
        { key: 'examCentreLabel', t: copy.examCentreLabel, v: examen.centre, field: 'centre' }],
        [
        { key: 'inspectorLabel', t: copy.inspectorLabel, v: examen.inspecteur, field: 'inspecteur' },
        { key: 'inspectorNumberLabel', t: copy.inspectorNumberLabel, v: examen.numeroInspecteur, field: 'numeroInspecteur' },
        { key: 'publicationDateLabel', t: copy.publicationDateLabel, v: examen.datePublication, field: 'datePublication' },
        { key: 'dossierNumberLabel', t: copy.dossierNumberLabel, v: examen.dossier, field: 'dossier' }]].map((bloc, i) =>
        <Card key={i} className="p-6">
            <dl className="space-y-5">
              {bloc.map((row) =>
            <div key={row.t}>
                  <dt className="text-sm text-ink-500"><InlineEditableField value={row.t} onSave={editCopy(row.key as keyof typeof copy)} className="inline-block" /></dt>
                  <dd className="mt-0.5 font-semibold text-ink-900">
                    {row.key === 'categoryLabel' ? <span className="inline-flex items-center gap-2"><CategoryBadge category={examen.categorie} /> <InlineEditableField value={examen.categorie} onSave={(next) => editExamen({ categorie: next as typeof examen.categorie })} type="select" options={['A', 'A2', 'B', 'BE', 'C']} className="inline-block" /> <span>- <InlineEditableField value={copy.carLabel} onSave={editCopy('carLabel')} className="inline-block" /></span></span> : <InlineEditableField value={row.v} onSave={(next) => editExamen({ [row.field]: next })} className="inline-block" />}
                  </dd>
                </div>
            )}
            </dl>
          </Card>
        )}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to={`/candidats/${examen.candidatId}`}
          className="flex h-12 flex-1 items-center justify-center rounded-lg border border-brand-600 text-sm font-semibold text-brand-600 transition-colors duration-150 hover:bg-brand-50">
          
          <InlineEditableField value={copy.backToCandidate} onSave={editCopy('backToCandidate')} className="inline-block" />
        </Link>
        <Link
          to={`/examens/${examen.id}/detail`}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border border-line bg-white text-sm font-semibold text-ink-800 transition-colors duration-150 hover:bg-canvas">
          
          <FileSearchIcon className="h-4 w-4" aria-hidden="true" />
          <InlineEditableField value={copy.evaluationDetail} onSave={editCopy('evaluationDetail')} className="inline-block" />
        </Link>
        <button
          type="button"
          onClick={() => navigate(`/examens/${examen.id}/succes`)}
          className="flex h-12 flex-1 items-center justify-center gap-2 rounded-lg bg-brand-700 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600">
          
          <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
          <InlineEditableField value={copy.downloadCecp} onSave={editCopy('downloadCecp')} className="inline-block text-sm font-semibold text-white" />
        </button>
      </div>
    </>);

}