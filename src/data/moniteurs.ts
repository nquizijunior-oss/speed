import { Moniteur } from '../types';

export const moniteurs: Moniteur[] = [
{
  id: 'mo1',
  nom: 'Karim Belhaj',
  initiales: 'KB',
  categories: ['B', 'BE'],
  vehicule: 'Renault Clio V — boîte manuelle',
  immatriculation: 'FT-482-QA',
  heuresSemaine: 31,
  capaciteSemaine: 35,
  tauxReussite: 96,
  statut: 'En leçon',
  prochainControle: '15/09/2026'
},
{
  id: 'mo2',
  nom: 'Sophie Marchand',
  initiales: 'SM',
  categories: ['B', 'BE'],
  vehicule: 'Renault Kangoo — remorque BE',
  immatriculation: 'GH-119-RS',
  heuresSemaine: 27,
  capaciteSemaine: 35,
  tauxReussite: 93,
  statut: 'Disponible',
  prochainControle: '14/09/2026'
},
{
  id: 'mo3',
  nom: 'Antoine Ferrand',
  initiales: 'AF',
  categories: ['A2', 'B'],
  vehicule: 'Yamaha MT-07 — A2',
  immatriculation: 'EK-704-ZL',
  heuresSemaine: 24,
  capaciteSemaine: 30,
  tauxReussite: 91,
  statut: 'Disponible',
  prochainControle: '13/09/2026'
},
{
  id: 'mo4',
  nom: 'Nadia Cherif',
  initiales: 'NC',
  categories: ['B'],
  vehicule: 'Opel Corsa — boîte automatique',
  immatriculation: 'DR-556-MP',
  heuresSemaine: 0,
  capaciteSemaine: 30,
  tauxReussite: 94,
  statut: 'Congés',
  prochainControle: '12/09/2026'
}];