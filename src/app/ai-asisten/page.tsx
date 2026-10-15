'use client';

import { useEffect, useState } from 'react';
import { readCookie } from '@/lib/cookies';

import { PublicShell } from '@/components/public-shell';
import { useLanguage } from '@/components/theme-provider';

interface Conversation {
  id: string;
  title: string;
  updatedAt: string;
}

interface Message {
  role: 'USER' | 'ASSISTANT' | 'SYSTEM';
  sources?: Source[];
  content: string;
}

interface Source {
  id: string;
  title: string;
  url: string;
}

export default function AiAsistenPage() {
  const { language } = useLanguage();
  const isId = language === 'id';
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);

  async function loadConversations() {
    const res = await fetch('/api/v1/ai/conversations?limit=50');
    const json = await res.json();
    setConversations(json.data ?? []);
  }

  async function openConversation(id: string) {
    setActiveId(id);
    const res = await fetch(`/api/v1/ai/conversations/${id}`);
    const json = await res.json();
    if (json.data) {
      setMessages(json.data.messages?.filter((m: Message) => m.role !== 'SYSTEM') ?? []);
      setSources(
        json.data.messages
          ?.filter((m: Message) => m.role === 'ASSISTANT' && m.sources?.length)
          .flatMap((m: { sources: Source[] }) => m.sources) ?? [],
      );
    }
  }

  async function send() {
    if (!input.trim() || sending) return;
    setSending(true);
    const csrfToken = readCookie(
      document.cookie.includes('madevi_owner_access=') ? 'madevi_owner_csrf' : 'madevi_csrf',
    );
    const res = await fetch('/api/v1/ai/conversations', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
      },
      body: JSON.stringify({ message: input.trim(), conversationId: activeId ?? undefined }),
    });
    const json = await res.json();
    if (json.data) {
      setActiveId(json.data.conversationId);
      setMessages((prev) => [
        ...prev,
        { role: 'USER', content: input.trim() },
        { role: 'ASSISTANT', content: json.data.answer },
      ]);
      setSources(json.data.sources ?? []);
    } else {
      setMessages((prev) => [
        ...prev,
        { role: 'USER', content: input.trim() },
        { role: 'ASSISTANT', content: json.error?.message ?? 'Gagal' },
      ]);
    }
    setInput('');
    setSending(false);
    loadConversations();
  }

  async function removeConversation(id: string) {
    const csrfToken = readCookie(
      document.cookie.includes('madevi_owner_access=') ? 'madevi_owner_csrf' : 'madevi_csrf',
    );
    await fetch(`/api/v1/ai/conversations/${id}`, {
      method: 'DELETE',
      headers: csrfToken ? { 'x-csrf-token': csrfToken } : undefined,
    });
    if (activeId === id) {
      setActiveId(null);
      setMessages([]);
      setSources([]);
    }
    loadConversations();
  }

  useEffect(() => {
    // These loaders update state from asynchronous network responses.
    loadConversations();
  }, []);

  return (
    <PublicShell hideAi>
      <div className="page-shell ai-page">
        <div className="ai-page__inner">
          <div className="ai-page__panel">
            <aside
              className="ai-page__sidebar"
              aria-label={isId ? 'Daftar percakapan' : 'Conversations'}
            >
              <h1>{isId ? 'Asisten Madevi' : 'Madevi Assistant'}</h1>
              <p className="ai-page__capability" role="status">
                {isId
                  ? 'Sumber lokal · gratis. Jawaban dirangkum dari artikel lokal yang diizinkan; nonaktif selama ujian.'
                  : 'Local sources · free. Answers are summarized from permitted local articles; disabled during exams.'}
              </p>
              <button
                type="button"
                className="button ai-page__new"
                onClick={() => {
                  setActiveId(null);
                  setMessages([]);
                  setSources([]);
                }}
              >
                {isId ? '+ Percakapan baru' : '+ New conversation'}
              </button>
              <ul className="ai-page__conv-list">
                {conversations.map((c) => (
                  <li key={c.id}>
                    <button
                      type="button"
                      className={`ai-page__conv${c.id === activeId ? ' ai-page__conv--active' : ''}`}
                      onClick={() => openConversation(c.id)}
                    >
                      {c.title}
                    </button>
                    <button
                      type="button"
                      className="ai-page__del"
                      onClick={() => removeConversation(c.id)}
                    >
                      {isId ? 'Hapus' : 'Delete'}
                    </button>
                  </li>
                ))}
              </ul>
            </aside>
            <section className="ai-page__chat" aria-label={isId ? 'Percakapan' : 'Chat'}>
              <div className="ai-page__messages">
                {messages.length === 0 ? (
                  <p className="ai-page__notice">
                    {isId
                      ? 'Ajukan pertanyaan seputar artikel, menu, software, atau bantuan menyusun draf.'
                      : 'Ask about articles, menus, software, or drafting help.'}
                  </p>
                ) : (
                  messages.map((m, i) => (
                    <p key={i} className={`ai-page__msg ai-page__msg--${m.role.toLowerCase()}`}>
                      {m.content}
                    </p>
                  ))
                )}
                {sources.length > 0 ? (
                  <div className="ai-page__sources">
                    <strong>{isId ? 'Sumber:' : 'Sources:'}</strong>
                    <ul>
                      {sources.map((s) => (
                        <li key={s.id}>
                          <a href={s.url}>{s.title}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              <div className="ai-page__input-row">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && send()}
                  placeholder={isId ? 'Tulis pertanyaan…' : 'Write a question…'}
                />
                <button type="button" className="button" onClick={send} disabled={sending}>
                  {sending ? '…' : isId ? 'Kirim' : 'Send'}
                </button>
              </div>
            </section>
          </div>
          <p className="ai-page__source-note">
            {isId
              ? 'Asisten sumber lokal: setiap jawaban dibatasi pada artikel Madevi yang diizinkan dan menampilkan sumbernya.'
              : 'Local-source assistant: every answer is limited to permitted Madevi articles and exposes its sources.'}
          </p>
        </div>
      </div>
    </PublicShell>
  );
}

