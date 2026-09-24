import { Message } from '../types';

export const messages: Message[] = [
{
  id: 'm1',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Titre en cours de fabrication — dossier 245789',
  extrait:
  'Le titre de permis de conduire de Mme Marwa DIAW est en cours de fabrication par l’Imprimerie Nationale. Aucune action n’est requise de votre part.',
  date: 'Aujourd’hui · 09:12',
  nonLu: true,
  categorie: 'ANTS'
},
{
  id: 'm7',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Dossier validé — fabrication du titre',
  extrait:
  'Votre dossier de permis de conduire a été validé. La fabrication du titre est désormais lancée par l’Imprimerie Nationale.',
  date: 'Aujourd’hui · 08:55',
  nonLu: true,
  categorie: 'ANTS'
},
{
  id: 'm8',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Mise à jour de votre dossier NEPH',
  extrait:
  'Une mise à jour a été apportée à votre dossier administratif. Consultez votre espace pour vérifier les informations enregistrées.',
  date: 'Hier · 16:24',
  nonLu: false,
  categorie: 'ANTS'
},
{
  id: 'm5',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Pièce refusée — dossier 18815',
  extrait:
  'La photo numérique transmise pour M. Amine TAZI ne respecte pas la norme e-Photo. Merci de déposer une nouvelle pièce.',
  date: 'Hier · 11:47',
  nonLu: false,
  categorie: 'ANTS'
},
{
  id: 'm2',
  expediteur: 'Centre d’examen La Valentine',
  role: 'Bureau d’éducation routière (13)',
  initiales: 'CV',
  objet: 'Places disponibles semaine du 05/10',
  extrait:
  'Trois places d’examen pratique catégorie B se libèrent la semaine du 5 octobre. Merci de confirmer vos attributions avant le 26/09.',
  date: '12/09 · 08:40',
  nonLu: true,
  categorie: 'Centre d’examen'
},
{
  id: 'm3',
  expediteur: 'Inès Kaddour',
  role: 'Candidate · Catégorie B',
  initiales: 'IK',
  objet: 'Décalage de ma leçon du jeudi',
  extrait:
  'Bonjour, est-il possible de déplacer ma leçon de jeudi 9h à vendredi en fin de journée ? Merci beaucoup.',
  date: '11/09 · 18:22',
  nonLu: true,
  categorie: 'Candidat'
},
{
  id: 'm4',
  expediteur: 'Karim Belhaj',
  role: 'Moniteur — équipe pédagogique',
  initiales: 'KB',
  objet: 'Bilan hebdomadaire des heures',
  extrait:
  'J’ai bouclé 31 heures cette semaine. Linda Martin est prête pour une présentation en octobre selon moi.',
  date: '11/09 · 17:05',
  nonLu: false,
  categorie: 'Interne'
},
{
  id: 'm6',
  expediteur: 'Thomas Rivière',
  role: 'Candidat · Catégorie B',
  initiales: 'TR',
  objet: 'Merci pour l’accompagnement',
  extrait:
  'Un grand merci à toute l’équipe, permis obtenu du premier coup. Je recommande l’auto-école autour de moi !',
  date: '10/09 · 20:03',
  nonLu: false,
  categorie: 'Candidat'
}
,
{
  id: 'm9',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Notification : envoi postal du titre',
  extrait:
    'Le titre de permis de Mme Linda MARTIN a été expédié par courrier recommandé. Numéro de suivi disponible sur votre espace.',
  date: 'Aujourd’hui · 10:05',
  nonLu: true,
  categorie: 'ANTS'
},
{
  id: 'm10',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Rappel : documents manquants',
  extrait:
    'Nous n’avons pas encore reçu la copie de la pièce d’identité pour le dossier 18840. Merci de la transmettre sous 15 jours.',
  date: 'Hier · 09:30',
  nonLu: false,
  categorie: 'ANTS'
},
{
  id: 'm11',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Problème d’acheminement',
  extrait:
    'Un incident d’acheminement a été signalé pour certaines expéditions. Vérifiez le suivi et contactez le service si nécessaire.',
  date: '12/09 · 14:12',
  nonLu: false,
  categorie: 'ANTS'
},
{
  id: 'm12',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Mise à jour réglementaire',
  extrait:
    'Mise à jour des délais de production des titres : veuillez noter que certains délais peuvent être prolongés en région.',
  date: '09/09 · 11:00',
  nonLu: false,
  categorie: 'ANTS'
},
{
  id: 'm13',
  expediteur: 'ANTS — Service permis',
  role: 'Agence Nationale des Titres Sécurisés',
  initiales: 'AN',
  objet: 'Confirmation d’adresse reçue',
  extrait:
    'Nous avons bien reçu la confirmation d’adresse pour le dossier 18788. La fabrication du titre est en cours.',
  date: '08/09 · 16:45',
  nonLu: false,
  categorie: 'ANTS'
}
];
