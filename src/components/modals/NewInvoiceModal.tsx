import { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../../hooks/useAppContext';

interface NewInvoiceModalProps {
  open: boolean;
  onClose: () => void;
}

export function NewInvoiceModal({ open, onClose }: NewInvoiceModalProps) {
  const { addFacture, candidats } = useAppContext();
  const [candidatId, setCandidatId] = useState(candidats[0]?.id ?? '');
  const [libelle, setLibelle] = useState('Formation B');
  const [montant, setMontant] = useState('');
  const [dateEcheance, setDateEcheance] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidatId || !montant || !dateEcheance) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    const selectedCandidat = candidats.find((candidate) => candidate.id === candidatId);
    if (!selectedCandidat) {
      setError('Candidat introuvable.');
      return;
    }

    const facture = {
      id: `f-${Date.now()}`,
      numero: `FA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      candidat: `${selectedCandidat.prenom} ${selectedCandidat.nom}`,
      libelle,
      montant: Number(montant),
      dateEmission: new Date().toLocaleDateString('fr-FR'),
      echeance: new Date(dateEcheance).toLocaleDateString('fr-FR'),
      statut: 'En attente' as const,
      moyen: '—',
    };

    addFacture(facture);
    setError('');
    onClose();
    setCandidatId(candidats[0]?.id ?? '');
    setMontant('');
    setDateEcheance('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="text-lg font-semibold text-ink-900">Créer une facture</h2>
          <button
            type="button"
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-lg text-ink-500 hover:bg-canvas hover:text-ink-900">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 p-6">
          {error && <p className="rounded-lg bg-danger-50 px-4 py-3 text-sm font-medium text-danger-700">{error}</p>}

          <div>
            <label className="block text-sm font-semibold text-ink-900">Candidat *</label>
            <select
              value={candidatId}
              onChange={(e) => setCandidatId(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
              {candidats.map((candidate) => (
                <option key={candidate.id} value={candidate.id}>
                  {candidate.prenom} {candidate.nom}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-ink-900">Libellé de prestation</label>
            <select
              value={libelle}
              onChange={(e) => setLibelle(e.target.value)}
              className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none">
              <option>Formation B</option>
              <option>Leçons supplémentaires</option>
              <option>Examen blanc</option>
              <option>Code en ligne</option>
              <option>Autre</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-ink-900">Montant (€) *</label>
              <input
                type="number"
                value={montant}
                onChange={(e) => setMontant(e.target.value)}
                placeholder="500"
                step="0.01"
                required
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-ink-900">Échéance *</label>
              <input
                type="date"
                value={dateEcheance}
                onChange={(e) => setDateEcheance(e.target.value)}
                required
                className="mt-1 h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 border-t border-line pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-line px-4 py-2.5 text-sm font-semibold text-ink-900 hover:bg-canvas">
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700">
              Créer la facture
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
