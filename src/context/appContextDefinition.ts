import { createContext } from 'react';
import { Candidat, DocumentDossier, Examen, Facture, Message, Reservation } from '../types';

export interface AppContextType {
  candidats: Candidat[];
  addCandidat: (candidat: Candidat) => void;
  updateCandidat: (id: string, candidat: Partial<Candidat>) => void;
  deleteCandidat: (id: string) => void;

  reservations: Reservation[];
  addReservation: (reservation: Reservation) => void;
  updateReservation: (id: string, reservation: Partial<Reservation>) => void;
  deleteReservation: (id: string) => void;

  factures: Facture[];
  addFacture: (facture: Facture) => void;
  updateFacture: (id: string, facture: Partial<Facture>) => void;
  deleteFacture: (id: string) => void;

  documents: DocumentDossier[];
  addDocument: (document: DocumentDossier) => void;
  updateDocument: (id: string, document: Partial<DocumentDossier>) => void;
  deleteDocument: (id: string) => void;

  examens: Examen[];
  addExamen: (examen: Examen) => void;
  updateExamen: (id: string, examen: Partial<Examen>) => void;
  deleteExamen: (id: string) => void;

  messages: Message[];
  addMessage: (message: Message) => void;
  updateMessage: (id: string, message: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  resetMessages: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);
