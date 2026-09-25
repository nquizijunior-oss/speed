import { Link, useNavigate } from 'react-router-dom';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  FileWarningIcon,
  ReceiptEuroIcon,
  TrendingUpIcon,
} from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { ResultBadge } from '../components/ui/ResultBadge';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { reussiteParMois } from '../data/facturation';
import { useAppContext } from '../hooks/useAppContext';
import React, { useEffect, useState } from 'react';

const alerts = [
  {
    icon: ReceiptEuroIcon,
    titre: '3 factures en retard',
    detail: '1 480 € à recouvrer — relance recommandée',
    to: '/facturation',
    tone: 'text-danger-600 bg-danger-50',
  },
  {
    icon: FileWarningIcon,
    titre: '3 pièces à vérifier',
    detail: 'Justificatifs déposés en attente de contrôle',
    to: '/documents',
    tone: 'text-warn-700 bg-warn-50',
  },
  {
    icon: AlertTriangleIcon,
    titre: '1 photo e-Photo refusée',
    detail: 'Amine Tazi — nouveau dépôt nécessaire',
    to: '/documents',
    tone: 'text-warn-700 bg-warn-50',
  },
];

export function Dashboard() {
  const { candidats, examens, reservations, updateCandidat } = useAppContext();
  const navigate = useNavigate();

  const getStoredString = (key: string, fallback: string) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const [schoolName, setSchoolName] = useState(() => getStoredString('schoolName', 'Auto-école SPEED PERMIS'));
  const [headerDescription, setHeaderDescription] = useState(() => getStoredString('dashboardHeaderDescription', 'Mardi 15 septembre 2026 — synthèse de votre activité'));
  const [planSessionLabel, setPlanSessionLabel] = useState(() => getStoredString('dashboardPlanSessionLabel', 'Planifier une session'));
  const [trendTitle, setTrendTitle] = useState(() => getStoredString('dashboardTrendTitle', 'Taux de réussite — 6 derniers mois'));
  const [trendValue, setTrendValue] = useState(() => getStoredString('dashboardTrendValue', '95 %'));
  const [trendDelta, setTrendDelta] = useState(() => getStoredString('dashboardTrendDelta', '+2 pts vs août'));
  const [candidatsActifsLabel, setCandidatsActifsLabel] = useState(() => getStoredString('dashboardCandidatsActifsLabel', 'Candidats actifs'));
  const [candidatsActifsValue, setCandidatsActifsValue] = useState(() => getStoredString('dashboardCandidatsActifsValue', String(candidats.filter((c) => c.statut === 'Actif').length)));
  const [candidatsActifsHint, setCandidatsActifsHint] = useState(() => getStoredString('dashboardCandidatsActifsHint', '+12 ce mois-ci'));
  const [examensAVenirLabel, setExamensAVenirLabel] = useState(() => getStoredString('dashboardExamensAVenirLabel', 'Examens à venir'));
  const [examensAVenirValue, setExamensAVenirValue] = useState(() => getStoredString('dashboardExamensAVenirValue', String(examens.filter((e) => e.resultat === 'En attente').length)));
  const [examensAVenirHint, setExamensAVenirHint] = useState(() => getStoredString('dashboardExamensAVenirHint', '3 sous 7 jours'));
  const [examensRealisesLabel, setExamensRealisesLabel] = useState(() => getStoredString('dashboardExamensRealisesLabel', 'Examens réalisés'));
  const [examensRealisesValue, setExamensRealisesValue] = useState(() => getStoredString('dashboardExamensRealisesValue', String(examens.filter((e) => e.resultat !== 'En attente').length)));
  const [examensRealisesHint, setExamensRealisesHint] = useState(() => getStoredString('dashboardExamensRealisesHint', 'depuis janvier'));
  const [lastExamsTitle, setLastExamsTitle] = useState(() => getStoredString('dashboardLastExamsTitle', 'Derniers examens réalisés'));
  const [tableHeaderCandidat, setTableHeaderCandidat] = useState(() => getStoredString('dashboardTableHeaderCandidat', 'Candidat'));
  const [tableHeaderCategorie, setTableHeaderCategorie] = useState(() => getStoredString('dashboardTableHeaderCategorie', 'Catégorie'));
  const [tableHeaderDate, setTableHeaderDate] = useState(() => getStoredString('dashboardTableHeaderDate', 'Date d’examen'));
  const [tableHeaderCentre, setTableHeaderCentre] = useState(() => getStoredString('dashboardTableHeaderCentre', 'Centre'));
  const [tableHeaderResultat, setTableHeaderResultat] = useState(() => getStoredString('dashboardTableHeaderResultat', 'Résultat'));
  const [viewAllExamsLabel, setViewAllExamsLabel] = useState(() => getStoredString('dashboardViewAllExamsLabel', 'Voir tous les examens'));
  const [agendaTitle, setAgendaTitle] = useState(() => getStoredString('dashboardAgendaTitle', 'Agenda du jour'));
  const [agendaDescription, setAgendaDescription] = useState(() => getStoredString('dashboardAgendaDescription', 'Mardi 15 septembre'));
  const [openPlanningLabel, setOpenPlanningLabel] = useState(() => getStoredString('dashboardOpenPlanningLabel', 'Ouvrir le planning'));
  const [todoTitle, setTodoTitle] = useState(() => getStoredString('dashboardTodoTitle', 'À traiter'));
  const [todoDescription, setTodoDescription] = useState(() => getStoredString('dashboardTodoDescription', 'Actions en attente de votre équipe'));

  useEffect(() => {
    try {
      localStorage.setItem('schoolName', schoolName);
      localStorage.setItem('dashboardHeaderDescription', headerDescription);
      localStorage.setItem('dashboardPlanSessionLabel', planSessionLabel);
      localStorage.setItem('dashboardTrendTitle', trendTitle);
      localStorage.setItem('dashboardTrendValue', trendValue);
      localStorage.setItem('dashboardTrendDelta', trendDelta);
      localStorage.setItem('dashboardCandidatsActifsLabel', candidatsActifsLabel);
      localStorage.setItem('dashboardCandidatsActifsValue', candidatsActifsValue);
      localStorage.setItem('dashboardCandidatsActifsHint', candidatsActifsHint);
      localStorage.setItem('dashboardExamensAVenirLabel', examensAVenirLabel);
      localStorage.setItem('dashboardExamensAVenirValue', examensAVenirValue);
      localStorage.setItem('dashboardExamensAVenirHint', examensAVenirHint);
      localStorage.setItem('dashboardExamensRealisesLabel', examensRealisesLabel);
      localStorage.setItem('dashboardExamensRealisesValue', examensRealisesValue);
      localStorage.setItem('dashboardExamensRealisesHint', examensRealisesHint);
      localStorage.setItem('dashboardLastExamsTitle', lastExamsTitle);
      localStorage.setItem('dashboardTableHeaderCandidat', tableHeaderCandidat);
      localStorage.setItem('dashboardTableHeaderCategorie', tableHeaderCategorie);
      localStorage.setItem('dashboardTableHeaderDate', tableHeaderDate);
      localStorage.setItem('dashboardTableHeaderCentre', tableHeaderCentre);
      localStorage.setItem('dashboardTableHeaderResultat', tableHeaderResultat);
      localStorage.setItem('dashboardViewAllExamsLabel', viewAllExamsLabel);
      localStorage.setItem('dashboardAgendaTitle', agendaTitle);
      localStorage.setItem('dashboardAgendaDescription', agendaDescription);
      localStorage.setItem('dashboardOpenPlanningLabel', openPlanningLabel);
      localStorage.setItem('dashboardTodoTitle', todoTitle);
      localStorage.setItem('dashboardTodoDescription', todoDescription);
    } catch {
      // ignore
    }
  }, [schoolName, headerDescription, planSessionLabel, trendTitle, trendValue, trendDelta, candidatsActifsLabel, candidatsActifsValue, candidatsActifsHint, examensAVenirLabel, examensAVenirValue, examensAVenirHint, examensRealisesLabel, examensRealisesValue, examensRealisesHint, lastExamsTitle, tableHeaderCandidat, tableHeaderCategorie, tableHeaderDate, tableHeaderCentre, tableHeaderResultat, viewAllExamsLabel, agendaTitle, agendaDescription, openPlanningLabel, todoTitle, todoDescription]);

  const recentExamsSeed = examens.filter((e) => e.resultat !== 'En attente').slice(0, 4).map((e) => ({
    id: e.id,
    candidatId: e.candidatId,
    candidat: candidats.find((candidate) => candidate.id === e.candidatId) ? `${candidats.find((candidate) => candidate.id === e.candidatId)!.prenom} ${candidats.find((candidate) => candidate.id === e.candidatId)!.nom}` : e.candidat,
    categorie: e.categorie,
    date: getStoredString(`dashboardExamDate:${e.id}`, e.date),
    centre: getStoredString(`dashboardExamCentre:${e.id}`, e.centre),
    resultat: e.resultat,
  }));
  const agendaSeed = reservations.filter((r) => r.jour === 7).map((r) => ({
    id: r.id,
    debut: getStoredString(`dashboardAgendaDebut:${r.id}`, r.debut),
    fin: getStoredString(`dashboardAgendaFin:${r.id}`, r.fin),
    candidat: candidats.find((candidate) => candidate.id === r.candidatId) ? `${candidats.find((candidate) => candidate.id === r.candidatId)!.prenom} ${candidats.find((candidate) => candidate.id === r.candidatId)!.nom}` : r.candidat,
    type: getStoredString(`dashboardAgendaType:${r.id}`, r.type),
    moniteur: getStoredString(`dashboardAgendaMoniteur:${r.id}`, r.moniteur),
  }));
  const alertsSeed = alerts.map((a) => ({
    ...a,
    titre: getStoredString(`dashboardAlertTitle:${a.to}:${a.titre}`, a.titre),
    detail: getStoredString(`dashboardAlertDetail:${a.to}:${a.titre}`, a.detail),
  }));

  const [recentExams, setRecentExams] = useState(recentExamsSeed);
  const [agendaItems, setAgendaItems] = useState(agendaSeed);
  const [alertItems, setAlertItems] = useState(alertsSeed);

  useEffect(() => {
    recentExams.forEach((exam) => {
      try {
        localStorage.setItem(`dashboardExamCandidat:${exam.id}`, exam.candidat);
        localStorage.setItem(`dashboardExamDate:${exam.id}`, exam.date);
        localStorage.setItem(`dashboardExamCentre:${exam.id}`, exam.centre);
      } catch {
        // ignore
      }
    });
  }, [recentExams]);

  useEffect(() => {
    agendaItems.forEach((item) => {
      try {
        localStorage.setItem(`dashboardAgendaDebut:${item.id}`, item.debut);
        localStorage.setItem(`dashboardAgendaFin:${item.id}`, item.fin);
        localStorage.setItem(`dashboardAgendaCandidat:${item.id}`, item.candidat);
        localStorage.setItem(`dashboardAgendaType:${item.id}`, item.type);
        localStorage.setItem(`dashboardAgendaMoniteur:${item.id}`, item.moniteur);
      } catch {
        // ignore
      }
    });
  }, [agendaItems]);

  useEffect(() => {
    alertItems.forEach((alertItem) => {
      try {
        localStorage.setItem(`dashboardAlertTitle:${alertItem.to}:${alertItem.titre}`, alertItem.titre);
        localStorage.setItem(`dashboardAlertDetail:${alertItem.to}:${alertItem.titre}`, alertItem.detail);
      } catch {
        // ignore
      }
    });
  }, [alertItems]);

  const manageRecentExam = (id: string, field: 'candidat' | 'date' | 'centre', value: string) => {
    setRecentExams((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const manageAgendaItem = (id: string, field: 'debut' | 'fin' | 'candidat' | 'type' | 'moniteur', value: string) => {
    setAgendaItems((current) => current.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const manageAlertItem = (key: string, field: 'titre' | 'detail', value: string) => {
    setAlertItems((current) => current.map((item) => (item.to === key ? { ...item, [field]: value } : item)));
  };

  const derniers = recentExams;
  const agenda = agendaItems;

  return (
    <>
      <PageHeader
        title={
          <>
            Bonjour, <InlineEditableField value={schoolName} onSave={setSchoolName} className="inline-flex text-2xl font-bold" />
          </>
        }
        description={<InlineEditableField value={headerDescription} onSave={setHeaderDescription} className="inline-block" />}
        action={
          <Link
            to="/reservations"
            className="inline-flex items-center gap-2 rounded-lg bg-sky-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-sky-600"
          >
            <CalendarDaysIcon className="h-4 w-4" aria-hidden="true" />
            <InlineEditableField value={planSessionLabel} onSave={setPlanSessionLabel} className="inline-block text-sm font-semibold text-white" />
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="space-y-6 xl:col-span-2">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-5">
              <div className="border-b border-line p-6 lg:col-span-3 lg:border-b-0 lg:border-r">
                <div className="flex items-center gap-2 text-sm font-medium text-ink-500">
                  <TrendingUpIcon className="h-4 w-4 text-ok-600" aria-hidden="true" />
                  <InlineEditableField value={trendTitle} onSave={setTrendTitle} className="inline-block" />
                </div>
                <p className="mt-2 flex items-baseline gap-2">
                  <span className="text-5xl font-extrabold tracking-tight text-ink-900"><InlineEditableField value={trendValue} onSave={setTrendValue} className="inline-block" /></span>
                  <span className="text-sm font-semibold text-ok-600"><InlineEditableField value={trendDelta} onSave={setTrendDelta} className="inline-block" /></span>
                </p>
                <div className="mt-4 h-28">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={reussiteParMois} margin={{ top: 4, right: 4, bottom: 0, left: -28 }}>
                      <defs>
                        <linearGradient id="reussite" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1a46c2" stopOpacity={0.18} />
                          <stop offset="100%" stopColor="#1a46c2" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="mois" tickLine={false} axisLine={false} tick={{ fill: '#8d97ac', fontSize: 12 }} />
                      <YAxis domain={[80, 100]} hide />
                      <Tooltip
                        cursor={{ stroke: '#c2d2ff' }}
                        contentStyle={{ borderRadius: 8, border: '1px solid #e3e8f1', fontSize: 12 }}
                        formatter={(v: number) => [`${v} %`, 'Réussite']}
                      />
                      <Area type="monotone" dataKey="taux" stroke="#1a46c2" strokeWidth={2} fill="url(#reussite)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <dl className="grid grid-cols-1 divide-y divide-line lg:col-span-2">
                {[
                  { label: candidatsActifsLabel, value: candidatsActifsValue, hint: candidatsActifsHint, onLabelChange: setCandidatsActifsLabel, onValueChange: setCandidatsActifsValue, onHintChange: setCandidatsActifsHint },
                  { label: examensAVenirLabel, value: examensAVenirValue, hint: examensAVenirHint, onLabelChange: setExamensAVenirLabel, onValueChange: setExamensAVenirValue, onHintChange: setExamensAVenirHint },
                  { label: examensRealisesLabel, value: examensRealisesValue, hint: examensRealisesHint, onLabelChange: setExamensRealisesLabel, onValueChange: setExamensRealisesValue, onHintChange: setExamensRealisesHint },
                ].map((m) => (
                  <div key={m.label} className="flex items-baseline justify-between px-6 py-5">
                    <div>
                      <dt className="text-sm text-ink-500"><InlineEditableField value={m.label} onSave={m.onLabelChange} className="inline-block" /></dt>
                      <dd className="mt-1 text-2xl font-bold tracking-tight text-ink-900"><InlineEditableField value={m.value} onSave={m.onValueChange} className="inline-block" /></dd>
                    </div>
                    <span className="text-xs text-ink-400"><InlineEditableField value={m.hint} onSave={m.onHintChange} className="inline-block" /></span>
                  </div>
                ))}
              </dl>
            </div>
          </Card>

          <Card>
            <CardHeader
              title={<InlineEditableField value={lastExamsTitle} onSave={setLastExamsTitle} className="inline-block" />}
              action={
                <Link to="/examens" className="text-sm font-semibold text-sky-600 transition-colors duration-150 hover:text-sky-700">
                  Voir tous
                </Link>
              }
            />

            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                    <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaderCandidat} onSave={setTableHeaderCandidat} className="inline-block" /></th>
                    <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaderCategorie} onSave={setTableHeaderCategorie} className="inline-block" /></th>
                    <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaderDate} onSave={setTableHeaderDate} className="inline-block" /></th>
                    <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaderCentre} onSave={setTableHeaderCentre} className="inline-block" /></th>
                    <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaderResultat} onSave={setTableHeaderResultat} className="inline-block" /></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {derniers.map((e) => (
                    <tr key={e.id} className="transition-colors duration-150 hover:bg-canvas">
                      <td className="px-6 py-4">
                        <Link to={`/candidats/${e.candidatId}`} className="font-semibold text-ink-900 transition-colors duration-150 hover:text-sky-600">
                          <InlineEditableField value={e.candidat} editOnDoubleClick onSingleClick={() => navigate(`/candidats/${e.candidatId}`)} onSave={(next) => {
                            const candidate = candidats.find((item) => item.id === e.candidatId);
                            if (candidate) {
                              const parts = next.trim().split(/\s+/);
                              updateCandidat(candidate.id, {
                                prenom: parts.shift() || candidate.prenom,
                                nom: parts.join(' ') || candidate.nom,
                              });
                            }
                          }} className="inline-block" />
                        </Link>
                      </td>
                      <td className="px-6 py-4"><CategoryBadge category={e.categorie} /></td>
                      <td className="px-6 py-4 text-ink-700"><InlineEditableField value={e.date} onSave={(next) => manageRecentExam(e.id, 'date', next)} className="inline-block" /></td>
                      <td className="px-6 py-4 text-ink-700"><InlineEditableField value={e.centre} onSave={(next) => manageRecentExam(e.id, 'centre', next)} className="inline-block" /></td>
                      <td className="px-6 py-4">
                        <ResultBadge result={e.resultat} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="border-t border-line px-6 py-4">
              <Link to="/examens" className="inline-flex items-center gap-2 rounded-lg border border-sky-600 px-4 py-2.5 text-sm font-semibold text-sky-600 transition-colors duration-150 hover:bg-sky-50">
                <InlineEditableField value={viewAllExamsLabel} onSave={setViewAllExamsLabel} className="inline-block" />
                <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader title={<InlineEditableField value={agendaTitle} onSave={setAgendaTitle} className="inline-block" />} description={<InlineEditableField value={agendaDescription} onSave={setAgendaDescription} className="inline-block" />} />
            <ul className="divide-y divide-line">
              {agenda.map((r) => (
                <li key={r.id} className="flex gap-4 px-6 py-4">
                  <div className="w-16 shrink-0">
                    <p className="text-sm font-bold text-ink-900"><InlineEditableField value={r.debut} onSave={(next) => manageAgendaItem(r.id, 'debut', next)} className="inline-block" /></p>
                    <p className="text-xs text-ink-400"><InlineEditableField value={r.fin} onSave={(next) => manageAgendaItem(r.id, 'fin', next)} className="inline-block" /></p>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink-900"><InlineEditableField value={r.candidat} onSave={(next) => {
                      const candidate = candidats.find((item) => item.id === r.candidatId);
                      if (candidate) {
                        const parts = next.trim().split(/\s+/);
                        updateCandidat(candidate.id, {
                          prenom: parts.shift() || candidate.prenom,
                          nom: parts.join(' ') || candidate.nom,
                        });
                      }
                    }} className="inline-block" /></p>
                    <p className="mt-0.5 truncate text-xs text-ink-500"><InlineEditableField value={`${r.type} · ${r.moniteur}`} onSave={(next) => {
                      const [updatedType, updatedMoniteur] = next.split(' · ');
                      manageAgendaItem(r.id, 'type', updatedType ?? r.type);
                      manageAgendaItem(r.id, 'moniteur', updatedMoniteur ?? r.moniteur);
                    }} className="inline-block" /></p>
                  </div>
                </li>
              ))}
            </ul>
            <div className="border-t border-line px-6 py-4">
              <Link to="/reservations" className="inline-flex items-center gap-1.5 text-sm font-semibold text-sky-600 transition-colors duration-150 hover:text-sky-700">
                <ClockIcon className="h-4 w-4" aria-hidden="true" />
                <InlineEditableField value={openPlanningLabel} onSave={setOpenPlanningLabel} className="inline-block" />
              </Link>
            </div>
          </Card>

          <Card>
            <CardHeader title={<InlineEditableField value={todoTitle} onSave={setTodoTitle} className="inline-block" />} description={<InlineEditableField value={todoDescription} onSave={setTodoDescription} className="inline-block" />} />
            <ul className="divide-y divide-line">
              {alertItems.map((a) => {
                const Icon = a.icon;
                return (
                  <li key={a.titre} className="px-6 py-4">
                    <Link to={a.to} className="flex items-start gap-3">
                      <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${a.tone}`}>
                        <Icon className="h-4 w-4" aria-hidden="true" />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-ink-900"><InlineEditableField value={a.titre} onSave={(next) => manageAlertItem(a.to, 'titre', next)} className="inline-block" /></p>
                        <p className="mt-0.5 text-xs text-ink-500"><InlineEditableField value={a.detail} onSave={(next) => manageAlertItem(a.to, 'detail', next)} className="inline-block" /></p>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </Card>
        </div>
      </div>
    </>
  );
}