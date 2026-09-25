export type Categorie = 'A' | 'A2' | 'B' | 'BE' | 'C';

export type StatutCandidat = 'Actif' | 'En attente' | 'Terminé' | 'Suspendu';

export interface Candidat {
  id: string;
  neph: string;
  prenom: string;
  nom: string;
  initiales: string;
  genre: 'F' | 'M';
  categorie: Categorie;
  dateNaissance: string;
  age: number;
  telephone: string;
  email: string;
  dateInscription: string;
  ecole: string;
  statut: StatutCandidat;
  heuresEffectuees: number;
  heuresPrevues: number;
  codeObtenu: boolean;
  moniteur: string;
  ville: string;
  soldeDu: number;
  photo?: string;
}

export type ResultatExamen = 'Favorable' | 'Défavorable' | 'En attente';

export type TypeExamen = 'Examen pratique' | 'Épreuve théorique (ETG)';

export interface Competence {
  libelle: string;
  note: 0 | 1 | 2 | 3 | 'E';
}

export interface Examen {
  id: string;
  dossier: string;
  candidatId: string;
  candidat: string;
  categorie: Categorie;
  type: TypeExamen;
  date: string;
  heure: string;
  centre: string;
  resultat: ResultatExamen;
  points: number;
  total: number;
  inspecteur: string;
  numeroInspecteur: string;
  datePublication: string;
  appreciation: string[];
  duree: string;
  kilometres: string;
  circulation: string;
  meteo: string;
  competences: Competence[];
}

export type StatutReservation = 'Confirmée' | 'À confirmer' | 'Annulée';

export interface Reservation {
  id: string;
  candidat: string;
  candidatId: string;
  moniteur: string;
  vehicule: string;
  type: 'Leçon de conduite' | 'Conduite accompagnée' | 'Examen blanc' | 'Examen pratique' | 'Cours de code';
  jour: number;
  date?: string;
  debut: string;
  fin: string;
  statut: StatutReservation;
  categorie?: 'A' | 'B';
}

export type StatutFacture = 'Payée' | 'En attente' | 'En retard';

export interface Facture {
  id: string;
  numero: string;
  candidat: string;
  libelle: string;
  montant: number;
  dateEmission: string;
  echeance: string;
  statut: StatutFacture;
  moyen: string;
}

export type StatutDocument = 'Validé' | 'À vérifier' | 'Refusé';

export interface DocumentDossier {
  id: string;
  nom: string;
  type: string;
  candidat: string;
  taille: string;
  dateDepot: string;
  statut: StatutDocument;
}

export interface Message {
  id: string;
  expediteur: string;
  role: string;
  initiales: string;
  objet: string;
  extrait: string;
  date: string;
  nonLu: boolean;
  categorie: 'ANTS' | 'Candidat' | 'Centre d’examen' | 'Interne';
}

export interface Moniteur {
  id: string;
  nom: string;
  initiales: string;
  categories: Categorie[];
  vehicule: string;
  immatriculation: string;
  heuresSemaine: number;
  capaciteSemaine: number;
  tauxReussite: number;
  statut: 'Disponible' | 'En leçon' | 'Congés';
  prochainControle: string;
}