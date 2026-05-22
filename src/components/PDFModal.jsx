import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Highlighter, Download, ExternalLink, ChevronLeft, ChevronRight, Zap } from 'lucide-react';

export default function PDFModal({ source, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    // Lock scroll
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  if (!source) return null;

  return (
    <AnimatePresence>
      <motion.div
        ref={overlayRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed', inset: 0, zIndex: 200,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 20,
          background: 'var(--bg-overlay)',
          backdropFilter: 'blur(8px)',
        }}
        onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 24 }}
          animate={{ opacity: 1,  scale: 1,    y: 0 }}
          exit={{   opacity: 0, scale: 0.94, y: 24 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            width: '100%', maxWidth: 760, maxHeight: '90vh',
            background: 'var(--bg-chat)',
            borderRadius: 20,
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-xl)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          {/* ── Header ───────────────────────────────────── */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--bg-sidebar)',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 12,
                background: 'var(--color-info-bg)',
                border: '1px solid var(--color-info-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <FileText size={18} color="var(--color-primary)" />
              </div>
              <div>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: 'var(--color-text)', lineHeight: 1.3 }}>
                  {source.fileName}
                </h2>
                <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', marginTop: 2 }}>
                  Page {source.page} · Relevant excerpt highlighted
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <HeaderBtn title="Download"><Download size={15} /></HeaderBtn>
              <HeaderBtn title="Open in new tab"><ExternalLink size={15} /></HeaderBtn>
              <HeaderBtn title="Close (Esc)" onClick={onClose} danger>
                <X size={15} />
              </HeaderBtn>
            </div>
          </div>

          {/* ── PDF Viewer Body ───────────────────────────── */}
          <div style={{
            flex: 1, overflowY: 'auto',
            background: 'var(--bg-app)',
            padding: '20px',
          }}>
            {/* Page nav bar */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 16,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button style={{ ...navBtn }}><ChevronLeft size={14} /></button>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--color-text)' }}>
                  Page {source.page}
                </span>
                <button style={{ ...navBtn }}><ChevronRight size={14} /></button>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#d97706' }}>
                <Highlighter size={13} />
                <span style={{ fontWeight: 500 }}>Relevant text highlighted</span>
              </div>
            </div>

            {/* Mock PDF page */}
            <div style={{
              background: 'var(--bg-chat)',
              borderRadius: 14,
              border: '1px solid var(--color-border)',
              boxShadow: 'var(--shadow-md)',
              maxWidth: 680, margin: '0 auto',
              overflow: 'hidden',
            }}>
              {/* Page header deco */}
              <div style={{
                padding: '20px 28px 16px',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--bg-sidebar)',
              }}>
                <div style={{ width: 80, height: 4, borderRadius: 3, background: 'var(--color-border)', marginBottom: 10 }} />
                <div style={{ width: 200, height: 10, borderRadius: 4, background: 'var(--color-text)', opacity: 0.8, marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <div style={{ width: 60, height: 4, borderRadius: 3, background: 'var(--color-border)' }} />
                  <div style={{ width: 40, height: 4, borderRadius: 3, background: 'var(--color-border)' }} />
                </div>
              </div>

              {/* Main content */}
              <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {/* Filler lines before */}
                {[88, 72, 95, 65, 80].map((w, i) => (
                  <div key={i} style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', width: `${w}%` }} />
                ))}

                {/* Highlighted passage */}
                <div style={{
                  margin: '8px 0', padding: '14px 16px',
                  background: 'rgba(251,191,36,0.12)',
                  borderLeft: '4px solid #f59e0b',
                  borderRadius: '0 10px 10px 0',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <Highlighter size={13} color="#d97706" />
                    <span style={{ fontSize: 10.5, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                      Relevant Passage
                    </span>
                  </div>
                  <p style={{ fontSize: 13.5, color: 'var(--color-text)', lineHeight: 1.7, fontStyle: 'italic' }}>
                    "{source.snippet}"
                  </p>
                </div>

                {/* Filler lines after */}
                {[74, 85, 58, 90, 70, 62].map((w, i) => (
                  <div key={i} style={{ height: 6, borderRadius: 3, background: 'var(--color-border)', width: `${w}%` }} />
                ))}

                {/* Page number */}
                <div style={{ textAlign: 'center', paddingTop: 12 }}>
                  <span style={{ fontSize: 11.5, color: 'var(--color-text-faint)' }}>— {source.page} —</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ── Helper styles ────────────────────────────────────────────────
const navBtn = {
  width: 28, height: 28, borderRadius: 7, border: '1px solid var(--color-border)',
  background: 'var(--bg-card)', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  color: 'var(--color-text-muted)',
};

function HeaderBtn({ children, onClick, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 32, height: 32, borderRadius: 8, border: 'none',
        background: 'transparent', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'var(--color-text-muted)', transition: 'all 0.15s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? 'rgba(239,68,68,0.1)' : 'var(--color-border)';
        e.currentTarget.style.color      = danger ? '#ef4444'             : 'var(--color-text)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'transparent';
        e.currentTarget.style.color      = 'var(--color-text-muted)';
      }}
    >
      {children}
    </button>
  );
}
