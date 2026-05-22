import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, Mic, Square, Sparkles, Zap } from 'lucide-react';

export default function InputBox({ onSend, onStop, isStreaming }) {
  const textareaRef = useRef(null);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const MAX_CHARS = 4000;

  const autoResize = () => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 180) + 'px';
  };

  useEffect(() => { autoResize(); }, [value]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSend = () => {
    if (!value.trim() || isStreaming) return;
    onSend(value);
    setValue('');
  };

  const charCount = value.length;
  const charOver  = charCount > MAX_CHARS;
  const canSend   = value.trim() && !isStreaming && !charOver;

  return (
    <div style={{
      padding: '10px 20px 18px',
      background: 'var(--bg-chat)',
      flexShrink: 0,
    }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Input container */}
        <motion.div
          animate={{
            boxShadow: focused
              ? '0 0 0 2.5px rgba(0,229,255,0.35), 0 4px 24px rgba(0,229,255,0.12)'
              : '0 2px 8px rgba(0,0,0,0.06)',
            borderColor: focused ? 'rgba(0,229,255,0.55)' : 'var(--color-border)',
          }}
          transition={{ duration: 0.18 }}
          style={{
            display: 'flex', alignItems: 'flex-end', gap: 6,
            background: 'var(--bg-input)',
            border: '1.5px solid var(--color-border)',
            borderRadius: 18, padding: '10px 10px 10px 14px',
          }}
        >
          {/* Attach */}
          <IconBtn title="Attach file">
            <Paperclip size={16} />
          </IconBtn>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            id="chat-input"
            value={value}
            onChange={e => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Ask about SOPs, policies, or procedures…"
            rows={1}
            disabled={isStreaming}
            style={{
              flex: 1, resize: 'none', border: 'none', outline: 'none',
              background: 'transparent', fontSize: 14.5,
              color: 'var(--color-text)', lineHeight: 1.65,
              minHeight: 24, maxHeight: 180,
              fontFamily: 'inherit',
              opacity: isStreaming ? 0.55 : 1,
              transition: 'opacity 0.15s',
            }}
          />

          {/* Right side buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            {/* Char count */}
            <AnimatePresence>
              {charCount > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  style={{
                    fontSize: 10.5, fontWeight: 500,
                    color: charOver ? '#ef4444' : 'var(--color-text-faint)',
                    marginRight: 2,
                  }}
                >
                  {charCount}/{MAX_CHARS}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Mic */}
            <IconBtn title="Voice input">
              <Mic size={16} />
            </IconBtn>

            {/* Send / Stop button */}
            <AnimatePresence mode="wait">
              {isStreaming ? (
                <motion.button
                  key="stop"
                  onClick={onStop}
                  title="Stop generating"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.92 }}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', border: 'none',
                    cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'var(--color-text)', color: 'var(--bg-chat)',
                    flexShrink: 0,
                  }}
                >
                  <Square size={12} fill="currentColor" />
                </motion.button>
              ) : (
                <motion.button
                  key="send"
                  onClick={handleSend}
                  disabled={!canSend}
                  id="send-btn"
                  aria-label="Send message"
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  whileHover={canSend ? { scale: 1.08 } : {}}
                  whileTap={canSend ? { scale: 0.92 } : {}}
                  transition={{ duration: 0.15 }}
                  style={{
                    width: 34, height: 34, borderRadius: '50%', border: 'none',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: canSend
                      ? 'linear-gradient(135deg, #4f46e5, #7c3aed)'
                      : 'var(--color-border)',
                    color: canSend ? '#fff' : 'var(--color-text-faint)',
                    flexShrink: 0,
                    boxShadow: canSend ? '0 3px 12px rgba(0,229,255,0.45)' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                >
                  <Send size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Footer hint */}
        <p style={{
          fontSize: 11, color: 'var(--color-text-faint)',
          textAlign: 'center', marginTop: 9, lineHeight: 1.5,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        }}>
          <Zap size={10} style={{ opacity: 0.5 }} />
          <kbd style={{
            padding: '1px 5px', borderRadius: 4,
            border: '1px solid var(--color-border)',
            background: 'var(--bg-chat)', color: 'var(--color-text-muted)',
            fontSize: 10, fontFamily: 'monospace',
          }}>Enter</kbd>
          {' to send · '}
          <kbd style={{
            padding: '1px 5px', borderRadius: 4,
            border: '1px solid var(--color-border)',
            background: 'var(--bg-chat)', color: 'var(--color-text-muted)',
            fontSize: 10, fontFamily: 'monospace',
          }}>Shift+Enter</kbd>
          {' for new line'}
        </p>
      </div>
    </div>
  );
}

function IconBtn({ children, title, onClick }) {
  return (
    <motion.button
      title={title}
      onClick={onClick}
      whileHover={{ color: 'var(--color-text-muted)' }}
      whileTap={{ scale: 0.9 }}
      style={{
        padding: 7, borderRadius: 9, border: 'none',
        background: 'transparent', cursor: 'pointer',
        color: 'var(--color-text-faint)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, transition: 'color 0.15s',
      }}
    >
      {children}
    </motion.button>
  );
}
