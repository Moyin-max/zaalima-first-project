import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, FileSearch, SortAsc, Zap } from 'lucide-react';
import SourceCard from './SourceCard';

export default function SourcePanel({ sources, isOpen, onClose, onViewSource }) {
  // Sort by relevance descending
  const sorted = [...sources].sort((a, b) => b.relevance - a.relevance);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.aside
          style={{
            flexShrink: 0, height: '100%',
            background: 'var(--bg-sidebar)',
            borderLeft: '1px solid var(--color-border)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 360, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 36 }}
        >
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '15px 16px',
            borderBottom: '1px solid var(--color-border)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 8, flexShrink: 0,
                background: 'var(--color-info-bg)',
                border: '1px solid var(--color-info-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <BookOpen size={15} color="var(--color-info)" />
              </div>
              <div>
                <div style={{ fontSize: 13.5, fontWeight: 650, color: 'var(--color-text)', lineHeight: 1.2 }}>
                  Source Documents
                </div>
                <div style={{ fontSize: 11, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  {sources.length} reference{sources.length !== 1 ? 's' : ''} found
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                width: 30, height: 30, borderRadius: 7, border: 'none',
                background: 'transparent', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--color-text-faint)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-text-faint)'; }}
            >
              <X size={15} />
            </button>
          </div>

          {/* Subheader */}
          <div style={{
            padding: '8px 16px',
            borderBottom: '1px solid var(--color-border)',
            background: 'rgba(0,229,255,0.04)',
            display: 'flex', alignItems: 'center', gap: 6,
            flexShrink: 0,
          }}>
            <FileSearch size={12} color="var(--color-info)" />
            <span style={{ fontSize: 11.5, color: 'var(--color-info)' }}>
              Ranked by semantic relevance
            </span>
            <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--color-text-faint)' }}>
              <SortAsc size={11} />
              Relevance ↓
            </div>
          </div>

          {/* Cards */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
            {sorted.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', height: '100%', textAlign: 'center',
                color: 'var(--color-text-faint)', padding: 24,
              }}>
                <BookOpen size={38} style={{ opacity: 0.2, marginBottom: 14 }} />
                <p style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--color-text-muted)', marginBottom: 6 }}>
                  No sources selected
                </p>
                <p style={{ fontSize: 12, lineHeight: 1.55 }}>
                  Click a citation chip in the chat to view the source documents here.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {sorted.map((source, idx) => (
                  <motion.div
                    key={source.id}
                    initial={{ opacity: 0, x: 18 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.06 }}
                  >
                    <SourceCard source={source} onView={onViewSource} />
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid var(--color-border)',
            flexShrink: 0,
          }}>
            <p style={{ fontSize: 11, color: 'var(--color-text-faint)', textAlign: 'center' }}>
              Click <strong>View</strong> on any card to open the document
            </p>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
