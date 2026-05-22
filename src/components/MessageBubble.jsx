import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check, Sparkles, Zap } from 'lucide-react';

// ── Markdown renderer ─────────────────────────────────────────────
function renderMarkdown(text) {
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  const lines = html.split('\n');
  const result = [];
  let inList = false;
  let inOl = false;
  let olIdx = 0;

  for (let i = 0; i < lines.length; i++) {
    const raw  = lines[i];
    const line = raw.trim();

    if (!line) {
      if (inList) { result.push('</ul>'); inList = false; }
      if (inOl)   { result.push('</ol>'); inOl = false; olIdx = 0; }
      result.push('<div style="height:0.5rem"></div>');
      continue;
    }

    // Numbered list
    const numMatch = line.match(/^(\d+)\.\s+(.*)/);
    if (numMatch) {
      if (inList) { result.push('</ul>'); inList = false; }
      if (!inOl) { result.push('<ol style="padding-left:1.4rem;margin:0.4rem 0">'); inOl = true; }
      result.push(`<li style="margin:0.22rem 0">${numMatch[2]}</li>`);
      continue;
    }

    // Bullet list
    if (/^[-•*]/.test(line)) {
      if (inOl) { result.push('</ol>'); inOl = false; }
      if (!inList) { result.push('<ul style="padding-left:1.4rem;margin:0.4rem 0">'); inList = true; }
      result.push(`<li style="margin:0.22rem 0">${line.replace(/^[-•*]\s*/, '')}</li>`);
      continue;
    }

    // Table row (simple detection)
    if (line.startsWith('|')) {
      if (inList) { result.push('</ul>'); inList = false; }
      if (inOl)   { result.push('</ol>'); inOl = false; }
      if (line.match(/^[|\s:-]+$/)) continue; // skip separator rows
      const cells = line.split('|').filter(c => c.trim()).map(c => `<td style="padding:4px 10px;border:1px solid var(--color-border)">${c.trim()}</td>`);
      result.push(`<tr>${cells.join('')}</tr>`);
      continue;
    }

    if (inList) { result.push('</ul>'); inList = false; }
    if (inOl)   { result.push('</ol>'); inOl = false; }
    result.push(`<p style="margin:0">${line}</p>`);
  }
  if (inList) result.push('</ul>');
  if (inOl)   result.push('</ol>');
  return result.join('');
}

export default function MessageBubble({ message, onCitationClick }) {
  const isUser = message.role === 'user';
  const [copied, setCopied] = useState(false);
  const [liked,  setLiked]  = useState(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ── User bubble ───────────────────────────────────────────────
  if (isUser) {
    return (
      <motion.div
        style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 0' }}
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      >
        <div style={{ maxWidth: '78%', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 5 }}>
          <div style={{
            background: 'linear-gradient(135deg, #4f46e5, #6d28d9)',
            color: '#fff',
            borderRadius: '18px 4px 18px 18px',
            padding: '12px 17px',
            fontSize: 14.5,
            lineHeight: 1.7,
            boxShadow: '0 3px 14px rgba(0,229,255,0.35)',
          }}>
            {message.content}
          </div>
          <span style={{ fontSize: 10.5, color: 'var(--color-text-faint)' }}>{message.timestamp}</span>
        </div>
      </motion.div>
    );
  }

  // ── AI bubble ─────────────────────────────────────────────────
  return (
    <motion.div
      style={{ display: 'flex', gap: 13, padding: '12px 0', alignItems: 'flex-start' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Avatar */}
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <div style={{
          width: 34, height: 34, borderRadius: 10,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 2px 10px rgba(0,229,255,0.35)',
        }}>
          <Zap size={14} color="#fff" />
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* Name */}
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-text)', marginBottom: 9, lineHeight: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
          OpsMind AI
          <span style={{
            fontSize: 10, padding: '1px 6px', borderRadius: 999,
            background: 'rgba(0,229,255,0.1)', color: 'var(--color-primary)',
            border: '1px solid rgba(0,229,255,0.2)', fontWeight: 500,
          }}>GPT-4o</span>
        </div>

        {/* Text */}
        <div
          className="ai-prose"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />

        {/* Citations */}
        {message.citations && message.citations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 14 }}
          >
            {message.citations.map((citation, idx) => (
              <button
                key={idx}
                className="citation-chip"
                onClick={() => onCitationClick && onCitationClick(message.sources)}
              >
                <FileText size={11} />
                {citation.label}
              </button>
            ))}
          </motion.div>
        )}

        {/* Action bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, marginTop: 10 }}>
          <span style={{ fontSize: 10.5, color: 'var(--color-text-faint)', marginRight: 4 }}>
            {message.timestamp}
          </span>

          <ActionBtn
            onClick={handleCopy}
            title={copied ? 'Copied!' : 'Copy'}
            active={copied}
            activeColor="#22c55e"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.span key="check" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, fontWeight: 500 }}>
                  <Check size={12} /> Copied
                </motion.span>
              ) : (
                <motion.span key="copy" initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0.6 }}>
                  <Copy size={13} />
                </motion.span>
              )}
            </AnimatePresence>
          </ActionBtn>

          <ActionBtn
            onClick={() => setLiked(liked === true ? null : true)}
            title="Good response"
            active={liked === true}
            activeColor="var(--color-primary)"
          >
            <ThumbsUp size={13} />
          </ActionBtn>

          <ActionBtn
            onClick={() => setLiked(liked === false ? null : false)}
            title="Poor response"
            active={liked === false}
            activeColor="#ef4444"
          >
            <ThumbsDown size={13} />
          </ActionBtn>

          <ActionBtn title="Regenerate">
            <RotateCcw size={13} />
          </ActionBtn>
        </div>
      </div>
    </motion.div>
  );
}

function ActionBtn({ children, onClick, title, active, activeColor }) {
  return (
    <motion.button
      onClick={onClick}
      title={title}
      whileHover={{ scale: 1.08, background: 'var(--color-border)' }}
      whileTap={{ scale: 0.93 }}
      style={{
        padding: '4px 7px', borderRadius: 7, border: 'none',
        background: 'transparent', cursor: 'pointer',
        color: active ? (activeColor || 'var(--color-primary)') : 'var(--color-text-faint)',
        transition: 'color 0.15s, background 0.15s',
        display: 'flex', alignItems: 'center', gap: 4,
      }}
    >
      {children}
    </motion.button>
  );
}
