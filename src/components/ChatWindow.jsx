import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:7001';

const SUGGESTED_QUERIES = [
  { icon: 'receipt_long', title: 'Expense Form', desc: 'Download the 2024 International Reimbursement template.', query: 'Where can I find the 2024 international expense reimbursement form?' },
  { icon: 'flight_takeoff', title: 'Travel Registry', desc: 'Register your upcoming high-budget trip for approval.', query: 'What is the process for registering international business travel over $5,000?' },
  { icon: 'account_balance_wallet', title: 'Finance Contact', desc: 'Directly message the Travel Compliance department.', query: 'How do I contact the Travel Compliance department for expense queries?' },
];

function TypingIndicator() {
  return (
    <div className="flex justify-start items-start gap-4 py-2 animate-fade-in">
      <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
        <span className="material-symbols-outlined text-white text-[16px]">psychology</span>
      </div>
      <div className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] px-5 py-4 rounded-2xl rounded-tl-sm shadow-sm">
        <div className="flex gap-1.5 items-center">
          <span className="w-2 h-2 bg-secondary/60 rounded-full animate-bounce" style={{animationDelay:'0ms'}} />
          <span className="w-2 h-2 bg-secondary/60 rounded-full animate-bounce" style={{animationDelay:'150ms'}} />
          <span className="w-2 h-2 bg-secondary/60 rounded-full animate-bounce" style={{animationDelay:'300ms'}} />
        </div>
      </div>
    </div>
  );
}

// Simple markdown-like formatting for bold text and lists
function FormattedContent({ text }) {
  if (!text) return null;
  
  const lines = text.split('\n');
  const elements = [];
  
  lines.forEach((line, lineIdx) => {
    // Process inline bold: **text**
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    const processedParts = parts.map((part, partIdx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={partIdx} className="font-semibold text-slate-900 dark:text-white">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
    
    if (line.trim().startsWith('- ')) {
      elements.push(
        <div key={lineIdx} className="flex items-start gap-2 ml-2">
          <span className="text-secondary mt-1.5 text-[6px]">●</span>
          <span>{processedParts.map((p, i) => typeof p === 'string' ? p.replace(/^- /, '') : p)}</span>
        </div>
      );
    } else if (line.trim() === '') {
      elements.push(<div key={lineIdx} className="h-2" />);
    } else {
      elements.push(<div key={lineIdx}>{processedParts}</div>);
    }
  });
  
  return <div className="space-y-0.5">{elements}</div>;
}

export default function ChatWindow({ messages, setMessages, isStreaming, setIsStreaming, streamingText, setStreamingText }) {
  const { user } = useAuth();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const eventSourceRef = useRef(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingText, isStreaming]);

  // Cleanup EventSource on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
    };
  }, []);

  const handleSend = useCallback((text = input) => {
    const q = (typeof text === 'string' ? text : input).trim();
    if (!q || isStreaming) return;
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    const userMsg = {
      role: 'user', content: q, id: Date.now(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setIsStreaming(true);
    setStreamingText('');

    // Use Server-Sent Events to stream from backend
    const es = new EventSource(`${API_URL}/api/chat/stream?q=${encodeURIComponent(q)}`);
    eventSourceRef.current = es;

    let fullText = '';
    let sources = [];

    es.onmessage = (e) => {
      if (e.data === '[DONE]') {
        es.close();
        eventSourceRef.current = null;
        setIsStreaming(false);
        setStreamingText('');

        const aiMsg = {
          role: 'assistant',
          content: fullText,
          id: Date.now() + 1,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sources: sources.map(s => ({
            id: s._id,
            fileName: s.filename,
            page: s.page || 1,
            snippet: s.text?.slice(0, 150) + '...',
            relevance: s.score || 0.9,
          })),
          citations: sources.map((s, i) => ({
            label: `${s.filename} • Chunk ${s.chunk ?? i}`,
            sourceId: (s.docId || '') + i,
          })),
        };

        setMessages(prev => [...prev, aiMsg]);
        return;
      }

      try {
        const payload = JSON.parse(e.data);
        if (payload.delta) {
          fullText += payload.delta;
          setStreamingText(fullText);
        }
        if (payload.sources) {
          sources = payload.sources;
        }
      } catch (err) {
        console.error('SSE parse error:', err);
      }
    };

    es.onerror = () => {
      es.close();
      eventSourceRef.current = null;
      setIsStreaming(false);
      setStreamingText('');
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error connecting to the backend. Make sure the backend server is running on port 7001.',
        id: Date.now() + 1,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    };
  }, [input, isStreaming, setMessages, setIsStreaming, setStreamingText]);

  const handleStop = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    setIsStreaming(false);
    setStreamingText('');
  }, [setIsStreaming, setStreamingText]);

  const handleCopy = useCallback((content, id) => {
    navigator.clipboard.writeText(content);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const hasMessages = messages.length > 0 || isStreaming;

  return (
    <main className="ml-64 pt-16 h-screen flex flex-col bg-surface dark:bg-[#0f1117] transition-colors">
      {!hasMessages ? (
        /* ── Empty State ── */
        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-32">
          <div className="w-16 h-16 bg-primary-container rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary-container/30 hover-lift cursor-default">
            <span className="material-symbols-outlined text-white text-3xl">psychology</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black font-h2 text-primary-container text-center mb-3">
            How can I help you<br />with our SOPs today?
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-center max-w-lg text-sm leading-relaxed mb-10">
            Access the latest enterprise procedures, compliance guidelines, and operational workflows with AI-powered precision.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-3xl">
            {SUGGESTED_QUERIES.map((sq, i) => (
              <button
                key={sq.title}
                onClick={() => handleSend(sq.query)}
                style={{ animationDelay: `${i * 80}ms` }}
                className="p-5 bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] rounded-2xl
                  hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10 transition-all cursor-pointer text-left group
                  hover-lift animate-fade-in"
              >
                <span className="material-symbols-outlined text-secondary text-2xl mb-3 block group-hover:scale-110 transition-transform">{sq.icon}</span>
                <h4 className="font-semibold text-slate-900 dark:text-white text-sm mb-1">{sq.title}</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{sq.desc}</p>
              </button>
            ))}
          </div>
        </div>
      ) : (
        /* ── Messages ── */
        <div className="flex-1 overflow-y-auto px-6 pb-36 pt-6 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((m) => (
              m.role === 'user' ? (
                <div key={m.id} className="flex justify-end items-end gap-3 animate-fade-in">
                  <div className="flex flex-col items-end gap-1 max-w-[75%]">
                    <div className="bg-primary-container text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 dark:text-slate-600">{m.timestamp}</span>
                  </div>
                  <img src={user?.avatar} alt="You" className="w-7 h-7 rounded-full border-2 border-slate-200 dark:border-[#2a2f4a] flex-shrink-0" />
                </div>
              ) : (
                <div key={m.id} className="flex justify-start items-start gap-3 animate-fade-in">
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <span className="material-symbols-outlined text-white text-[16px]">psychology</span>
                  </div>
                  <div className="flex-1 max-w-[85%]">
                    <div className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm relative overflow-hidden">
                      <div className="absolute left-0 top-0 w-1 h-full bg-secondary rounded-l-2xl" />
                      <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                        <FormattedContent text={m.content} />
                      </div>
                      {m.citations?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-[#21253a] flex flex-wrap gap-2 items-center">
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-bold mr-1">Sources:</span>
                          {m.citations.map((c, i) => (
                            <button key={i} className="flex items-center gap-1.5 px-3 py-1 bg-secondary-container/30 dark:bg-secondary/15 text-on-secondary-container dark:text-secondary border border-secondary/20 rounded-full text-xs font-semibold hover:bg-secondary-container/50 transition-colors">
                              <span className="material-symbols-outlined text-[12px]">description</span>
                              {c.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-2 ml-1">
                      <button
                        onClick={() => handleCopy(m.content, m.id)}
                        className="text-slate-400 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-300 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors"
                        title="Copy"
                      >
                        <span className="material-symbols-outlined text-[15px]">
                          {copiedId === m.id ? 'check' : 'content_copy'}
                        </span>
                      </button>
                      <button className="text-slate-400 dark:text-slate-600 hover:text-green-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors">
                        <span className="material-symbols-outlined text-[15px]">thumb_up</span>
                      </button>
                      <button className="text-slate-400 dark:text-slate-600 hover:text-red-500 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors">
                        <span className="material-symbols-outlined text-[15px]">thumb_down</span>
                      </button>
                      <span className="text-[10px] text-slate-400 dark:text-slate-600 ml-1">{m.timestamp}</span>
                    </div>
                  </div>
                </div>
              )
            ))}

            {isStreaming && (streamingText ? (
              <div className="flex justify-start items-start gap-3 animate-fade-in">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="material-symbols-outlined text-white text-[16px]">psychology</span>
                </div>
                <div className="flex-1 max-w-[85%]">
                  <div className="bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a] px-6 py-5 rounded-2xl rounded-tl-sm shadow-sm relative overflow-hidden">
                    <div className="absolute left-0 top-0 w-1 h-full bg-secondary/60 rounded-l-2xl animate-pulse" />
                    <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                      <FormattedContent text={streamingText} />
                      <span className="inline-block w-0.5 h-4 bg-secondary ml-0.5 animate-pulse align-middle" />
                    </div>
                  </div>
                  <div className="flex items-center mt-2 ml-1">
                    <button
                      onClick={handleStop}
                      className="flex items-center gap-1.5 text-xs text-slate-400 dark:text-slate-500 hover:text-error p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-[#21253a] transition-colors"
                    >
                      <span className="material-symbols-outlined text-[14px]">stop_circle</span>
                      Stop generating
                    </button>
                  </div>
                </div>
              </div>
            ) : <TypingIndicator />)}

            <div ref={bottomRef} />
          </div>
        </div>
      )}

      {/* ── Input Bar ── */}
      <div className="fixed bottom-0 left-64 right-0 p-6 bg-gradient-to-t from-surface dark:from-[#0f1117] via-surface/95 dark:via-[#0f1117]/95 to-transparent pointer-events-none z-10">
        <div className="max-w-3xl mx-auto w-full pointer-events-auto">
          <div className="relative bg-white dark:bg-[#1a1d27] border border-slate-200 dark:border-[#2a2f4a]
            rounded-2xl shadow-xl shadow-slate-200/60 dark:shadow-black/40 p-2 flex items-end gap-2
            focus-within:border-secondary focus-within:shadow-secondary/10 transition-all">
            <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors self-end mb-0.5">
              <span className="material-symbols-outlined text-[20px]">attach_file</span>
            </button>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => {
                setInput(e.target.value);
                e.target.style.height = 'auto';
                e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
              }}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about any SOP..."
              rows={1}
              className="flex-1 bg-transparent border-none focus:ring-0 py-2.5 text-sm resize-none outline-none scrollbar-hide
                text-slate-800 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500"
              style={{ minHeight: '40px', maxHeight: '200px' }}
            />
            <div className="flex items-center gap-1.5 self-end mb-0.5">
              <button className="p-2.5 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
                <span className="material-symbols-outlined text-[20px]">mic</span>
              </button>
              {isStreaming ? (
                <button
                  onClick={handleStop}
                  className="bg-error text-white p-2.5 rounded-xl hover:opacity-90 transition-all hover-lift"
                  title="Stop generating"
                >
                  <span className="material-symbols-outlined text-[20px]">stop</span>
                </button>
              ) : (
                <button
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  className="bg-primary-container text-white p-2.5 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed hover-lift"
                >
                  <span className="material-symbols-outlined text-[20px]">send</span>
                </button>
              )}
            </div>
          </div>
          <div className="flex justify-center gap-6 mt-3">
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">history</span>
              Syncing with Knowledge Base
            </span>
            <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[13px]">shield</span>
              Enterprise Grade Privacy
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
