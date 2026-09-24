import { useEffect, useState } from 'react';
import { CarFrontIcon, WrenchIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card, CardHeader } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { CategoryBadge } from '../components/ui/CategoryBadge';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { moniteurs } from '../data/moniteurs';

const toneStatut = (statut: string) =>
statut === 'Disponible' ? 'success' : statut === 'En leçon' ? 'info' : 'neutral';

export function Flotte() {
  const [pageTitle, setPageTitle] = useState(() => localStorage.getItem('flottePageTitle') ?? 'Moniteurs & flotte');
  const [pageDescription, setPageDescription] = useState(() => localStorage.getItem('flottePageDescription') ?? `${moniteurs.length} moniteurs · ${moniteurs.reduce((s, m) => s + m.heuresSemaine, 0)} h planifiées sur ${moniteurs.reduce((s, m) => s + m.capaciteSemaine, 0)} h disponibles cette semaine`);
  const [categoriesLabel, setCategoriesLabel] = useState(() => localStorage.getItem('flotteCategoriesLabel') ?? 'Catégories');
  const [maintenanceTitle, setMaintenanceTitle] = useState(() => localStorage.getItem('flotteMaintenanceTitle') ?? 'Rappels d’entretien');
  const [maintenanceDescription, setMaintenanceDescription] = useState(() => localStorage.getItem('flotteMaintenanceDescription') ?? 'Échéances véhicules des 90 prochains jours');
  const [controlLabel, setControlLabel] = useState(() => localStorage.getItem('flotteControlLabel') ?? 'Prochain contrôle technique');
  const [weeklyChargeLabel, setWeeklyChargeLabel] = useState(() => localStorage.getItem('flotteWeeklyChargeLabel') ?? 'Charge hebdomadaire');
  const [successRateLabel, setSuccessRateLabel] = useState(() => localStorage.getItem('flotteSuccessRateLabel') ?? 'Taux de réussite');
  const [vehicleNames, setVehicleNames] = useState<Record<string, string>>(() => {
    try { return JSON.parse(localStorage.getItem('flotteVehicleNames') ?? '{}'); } catch { return {}; }
  });

  useEffect(() => {
    try { localStorage.setItem('flotteVehicleNames', JSON.stringify(vehicleNames)); } catch { /* ignore */ }
  }, [vehicleNames]);

  useEffect(() => {
    try {
      localStorage.setItem('flottePageTitle', pageTitle);
      localStorage.setItem('flottePageDescription', pageDescription);
      localStorage.setItem('flotteCategoriesLabel', categoriesLabel);
      localStorage.setItem('flotteMaintenanceTitle', maintenanceTitle);
      localStorage.setItem('flotteMaintenanceDescription', maintenanceDescription);
      localStorage.setItem('flotteControlLabel', controlLabel);
      localStorage.setItem('flotteWeeklyChargeLabel', weeklyChargeLabel);
      localStorage.setItem('flotteSuccessRateLabel', successRateLabel);
    } catch {
      // ignore
    }
  }, [pageTitle, pageDescription, categoriesLabel, maintenanceTitle, maintenanceDescription, controlLabel, weeklyChargeLabel, successRateLabel]);

  return (
    <>
      <PageHeader
        title={<InlineEditableField value={pageTitle} onSave={setPageTitle} className="inline-block" />}
        description={<InlineEditableField value={pageDescription} onSave={setPageDescription} className="inline-block" />}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {moniteurs.map((m) => {
          const charge = Math.round(m.heuresSemaine / m.capaciteSemaine * 100);
          return (
            <Card key={m.id} className="flex flex-col p-6">
              <div className="flex items-start gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 text-sm font-bold text-white">
                  {m.initiales}
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-semibold text-ink-900">{m.nom}</h2>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="text-sm text-ink-500"><InlineEditableField value={categoriesLabel} onSave={setCategoriesLabel} className="inline-block" /></span>
                    {m.categories.map((category) => <CategoryBadge key={category} category={category} />)}
                  </div>
                </div>
                <Badge tone={toneStatut(m.statut)}>{m.statut}</Badge>
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex items-start gap-2 text-ink-700">
                  <CarFrontIcon className="mt-0.5 h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                  <dt className="sr-only">Véhicule</dt>
                  <dd>
                    <InlineEditableField value={vehicleNames[m.id] ?? m.vehicule} onSave={(next) => setVehicleNames((current) => ({ ...current, [m.id]: next }))} className="inline-block" />
                    <span className="ml-2 rounded bg-canvas px-1.5 py-0.5 text-xs font-semibold tabular-nums text-ink-800">
                      {m.immatriculation}
                    </span>
                  </dd>
                </div>
                <div className="flex items-center gap-2 text-ink-700">
                  <WrenchIcon className="h-4 w-4 shrink-0 text-ink-400" aria-hidden="true" />
                  <dt className="sr-only"><InlineEditableField value={controlLabel} onSave={setControlLabel} className="inline-block" /></dt>
                  <dd><InlineEditableField value={controlLabel} onSave={setControlLabel} className="inline-block" /> : {m.prochainControle}</dd>
                </div>
              </dl>

              <div className="mt-auto grid grid-cols-2 gap-6 pt-6">
                <div>
                  <p className="text-xs text-ink-500"><InlineEditableField value={weeklyChargeLabel} onSave={setWeeklyChargeLabel} className="inline-block" /></p>
                  <div className="mt-2 flex items-center gap-2">
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-line">
                      <div className="h-full rounded-full bg-brand-600" style={{ width: `${charge}%` }} />
                    </div>
                    <span className="text-sm font-semibold tabular-nums text-ink-900">
                      {m.heuresSemaine} h
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-ink-500"><InlineEditableField value={successRateLabel} onSave={setSuccessRateLabel} className="inline-block" /></p>
                  <p className="mt-1 text-xl font-bold tabular-nums text-ink-900">{m.tauxReussite} %</p>
                </div>
              </div>
            </Card>);

        })}
      </div>

      <Card className="mt-6">
        <CardHeader
          title={<InlineEditableField value={maintenanceTitle} onSave={setMaintenanceTitle} className="inline-block" />}
          description={<InlineEditableField value={maintenanceDescription} onSave={setMaintenanceDescription} className="inline-block" />}
        />
        <ul className="divide-y divide-line">
          {moniteurs.map((m) =>
          <li key={m.id} className="flex flex-wrap items-center gap-4 px-6 py-4">
              <span className="min-w-[220px] flex-1 text-sm font-medium text-ink-900"><InlineEditableField value={vehicleNames[m.id] ?? m.vehicule} onSave={(next) => setVehicleNames((current) => ({ ...current, [m.id]: next }))} className="inline-block" /></span>
              <span className="text-sm tabular-nums text-ink-700">{m.immatriculation}</span>
              <span className="text-sm text-ink-500"><InlineEditableField value={`${controlLabel} : ${m.prochainControle}`} onSave={() => undefined} className="inline-block" /></span>
            </li>
          )}
        </ul>
      </Card>
    </>);

}