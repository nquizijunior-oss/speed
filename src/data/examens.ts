import { Competence, Examen } from '../types';

const bilanComplet: Competence[] = [
  { libelle: 'Savoir s’installer et assurer la sécurité à bord', note: 3 },
  { libelle: 'Effectuer des vérifications du véhicule', note: 3 },
  { libelle: 'Connaître et utiliser les commandes', note: 3 },
  { libelle: 'Appréhender la route', note: 3 },
  { libelle: 'Prendre l’information', note: 3 },
  { libelle: 'Adapter son allure aux circonstances', note: 3 },
  { libelle: 'Appliquer la réglementation', note: 3 },
  { libelle: 'Partager la route avec les autres usagers', note: 3 },
  { libelle: 'Communiquer avec les autres usagers', note: 'E' },
  { libelle: 'Partager la chaussée', note: 3 },
  { libelle: 'Maintenir les espaces de sécurité', note: 3 }
];


const bilanPartiel: Competence[] = [
  { libelle: 'Savoir s’installer et assurer la sécurité à bord', note: 3 },
  { libelle: 'Effectuer des vérifications du véhicule', note: 2 },
  { libelle: 'Connaître et utiliser les commandes', note: 3 },
  { libelle: 'Appréhender la route', note: 1 },
  { libelle: 'Prendre l’information', note: 1 },
  { libelle: 'Adapter son allure aux circonstances', note: 2 },
  { libelle: 'Appliquer la réglementation', note: 2 },
  { libelle: 'Partager la route avec les autres usagers', note: 1 },
  { libelle: 'Communiquer avec les autres usagers', note: 'E' },
  { libelle: 'Partager la chaussée', note: 2 },
  { libelle: 'Maintenir les espaces de sécurité', note: 1 }
];

// Generate dates dynamically so the list spans from last week to today
const today = new Date();
const startDate = new Date();
startDate.setDate(today.getDate() - 7);

const formatDate = (d: Date) => {
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

const formatPublication = (d: Date) => {
  const pub = new Date(d);
  pub.setDate(pub.getDate() + 1);
  return `${formatDate(pub)} à 01h30`;
};

const dateRange: Date[] = [];
for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
  dateRange.push(new Date(d));
}

const pickDate = (index: number) => dateRange[index % dateRange.length];

export const examens: Examen[] = [
  {
    id: '245789',
    dossier: '245789',
    candidatId: '18675',
    candidat: 'MARWA DIAW',
    categorie: 'B',
    type: 'Examen pratique',
    date: formatDate(pickDate(0)),
    heure: '14h30',
    centre: 'Marseille La Valentine (13)',
    resultat: 'Favorable',
    points: 31,
    total: 31,
    inspecteur: 'M. DUPONT',
    numeroInspecteur: '03447',
    datePublication: formatPublication(pickDate(0)),
    appreciation: [
      'Conduite sûre et adaptée.',
      'Bonne autonomie et respect des règles.',
      'Félicitations.'
    ],

    duree: '32 min',
    kilometres: '12,4 km',
    circulation: 'Dense',
    meteo: 'Ensoleillé',
    competences: bilanComplet
  },
  {
    id: '245801',
    dossier: '245801',
    candidatId: '18701',
    candidat: 'YASSINE BENALI',
    categorie: 'B',
    type: 'Examen pratique',
    date: formatDate(pickDate(1)),
    heure: '09h00',
    centre: 'Marseille La Valentine (13)',
    resultat: 'Favorable',
    points: 29,
    total: 31,
    inspecteur: 'Mme LEROY',
    numeroInspecteur: '03512',
    datePublication: formatPublication(pickDate(1)),
    appreciation: [
      'Bonne maîtrise du véhicule.',
      'Prise d’information à consolider en intersection.'
    ],

    duree: '31 min',
    kilometres: '11,8 km',
    circulation: 'Modérée',
    meteo: 'Nuageux',
    competences: bilanComplet
  },
  {
    id: '245812',
    dossier: '245812',
    candidatId: '18744',
    candidat: 'LINDA MARTIN',
    categorie: 'B',
    type: 'Examen pratique',
    date: formatDate(pickDate(2)),
    heure: '11h15',
    centre: 'Aubagne (13)',
    resultat: 'Favorable',
    points: 28,
    total: 31,
    inspecteur: 'M. GARCIA',
    numeroInspecteur: '03390',
    datePublication: formatPublication(pickDate(2)),
    appreciation: ['Conduite fluide.', 'Attention aux angles morts en changement de file.'],
    duree: '33 min',
    kilometres: '13,1 km',
    circulation: 'Dense',
    meteo: 'Ensoleillé',
    competences: bilanComplet
  },
  {
    id: '245830',
    dossier: '245830',
    candidatId: '18760',
    candidat: 'THOMAS RIVIÈRE',
    categorie: 'B',
    type: 'Examen pratique',
    date: formatDate(pickDate(3)),
    heure: '15h45',
    centre: 'Marseille La Valentine (13)',
    resultat: 'Favorable',
    points: 27,
    total: 31,
    inspecteur: 'M. DUPONT',
    numeroInspecteur: '03447',
    datePublication: formatPublication(pickDate(3)),
    appreciation: ['Examen réussi.', 'Allure à adapter davantage en zone 30.'],
    duree: '30 min',
    kilometres: '10,9 km',
    circulation: 'Modérée',
    meteo: 'Ensoleillé',
    competences: bilanComplet
  },
  {
    id: '245845',
    dossier: '245845',
    candidatId: '18856',
    candidat: 'SARAH NGUYEN',
    categorie: 'B',
    type: 'Examen pratique',
    date: formatDate(pickDate(4)),
    heure: '08h30',
    centre: 'Aubagne (13)',
    resultat: 'Défavorable',
    points: 18,
    total: 31,
    inspecteur: 'Mme LEROY',
    numeroInspecteur: '03512',
    datePublication: formatPublication(pickDate(4)),
    appreciation: [
      'Prise d’information insuffisante aux intersections.',
      'Travailler le partage de la route et les contrôles visuels.'
    ],

    duree: '29 min',
    kilometres: '10,2 km',
    circulation: 'Dense',
    meteo: 'Pluie fine',
    competences: bilanPartiel
  },
  {
    id: '245902',
    dossier: '245902',
    candidatId: '18788',
    candidat: 'INÈS KADDOUR',
    categorie: 'B',
    type: 'Examen pratique',
    date: formatDate(pickDate(5)),
    heure: '10h00',
    centre: 'Marseille La Valentine (13)',
    resultat: 'En attente',
    points: 0,
    total: 31,
    inspecteur: 'À désigner',
    numeroInspecteur: '—',
    datePublication: '—',
    appreciation: [],
    duree: '—',
    kilometres: '—',
    circulation: '—',
    meteo: '—',
    competences: []
  },
  {
    id: '245915',
    dossier: '245915',
    candidatId: '18802',
    candidat: 'LUCAS PERRIN',
    categorie: 'A2',
    type: 'Examen pratique',
    date: formatDate(pickDate(6)),
    heure: '13h30',
    centre: 'Aix-en-Provence (13)',
    resultat: 'En attente',
    points: 0,
    total: 31,
    inspecteur: 'À désigner',
    numeroInspecteur: '—',
    datePublication: '—',
    appreciation: [],
    duree: '—',
    kilometres: '—',
    circulation: '—',
    meteo: '—',
    competences: []
  },
  {
    id: '245930',
    dossier: '245930',
    candidatId: '18840',
    candidat: 'NOAH LEFÈVRE',
    categorie: 'B',
    type: 'Épreuve théorique (ETG)',
    date: formatDate(pickDate(7)),
    heure: '09h30',
    centre: 'Centre agréé Marseille Prado (13)',
    resultat: 'En attente',
    points: 0,
    total: 40,
    inspecteur: '—',
    numeroInspecteur: '—',
    datePublication: '—',
    appreciation: [],
    duree: '—',
    kilometres: '—',
    circulation: '—',
    meteo: '—',
    competences: []
  }
];


export const getExamen = (id: string): Examen | undefined => examens.find((e) => e.id === id);

export const examensParCandidat = (candidatId: string): Examen[] =>
  examens.filter((e) => e.candidatId === candidatId);

export const noteLabel: Record<string, string> = {
  '3': 'Compétence acquise',
  '2': 'Compétence en cours d’acquisition',
  '1': 'Compétence non acquise',
  '0': 'Compétence non évaluée',
  E: 'Non évaluable durant l’épreuve'
};
