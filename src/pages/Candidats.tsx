import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, SearchIcon, UsersIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { NewCandidatModal } from '../components/modals/NewCandidatModal';
import { useAppContext } from '../hooks/useAppContext';
import type { Candidat, StatutCandidat } from '../types';
import { InlineEditableField } from '../components/ui/InlineEditableField';

const defaultFilters: Array<StatutCandidat | 'Tous'> = ['Tous', 'Actif', 'En attente', 'Terminé', 'Suspendu'];

export function Candidats() {
  const { candidats } = useAppContext();

  const getStoredString = (key: string, fallback: string) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const [pageTitle, setPageTitle] = useState(() => getStoredString('candidatsPageTitle', 'Candidats'));
  const [pageDescription, setPageDescription] = useState(() => getStoredString('candidatsPageDescription', `${candidats.length} dossiers suivis par l’auto-école`));
  const [newCandidateLabel, setNewCandidateLabel] = useState(() => getStoredString('candidatsNewCandidateLabel', 'Nouveau candidat'));
  const [searchPlaceholder, setSearchPlaceholder] = useState(() => getStoredString('candidatsSearchPlaceholder', 'Nom, e-mail ou n° NEPH'));
  const [emptyTitle, setEmptyTitle] = useState(() => getStoredString('candidatsEmptyTitle', 'Aucun candidat ne correspond'));
  const [emptyText, setEmptyText] = useState(() => getStoredString('candidatsEmptyText', 'Modifiez votre recherche ou réinitialisez les filtres pour retrouver un dossier.'));
  const [tableHeaders, setTableHeaders] = useState({
    candidat: getStoredString('candidatsTableHeaderCandidat', 'Candidat'),
    neph: getStoredString('candidatsTableHeaderNeph', 'N° NEPH'),
    category: getStoredString('candidatsTableHeaderCategory', 'Cat.'),
    progression: getStoredString('candidatsTableHeaderProgression', 'Progression'),
    moniteur: getStoredString('candidatsTableHeaderMoniteur', 'Moniteur'),
    solde: getStoredString('candidatsTableHeaderSolde', 'Solde dû'),
    statut: getStoredString('candidatsTableHeaderStatut', 'Statut'),
  });
  const [filterLabels, setFilterLabels] = useState<Record<StatutCandidat | 'Tous', string>>({
    Tous: getStoredString('candidatsFilterTous', 'Tous'),
    Actif: getStoredString('candidatsFilterActif', 'Actif'),
    'En attente': getStoredString('candidatsFilterEnAttente', 'En attente'),
    Terminé: getStoredString('candidatsFilterTermine', 'Terminé'),
    Suspendu: getStoredString('candidatsFilterSuspendu', 'Suspendu'),
  });

  useEffect(() => {
    try {
      localStorage.setItem('candidatsPageTitle', pageTitle);
      localStorage.setItem('candidatsPageDescription', pageDescription);
      localStorage.setItem('candidatsNewCandidateLabel', newCandidateLabel);
      localStorage.setItem('candidatsSearchPlaceholder', searchPlaceholder);
      localStorage.setItem('candidatsEmptyTitle', emptyTitle);
      localStorage.setItem('candidatsEmptyText', emptyText);
      localStorage.setItem('candidatsTableHeaderCandidat', tableHeaders.candidat);
      localStorage.setItem('candidatsTableHeaderNeph', tableHeaders.neph);
      localStorage.setItem('candidatsTableHeaderCategory', tableHeaders.category);
      localStorage.setItem('candidatsTableHeaderProgression', tableHeaders.progression);
      localStorage.setItem('candidatsTableHeaderMoniteur', tableHeaders.moniteur);
      localStorage.setItem('candidatsTableHeaderSolde', tableHeaders.solde);
      localStorage.setItem('candidatsTableHeaderStatut', tableHeaders.statut);
      localStorage.setItem('candidatsFilterTous', filterLabels.Tous);
      localStorage.setItem('candidatsFilterActif', filterLabels.Actif);
      localStorage.setItem('candidatsFilterEnAttente', filterLabels['En attente']);
      localStorage.setItem('candidatsFilterTermine', filterLabels.Terminé);
      localStorage.setItem('candidatsFilterSuspendu', filterLabels.Suspendu);
    } catch {
      // ignore
    }
  }, [pageTitle, pageDescription, newCandidateLabel, searchPlaceholder, emptyTitle, emptyText, tableHeaders, filterLabels]);

  const [query, setQuery] = useState('');
  const [statut, setStatut] = useState<StatutCandidat | 'Tous'>('Tous');
  const [modalOpen, setModalOpen] = useState(false);
  const [editedCandidates, setEditedCandidates] = useState<Record<string, {
    prenom: string;
    nom: string;
    email: string;
    neph: string;
    categorie: string;
    heuresEffectuees: string;
    heuresPrevues: string;
    moniteur: string;
    soldeDu: string;
    statut: StatutCandidat;
  }>>(() => {
    const entries = Object.fromEntries(
      candidats.map((candidate) => [
        candidate.id,
        {
          prenom: getStoredString(`candidatEditPrenom:${candidate.id}`, candidate.prenom),
          nom: getStoredString(`candidatEditNom:${candidate.id}`, candidate.nom),
          email: getStoredString(`candidatEditEmail:${candidate.id}`, candidate.email),
          neph: getStoredString(`candidatEditNeph:${candidate.id}`, candidate.neph),
          categorie: getStoredString(`candidatEditCategorie:${candidate.id}`, candidate.categorie),
          heuresEffectuees: getStoredString(`candidatEditHeuresEffectuees:${candidate.id}`, String(candidate.heuresEffectuees)),
          heuresPrevues: getStoredString(`candidatEditHeuresPrevues:${candidate.id}`, String(candidate.heuresPrevues)),
          moniteur: getStoredString(`candidatEditMoniteur:${candidate.id}`, candidate.moniteur),
          soldeDu: getStoredString(`candidatEditSolde:${candidate.id}`, String(candidate.soldeDu)),
          statut: (getStoredString(`candidatEditStatut:${candidate.id}`, candidate.statut) as StatutCandidat) || candidate.statut,
        },
      ])
    );
    return entries;
  });

  useEffect(() => {
    setEditedCandidates((current) => {
      const next = { ...current };
      for (const candidate of candidats) {
        if (!next[candidate.id]) {
          next[candidate.id] = {
            prenom: candidate.prenom,
            nom: candidate.nom,
            email: candidate.email,
            neph: candidate.neph,
            categorie: candidate.categorie,
            heuresEffectuees: String(candidate.heuresEffectuees),
            heuresPrevues: String(candidate.heuresPrevues),
            moniteur: candidate.moniteur,
            soldeDu: String(candidate.soldeDu),
            statut: candidate.statut,
          };
        }
      }
      return next;
    });
  }, [candidats]);

  useEffect(() => {
    for (const candidate of candidats) {
      const current = editedCandidates[candidate.id];
      if (!current) continue;
      try {
        localStorage.setItem(`candidatEditPrenom:${candidate.id}`, current.prenom);
        localStorage.setItem(`candidatEditNom:${candidate.id}`, current.nom);
        localStorage.setItem(`candidatEditEmail:${candidate.id}`, current.email);
        localStorage.setItem(`candidatEditNeph:${candidate.id}`, current.neph);
        localStorage.setItem(`candidatEditCategorie:${candidate.id}`, current.categorie);
        localStorage.setItem(`candidatEditHeuresEffectuees:${candidate.id}`, current.heuresEffectuees);
        localStorage.setItem(`candidatEditHeuresPrevues:${candidate.id}`, current.heuresPrevues);
        localStorage.setItem(`candidatEditMoniteur:${candidate.id}`, current.moniteur);
        localStorage.setItem(`candidatEditSolde:${candidate.id}`, current.soldeDu);
        localStorage.setItem(`candidatEditStatut:${candidate.id}`, current.statut);
      } catch {
        // ignore
      }
    }
  }, [editedCandidates, candidats]);

  const updateCandidate = (id: string, field: keyof NonNullable<typeof editedCandidates[string]>, value: string) => {
    setEditedCandidates((current) => ({
      ...current,
      [id]: {
        ...current[id],
        [field]: value,
      },
    }));
  };

  const visibleCandidates = useMemo(
    () =>
      candidats.map((candidate) => {
        const edited = editedCandidates[candidate.id] ?? {
          prenom: candidate.prenom,
          nom: candidate.nom,
          email: candidate.email,
          neph: candidate.neph,
          categorie: candidate.categorie,
          heuresEffectuees: String(candidate.heuresEffectuees),
          heuresPrevues: String(candidate.heuresPrevues),
          moniteur: candidate.moniteur,
          soldeDu: String(candidate.soldeDu),
          statut: candidate.statut,
        };

        return {
          ...candidate,
          prenom: edited.prenom,
          nom: edited.nom,
          email: edited.email,
          neph: edited.neph,
          categorie: edited.categorie as Candidat['categorie'],
          heuresEffectuees: Number(edited.heuresEffectuees) || 0,
          heuresPrevues: Number(edited.heuresPrevues) || 0,
          moniteur: edited.moniteur,
          soldeDu: Number(edited.soldeDu) || 0,
          statut: edited.statut,
        };
      }),
    [candidats, editedCandidates]
  );

  const filtres = defaultFilters.map((filter) => ({
    value: filter,
    label: filterLabels[filter],
  }));

  const liste = useMemo(
    () =>
      visibleCandidates.filter((c) => {
        const matchQuery = `${c.prenom} ${c.nom} ${c.neph} ${c.email}`.toLowerCase().includes(query.trim().toLowerCase());
        const matchStatut = statut === 'Tous' || c.statut === statut;
        return matchQuery && matchStatut;
      }),
    [visibleCandidates, query, statut]
  );

  return (
    <>
      <PageHeader
        title={<InlineEditableField value={pageTitle} onSave={setPageTitle} className="inline-block" />}
        description={<InlineEditableField value={pageDescription} onSave={setPageDescription} className="inline-block" />}
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            <InlineEditableField value={newCandidateLabel} onSave={setNewCandidateLabel} className="inline-block text-sm font-semibold text-white" />
          </button>
        }
      />

      <NewCandidatModal open={modalOpen} onClose={() => setModalOpen(false)} />

      <Card>
        <div className="flex flex-wrap items-center gap-3 border-b border-line px-6 py-4">
          <div className="relative min-w-[240px] flex-1">
            <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-400">
              <InlineEditableField value={searchPlaceholder} onSave={setSearchPlaceholder} className="inline-block" />
            </div>
            <SearchIcon className="pointer-events-none absolute left-3 top-[calc(50%+10px)] h-4 w-4 -translate-y-1/2 text-ink-400" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Filtrer les candidats"
              className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors duration-150 focus:border-brand-600 focus:bg-white focus:outline-none"
            />
          </div>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filtrer par statut">
            {filtres.map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setStatut(filter.value)}
                aria-pressed={statut === filter.value}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-150 ${
                  statut === filter.value ? 'bg-navy-800 text-white' : 'bg-canvas text-ink-700 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                <InlineEditableField value={filter.label} onSave={(next) => setFilterLabels((current) => ({ ...current, [filter.value]: next }))} className="inline-block" />
              </button>
            ))}
          </div>
        </div>

        {liste.length === 0 ? (
          <div className="flex flex-col items-center gap-3 px-6 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-full bg-canvas text-ink-400">
              <UsersIcon className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="text-sm font-semibold text-ink-900"><InlineEditableField value={emptyTitle} onSave={setEmptyTitle} className="inline-block" /></p>
            <p className="max-w-sm text-sm text-ink-500">
              <InlineEditableField value={emptyText} onSave={setEmptyText} className="inline-block" />
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.candidat} onSave={(next) => setTableHeaders((current) => ({ ...current, candidat: next }))} className="inline-block" /></th>
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.neph} onSave={(next) => setTableHeaders((current) => ({ ...current, neph: next }))} className="inline-block" /></th>
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.category} onSave={(next) => setTableHeaders((current) => ({ ...current, category: next }))} className="inline-block" /></th>
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.progression} onSave={(next) => setTableHeaders((current) => ({ ...current, progression: next }))} className="inline-block" /></th>
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.moniteur} onSave={(next) => setTableHeaders((current) => ({ ...current, moniteur: next }))} className="inline-block" /></th>
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.solde} onSave={(next) => setTableHeaders((current) => ({ ...current, solde: next }))} className="inline-block" /></th>
                  <th scope="col" className="px-6 py-3 font-semibold"><InlineEditableField value={tableHeaders.statut} onSave={(next) => setTableHeaders((current) => ({ ...current, statut: next }))} className="inline-block" /></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {liste.map((candidate) => (
                  <tr key={candidate.id} className="transition-colors duration-150 hover:bg-canvas">
                    <td className="px-6 py-4">
                      <Link to={`/candidats/${candidate.id}`} className="flex items-center gap-3 group">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-xs font-bold text-brand-700">
                          {candidate.initiales}
                        </span>
                        <span>
                          <span className="block font-semibold text-ink-900 transition-colors duration-150 group-hover:text-brand-600">
                            <InlineEditableField value={candidate.prenom} onSave={(next) => updateCandidate(candidate.id, 'prenom', next)} className="inline-block" />{' '}
                            <InlineEditableField value={candidate.nom.toUpperCase()} onSave={(next) => updateCandidate(candidate.id, 'nom', next)} className="inline-block" />
                          </span>
                          <span className="block text-xs text-ink-500">
                            <InlineEditableField value={candidate.email} onSave={(next) => updateCandidate(candidate.id, 'email', next)} className="inline-block" />
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="px-6 py-4 tabular-nums text-ink-700">
                      <InlineEditableField value={candidate.neph} onSave={(next) => updateCandidate(candidate.id, 'neph', next)} className="inline-block" />
                    </td>
                    <td className="px-6 py-4">
                      <InlineEditableField
                        value={candidate.categorie}
                        onSave={(next) => updateCandidate(candidate.id, 'categorie', next)}
                        type="select"
                        options={['A', 'A2', 'B', 'BE', 'C']}
                        className="inline-block"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-24 overflow-hidden rounded-full bg-line">
                          <div
                            className="h-full rounded-full bg-brand-600"
                            style={{ width: `${Math.round((candidate.heuresEffectuees / Math.max(candidate.heuresPrevues, 1)) * 100)}%` }}
                          />
                        </div>
                        <span className="text-xs tabular-nums text-ink-500">
                          <InlineEditableField value={String(candidate.heuresEffectuees)} onSave={(next) => updateCandidate(candidate.id, 'heuresEffectuees', next)} className="inline-block" />/
                          <InlineEditableField value={String(candidate.heuresPrevues)} onSave={(next) => updateCandidate(candidate.id, 'heuresPrevues', next)} className="inline-block" /> h
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-ink-700">
                      <InlineEditableField value={candidate.moniteur} onSave={(next) => updateCandidate(candidate.id, 'moniteur', next)} className="inline-block" />
                    </td>
                    <td className="px-6 py-4 tabular-nums font-medium text-ink-900">
                      {candidate.soldeDu === 0 ? (
                        <span className="text-ink-400">—</span>
                      ) : (
                        <InlineEditableField value={`${candidate.soldeDu} €`} onSave={(next) => updateCandidate(candidate.id, 'soldeDu', next.replace(' €', '').trim())} className="inline-block" />
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <InlineEditableField
                        value={candidate.statut}
                        onSave={(next) => updateCandidate(candidate.id, 'statut', next as StatutCandidat)}
                        type="select"
                        options={['Actif', 'En attente', 'Terminé', 'Suspendu']}
                        className="inline-block"
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </>
  );
}