import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PlusIcon, SendIcon } from 'lucide-react';
import { PageHeader } from '../components/ui/PageHeader';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { InlineEditableField } from '../components/ui/InlineEditableField';
import { useAppContext } from '../hooks/useAppContext';
import { Message } from '../types';

const categories = ['Tous', 'ANTS', 'Candidat', 'Centre d’examen', 'Interne'] as const;
type CategoryFilter = (typeof categories)[number];

export function Messages() {
  const { messages, addMessage, updateMessage, resetMessages } = useAppContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const getStoredString = (key: string, fallback: string) => {
    try {
      return localStorage.getItem(key) ?? fallback;
    } catch {
      return fallback;
    }
  };
  const [pageTitle, setPageTitle] = useState(() => getStoredString('messagesPageTitle', 'Messages'));
  const [pageDescription, setPageDescription] = useState(() => getStoredString('messagesPageDescription', 'Messages non lus'));
  const [newMessageLabel, setNewMessageLabel] = useState(() => getStoredString('messagesNewMessageLabel', 'Nouveau message'));
  const [resetMessagesLabel, setResetMessagesLabel] = useState(() => getStoredString('messagesResetLabel', 'Réinitialiser les messages'));
  const [composerTitle, setComposerTitle] = useState(() => getStoredString('messagesComposerTitle', 'Composer un message'));
  const [recipientLabel, setRecipientLabel] = useState(() => getStoredString('messagesRecipientLabel', 'Destinataire'));
  const [categoryLabel, setCategoryLabel] = useState(() => getStoredString('messagesCategoryLabel', 'Catégorie'));
  const [subjectLabel, setSubjectLabel] = useState(() => getStoredString('messagesSubjectLabel', 'Objet'));
  const [messageLabel, setMessageLabel] = useState(() => getStoredString('messagesMessageLabel', 'Message'));
  const [cancelLabel, setCancelLabel] = useState(() => getStoredString('messagesCancelLabel', 'Annuler'));
  const [sendLabel, setSendLabel] = useState(() => getStoredString('messagesSendLabel', 'Envoyer'));
  const [replyLabel, setReplyLabel] = useState(() => getStoredString('messagesReplyLabel', 'Votre réponse'));
  const [replyPlaceholder, setReplyPlaceholder] = useState(() => getStoredString('messagesReplyPlaceholder', 'Rédiger une réponse…'));
  const [emptyFilterLabel, setEmptyFilterLabel] = useState(() => getStoredString('messagesEmptyFilterLabel', 'Aucun message pour ce filtre.'));
  const [selectMessageLabel, setSelectMessageLabel] = useState(() => getStoredString('messagesSelectLabel', 'Sélectionnez un message.'));
  const [filterLabels, setFilterLabels] = useState<Record<CategoryFilter, string>>(() => {
    try {
      return { ...Object.fromEntries(categories.map((category) => [category, category])), ...JSON.parse(localStorage.getItem('messagesFilterLabels') ?? '{}') } as Record<CategoryFilter, string>;
    } catch {
      return Object.fromEntries(categories.map((category) => [category, category])) as Record<CategoryFilter, string>;
    }
  });
  const [selectedId, setSelectedId] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('Tous');
  const [reply, setReply] = useState('');
  const [status, setStatus] = useState('');
  const [showComposer, setShowComposer] = useState(false);
  const [draft, setDraft] = useState({
    destinataire: 'Service interne',
    objet: 'Demande de confirmation',
    categorie: 'Interne' as Message['categorie'],
    texte: '',
  });

  useEffect(() => {
    try {
      localStorage.setItem('messagesPageTitle', pageTitle);
      localStorage.setItem('messagesPageDescription', pageDescription);
      localStorage.setItem('messagesNewMessageLabel', newMessageLabel);
      localStorage.setItem('messagesResetLabel', resetMessagesLabel);
      localStorage.setItem('messagesComposerTitle', composerTitle);
      localStorage.setItem('messagesRecipientLabel', recipientLabel);
      localStorage.setItem('messagesCategoryLabel', categoryLabel);
      localStorage.setItem('messagesSubjectLabel', subjectLabel);
      localStorage.setItem('messagesMessageLabel', messageLabel);
      localStorage.setItem('messagesCancelLabel', cancelLabel);
      localStorage.setItem('messagesSendLabel', sendLabel);
      localStorage.setItem('messagesReplyLabel', replyLabel);
      localStorage.setItem('messagesReplyPlaceholder', replyPlaceholder);
      localStorage.setItem('messagesEmptyFilterLabel', emptyFilterLabel);
      localStorage.setItem('messagesSelectLabel', selectMessageLabel);
      localStorage.setItem('messagesFilterLabels', JSON.stringify(filterLabels));
    } catch {
      // ignore localStorage errors
    }
  }, [pageTitle, pageDescription, newMessageLabel, resetMessagesLabel, composerTitle, recipientLabel, categoryLabel, subjectLabel, messageLabel, cancelLabel, sendLabel, replyLabel, replyPlaceholder, emptyFilterLabel, selectMessageLabel, filterLabels]);

  const filteredMessages = useMemo(
    () => (categoryFilter === 'Tous' ? messages : messages.filter((m) => m.categorie === categoryFilter)),
    [categoryFilter, messages]
  );

  useEffect(() => {
    const targetId = searchParams.get('message');
    if (targetId && messages.some((m) => m.id === targetId)) {
      setSelectedId(targetId);
      setCategoryFilter('Tous');
      updateMessage(targetId, { nonLu: false });
      setSearchParams({}, { replace: true });
    }
  }, [messages, searchParams, setSearchParams, updateMessage]);

  useEffect(() => {
    if (!filteredMessages.length) return;
    if (!selectedId || !filteredMessages.some((m) => m.id === selectedId)) {
      setSelectedId(filteredMessages[0].id);
    }
  }, [filteredMessages, selectedId]);

  const selected = filteredMessages.find((m) => m.id === selectedId) ?? messages[0] ?? null;
  const unread = messages.filter((m) => m.nonLu).length;

  const editMessage = (id: string, updates: Partial<Message>) => updateMessage(id, updates);

  const handleSelectMessage = (id: string) => {
    setSelectedId(id);
    const current = messages.find((m) => m.id === id);
    if (current && current.nonLu) {
      updateMessage(id, { nonLu: false });
    }
  };

  const handleReply = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selected || !reply.trim()) return;

    const outgoing: Message = {
      id: `m-${Date.now()}`,
      expediteur: 'Vous',
      role: 'Responsable de l’auto-école',
      initiales: 'SP',
      objet: `Réponse — ${selected.objet}`,
      extrait: reply.trim(),
      date: 'À l’instant',
      nonLu: false,
      categorie: selected.categorie,
    };

    addMessage(outgoing);
    updateMessage(selected.id, { nonLu: false });
    setReply('');
    setStatus(`Réponse envoyée à ${selected.expediteur}.`);
    setSelectedId(outgoing.id);
  };

  const handleNewMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!draft.texte.trim() || !draft.objet.trim()) return;

    const newMessage: Message = {
      id: `m-${Date.now()}`,
      expediteur: 'Vous',
      role: 'Responsable de l’auto-école',
      initiales: 'SP',
      objet: draft.objet,
      extrait: draft.texte.trim(),
      date: 'À l’instant',
      nonLu: false,
      categorie: draft.categorie,
    };

    addMessage(newMessage);
    setSelectedId(newMessage.id);
    setShowComposer(false);
    setDraft({
      destinataire: 'Service interne',
      objet: 'Demande de confirmation',
      categorie: 'Interne',
      texte: '',
    });
    setStatus(`Message envoyé à ${draft.destinataire}.`);
  };

  return (
    <>
      <PageHeader
        title={<InlineEditableField value={pageTitle} onSave={setPageTitle} className="inline-block" />}
        description={<InlineEditableField value={pageDescription} onSave={setPageDescription} className="inline-block" />}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowComposer((v) => !v)}
              className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-brand-700"
            >
              <PlusIcon className="h-4 w-4" aria-hidden="true" />
              <InlineEditableField value={newMessageLabel} onSave={setNewMessageLabel} className="inline-block text-sm font-semibold text-white" />
            </button>
            <button
              type="button"
              onClick={() => {
                // reset messages to initial sample data
                if (window.confirm('Réinitialiser les messages aux données d’exemple ?')) {
                  resetMessages();
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm font-semibold text-ink-800 hover:bg-canvas"
            >
              <InlineEditableField value={resetMessagesLabel} onSave={setResetMessagesLabel} className="inline-block" />
            </button>
          </div>
        }
      />

      {showComposer && (
        <Card className="mb-6 p-5">
          <h2 className="text-base font-semibold text-ink-900"><InlineEditableField value={composerTitle} onSave={setComposerTitle} className="inline-block" /></h2>
          <form onSubmit={handleNewMessage} className="mt-4 grid gap-4 md:grid-cols-2">
            <label className="text-sm text-ink-700 md:col-span-1">
              <span className="mb-1 block font-medium"><InlineEditableField value={recipientLabel} onSave={setRecipientLabel} className="inline-block" /></span>
              <input
                value={draft.destinataire}
                onChange={(e) => setDraft((prev) => ({ ...prev, destinataire: e.target.value }))}
                className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="text-sm text-ink-700 md:col-span-1">
              <span className="mb-1 block font-medium"><InlineEditableField value={categoryLabel} onSave={setCategoryLabel} className="inline-block" /></span>
              <select
                value={draft.categorie}
                onChange={(e) => setDraft((prev) => ({ ...prev, categorie: e.target.value as Message['categorie'] }))}
                className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              >
                <option value="ANTS">ANTS</option>
                <option value="Candidat">Candidat</option>
                <option value="Centre d’examen">Centre d’examen</option>
                <option value="Interne">Interne</option>
              </select>
            </label>
            <label className="text-sm text-ink-700 md:col-span-2">
              <span className="mb-1 block font-medium"><InlineEditableField value={subjectLabel} onSave={setSubjectLabel} className="inline-block" /></span>
              <input
                value={draft.objet}
                onChange={(e) => setDraft((prev) => ({ ...prev, objet: e.target.value }))}
                className="h-10 w-full rounded-lg border border-line bg-white px-3 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <label className="text-sm text-ink-700 md:col-span-2">
              <span className="mb-1 block font-medium"><InlineEditableField value={messageLabel} onSave={setMessageLabel} className="inline-block" /></span>
              <textarea
                rows={4}
                value={draft.texte}
                onChange={(e) => setDraft((prev) => ({ ...prev, texte: e.target.value }))}
                className="w-full resize-none rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink-900 focus:border-brand-600 focus:outline-none"
              />
            </label>
            <div className="md:col-span-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowComposer(false)}
                className="rounded-lg border border-line px-4 py-2 text-sm font-semibold text-ink-800 hover:bg-canvas"
              >
                <InlineEditableField value={cancelLabel} onSave={setCancelLabel} className="inline-block" />
              </button>
              <button
                type="submit"
                disabled={!draft.texte.trim() || !draft.objet.trim()}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <InlineEditableField value={sendLabel} onSave={setSendLabel} className="inline-block text-sm font-semibold text-white" />
              </button>
            </div>
          </form>
        </Card>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[380px_1fr]">
        <Card className="overflow-hidden">
          <div className="flex flex-wrap gap-2 border-b border-line p-3">
            {categories.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setCategoryFilter(filter)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-semibold transition-colors duration-150 ${
                  categoryFilter === filter ? 'bg-brand-600 text-white' : 'bg-canvas text-ink-700 hover:bg-brand-50 hover:text-brand-700'
                }`}
              >
                <InlineEditableField value={filterLabels[filter]} onSave={(next) => setFilterLabels((current) => ({ ...current, [filter]: next }))} className="inline-block" />
              </button>
            ))}
          </div>

          <ul className="divide-y divide-line">
            {filteredMessages.length === 0 ? (
              <li className="px-5 py-8 text-center text-sm text-ink-500"><InlineEditableField value={emptyFilterLabel} onSave={setEmptyFilterLabel} className="inline-block" /></li>
            ) : (
              filteredMessages.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => handleSelectMessage(m.id)}
                    aria-current={selectedId === m.id}
                    className={`flex w-full gap-3 px-5 py-4 text-left transition-colors duration-150 ${
                      selectedId === m.id ? 'bg-brand-50' : 'hover:bg-canvas'
                    }`}
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-navy-800 text-xs font-bold text-white">
                      <InlineEditableField value={m.initiales} onSave={(next) => editMessage(m.id, { initiales: next })} className="inline-block text-xs font-bold text-white" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-baseline justify-between gap-2">
                        <span className="truncate text-sm font-semibold text-ink-900"><InlineEditableField value={m.expediteur} onSave={(next) => editMessage(m.id, { expediteur: next })} className="inline-block text-sm font-semibold text-ink-900" /></span>
                        <span className="date-value shrink-0 text-[11px] text-ink-400"><InlineEditableField value={m.date} onSave={(next) => editMessage(m.id, { date: next })} className="inline-block text-[11px] text-ink-400" /></span>
                      </span>
                      <span className="mt-0.5 block truncate text-sm text-ink-800"><InlineEditableField value={m.objet} onSave={(next) => editMessage(m.id, { objet: next })} className="inline-block text-sm text-ink-800" /></span>
                      <span className="mt-0.5 block truncate text-xs text-ink-500"><InlineEditableField value={m.extrait} onSave={(next) => editMessage(m.id, { extrait: next })} className="inline-block text-xs text-ink-500" /></span>
                    </span>
                    {m.nonLu && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-brand-600" />}
                  </button>
                </li>
              ))
            )}
          </ul>
        </Card>

        {selected ? (
          <Card className="flex flex-col">
            <header className="flex flex-wrap items-start gap-4 border-b border-line px-6 py-5">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-navy-800 text-sm font-bold text-white">
                <InlineEditableField value={selected.initiales} onSave={(next) => editMessage(selected.id, { initiales: next })} className="inline-block text-sm font-bold text-white" />
              </span>
              <div className="min-w-0 flex-1">
                <h2 className="text-lg font-semibold text-ink-900"><InlineEditableField value={selected.objet} onSave={(next) => editMessage(selected.id, { objet: next })} className="inline-block text-lg font-semibold text-ink-900" /></h2>
                <p className="mt-0.5 text-sm text-ink-500">
                  <InlineEditableField value={selected.expediteur} onSave={(next) => editMessage(selected.id, { expediteur: next })} className="inline-block text-sm text-ink-500" /> · <InlineEditableField value={selected.role} onSave={(next) => editMessage(selected.id, { role: next })} className="inline-block text-sm text-ink-500" />
                </p>
              </div>
              <Badge tone="info"><InlineEditableField value={selected.categorie} onSave={(next) => editMessage(selected.id, { categorie: next as Message['categorie'] })} type="select" options={['ANTS', 'Candidat', 'Centre d’examen', 'Interne']} className="inline-block" /></Badge>
            </header>

            <div className="flex-1 px-6 py-6 text-sm leading-relaxed text-ink-800">
              <p className="date-value mb-4 text-xs uppercase tracking-wide text-ink-400"><InlineEditableField value={selected.date} onSave={(next) => editMessage(selected.id, { date: next })} className="inline-block text-xs uppercase tracking-wide text-ink-400" /></p>
              <p><InlineEditableField value={selected.extrait} onSave={(next) => editMessage(selected.id, { extrait: next })} className="inline-block" /></p>
              {status && (
                <p className="mt-5 rounded-lg bg-ok-50 px-4 py-3 text-sm font-medium text-ok-700" role="status">
                  <InlineEditableField value={status} onSave={setStatus} className="inline-block text-sm font-medium text-ok-700" />
                </p>
              )}
            </div>

            <div className="border-t border-line p-6">
              <form onSubmit={handleReply} className="space-y-3">
                <label htmlFor="reponse" className="sr-only">
                  <InlineEditableField value={replyLabel} onSave={setReplyLabel} className="inline-block" />
                </label>
                <textarea
                  id="reponse"
                  rows={4}
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={replyPlaceholder}
                  className="w-full resize-none rounded-lg border border-line bg-canvas px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 transition-colors duration-150 focus:border-brand-600 focus:bg-white focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={!reply.trim()}
                  className="inline-flex items-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50 transition-colors duration-150 hover:bg-brand-700 hover:disabled:bg-brand-600"
                >
                  <SendIcon className="h-4 w-4" aria-hidden="true" />
                  <InlineEditableField value={sendLabel} onSave={setSendLabel} className="inline-block text-sm font-semibold text-white" />
                </button>
              </form>
            </div>
          </Card>
        ) : (
          <Card className="flex items-center justify-center p-10 text-sm text-ink-500"><InlineEditableField value={selectMessageLabel} onSave={setSelectMessageLabel} className="inline-block" /></Card>
        )}
      </div>
    </>
  );
}