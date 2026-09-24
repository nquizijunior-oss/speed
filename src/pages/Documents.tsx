import React, { useState } from 'react';
import { DownloadIcon, FileTextIcon, UploadIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { StatutDocument } from '../types';
import { useAppContext } from '../hooks/useAppContext';

const filtres: Array<StatutDocument | 'Tous'> = ['Tous', 'À vérifier', 'Validé', 'Refusé'];

export function Documents() {
  const { documents, addDocument, updateDocument } = useAppContext();
  const [filtre, setFiltre] = useState<StatutDocument | 'Tous'>('Tous');
  const liste = filtre === 'Tous' ? documents : documents.filter((d) => d.statut === filtre);
  const aVerifier = documents.filter((d) => d.statut === 'À vérifier').length;

  const handleValidate = (id: string) => {
    updateDocument(id, { statut: 'Validé' as StatutDocument });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const doc = {
      id: `d-${Date.now()}`,
      nom: file.name,
      type: file.type.includes('pdf') ? 'Document PDF' : 'Pièce jointe',
      candidat: 'Nouveau dépôt',
      taille: `${Math.max(1, Math.round(file.size / 1024))} Ko`,
      dateDepot: new Date().toLocaleDateString('fr-FR'),
      statut: 'À vérifier' as StatutDocument,
    };

    addDocument(doc);
    e.target.value = '';
  };

  return (
    <>
      <PageHeader
        title="Documents"
        description={`${documents.length} pièces au dossier · ${aVerifier} en attente de contrôle`}
        action={
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700">
            <UploadIcon className="h-4 w-4" aria-hidden="true" />
            Déposer une pièce
            <input
              type="file"
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*,.pdf,.doc,.docx"
              aria-label="Déposer une pièce"
            />
          </label>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filtrer les documents">
        {filtres.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFiltre(f)}
            aria-pressed={filtre === f}
            className={`rounded-lg px-3.5 py-2 text-sm font-medium transition-colors duration-150 ${
              filtre === f ? 'bg-navy-800 text-white' : 'border border-line bg-white text-ink-700 hover:bg-brand-50 hover:text-brand-700'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <Card>
        <ul className="divide-y divide-line">
          {liste.map((d) => (
            <li key={d.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-canvas text-ink-500">
                <FileTextIcon className="h-5 w-5" aria-hidden="true" />
              </span>
              <div className="min-w-[240px] flex-1">
                <p className="text-sm font-semibold text-ink-900">
                  <InlineEditableField value={d.nom} onSave={(next) => updateDocument(d.id, { nom: next })} className="inline-block text-sm font-semibold text-ink-900" />
                </p>
                <p className="mt-0.5 text-xs text-ink-500">
                  <InlineEditableField value={d.type} onSave={(next) => updateDocument(d.id, { type: next })} className="inline-block text-xs text-ink-500" />
                  {' · '}
                  <InlineEditableField value={d.candidat} onSave={(next) => updateDocument(d.id, { candidat: next })} className="inline-block text-xs text-ink-500" />
                  {' · '}
                  {d.taille} · déposé le <InlineEditableField value={d.dateDepot} onSave={(next) => updateDocument(d.id, { dateDepot: next })} className="date-value inline-block text-xs text-ink-500" />
                </p>
              </div>
              <InlineEditableField
                value={d.statut}
                onSave={(next) => updateDocument(d.id, { statut: next as StatutDocument })}
                type="select"
                options={['À vérifier', 'Validé', 'Refusé']}
                className="inline-block"
              />
              {d.statut === 'À vérifier' && (
                <button
                  type="button"
                  onClick={() => handleValidate(d.id)}
                  className="rounded-lg bg-brand-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
                >
                  Valider
                </button>
              )}
              <button
                type="button"
                aria-label={`Télécharger ${d.nom}`}
                className="grid h-9 w-9 place-items-center rounded-lg text-ink-500 transition-colors duration-150 hover:bg-canvas hover:text-ink-900"
              >
                <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}