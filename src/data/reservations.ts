import { Reservation } from '../types';

export const creneaux = (() => {
  const startHour = 8;
  const endHour = 17;
  const slots: string[] = [];
  for (let h = startHour; h <= endHour; h++) {
    const hh = String(h).padStart(2, '0');
    slots.push(`${hh}:00`);
    if (h !== endHour) slots.push(`${hh}:30`);
  }
  return slots;
})();

export interface WeekDay {
  label: string;
  shortLabel: string;
  date: string;
  iso: string;
}

const dayNames = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const shortDayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

export function getCurrentWeekDays(baseDate = new Date()): WeekDay[] {
  const date = new Date(baseDate);
  date.setHours(12, 0, 0, 0);
  const day = date.getDay(); // Sunday = 0
  const mondayOffset = day === 0 ? -6 : 1 - day;
  date.setDate(date.getDate() + mondayOffset);

  return Array.from({ length: 7 }, (_, index) => {
    const d = new Date(date);
    d.setDate(date.getDate() + index);
    const iso = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
    return {
      label: dayNames[d.getDay()],
      shortLabel: shortDayNames[d.getDay()],
      date: `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`,
      iso,
    };
  });
}

export function getWeekDaysKey(date = new Date()) {
  return getCurrentWeekDays(date)[0].iso;
}

export const joursSemaine = getCurrentWeekDays().map((day) => day.label);
export const datesSemaine = getCurrentWeekDays().map((day) => day.date);

// Demo data is assigned to the current week when it is first loaded. Real
// reservations created in the UI receive an exact ISO date and do not move
// when the calendar rolls into a new week.
export const reservations: Reservation[] = [
  { id: 'seed1', candidat: 'Marwa Diaw', candidatId: '18675', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 0, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed2', candidat: 'Yassine Benali', candidatId: '18701', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 0, debut: '08:30', fin: '09:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed3', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen blanc', jour: 0, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed4', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 0, debut: '10:00', fin: '10:30', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed5', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 0, debut: '10:30', fin: '11:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed6', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 0, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed7', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 0, debut: '14:30', fin: '15:00', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed8', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen blanc', jour: 1, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed9', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 1, debut: '08:30', fin: '09:00', statut: 'Confirmée', categorie: 'A' },
  { id: 'seed10', candidat: 'Sarah Nguyen', candidatId: '18856', moniteur: 'Nadia Cherif', vehicule: 'Opel Corsa — boîte automatique', type: 'Examen pratique', jour: 1, debut: '09:30', fin: '10:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed11', candidat: 'Marwa Diaw', candidatId: '18675', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 1, debut: '10:00', fin: '10:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed12', candidat: 'Yassine Benali', candidatId: '18701', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 1, debut: '11:00', fin: '11:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed13', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen blanc', jour: 1, debut: '14:00', fin: '14:30', statut: 'Annulée', categorie: 'B' },
  { id: 'seed14', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 1, debut: '15:00', fin: '15:30', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed15', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 2, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed16', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 2, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed17', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 2, debut: '09:30', fin: '10:00', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed18', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen blanc', jour: 2, debut: '10:30', fin: '11:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed19', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 2, debut: '11:30', fin: '12:00', statut: 'Confirmée', categorie: 'A' },
  { id: 'seed20', candidat: 'Sarah Nguyen', candidatId: '18856', moniteur: 'Nadia Cherif', vehicule: 'Opel Corsa — boîte automatique', type: 'Examen pratique', jour: 2, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed21', candidat: 'Marwa Diaw', candidatId: '18675', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 2, debut: '14:30', fin: '15:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed22', candidat: 'Yassine Benali', candidatId: '18701', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 2, debut: '15:30', fin: '16:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed23', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen blanc', jour: 3, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed24', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 3, debut: '08:30', fin: '09:00', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed25', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 3, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed26', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 3, debut: '10:00', fin: '10:30', statut: 'Annulée', categorie: 'B' },
  { id: 'seed27', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 3, debut: '11:00', fin: '11:30', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed28', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen blanc', jour: 3, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed29', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 3, debut: '15:00', fin: '15:30', statut: 'Confirmée', categorie: 'A' },
  { id: 'seed30', candidat: 'Sarah Nguyen', candidatId: '18856', moniteur: 'Nadia Cherif', vehicule: 'Opel Corsa — boîte automatique', type: 'Examen pratique', jour: 4, debut: '08:30', fin: '09:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed31', candidat: 'Marwa Diaw', candidatId: '18675', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 4, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed32', candidat: 'Yassine Benali', candidatId: '18701', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 4, debut: '09:30', fin: '10:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed33', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen blanc', jour: 4, debut: '10:30', fin: '11:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed34', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 4, debut: '11:30', fin: '12:00', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed35', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 4, debut: '14:30', fin: '15:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed36', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 4, debut: '15:00', fin: '15:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed37', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 5, debut: '08:00', fin: '08:30', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed38', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen blanc', jour: 5, debut: '08:30', fin: '09:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed39', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 5, debut: '09:30', fin: '10:00', statut: 'Annulée', categorie: 'A' },
  { id: 'seed40', candidat: 'Sarah Nguyen', candidatId: '18856', moniteur: 'Nadia Cherif', vehicule: 'Opel Corsa — boîte automatique', type: 'Examen pratique', jour: 5, debut: '10:00', fin: '10:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed41', candidat: 'Marwa Diaw', candidatId: '18675', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 5, debut: '11:00', fin: '11:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed42', candidat: 'Yassine Benali', candidatId: '18701', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 5, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed43', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen blanc', jour: 5, debut: '14:30', fin: '15:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed44', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 6, debut: '08:00', fin: '08:30', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed45', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 6, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed46', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 6, debut: '10:00', fin: '10:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed47', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 6, debut: '10:30', fin: '11:00', statut: 'À confirmer', categorie: 'B' },
  { id: 'seed48', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen blanc', jour: 6, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed49', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Antoine Ferrand', vehicule: 'Yamaha MT-07 — A2', type: 'Examen pratique', jour: 6, debut: '15:30', fin: '16:00', statut: 'Confirmée', categorie: 'A' },
  { id: 'seed50', candidat: 'Yassine Benali', candidatId: '18701', moniteur: 'Sophie Marchand', vehicule: 'Renault Kangoo — remorque BE', type: 'Examen pratique', jour: 0, debut: '15:30', fin: '16:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed51', candidat: 'Marwa Diaw', candidatId: '18675', moniteur: 'Karim Belhaj', vehicule: 'Renault Clio V — boîte manuelle', type: 'Examen pratique', jour: 2, debut: '15:30', fin: '16:00', statut: 'Confirmée', categorie: 'B' },
  { id: 'seed52', candidat: 'Sarah Nguyen', candidatId: '18856', moniteur: 'Nadia Cherif', vehicule: 'Opel Corsa — boîte automatique', type: 'Examen pratique', jour: 4, debut: '15:30', fin: '16:00', statut: 'À confirmer', categorie: 'B' },
];
