import { useState, useEffect, ReactNode } from 'react';
import { Candidat, DocumentDossier, Examen, Facture, Message, Reservation } from '../types';
import { candidats as initialCandidats } from '../data/candidats';
import { reservations as initialReservations } from '../data/reservations';
import { factures as initialFactures } from '../data/facturation';
import { documents as initialDocuments } from '../data/documents';
import { examens as initialExamens } from '../data/examens';
import { messages as initialMessages } from '../data/messages';
import { AppContext } from './appContextDefinition';

function loadJson<T>(key: string, fallback: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (!stored) return fallback;
    return JSON.parse(stored) as T;
  } catch {
    return fallback;
  }
}

export function AppContextProvider({ children }: { children: ReactNode }) {
  const [candidats, setCandidats] = useState<Candidat[]>(() => loadJson('candidats', initialCandidats));
  const [reservations, setReservations] = useState<Reservation[]>(() => loadJson('reservations', initialReservations));
  const [factures, setFactures] = useState<Facture[]>(() => loadJson('factures', initialFactures));
  const [documents, setDocuments] = useState<DocumentDossier[]>(() => loadJson('documents', initialDocuments));
  const [examens, setExamens] = useState<Examen[]>(() => loadJson('examens', initialExamens));
  const [messages, setMessages] = useState<Message[]>(() => loadJson('messages', initialMessages));

  // Save to localStorage when state changes
  useEffect(() => {
    localStorage.setItem('candidats', JSON.stringify(candidats));
  }, [candidats]);

  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  // One-time migration: if stored reservations exist but haven't been migrated to
  // the 30-minute slots dataset, replace them with `initialReservations` so
  // the app reflects the updated intervals. This avoids requiring the user to
  // manually clear localStorage.
  useEffect(() => {
    try {
      const migrated = localStorage.getItem('reservations_migrated_30min');
      const stored = localStorage.getItem('reservations');
      if (!migrated && stored) {
        // replace stored reservations with initial set and mark migrated
        setReservations(initialReservations);
        localStorage.setItem('reservations_migrated_30min', '1');
      }
    } catch {
      // ignore localStorage errors
    }
    // run only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem('factures', JSON.stringify(factures));
  }, [factures]);

  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  useEffect(() => {
    localStorage.setItem('examens', JSON.stringify(examens));
  }, [examens]);

  useEffect(() => {
    localStorage.setItem('messages', JSON.stringify(messages));
  }, [messages]);

  // One-time migration: replace any stored messages (e.g., created via the UI)
  // with the initial sample messages from the repo so site-inserted messages
  // are removed. Marks migration with a flag to avoid repeating.
  useEffect(() => {
    try {
      const migrated = localStorage.getItem('messages_migrated_reset');
      const stored = localStorage.getItem('messages');
      if (!migrated && stored) {
        setMessages(initialMessages);
        localStorage.setItem('messages_migrated_reset', '1');
      }
    } catch {
      // ignore
    }
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addCandidat = (candidat: Candidat) => {
    setCandidats((prev) => [...prev, candidat]);
  };

  const updateCandidat = (id: string, updates: Partial<Candidat>) => {
    setCandidats((prev) => {
      const current = prev.find((c) => c.id === id);
      if (!current) return prev;

      const oldFullName = `${current.prenom} ${current.nom}`.trim();
      const nextCandidate = { ...current, ...updates };
      const newFullName = `${nextCandidate.prenom} ${nextCandidate.nom}`.trim();
      const nameChanged = oldFullName !== newFullName;

      if (nameChanged) {
        // Keep every denormalized candidate-name field in sync across the app.
        setReservations((items) => items.map((item) =>
          item.candidatId === id || item.candidat === oldFullName
            ? { ...item, candidat: newFullName }
            : item
        ));
        setExamens((items) => items.map((item) =>
          item.candidatId === id || item.candidat === oldFullName
            ? { ...item, candidat: newFullName }
            : item
        ));
        setFactures((items) => items.map((item) =>
          item.candidat === oldFullName ? { ...item, candidat: newFullName } : item
        ));
        setDocuments((items) => items.map((item) =>
          item.candidat === oldFullName ? { ...item, candidat: newFullName } : item
        ));
        setMessages((items) => items.map((item) =>
          item.expediteur === oldFullName ? { ...item, expediteur: newFullName } : item
        ));
      }

      return prev.map((c) => (c.id === id ? nextCandidate : c));
    });
  };

  const deleteCandidat = (id: string) => {
    setCandidats((prev) => prev.filter((c) => c.id !== id));
  };

  const addReservation = (reservation: Reservation) => {
    setReservations((prev) => [...prev, reservation]);
  };

  const updateReservation = (id: string, updates: Partial<Reservation>) => {
    setReservations((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
  };

  const deleteReservation = (id: string) => {
    setReservations((prev) => prev.filter((r) => r.id !== id));
  };

  const addFacture = (facture: Facture) => {
    setFactures((prev) => [...prev, facture]);
  };

  const updateFacture = (id: string, updates: Partial<Facture>) => {
    setFactures((prev) => prev.map((f) => (f.id === id ? { ...f, ...updates } : f)));
  };

  const deleteFacture = (id: string) => {
    setFactures((prev) => prev.filter((f) => f.id !== id));
  };

  const addDocument = (document: DocumentDossier) => {
    setDocuments((prev) => [...prev, document]);
  };

  const updateDocument = (id: string, updates: Partial<DocumentDossier>) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...updates } : d)));
  };

  const deleteDocument = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const addExamen = (examen: Examen) => {
    setExamens((prev) => [...prev, examen]);
  };

  const updateExamen = (id: string, updates: Partial<Examen>) => {
    setExamens((prev) => prev.map((e) => (e.id === id ? { ...e, ...updates } : e)));
  };

  const deleteExamen = (id: string) => {
    setExamens((prev) => prev.filter((e) => e.id !== id));
  };

  const addMessage = (message: Message) => {
    setMessages((prev) => [message, ...prev]);
  };

  const updateMessage = (id: string, updates: Partial<Message>) => {
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMessage = (id: string) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
  };

  const resetMessages = () => {
    setMessages(initialMessages);
    try {
      localStorage.setItem('messages_migrated_reset', '1');
    } catch {}
  };

  return (
    <AppContext.Provider
      value={{
        candidats,
        addCandidat,
        updateCandidat,
        deleteCandidat,
        reservations,
        addReservation,
        updateReservation,
        deleteReservation,
        factures,
        addFacture,
        updateFacture,
        deleteFacture,
        documents,
        addDocument,
        updateDocument,
        deleteDocument,
        examens,
        addExamen,
        updateExamen,
        deleteExamen,
        messages,
        addMessage,
        updateMessage,
        deleteMessage,
        resetMessages,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
