import { Reservation } from '../types';

export const joursSemaine = ['Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche', 'Lundi', 'Mardi'];

export const datesSemaine = ['08/09', '09/09', '10/09', '11/09', '12/09', '13/09', '14/09', '15/09'];

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

export const reservations: Reservation[] = [
{ id: 'r1', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Clio V', type: 'Leçon de conduite', jour: 0, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r2', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Corsa', type: 'Leçon de conduite', jour: 0, debut: '10:00', fin: '10:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r3', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Antoine Ferrand', vehicule: 'Salle 2', type: 'Cours de code', jour: 0, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'A' },
{ id: 'r4', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Clio V', type: 'Leçon de conduite', jour: 1, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r5', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Kangoo BE', type: 'Leçon de conduite', jour: 1, debut: '13:00', fin: '13:30', statut: 'À confirmer', categorie: 'A' },
{ id: 'r6', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'MT-07 A2', type: 'Leçon de conduite', jour: 2, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r7', candidat: 'Linda Martin', candidatId: '18744', moniteur: 'Karim Belhaj', vehicule: 'Clio V', type: 'Examen blanc', jour: 2, debut: '11:00', fin: '11:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r8', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Salle 2', type: 'Cours de code', jour: 2, debut: '15:00', fin: '15:30', statut: 'À confirmer', categorie: 'A' },
{ id: 'r9', candidat: 'Inès Kaddour', candidatId: '18788', moniteur: 'Antoine Ferrand', vehicule: 'Corsa', type: 'Examen blanc', jour: 3, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r10', candidat: 'Thomas Rivière', candidatId: '18760', moniteur: 'Sophie Marchand', vehicule: 'Clio V', type: 'Conduite accompagnée', jour: 3, debut: '14:00', fin: '14:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r11', candidat: 'Camille Dubois', candidatId: '18829', moniteur: 'Sophie Marchand', vehicule: 'Kangoo BE', type: 'Leçon de conduite', jour: 4, debut: '10:00', fin: '10:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r12', candidat: 'Noah Lefèvre', candidatId: '18840', moniteur: 'Karim Belhaj', vehicule: 'Corsa', type: 'Leçon de conduite', jour: 4, debut: '16:00', fin: '16:30', statut: 'Annulée', categorie: 'A' },
{ id: 'r13', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'MT-07 A2', type: 'Leçon de conduite', jour: 5, debut: '08:00', fin: '08:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r14', candidat: 'Amine Tazi', candidatId: '18815', moniteur: 'Karim Belhaj', vehicule: 'Clio V', type: 'Leçon de conduite', jour: 5, debut: '11:00', fin: '11:30', statut: 'À confirmer', categorie: 'B' },
{ id: 'r15', candidat: 'Sarah Nguyen', candidatId: '18856', moniteur: 'Nadia Cherif', vehicule: 'Corsa', type: 'Leçon de conduite', jour: 6, debut: '09:00', fin: '09:30', statut: 'Confirmée', categorie: 'B' },
{ id: 'r16', candidat: 'Lucas Perrin', candidatId: '18802', moniteur: 'Antoine Ferrand', vehicule: 'MT-07 A2', type: 'Examen blanc', jour: 7, debut: '10:00', fin: '10:30', statut: 'Confirmée', categorie: 'A' }];