import { DocumentDossier } from '../types';

export const documents: DocumentDossier[] = [
{ id: 'd1', nom: 'CEPC — Marwa Diaw.pdf', type: 'Certificat d’examen', candidat: 'Marwa Diaw', taille: '182 Ko', dateDepot: '08/09/2026', statut: 'Validé' },
{ id: 'd2', nom: 'Pièce d’identité — Linda Martin.pdf', type: 'Identité', candidat: 'Linda Martin', taille: '1,2 Mo', dateDepot: '11/09/2026', statut: 'Validé' },
{ id: 'd3', nom: 'Justificatif de domicile — Inès Kaddour.pdf', type: 'Domicile', candidat: 'Inès Kaddour', taille: '640 Ko', dateDepot: '10/09/2026', statut: 'À vérifier' },
{ id: 'd4', nom: 'ASSR 2 — Noah Lefèvre.pdf', type: 'Attestation scolaire', candidat: 'Noah Lefèvre', taille: '310 Ko', dateDepot: '11/09/2026', statut: 'À vérifier' },
{ id: 'd5', nom: 'Photo e-Photo — Amine Tazi.jpg', type: 'Photo numérique', candidat: 'Amine Tazi', taille: '820 Ko', dateDepot: '12/09/2026', statut: 'Refusé' },
{ id: 'd6', nom: 'Attestation JDC — Lucas Perrin.pdf', type: 'Journée défense', candidat: 'Lucas Perrin', taille: '425 Ko', dateDepot: '13/09/2026', statut: 'Validé' },
{ id: 'd7', nom: 'Contrat de formation — Camille Dubois.pdf', type: 'Contrat', candidat: 'Camille Dubois', taille: '298 Ko', dateDepot: '14/09/2026', statut: 'Validé' },
{ id: 'd8', nom: 'Avis médical — Sarah Nguyen.pdf', type: 'Médical', candidat: 'Sarah Nguyen', taille: '512 Ko', dateDepot: '15/09/2026', statut: 'À vérifier' }];


export const documentsCandidat = (candidat: string): DocumentDossier[] =>
documents.filter((d) => d.candidat === candidat);