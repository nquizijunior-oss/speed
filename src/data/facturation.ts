import { Facture } from '../types';

export const factures: Facture[] = [
{ id: 'f1', numero: 'FA-2026-0412', candidat: 'Marwa Diaw', libelle: 'Forfait permis B — 30 h', montant: 1290, dateEmission: '08/09/2026', echeance: '12/09/2026', statut: 'Payée', moyen: 'Virement' },
{ id: 'f2', numero: 'FA-2026-0418', candidat: 'Yassine Benali', libelle: 'Heures supplémentaires (4 h)', montant: 232, dateEmission: '08/09/2026', echeance: '13/09/2026', statut: 'Payée', moyen: 'CB' },
{ id: 'f3', numero: 'FA-2026-0425', candidat: 'Linda Martin', libelle: 'Présentation examen pratique', montant: 240, dateEmission: '12/09/2026', echeance: '14/09/2026', statut: 'En attente', moyen: '—' },
{ id: 'f4', numero: 'FA-2026-0431', candidat: 'Thomas Rivière', libelle: 'Heures supplémentaires (2 h)', montant: 120, dateEmission: '12/09/2026', echeance: '15/09/2026', statut: 'En attente', moyen: '—' },
{ id: 'f5', numero: 'FA-2026-0436', candidat: 'Inès Kaddour', libelle: 'Forfait code + 10 h conduite', montant: 380, dateEmission: '10/09/2026', echeance: '12/09/2026', statut: 'En retard', moyen: '—' },
{ id: 'f6', numero: 'FA-2026-0440', candidat: 'Amine Tazi', libelle: 'Forfait permis B — 30 h', montant: 640, dateEmission: '10/09/2026', echeance: '13/09/2026', statut: 'En retard', moyen: '—' },
{ id: 'f7', numero: 'FA-2026-0447', candidat: 'Camille Dubois', libelle: 'Formation BE — 16 h', montant: 890, dateEmission: '13/09/2026', echeance: '15/09/2026', statut: 'Payée', moyen: 'CB' },
{ id: 'f8', numero: 'FA-2026-0452', candidat: 'Noah Lefèvre', libelle: 'Forfait code', montant: 290, dateEmission: '12/09/2026', echeance: '15/09/2026', statut: 'En attente', moyen: '—' },
{ id: 'f9', numero: 'FA-2026-0458', candidat: 'Sarah Nguyen', libelle: 'Heures supplémentaires (8 h)', montant: 460, dateEmission: '13/09/2026', echeance: '14/09/2026', statut: 'En retard', moyen: '—' },
{ id: 'f10', numero: 'FA-2026-0463', candidat: 'Lucas Perrin', libelle: 'Formation A2 — 20 h', montant: 1150, dateEmission: '14/09/2026', echeance: '15/09/2026', statut: 'Payée', moyen: 'Virement' }];


export const chiffreAffaires = [
{ mois: 'Avr', encaisse: 18400, facture: 21200 },
{ mois: 'Mai', encaisse: 20950, facture: 22800 },
{ mois: 'Juin', encaisse: 24300, facture: 25100 },
{ mois: 'Juil', encaisse: 19800, facture: 23400 },
{ mois: 'Août', encaisse: 26700, facture: 28900 },
{ mois: 'Sept', encaisse: 23100, facture: 29600 }];


export const reussiteParMois = [
{ mois: 'Avr', taux: 88 },
{ mois: 'Mai', taux: 91 },
{ mois: 'Juin', taux: 89 },
{ mois: 'Juil', taux: 93 },
{ mois: 'Août', taux: 96 },
{ mois: 'Sept', taux: 95 }];