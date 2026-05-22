import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      style={{ display: 'flex', gap: 13, padding: '10px 0', alignItems: 'flex-start' }}
    >
      {/* AI avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: 10, flexShrink: 0,
        background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,229,255,0.4)',
      }}>
        <Zap size={14} color="#fff" />
      </div>

      <div style={{ paddingTop: 5 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--color-text)', marginBottom: 9, lineHeight: 1 }}>
          OpsMind AI
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 5,
          padding: '11px 15px', borderRadius: 14,
          background: 'var(--bg-input)',
          border: '1px solid var(--color-border)',
        }}>
          {[0, 1, 2].map(i => (
            <span
              key={i}
              className="typing-dot"
              style={{
                width: 7, height: 7, borderRadius: '50%',
                background: 'var(--color-primary)',
                display: 'block', flexShrink: 0,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
