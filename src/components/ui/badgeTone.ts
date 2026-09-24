export type BadgeTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

export function toneForResultat(resultat: string): BadgeTone {
  if (resultat === 'Favorable' || resultat === 'Payée' || resultat === 'Validé' || resultat === 'Confirmée')
    return 'success';
  if (resultat === 'Défavorable' || resultat === 'En retard' || resultat === 'Refusé' || resultat === 'Annulée')
    return 'danger';
  if (resultat === 'En attente' || resultat === 'À vérifier' || resultat === 'À confirmer') return 'warning';
  return 'neutral';
}
