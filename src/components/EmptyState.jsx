import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { suggestedQueries } from '../data/mockData';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

export default function EmptyState({ onSuggestedQuery }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', height: '100%',
      padding: '40px 24px', maxWidth: 780, margin: '0 auto',
    }}>

      {/* Logo orb */}
      <motion.div
        className="float-anim"
        style={{
          width: 72, height: 72, borderRadius: 22,
          background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: 28,
          boxShadow: '0 8px 32px rgba(0,229,255,0.38), 0 0 0 8px rgba(0,229,255,0.1)',
        }}
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        transition={{ type: 'spring', stiffness: 320, damping: 22, delay: 0.05 }}
      >
        <Zap size={30} color="#fff" />
      </motion.div>

      {/* Heading */}
      <motion.div
        style={{ textAlign: 'center', marginBottom: 36 }}
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        <h1 style={{
          fontSize: 30, fontWeight: 800,
          color: 'var(--color-text)',
          letterSpacing: '-0.025em', marginBottom: 12, lineHeight: 1.2,
        }}>
          What do you want to know?
        </h1>
        <p style={{
          fontSize: 15.5, color: 'var(--color-text-muted)',
          maxWidth: 440, lineHeight: 1.65, margin: '0 auto',
        }}>
          Ask anything about your company SOPs, policies, and procedures.
          Get accurate answers with source citations.
        </p>
      </motion.div>

      {/* Suggestion cards */}
      <motion.div
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 10, width: '100%', maxWidth: 680, marginBottom: 32,
        }}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
      >
        {suggestedQueries.map((q, idx) => (
          <motion.button
            key={idx}
            onClick={() => onSuggestedQuery(q.title)}
            onMouseEnter={() => setHovered(idx)}
            onMouseLeave={() => setHovered(null)}
            whileTap={{ scale: 0.98 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              gap: 8, padding: '14px 14px 12px', borderRadius: 14,
              background: hovered === idx ? 'var(--bg-input)' : 'var(--bg-card)',
              border: `1px solid ${hovered === idx ? 'rgba(0,229,255,0.45)' : 'var(--color-border)'}`,
              cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.15s',
              boxShadow: hovered === idx ? '0 4px 14px rgba(0,229,255,0.12)' : 'none',
              transform: hovered === idx ? 'translateY(-2px)' : 'none',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
              <span style={{ fontSize: 22, lineHeight: 1 }}>{q.icon}</span>
              {hovered === idx && <ArrowRight size={14} color="var(--color-primary)" />}
            </div>
            <div>
              <p style={{
                fontSize: 13, fontWeight: 600,
                color: 'var(--color-text)', lineHeight: 1.35, marginBottom: 3,
              }}>
                {q.title}
              </p>
              <p style={{ fontSize: 11.5, color: 'var(--color-text-muted)', lineHeight: 1.4 }}>
                {q.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Footer */}
      <motion.div
        style={{ display: 'flex', alignItems: 'center', gap: 8 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
      >
        <div style={{
          width: 6, height: 6, borderRadius: '50%',
          background: '#22c55e',
          boxShadow: '0 0 6px rgba(34,197,94,0.7)',
        }} />
        <p style={{ fontSize: 12, color: 'var(--color-text-faint)' }}>
          Powered by OpsMind AI · Enterprise SOP Intelligence · GPT-4o
        </p>
      </motion.div>
    </div>
  );
}
