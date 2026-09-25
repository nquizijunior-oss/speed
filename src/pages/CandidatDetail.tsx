import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowRightIcon, DownloadIcon, EyeIcon, PhoneIcon, MailIcon, UserXIcon, CameraIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { ResultBadge } from '../components/ui/ResultBadge';
import { toneForResultat } from '../components/ui/badgeTone';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { useAppContext } from '../hooks/useAppContext';
import { examensParCandidat } from '../data/examens';
import { documentsCandidat } from '../data/documents';

const onglets = ['Dossier', 'Suivi pédagogique', 'Examens', 'Documents', 'Paiements'] as const;
type Onglet = (typeof onglets)[number];

const competencesPedago = [
{ libelle: 'Maîtriser le maniement du véhicule', niveau: 100 },
{ libelle: 'Appréhender la route et circuler', niveau: 85 },
{ libelle: 'Circuler dans des conditions difficiles', niveau: 60 },
{ libelle: 'Pratiquer une conduite autonome et sûre', niveau: 45 }];


export function CandidatDetail() {
  const { id = '' } = useParams();
  const { candidats, factures, updateCandidat } = useAppContext();
  const candidat = candidats.find(c => c.id === id);
  const [onglet, setOnglet] = useState<Onglet>('Examens');
  const [photo, setPhoto] = useState<string | undefined>(candidat?.photo);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setPhoto(candidat?.photo);
  }, [candidat?.photo]);

  if (!candidat) {
    return (
      <Card className="flex flex-col items-center gap-3 px-6 py-20 text-center">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-canvas text-ink-400">
          <UserXIcon className="h-6 w-6" aria-hidden="true" />
        </span>
        <h1 className="text-lg font-semibold text-ink-900">Dossier introuvable</h1>
        <p className="text-sm text-ink-500">Ce candidat n’existe pas ou a été archivé.</p>
        <Link
          to="/candidats"
          className="mt-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
        >
          Retour à la liste
        </Link>
      </Card>);

  }

  const examens = examensParCandidat(candidat.id);
  const docs = documentsCandidat(`${candidat.prenom} ${candidat.nom}`);
  const paiements = factures.filter((f) => f.candidat === `${candidat.prenom} ${candidat.nom}`);
  const nomComplet = `${candidat.prenom.toUpperCase()} ${candidat.nom.toUpperCase()}`;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const value = reader.result as string;
        setPhoto(value);
        updateCandidat(candidat.id, { photo: value });
      };
      reader.readAsDataURL(file);
    }
    event.target.value = '';
  };

  return (
    <>
      <PageHeader
        title={nomComplet}
        crumbs={[{ label: 'Candidats', to: '/candidats' }, { label: 'Dossier candidat' }]} />

      <Card className="overflow-hidden">
        <div className="grid grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_320px] lg:gap-10">
          <div className="flex flex-wrap items-start gap-5">
            <div className="relative group">
              {photo ? (
                <img
                  src={photo}
                  alt={nomComplet}
                  className="h-24 w-24 shrink-0 rounded-full object-cover bg-ink-900/10"
                />
              ) : (
                <span className="grid h-24 w-24 shrink-0 place-items-center rounded-full bg-ink-900/10 text-3xl font-bold text-ink-800">
                  {candidat.initiales}
                </span>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 grid place-items-center rounded-full bg-black/50 opacity-0 transition-opacity duration-150 group-hover:opacity-100"
              >
                <CameraIcon className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                aria-label="Uploader une photo du candidat"
              />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-2xl font-bold tracking-tight text-ink-900">
                  <InlineEditableField value={candidat.prenom} onSave={(next) => updateCandidat(candidat.id, { prenom: next })} className="inline-block" />
                  {' '}
                  <InlineEditableField value={candidat.nom} onSave={(next) => updateCandidat(candidat.id, { nom: next })} className="inline-block" />
                </h2>
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink-700">Catégorie <InlineEditableField value={candidat.categorie} onSave={(next) => updateCandidat(candidat.id, { categorie: next as typeof candidat.categorie })} type="select" options={['A', 'A2', 'B', 'BE', 'C']} className="inline-block text-sm font-semibold text-ink-700" /></span>
              </div>
              <p className="mt-2 text-sm text-ink-700">
                {candidat.genre === 'F' ? 'Née' : 'Né'} le <InlineEditableField value={candidat.dateNaissance} onSave={(next) => updateCandidat(candidat.id, { dateNaissance: next })} className="date-value inline-block" /> (<InlineEditableField value={String(candidat.age)} onSave={(next) => updateCandidat(candidat.id, { age: Number(next) || 0 })} className="inline-block" /> ans)
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-700">
                <PhoneIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />
                <InlineEditableField value={candidat.telephone} onSave={(next) => updateCandidat(candidat.id, { telephone: next })} className="inline-block" />
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-700">
                <MailIcon className="h-4 w-4 text-ink-400" aria-hidden="true" />
                <InlineEditableField value={candidat.email} onSave={(next) => updateCandidat(candidat.id, { email: next })} className="inline-block" />
              </p>
            </div>
          </div>

          <dl className="space-y-4 lg:border-l lg:border-line lg:pl-10">
            {[
              { t: 'N° NEPH', v: candidat.neph },
              { t: 'Date d’inscription', v: candidat.dateInscription },
              { t: 'Auto-école', v: candidat.ecole },
              { t: 'Moniteur référent', v: candidat.moniteur },
            ].map((row) => (
              <div key={row.t}>
                <dt className="text-sm text-ink-500">{row.t}</dt>
                <dd className="mt-0.5 font-semibold tabular-nums text-ink-900">{row.t === 'Date d’inscription' ? <InlineEditableField value={candidat.dateInscription} onSave={(next) => updateCandidat(candidat.id, { dateInscription: next })} className="inline-block" /> : row.v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="overflow-x-auto border-t border-line bg-white">
          <div className="flex min-w-max gap-1 px-4" role="tablist" aria-label="Sections du dossier">
            {onglets.map((o) => (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={onglet === o}
                onClick={() => setOnglet(o)}
                className={`relative px-5 py-4 text-sm font-medium transition-colors duration-150 ${
                  onglet === o ? 'text-brand-600' : 'text-ink-700 hover:text-ink-900'
                }`}
              >
                {o}
                {onglet === o && <span className="absolute inset-x-3 bottom-0 h-0.5 rounded-full bg-brand-600" />}
              </button>
            ))}
          </div>
        </div>
      </Card>

      <div className="mt-6">
        {onglet === 'Dossier' && (
          <Card>
            <CardHeader title="Informations du dossier" description="Données transmises au service national" />
            <dl className="grid grid-cols-1 gap-x-10 gap-y-5 p-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  t: 'Statut du dossier',
                  v: candidat.statut,
                  onSave: (next: string) => updateCandidat(candidat.id, { statut: next as typeof candidat.statut }),
                  type: 'select' as const,
                  options: ['Actif', 'En attente', 'Terminé', 'Suspendu'],
                },
                {
                  t: 'Code de la route',
                  v: candidat.codeObtenu ? 'Obtenu' : 'Non obtenu',
                  onSave: (next: string) => updateCandidat(candidat.id, { codeObtenu: next === 'Obtenu' }),
                  type: 'select' as const,
                  options: ['Obtenu', 'Non obtenu'],
                },
                {
                  t: 'Âge',
                  v: String(candidat.age),
                  onSave: (next: string) => updateCandidat(candidat.id, { age: Number(next.replace(/[^0-9]/g, '')) || 0 }),
                },
                { t: 'Heures effectuées', v: `${candidat.heuresEffectuees} h / ${candidat.heuresPrevues} h` },
                {
                  t: 'Ville de rattachement',
                  v: candidat.ville,
                  onSave: (next: string) => updateCandidat(candidat.id, { ville: next }),
                },
                {
                  t: 'Solde restant dû',
                  v: candidat.soldeDu === 0 ? 'Aucun' : `${candidat.soldeDu} €`,
                  onSave: (next: string) => updateCandidat(candidat.id, { soldeDu: Number(next.replace(/[^0-9.-]/g, '')) || 0 }),
                },
                { t: 'Type de formation', v: 'Formation traditionnelle' },
              ].map((row) => (
                <div key={row.t}>
                  <dt className="text-sm text-ink-500">{row.t}</dt>
                  <dd className="mt-1 font-semibold text-ink-900">
                    {row.onSave ? (
                      <InlineEditableField
                        value={row.v}
                        onSave={row.onSave}
                        type={row.type ?? 'text'}
                        options={row.options ?? []}
                        className="inline-block"
                      />
                    ) : (
                      row.v
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </Card>
        )}

        {onglet === 'Suivi pédagogique' && (
          <Card>
            <CardHeader
              title="Livret d’apprentissage"
              description={`${candidat.heuresEffectuees} heures de conduite réalisées sur ${candidat.heuresPrevues}`} 
            />
            <ul className="divide-y divide-line">
              {competencesPedago.map((c) => (
                <li key={c.libelle} className="flex flex-wrap items-center gap-4 px-6 py-4">
                  <span className="min-w-[240px] flex-1 text-sm text-ink-800">{c.libelle}</span>
                  <div className="h-2 w-40 overflow-hidden rounded-full bg-line">
                    <div className="h-full rounded-full bg-brand-600" style={{ width: `${c.niveau}%` }} />
                  </div>
                  <span className="w-12 text-right text-sm font-semibold tabular-nums text-ink-900">{c.niveau} %</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {onglet === 'Examens' && (
          <Card>
            <CardHeader title="Examens réalisés" />
            {examens.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-ink-500">Aucun examen n’a encore été programmé pour ce candidat.</p>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[720px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                        <th scope="col" className="px-6 py-3 font-semibold">Date</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Type d’examen</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Centre</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Résultat</th>
                        <th scope="col" className="px-6 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-line">
                      {examens.map((e) => (
                        <tr key={e.id} className="transition-colors duration-150 hover:bg-canvas">
                          <td className="px-6 py-4 tabular-nums text-ink-700"><span className="date-value">{e.date}</span></td>
                          <td className="px-6 py-4 text-ink-700">{e.type}</td>
                          <td className="px-6 py-4 text-ink-700">{e.centre}</td>
                          <td className="px-6 py-4"><ResultBadge result={e.resultat} /></td>
                          <td className="px-6 py-4">
                            <Link
                              to={`/examens/${e.id}/resultat`}
                              aria-label={`Consulter le résultat de l’examen du ${e.date}`}
                              className="inline-grid h-9 w-9 place-items-center rounded-lg text-brand-600 transition-colors duration-150 hover:bg-brand-50"
                            >
                              <EyeIcon className="h-5 w-5" aria-hidden="true" />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="border-t border-line px-6 py-4">
                  <Link
                    to={`/examens/${examens[0].id}/resultat`}
                    className="inline-flex items-center gap-2 rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-600 transition-colors duration-150 hover:bg-brand-50"
                  >
                    Consulter le résultat
                    <ArrowRightIcon className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </div>
              </>
            )}
          </Card>
        )}

        {onglet === 'Documents' && (
          <Card>
            <CardHeader title="Pièces du dossier" />
            {docs.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-ink-500">Aucune pièce déposée.</p>
            ) : (
              <ul className="divide-y divide-line">
                {docs.map((d) => (
                  <li key={d.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                    <div className="min-w-[220px] flex-1">
                      <p className="text-sm font-semibold text-ink-900">{d.nom}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {d.type} · {d.taille} · déposé le <span className="date-value">{d.dateDepot}</span>
                      </p>
                    </div>
                    <Badge tone={toneForResultat(d.statut)}>{d.statut}</Badge>
                    <a
                      href="#"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors duration-150 hover:text-brand-700"
                    >
                      <DownloadIcon className="h-4 w-4" aria-hidden="true" />
                      Télécharger
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}

        {onglet === 'Paiements' && (
          <Card>
            <CardHeader
              title="Paiements"
              description={candidat.soldeDu === 0 ? 'Dossier soldé' : `Solde restant dû : ${candidat.soldeDu} €`} 
            />

            {paiements.length === 0 ? (
              <p className="px-6 py-12 text-center text-sm text-ink-500">Aucune facture émise.</p>
            ) : (
              <ul className="divide-y divide-line">
                {paiements.map((f) => (
                  <li key={f.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
                    <div className="min-w-[220px] flex-1">
                      <p className="text-sm font-semibold text-ink-900">{f.libelle}</p>
                      <p className="mt-0.5 text-xs text-ink-500">
                        {f.numero} · émise le <span className="date-value">{f.dateEmission}</span> · échéance <span className="date-value">{f.echeance}</span>
                      </p>
                    </div>
                    <span className="text-sm font-bold tabular-nums text-ink-900">{f.montant} €</span>
                    <Badge tone={toneForResultat(f.statut)}>{f.statut}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        )}
      </div>
    </>
  );
}