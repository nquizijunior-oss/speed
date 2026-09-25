export interface NavItem {
  label: string;
  items: string[];
}

export const primaryNav: NavItem[] = [
{
  label: 'PERMIS',
  items: [
  'Passer son permis de conduire',
  'Inscription et formation',
  'Le permis à points',
  'Récupérer des points']

},
{
  label: 'ROUTE PLUS SÛRE',
  items: [
  'Les dangers de la route',
  'Équipements de sécurité',
  'Aménagements et signalisation',
  'Véhicules']

},
{
  label: 'CODE DE LA ROUTE',
  items: [
  'Règles de circulation',
  'Vitesse et limitations',
  'Alcool et stupéfiants',
  'Sanctions et amendes']

}];


export const secondaryNav: NavItem[] = [
{
  label: "J'AGIS",
  items: [
  'Devenir intervenant',
  'Commander des outils',
  'Nos campagnes',
  'Associations']

},
{
  label: 'LA SÉCURITÉ ROUTIÈRE',
  items: [
  'Mieux nous connaître',
  'Actualités',
  'Salle de presse',
  'Observatoire (ONISR)']

}];