import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CheckIcon, DownloadIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { NewInvoiceModal } from '../components/modals/NewInvoiceModal';
import { Facture, StatutFacture } from '../types';
import { useAppContext } from '../hooks/useAppContext';

const filtres: Array<StatutFacture | 'Toutes'> = ['Toutes', 'Payée', 'En attente', 'En retard'];

export function Facturation() {
  const [filtre, setFiltre] = useState<StatutFacture | 'Toutes'>('Toutes');
  const [modalOpen, setModalOpen] = useState(false);
  const [invoiceEditing, setInvoiceEditing] = useState<Facture | null>(null);
  const { factures, updateFacture, deleteFacture } = useAppContext();

  const chartData = useMemo(() => {
    const monthly = new Map<string, { facture: number; encaisse: number }>();

    factures.forEach((invoice) => {
      const normalized = invoice.dateEmission.split('/');
      if (normalized.length !== 3) return;

      const isoDate = `${normalized[2]}-${normalized[1]}-${normalized[0]}`;
      const parsed = new Date(isoDate);
      if (Number.isNaN(parsed.getTime())) return;

      const monthKey = parsed.toLocaleDateString('fr-FR', { month: 'short' });
      const current = monthly.get(monthKey) ?? { facture: 0, encaisse: 0 };
      current.facture += invoice.montant;
      if (invoice.statut === 'Payée') current.encaisse += invoice.montant;
      monthly.set(monthKey, current);
    });

    return Array.from(monthly.entries()).slice(-6).map(([mois, values]) => ({
      mois,
      facture: values.facture,
      encaisse: values.encaisse,
    }));
  }, [factures]);

  const liste = useMemo(
    () => (filtre === 'Toutes' ? factures : factures.filter((f) => f.statut === filtre)),
    [factures, filtre]
  );

  const encaisse = factures.filter((f) => f.statut === 'Payée').reduce((s, f) => s + f.montant, 0);
  const enAttente = factures.filter((f) => f.statut === 'En attente').reduce((s, f) => s + f.montant, 0);
  const enRetard = factures.filter((f) => f.statut === 'En retard').reduce((s, f) => s + f.montant, 0);

  const handleExport = () => {
    const csv = ['numero,candidat,libelle,montant,dateEmission,echeance,statut,moyen']
      .concat(
        factures.map((f) =>
          [f.numero, f.candidat, f.libelle, String(f.montant), f.dateEmission, f.echeance, f.statut, f.moyen]
            .map((value) => `"${String(value).replace(/"/g, '""')}"`)
            .join(',')
        )
      )
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = 'factures.csv';
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageHeader
        title="Facturation"
        description="Suivi des encaissements et des impayés"
        action={
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
          >
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Créer une facture
          </button>
        }
      />

      <NewInvoiceModal open={modalOpen} onClose={() => setModalOpen(false)} />

      {invoiceEditing && (
        <div className="mb-6 rounded-xl border border-line bg-white p-5 shadow-card">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-ink-900">Modifier la facture</h2>
            <button
              type="button"
              onClick={() => setInvoiceEditing(null)}
              className="text-sm font-medium text-ink-500 hover:text-ink-900"
            >
              Fermer
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <label className="text-sm text-ink-700">
              <span className="mb-1 block font-medium">Libellé</span>
              <input
                value={invoiceEditing.libelle}
                onChange={(e) => setInvoiceEditing({ ...invoiceEditing, libelle: e.target.value })}
                className="h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="text-sm text-ink-700">
              <span className="mb-1 block font-medium">Montant</span>
              <input
                type="number"
                value={invoiceEditing.montant}
                onChange={(e) => setInvoiceEditing({ ...invoiceEditing, montant: Number(e.target.value) })}
                className="h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="text-sm text-ink-700">
              <span className="mb-1 block font-medium">Échéance</span>
              <input
                type="date"
                value={invoiceEditing.echeance.split('/').reverse().join('-')}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setInvoiceEditing({
                    ...invoiceEditing,
                    echeance: Number.isNaN(date.getTime()) ? invoiceEditing.echeance : date.toLocaleDateString('fr-FR'),
                  });
                }}
                className="h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="text-sm text-ink-700">
              <span className="mb-1 block font-medium">Statut</span>
              <select
                value={invoiceEditing.statut}
                onChange={(e) => setInvoiceEditing({ ...invoiceEditing, statut: e.target.value as StatutFacture })}
                className="h-10 w-full rounded-lg border border-line px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              >
                <option value="Payée">Payée</option>
                <option value="En attente">En attente</option>
                <option value="En retard">En retard</option>
              </select>
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setInvoiceEditing(null)}
              className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-canvas"
            >
              Annuler
            </button>
            <button
              type="button"
              onClick={() => {
                updateFacture(invoiceEditing.id, invoiceEditing);
                setInvoiceEditing(null);
              }}
              className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Enregistrer
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <Card className="p-6 xl:col-span-2">
          <h2 className="text-base font-semibold text-ink-900">Chiffre d’affaires</h2>
          <p className="mt-0.5 text-sm text-ink-500">Facturé et encaissé sur les 6 derniers mois</p>
          <div className="mt-5 h-64">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-ink-500">Aucune facture pour le moment.</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 8, right: 12, bottom: 0, left: -8 }}>
                  <CartesianGrid vertical={false} stroke="#e3e8f1" />
                  <XAxis dataKey="mois" tickLine={false} axisLine={false} tick={{ fill: '#8d97ac', fontSize: 12 }} />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: '#8d97ac', fontSize: 12 }}
                    tickFormatter={(v: number) => `${v / 1000}k`}
                  />
                  <Tooltip
                    cursor={{ fill: '#f4f6fb' }}
                    contentStyle={{ borderRadius: 8, border: '1px solid #e3e8f1', fontSize: 12 }}
                    formatter={(v: number) => `${v.toLocaleString('fr-FR')} €`}
                  />
                  <Legend wrapperStyle={{ fontSize: 12, paddingTop: 8 }} />
                  <Bar dataKey="facture" name="Facturé" fill="#c2d2ff" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="encaisse" name="Encaissé" fill="#1a46c2" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </Card>

        <Card className="divide-y divide-line">
          {[
            { t: 'Encaissé ce mois', v: encaisse, hint: `${factures.filter((f) => f.statut === 'Payée').length} factures réglées`, color: 'text-ok-600' },
            { t: 'En attente de règlement', v: enAttente, hint: 'échéances à venir', color: 'text-ink-900' },
            { t: 'Impayés à relancer', v: enRetard, hint: 'échéance dépassée', color: 'text-danger-600' },
          ].map((m) => (
            <div key={m.t} className="px-6 py-6">
              <p className="text-sm text-ink-500">{m.t}</p>
              <p className={`mt-1 text-3xl font-bold tabular-nums tracking-tight ${m.color}`}>
                {m.v.toLocaleString('fr-FR')} €
              </p>
              <p className="mt-1 text-xs text-ink-400">{m.hint}</p>
            </div>
          ))}
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader
          title="Factures"
          action={
            <button
              type="button"
              onClick={handleExport}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-600 transition-colors duration-150 hover:text-brand-700"
            >
              <DownloadIcon className="h-4 w-4" aria-hidden="true" />
              Exporter
            </button>
          }
        />

        <div className="flex flex-wrap gap-1.5 border-b border-line px-6 py-4" role="group" aria-label="Filtrer les factures">
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
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs uppercase tracking-wide text-ink-500">
                <th scope="col" className="px-6 py-3 font-semibold">N° facture</th>
                <th scope="col" className="px-6 py-3 font-semibold">Candidat</th>
                <th scope="col" className="px-6 py-3 font-semibold">Prestation</th>
                <th scope="col" className="px-6 py-3 font-semibold">Échéance</th>
                <th scope="col" className="px-6 py-3 font-semibold">Montant</th>
                <th scope="col" className="px-6 py-3 font-semibold">Statut</th>
                <th scope="col" className="px-6 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {liste.map((f) => (
                <tr key={f.id} className="transition-colors duration-150 hover:bg-canvas">
                  <td className="px-6 py-4 font-semibold tabular-nums text-ink-900">{f.numero}</td>
                  <td className="px-6 py-4 text-ink-700">
                    <InlineEditableField
                      value={f.candidat}
                      onSave={(next) => updateFacture(f.id, { candidat: next })}
                      className="inline-block text-ink-700"
                    />
                  </td>
                  <td className="px-6 py-4 text-ink-700">
                    <InlineEditableField
                      value={f.libelle}
                      onSave={(next) => updateFacture(f.id, { libelle: next })}
                      className="inline-block text-ink-700"
                    />
                  </td>
                  <td className="px-6 py-4 tabular-nums text-ink-700">
                    <InlineEditableField
                      value={f.echeance}
                      onSave={(next) => updateFacture(f.id, { echeance: next })}
                      className="date-value inline-block text-ink-700"
                    />
                  </td>
                  <td className="px-6 py-4 font-semibold tabular-nums text-ink-900">
                    <InlineEditableField
                      value={`${f.montant} €`}
                      onSave={(next) => updateFacture(f.id, { montant: Number(next.replace(/[^0-9.-]/g, '')) || 0 })}
                      className="inline-block font-semibold text-ink-900"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <InlineEditableField
                      value={f.statut}
                      onSave={(next) => updateFacture(f.id, { statut: next as StatutFacture })}
                      type="select"
                      options={['Payée', 'En attente', 'En retard']}
                      className="inline-block"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      {f.statut !== 'Payée' && (
                        <button
                          type="button"
                          onClick={() => updateFacture(f.id, { statut: 'Payée', moyen: 'Virement' })}
                          className="inline-flex items-center gap-1 rounded-lg bg-ok-600 px-2.5 py-2 text-xs font-semibold text-white hover:bg-ok-700"
                        >
                          <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
                          Payée
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => setInvoiceEditing(f)}
                        className="inline-flex items-center gap-1 rounded-lg border border-line px-2.5 py-2 text-xs font-semibold text-ink-800 hover:bg-canvas"
                      >
                        <PencilIcon className="h-3.5 w-3.5" aria-hidden="true" />
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => deleteFacture(f.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-danger-200 bg-danger-50 px-2.5 py-2 text-xs font-semibold text-danger-700 hover:bg-danger-100"
                      >
                        <Trash2Icon className="h-3.5 w-3.5" aria-hidden="true" />
                        Supprimer
                      </button>
                    </div>
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