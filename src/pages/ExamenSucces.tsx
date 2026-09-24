import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  CheckIcon,
  DownloadIcon,
  PartyPopperIcon,
  Share2Icon,
  SparklesIcon,
  StarIcon,
  TrophyIcon,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { getExamen } from '../data/examens';
import { InlineEditableField } from '../components/ui/InlineEditableField';

const confettis = [
  { left: '5%', top: '20%', color: '#1a46c2', rotate: -22, delay: 0.05, size: 'h-3 w-1.5' },
  { left: '10%', top: '8%', color: '#b7fbca', rotate: 35, delay: 0.12, size: 'h-2.5 w-2' },
  { left: '15%', top: '34%', color: '#e1000f', rotate: -45, delay: 0.18, size: 'h-3 w-1.5' },
  { left: '21%', top: '2%', color: '#1a46c2', rotate: 12, delay: 0.22, size: 'h-2.5 w-2.5' },
  { left: '28%', top: '18%', color: '#e0a83a', rotate: 52, delay: 0.08, size: 'h-3 w-1.5' },
  { left: '35%', top: '6%', color: '#1b6736', rotate: -18, delay: 0.16, size: 'h-2.5 w-2' },
  { left: '42%', top: '30%', color: '#1a46c2', rotate: 40, delay: 0.26, size: 'h-3 w-1.5' },
  { left: '48%', top: '1%', color: '#e1000f', rotate: -35, delay: 0.1, size: 'h-2.5 w-2.5' },
  { left: '55%', top: '12%', color: '#e0a83a', rotate: 20, delay: 0.2, size: 'h-3 w-1.5' },
  { left: '62%', top: '28%', color: '#1b6736', rotate: -50, delay: 0.14, size: 'h-2.5 w-2' },
  { left: '69%', top: '5%', color: '#1a46c2', rotate: 30, delay: 0.06, size: 'h-3 w-1.5' },
  { left: '76%', top: '20%', color: '#e1000f', rotate: -14, delay: 0.24, size: 'h-2.5 w-2.5' },
  { left: '83%', top: '7%', color: '#e0a83a', rotate: 45, delay: 0.18, size: 'h-3 w-1.5' },
  { left: '90%', top: '29%', color: '#1b6736', rotate: -30, delay: 0.12, size: 'h-2.5 w-2' },
  { left: '95%', top: '12%', color: '#1a46c2', rotate: 18, delay: 0.2, size: 'h-3 w-1.5' },
  { left: '8%', top: '48%', color: '#e0a83a', rotate: 20, delay: 0.28, size: 'h-2 w-2.5' },
  { left: '92%', top: '48%', color: '#e1000f', rotate: -38, delay: 0.32, size: 'h-2.5 w-1.5' },
];

function downloadCepc(examen: NonNullable<ReturnType<typeof getExamen>>) {
  const content = [
    'CEPC - Examen de conduite',
    `Candidat: ${examen.candidat}`,
    `Dossier: ${examen.dossier}`,
    `Date: ${examen.date}`,
    `Centre: ${examen.centre}`,
    `Résultat: ${examen.resultat}`,
    `Score: ${examen.points} / ${examen.total}`,
    '',
    'Appréciation:',
    ...examen.appreciation,
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `CEPC-${examen.dossier}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ExamenSucces() {
  const { id = '' } = useParams();
  const examen = getExamen(id);
  const [notFoundTitle, setNotFoundTitle] = useState(() => localStorage.getItem('successNotFoundTitle') ?? 'Dossier introuvable');
  const [backLabel, setBackLabel] = useState(() => localStorage.getItem('successBackLabel') ?? 'Retour aux examens');
  const [resultLabel, setResultLabel] = useState(() => localStorage.getItem('successResultLabel') ?? 'Résultat favorable');
  const [successTitle, setSuccessTitle] = useState(() => localStorage.getItem('successMainTitle') ?? 'Permis obtenu !');
  const [successText, setSuccessText] = useState(() => localStorage.getItem('successText') ?? 'Félicitations ! Le résultat de l’examen pratique de');
  const [downloadLabel, setDownloadLabel] = useState(() => localStorage.getItem('successDownloadLabel') ?? 'Télécharger le CEPC');
  const [shareLabel, setShareLabel] = useState(() => localStorage.getItem('successShareLabel') ?? 'Partager la réussite');
  const [returnLabel, setReturnLabel] = useState(() => localStorage.getItem('successReturnLabel') ?? 'Retour au dossier du candidat');

  useEffect(() => {
    try {
      localStorage.setItem('successNotFoundTitle', notFoundTitle);
      localStorage.setItem('successBackLabel', backLabel);
      localStorage.setItem('successResultLabel', resultLabel);
      localStorage.setItem('successMainTitle', successTitle);
      localStorage.setItem('successText', successText);
      localStorage.setItem('successDownloadLabel', downloadLabel);
      localStorage.setItem('successShareLabel', shareLabel);
      localStorage.setItem('successReturnLabel', returnLabel);
    } catch {
      // ignore
    }
  }, [notFoundTitle, backLabel, resultLabel, successTitle, successText, downloadLabel, shareLabel, returnLabel]);

  if (!examen) {
    return (
      <Card className="px-6 py-20 text-center">
        <h1 className="text-lg font-semibold text-ink-900"><InlineEditableField value={notFoundTitle} onSave={setNotFoundTitle} className="inline-block" /></h1>
        <Link to="/examens" className="mt-3 inline-block text-sm font-semibold text-brand-600">
          <InlineEditableField value={backLabel} onSave={setBackLabel} className="inline-block" />
        </Link>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-3xl py-4 text-center sm:py-8">
      <div className="relative overflow-hidden rounded-2xl border border-[#b7fbca] bg-[#f4fef3] px-5 py-10 shadow-sm sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          {confettis.map((c, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: -24, scale: 0.4, rotate: c.rotate - 20 }}
              animate={{ opacity: 1, y: [0, 10, 0], scale: 1, rotate: c.rotate }}
              transition={{ duration: 1.4, delay: c.delay, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
              className={`absolute rounded-sm ${c.size}`}
              style={{ left: c.left, top: c.top, backgroundColor: c.color }}
            />
          ))}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0.1, 0.35, 0.1], scale: [0.85, 1.1, 0.85] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#b7fbca]/60 blur-2xl"
          />
        </div>

        <div className="relative z-10">
          <div className="mb-6 flex items-center justify-center gap-3 text-[#1b6736]">
            <SparklesIcon className="h-7 w-7" aria-hidden="true" />
            <PartyPopperIcon className="h-8 w-8" aria-hidden="true" />
            <SparklesIcon className="h-7 w-7" aria-hidden="true" />
          </div>

          <div className="relative mx-auto h-36 w-36">
            <motion.span
              initial={{ opacity: 0, scale: 0.5, rotate: -12 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 0.45, ease: [0.23, 1, 0.32, 1] }}
              className="absolute inset-0 grid place-items-center rounded-full bg-[#1b6736] text-white shadow-lg"
            >
              <CheckIcon className="h-16 w-16" strokeWidth={3} aria-hidden="true" />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.45, type: 'spring', stiffness: 260, damping: 14 }}
              className="absolute -right-2 -top-2 grid h-11 w-11 place-items-center rounded-full bg-white text-[#e0a83a] shadow-md"
              aria-hidden="true"
            >
              <StarIcon className="h-6 w-6 fill-current" />
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.58, type: 'spring', stiffness: 260, damping: 14 }}
              className="absolute -bottom-1 -left-3 grid h-12 w-12 place-items-center rounded-full bg-white text-[#1a46c2] shadow-md"
              aria-hidden="true"
            >
              <TrophyIcon className="h-6 w-6" />
            </motion.span>
          </div>

          <p className="mt-7 text-sm font-bold uppercase tracking-[0.18em] text-[#1b6736]"><InlineEditableField value={resultLabel} onSave={setResultLabel} className="inline-block" /></p>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-[#1b6736] sm:text-5xl"><InlineEditableField value={successTitle} onSave={setSuccessTitle} className="inline-block" /></h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-ink-800">
            <InlineEditableField value={successText} onSave={setSuccessText} className="inline-block" /> <span className="font-semibold">{examen.candidat}</span> est{' '}
            <span className="font-bold text-[#1b6736]">favorable</span>.
            <br />
            Le certificat d’examen du permis de conduire (CEPC) a été généré avec succès.
          </p>

          <div className="mx-auto mt-7 grid max-w-xl grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs text-ink-500">Candidat</p>
              <p className="mt-1 truncate text-sm font-bold text-ink-900">{examen.candidat}</p>
            </div>
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs text-ink-500">Score</p>
              <p className="mt-1 text-sm font-bold text-[#1b6736]">{examen.points} / {examen.total}</p>
            </div>
            <div className="rounded-xl bg-white/80 px-4 py-3 shadow-sm">
              <p className="text-xs text-ink-500">Dossier</p>
              <p className="mt-1 text-sm font-bold text-ink-900">{examen.dossier}</p>
            </div>
          </div>

          <p className="mx-auto mt-7 max-w-xl rounded-xl border border-warn-700/20 bg-warn-50 px-6 py-4 text-sm font-medium text-warn-700">
            Le titre de permis de conduire est en cours de fabrication par l’Imprimerie Nationale.
          </p>

          <div className="mx-auto mt-7 max-w-xl space-y-3">
            <button
              type="button"
              onClick={() => downloadCepc(examen)}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg bg-brand-700 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-600"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              <InlineEditableField value={downloadLabel} onSave={setDownloadLabel} className="inline-block" />
            </button>
            <button
              type="button"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({ title: 'Permis obtenu !', text: `Examen favorable pour ${examen.candidat}.` }).catch(() => undefined);
                }
              }}
              className="flex h-12 w-full items-center justify-center gap-2.5 rounded-lg border border-line bg-white text-sm font-semibold text-ink-800 transition-colors duration-150 hover:bg-canvas"
            >
              <Share2Icon className="h-4 w-4" aria-hidden="true" />
              <InlineEditableField value={shareLabel} onSave={setShareLabel} className="inline-block" />
            </button>
          </div>

          <Link
            to={`/candidats/${examen.candidatId}`}
            className="mt-7 inline-block text-sm font-semibold text-brand-600 transition-colors duration-150 hover:text-brand-700"
          >
            <InlineEditableField value={returnLabel} onSave={setReturnLabel} className="inline-block" />
          </Link>
        </div>
      </div>
    </div>
  );
}
