import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, Zap, FileText, Shield, Search, CheckCircle2, ChevronRight, MessageSquare, BookOpen, BarChart3, Lock, Globe, Moon, Sun, Star, Users, TrendingUp, Bot, Play } from 'lucide-react';

const Motion = motion;

// ─────────────────────────────────────────────────────────────────
// Data
// ─────────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Bot,
    color: '#00e5ff',
    colorBg: 'rgba(0,229,255,0.1)',
    title: 'Context-Aware AI',
    desc: 'Answers drawn directly from your own documents — never hallucinated, always cited.',
  },
  {
    icon: FileText,
    color: '#34d399',
    colorBg: 'rgba(52,211,153,0.1)',
    title: 'Source Citations',
    desc: 'Every response links back to the exact page and paragraph in your knowledge base.',
  },
  {
    icon: Zap,
    color: '#f59e0b',
    colorBg: 'rgba(245,158,11,0.1)',
    title: 'Instant Answers',
    desc: 'Real-time streaming responses so your team gets answers in seconds, not minutes.',
  },
  {
    icon: Lock,
    color: '#cccccc',
    colorBg: 'rgba(244,114,182,0.1)',
    title: 'Enterprise Security',
    desc: 'SOC 2 compliant, data stays in your cloud — your SOPs never leave your environment.',
  },
  {
    icon: Search,
    color: '#60a5fa',
    colorBg: 'rgba(96,165,250,0.1)',
    title: 'Semantic Search',
    desc: "Find the right policy even when you don't know the exact words. AI understands intent.",
  },
  {
    icon: BarChart3,
    color: '#0077ff',
    colorBg: 'rgba(192,132,252,0.1)',
    title: 'Admin Analytics',
    desc: 'See which SOPs are queried most, where gaps exist, and what needs updating.',
  },
];

const HOW_IT_WORKS = [
  { step: '01', title: 'Upload your documents', desc: 'Drag and drop PDFs, Word docs, or SOPs. OpsMind AI indexes them in seconds.' },
  { step: '02', title: 'Ask in plain English', desc: 'Your employees type questions naturally. No training needed — just ask.' },
  { step: '03', title: 'Get cited answers', desc: 'AI returns precise answers with clickable links back to the source document.' },
];

const TESTIMONIALS = [
  {
    quote: 'We reduced onboarding time by 40%. New hires just ask OpsMind instead of hunting through SharePoint.',
    author: 'Sarah Chen',
    role: 'Head of People Operations',
    company: 'Nexus Retail',
    stars: 5,
  },
  {
    quote: 'Customer support quality improved dramatically. Agents get exact policy answers in under 3 seconds.',
    author: 'James Okafor',
    role: 'VP Customer Experience',
    company: 'Vertex Financial',
    stars: 5,
  },
  {
    quote: 'Finally, a tool that actually reads our SOPs instead of making things up. Game changer for compliance.',
    author: 'Priya Murthy',
    role: 'Compliance Director',
    company: 'MedCore Health',
    stars: 5,
  },
];

const STATS = [
  { value: '10x', label: 'faster answers vs manual search' },
  { value: '94%', label: 'accuracy on SOP queries' },
  { value: '40%', label: 'reduction in support tickets' },
  { value: '< 3s', label: 'average response time' },
];

// ─────────────────────────────────────────────────────────────────
// Animated particles background
// ─────────────────────────────────────────────────────────────────
function Particles() {
  const [particles] = useState(() => Array.from({ length: 28 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 6,
    dur: Math.random() * 8 + 10,
    opacity: Math.random() * 0.35 + 0.05,
  })));

  return (
    <svg
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden' }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {particles.map(p => (
        <circle
          key={p.id}
          cx={`${p.x}%`}
          cy={`${p.y}%`}
          r={p.size}
          fill="#00e5ff"
          opacity={p.opacity}
        >
          <animate
            attributeName="cy"
            values={`${p.y}%;${p.y - 12}%;${p.y}%`}
            dur={`${p.dur}s`}
            repeatCount="indefinite"
            begin={`${p.delay}s`}
            calcMode="spline"
            keySplines="0.4 0 0.6 1;0.4 0 0.6 1"
          />
          <animate
            attributeName="opacity"
            values={`${p.opacity};${p.opacity * 2};${p.opacity}`}
            dur={`${p.dur * 0.8}s`}
            repeatCount="indefinite"
            begin={`${p.delay}s`}
          />
        </circle>
      ))}
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// Typing animation for hero
// ─────────────────────────────────────────────────────────────────
const ROTATING_WORDS = ['SOPs', 'Policies', 'Procedures', 'Compliance', 'Guidelines'];

function RotatingWord() {
  const [index, setIndex] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % ROTATING_WORDS.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <AnimatePresence mode="wait">
      <Motion.span
        key={index}
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0,  filter: 'blur(0px)' }}
        exit={{   opacity: 0, y: -18, filter: 'blur(6px)' }}
        transition={{ duration: 0.38, ease: 'easeInOut' }}
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #00e5ff, #0077ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {ROTATING_WORDS[index]}
      </Motion.span>
    </AnimatePresence>
  );
}

// ─────────────────────────────────────────────────────────────────
// Scroll-reveal wrapper
// ─────────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0, y = 32 }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  return (
    <Motion.div
      ref={ref}
      initial={{ opacity: 0, y }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion.div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Navbar
// ─────────────────────────────────────────────────────────────────
function Navbar({ darkMode, onToggleDark, navigate, isCompact }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <Motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '0 5%',
        transition: 'all 0.25s',
        background: scrolled
          ? (darkMode ? 'rgba(23,23,23,0.88)' : 'rgba(255,255,255,0.88)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? `1px solid ${darkMode ? '#3f3f3f' : '#e5e7eb'}` : '1px solid transparent',
        boxShadow: scrolled ? '0 1px 24px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div style={{
        maxWidth: 1200, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 64,
        gap: 16,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 11,
            background: 'linear-gradient(135deg, #000000, #0077ff)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.4)',
          }}>
            <Zap size={17} color="#fff" />
          </div>
          <span style={{
            fontWeight: 800, fontSize: 17,
            color: darkMode ? '#ececec' : '#111827',
            letterSpacing: '-0.015em',
          }}>
            OpsMind <span style={{ color: '#00e5ff' }}>AI</span>
          </span>
        </div>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <button
            onClick={() => setMenuOpen(v => !v)}
            style={{
              width: 36, height: 36, borderRadius: 9, border: 'none',
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              cursor: 'pointer',
              display: isCompact ? 'flex' : 'none',
              alignItems: 'center', justifyContent: 'center',
              color: darkMode ? '#ececec' : '#111827',
            }}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? <ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} /> : <span style={{ fontSize: 20, fontWeight: 700 }}>≡</span>}
          </button>

          <div style={{
            display: isCompact ? (menuOpen ? 'flex' : 'none') : 'flex',
            position: isCompact ? 'absolute' : 'static',
            top: isCompact ? 72 : 'auto',
            left: isCompact ? '5%' : 'auto',
            right: isCompact ? '5%' : 'auto',
            flexDirection: isCompact ? 'column' : 'row',
            alignItems: isCompact ? 'stretch' : 'center',
            gap: isCompact ? 8 : 6,
            padding: isCompact ? 12 : 0,
            borderRadius: isCompact ? 16 : 0,
            background: isCompact ? (darkMode ? 'rgba(15,15,15,0.98)' : 'rgba(255,255,255,0.98)') : 'transparent',
            border: isCompact ? `1px solid ${darkMode ? '#2a2a2a' : '#e5e7eb'}` : 'none',
            boxShadow: isCompact ? '0 18px 40px rgba(0,0,0,0.18)' : 'none',
            backdropFilter: isCompact ? 'blur(14px)' : 'none',
            zIndex: 5,
          }}>
          {['Features', 'How it works', 'Testimonials'].map(link => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/ /g, '-')}`}
              style={{
                padding: isCompact ? '10px 14px' : '7px 14px', borderRadius: 8,
                fontSize: 13.5, fontWeight: 500,
                color: darkMode ? '#8e8ea0' : '#6b7280',
                textDecoration: 'none', transition: 'all 0.15s',
              }}
              onClick={() => setMenuOpen(false)}
              onMouseEnter={e => { e.currentTarget.style.color = darkMode ? '#ececec' : '#111827'; e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = darkMode ? '#8e8ea0' : '#6b7280'; e.currentTarget.style.background = 'transparent'; }}
            >
              {link}
            </a>
          ))}

          {/* Theme toggle */}
          <button
            onClick={onToggleDark}
            style={{
              width: 36, height: 36, borderRadius: 9, border: 'none',
              background: darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)',
              cursor: 'pointer', marginLeft: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: darkMode ? '#8e8ea0' : '#6b7280', transition: 'all 0.15s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)'; e.currentTarget.style.color = darkMode ? '#ececec' : '#111827'; }}
            onMouseLeave={e => { e.currentTarget.style.background = darkMode ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.05)'; e.currentTarget.style.color = darkMode ? '#8e8ea0' : '#6b7280'; }}
          >
            {darkMode ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* CTA */}
          <button
            onClick={() => {
              setMenuOpen(false);
              navigate('/chat', { state: { fresh: true } });
            }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 20px', borderRadius: 10, border: 'none',
              background: 'linear-gradient(135deg, #000000, #0077ff)',
              color: '#fff', fontSize: 13.5, fontWeight: 700,
              cursor: 'pointer', marginLeft: 6, transition: 'all 0.18s',
              boxShadow: '0 2px 10px rgba(0,0,0,0.35)',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 6px 18px rgba(0,0,0,0.4)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,0,0,0.35)'; }}
          >
            Launch App <ArrowRight size={14} />
          </button>
        </div>
        </div>
      </div>
    </Motion.nav>
  );
}

// ─────────────────────────────────────────────────────────────────
// Main landing page export
// ─────────────────────────────────────────────────────────────────
export default function LandingPage({ darkMode, onToggleDark }) {
  const navigate = useNavigate();
  const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile = viewportWidth <= 640;
  const isTablet = viewportWidth <= 960;
  const statsColumns = isMobile ? '1fr 1fr' : isTablet ? '1fr 1fr' : 'repeat(4,1fr)';
  const featureColumns = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)';
  const stepColumns = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)';
  const testimonialColumns = isMobile ? '1fr' : isTablet ? '1fr 1fr' : 'repeat(3,1fr)';

  const bg   = darkMode ? '#000000' : '#fafafa';
  const card = darkMode ? '#0a0a0a' : '#ffffff';
  const text = darkMode ? '#ececec' : '#111827';
  const muted= darkMode ? '#8e8ea0' : '#6b7280';
  const bdr  = darkMode ? '#1a1a1a' : '#e5e7eb';

  return (
    <Motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      style={{ background: bg, color: text, minHeight: '100vh', fontFamily: 'Inter, system-ui, sans-serif', overflowX: 'hidden' }}
    >
      <Navbar darkMode={darkMode} onToggleDark={onToggleDark} navigate={navigate} isCompact={viewportWidth <= 820} />

      {/* ═══════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════ */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? '112px 5% 64px' : '120px 5% 80px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Background glow blobs */}
        <div style={{
          position: 'absolute', top: '10%', left: '15%',
          width: isMobile ? 260 : 500, height: isMobile ? 260 : 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,229,255,0.18) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '5%', right: '10%',
          width: isMobile ? 220 : 400, height: isMobile ? 220 : 400, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)',
          filter: 'blur(60px)', pointerEvents: 'none',
        }} />
        <Particles />

        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {/* Badge */}
          <Motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 7, marginBottom: 28, maxWidth: '100%' }}
          >
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid rgba(0,229,255,0.35)',
              background: 'rgba(0,229,255,0.1)',
              fontSize: 12.5, fontWeight: 600, color: '#00e5ff',
              flexWrap: 'wrap', justifyContent: 'center',
            }}>
              <Zap size={13} />
              Enterprise SOP Intelligence — Powered by GPT-4o
            </span>
          </Motion.div>

          {/* Headline */}
          <Motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.65, ease: [0.22,1,0.36,1] }}
            style={{
              fontSize: isMobile ? 'clamp(34px, 11vw, 48px)' : 'clamp(42px, 7vw, 80px)',
              fontWeight: 900,
              lineHeight: isMobile ? 1.12 : 1.08,
              letterSpacing: '-0.035em',
              marginBottom: 26,
              color: text,
            }}
          >
            Your AI expert for<br />
            company{' '}
            <RotatingWord />
          </Motion.h1>

          {/* Sub-headline */}
          <Motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
            style={{ fontSize: isMobile ? 16 : 18, color: muted, lineHeight: 1.7, maxWidth: 580, margin: '0 auto 44px' }}
          >
            Ask any question about your company's processes and get instant, cited answers.
            OpsMind reads your SOPs so your team doesn't have to hunt for answers.
          </Motion.p>

          {/* CTAs */}
          <Motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48 }}
            style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', width: '100%' }}
          >
            <button
              onClick={() => navigate('/chat', { state: { fresh: true } })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: isMobile ? '14px 20px' : '14px 32px', borderRadius: 14, border: 'none',
                background: 'linear-gradient(135deg, #000000, #0077ff)',
                color: '#fff', fontSize: 15, fontWeight: 700,
                cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 20px rgba(0,229,255,0.45)',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,229,255,0.5)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,229,255,0.45)'; }}
            >
              <Zap size={16} />
              Start for Free
              <ArrowRight size={15} />
            </button>

            <button
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: isMobile ? '14px 20px' : '14px 28px', borderRadius: 14,
                border: `1px solid ${bdr}`,
                background: card, color: muted,
                fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = text; e.currentTarget.style.borderColor = '#00e5ff'; }}
              onMouseLeave={e => { e.currentTarget.style.color = muted; e.currentTarget.style.borderColor = bdr; }}
            >
              <Play size={14} />
              See how it works
            </button>
          </Motion.div>

          {/* Pull-quote */}
          <Motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            style={{ marginTop: 36, maxWidth: 540, margin: '36px auto 0' }}
          >
            <div style={{
              padding: isMobile ? '16px' : '18px 24px', borderRadius: 14,
              background: darkMode ? 'rgba(0,229,255,0.08)' : 'rgba(0,229,255,0.06)',
              border: `1px solid ${darkMode ? 'rgba(0,229,255,0.2)' : 'rgba(0,229,255,0.15)'}`,
              display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 36, lineHeight: 1, color: '#00e5ff', fontFamily: 'Georgia, serif', flexShrink: 0, marginTop: -4 }}>&ldquo;</span>
              <div>
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.7, fontStyle: 'italic', marginBottom: 8 }}>
                  OpsMind cut our policy-lookup time from 20 minutes to under 30 seconds.
                  It's the single biggest productivity win we've shipped this year.
                </p>
                <p style={{ fontSize: 12.5, fontWeight: 700, color: text }}>Ananya Patel</p>
                <p style={{ fontSize: 11.5, color: 'var(--color-text-faint, #9ca3af)' }}>VP Operations, Vertex Financial</p>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* App preview card */}
        <Motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.8, ease: [0.22,1,0.36,1] }}
          style={{ maxWidth: 900, width: '100%', margin: '72px auto 0', position: 'relative', zIndex: 1 }}
        >
          {/* Glow behind card */}
          <div style={{
            position: 'absolute', inset: -2, borderRadius: 24,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.4), rgba(124,58,237,0.3), rgba(236,72,153,0.2))',
            filter: 'blur(20px)', zIndex: -1,
          }} />

          {/* Card */}
          <div style={{
            borderRadius: 20, overflow: 'hidden',
            border: `1px solid ${darkMode ? 'rgba(0,229,255,0.25)' : 'rgba(0,229,255,0.15)'}`,
            boxShadow: darkMode ? '0 40px 80px rgba(0,0,0,0.7)' : '0 40px 80px rgba(0,0,0,0.12)',
          }}>
            {/* Fake browser chrome */}
            <div style={{
              background: darkMode ? '#0a0a0a' : '#f3f4f6',
              borderBottom: `1px solid ${bdr}`,
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <div style={{ display: 'flex', gap: 6 }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => (
                  <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
                ))}
              </div>
              <div style={{
                flex: 1, background: darkMode ? '#1a1a1a' : '#e5e7eb',
                borderRadius: 6, padding: '4px 12px', fontSize: 11.5,
                color: muted, textAlign: 'center',
              }}>
                app.opsmind.ai
              </div>
            </div>

            {/* App preview body */}
            <div style={{ display: 'flex', height: 400, background: darkMode ? '#050505' : '#fff' }}>
              {/* Sidebar preview */}
              <div style={{ width: 200, background: darkMode ? '#0a0a0a' : '#f9fafb', borderRight: `1px solid ${bdr}`, padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #000000, #0077ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Zap size={11} color="#fff" />
                  </div>
                  <span style={{ fontSize: 11.5, fontWeight: 700, color: text }}>OpsMind AI</span>
                </div>
                {['Refund Policy Workflow', 'Employee Onboarding', 'IT Security SOP', 'Data Retention'].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 7,
                    background: i === 0 ? 'rgba(0,229,255,0.12)' : 'transparent',
                    borderLeft: i === 0 ? '2px solid #00e5ff' : '2px solid transparent',
                  }}>
                    <MessageSquare size={10} color={i === 0 ? '#00e5ff' : muted} />
                    <span style={{ fontSize: 10.5, color: i === 0 ? '#00e5ff' : muted, fontWeight: i === 0 ? 600 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item}</span>
                  </div>
                ))}
              </div>

              {/* Chat preview */}
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: 20, gap: 14, overflow: 'hidden' }}>
                {/* User message */}
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #000000, #0077ff)',
                    color: '#fff', padding: '9px 14px', borderRadius: '14px 4px 14px 14px',
                    fontSize: 12.5, maxWidth: '70%', lineHeight: 1.5,
                  }}>
                    How do I process a refund over ₹500?
                  </div>
                </div>

                {/* AI response */}
                <div style={{ display: 'flex', gap: 10 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 9, background: 'linear-gradient(135deg, #000000, #0077ff)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#fff', fontSize: 8, fontWeight: 700 }}>AI</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 11, fontWeight: 700, color: text, marginBottom: 6 }}>OpsMind AI</p>
                    <p style={{ fontSize: 11.5, color: muted, lineHeight: 1.65, marginBottom: 8 }}>
                      For refunds over ₹500, you need to escalate to Finance via the internal portal. Here's the process: <strong style={{ color: text }}>1.</strong> Log into CRM and locate order. <strong style={{ color: text }}>2.</strong> Select "Initiate Refund". <strong style={{ color: text }}>3.</strong> For amounts over ₹500, select "Escalate to Finance"...
                    </p>
                    {/* Citation chips */}
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {['RefundPolicy.pdf • p.12', 'FinanceOps.pdf • p.7'].map(c => (
                        <span key={c} style={{
                          display: 'inline-flex', alignItems: 'center', gap: 4,
                          padding: '2px 9px', borderRadius: 999,
                          background: 'rgba(0,229,255,0.1)', color: '#00e5ff',
                          fontSize: 10, fontWeight: 600,
                          border: '1px solid rgba(0,229,255,0.2)',
                        }}>
                          <FileText size={9} />
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          STATS
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: '70px 5%', borderTop: `1px solid ${bdr}`, borderBottom: `1px solid ${bdr}` }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: statsColumns, gap: isMobile ? 18 : 24 }}>
          {STATS.map((s, i) => (
            <Reveal key={i} delay={i * 0.08}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900,
                  background: 'linear-gradient(135deg, #00e5ff, #0077ff)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  letterSpacing: '-0.03em', lineHeight: 1.1, marginBottom: 8,
                }}>
                  {s.value}
                </div>
                <p style={{ fontSize: 13.5, color: muted, lineHeight: 1.4 }}>{s.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURES
      ═══════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: isMobile ? '80px 5%' : '100px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 999, marginBottom: 16,
                background: 'rgba(0,229,255,0.1)', border: '1px solid rgba(0,229,255,0.25)',
                fontSize: 12, fontWeight: 700, color: '#00e5ff', textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                <Zap size={12} /> Features
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.025em', color: text, marginBottom: 16 }}>
                Everything your team needs
              </h2>
              <p style={{ fontSize: 17, color: muted, maxWidth: 540, margin: '0 auto' }}>
                From instant SOP lookup to admin analytics, OpsMind makes your entire knowledge base queryable.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: featureColumns, gap: 20 }}>
            {FEATURES.map((f, i) => {
              const Icon = f.icon;
              return (
                <Reveal key={i} delay={i * 0.07}>
                  <div
                    style={{
                      padding: '28px 26px', borderRadius: 18,
                      background: card, border: `1px solid ${bdr}`,
                      transition: 'all 0.22s', cursor: 'default',
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.transform = 'translateY(-4px)';
                      e.currentTarget.style.boxShadow = darkMode
                        ? '0 12px 40px rgba(0,0,0,0.4)'
                        : '0 12px 40px rgba(0,0,0,0.1)';
                      e.currentTarget.style.borderColor = f.color + '55';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.transform = 'none';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.borderColor = bdr;
                    }}
                  >
                    <div style={{
                      width: 48, height: 48, borderRadius: 14, marginBottom: 18,
                      background: f.colorBg, border: `1px solid ${f.color}33`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={22} color={f.color} />
                    </div>
                    <h3 style={{ fontSize: 16, fontWeight: 700, color: text, marginBottom: 10, letterSpacing: '-0.01em' }}>
                      {f.title}
                    </h3>
                    <p style={{ fontSize: 14, color: muted, lineHeight: 1.7 }}>{f.desc}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS
      ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ padding: isMobile ? '80px 5%' : '100px 5%', background: darkMode ? '#101010' : '#f5f5f5' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 72 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 999, marginBottom: 16,
                background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)',
                fontSize: 12, fontWeight: 700, color: '#34d399', textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                <CheckCircle2 size={12} /> How it works
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.025em', color: text, marginBottom: 16 }}>
                Up and running in minutes
              </h2>
              <p style={{ fontSize: 17, color: muted, maxWidth: 480, margin: '0 auto' }}>
                No LLM expertise needed. Just upload, ask, and get answers.
              </p>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: stepColumns, gap: 28, position: 'relative' }}>
            {/* Connector line */}
            <div style={{
              position: 'absolute', top: 56, left: '17%', right: '17%', height: 2,
              background: `linear-gradient(90deg, transparent, #00e5ff, transparent)`,
              opacity: 0.4,
              display: isTablet ? 'none' : 'block',
            }} />

            {HOW_IT_WORKS.map((step, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{ textAlign: 'center', padding: '0 10px' }}>
                  <div style={{
                    width: 64, height: 64, borderRadius: '50%', margin: '0 auto 24px',
                    background: 'linear-gradient(135deg, #000000, #0077ff)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16, fontWeight: 800, color: '#fff',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                    position: 'relative',
                  }}>
                    {step.step}
                  </div>
                  <h3 style={{ fontSize: 17, fontWeight: 700, color: text, marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ fontSize: 14.5, color: muted, lineHeight: 1.7 }}>{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════════════════════ */}
      <section id="testimonials" style={{ padding: isMobile ? '80px 5%' : '100px 5%' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <Reveal>
            <div style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 999, marginBottom: 16,
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)',
                fontSize: 12, fontWeight: 700, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.1em',
              }}>
                <Star size={12} /> Testimonials
              </div>
              <h2 style={{ fontSize: 'clamp(30px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-0.025em', color: text, marginBottom: 16 }}>
                Loved by enterprise teams
              </h2>
            </div>
          </Reveal>

          <div style={{ display: 'grid', gridTemplateColumns: testimonialColumns, gap: 20 }}>
            {TESTIMONIALS.map((t, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div style={{
                  padding: '28px 26px', borderRadius: 18,
                  background: card, border: `1px solid ${bdr}`,
                  display: 'flex', flexDirection: 'column', gap: 20,
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = darkMode ? '0 10px 30px rgba(0,0,0,0.4)' : '0 10px 30px rgba(0,0,0,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  {/* Stars */}
                  <div style={{ display: 'flex', gap: 3 }}>
                    {[...Array(t.stars)].map((_, j) => (
                      <Star key={j} size={14} color="#f59e0b" fill="#f59e0b" />
                    ))}
                  </div>
                  {/* Quote */}
                  <p style={{ fontSize: 14.5, color: text, lineHeight: 1.75, fontStyle: 'italic', flex: 1 }}>
                    "{t.quote}"
                  </p>
                  {/* Author */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%',
                      background: `hsl(${(t.author.charCodeAt(0) * 37) % 360}, 70%, 55%)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#fff', fontSize: 13, fontWeight: 700, flexShrink: 0,
                    }}>
                      {t.author.split(' ').map(w => w[0]).join('')}
                    </div>
                    <div>
                      <p style={{ fontSize: 13.5, fontWeight: 700, color: text }}>{t.author}</p>
                      <p style={{ fontSize: 12, color: muted }}>{t.role}, {t.company}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section style={{ padding: isMobile ? '64px 5% 80px' : '80px 5% 100px' }}>
        <Reveal>
          <div style={{
            maxWidth: 840, margin: '0 auto', textAlign: 'center',
            padding: isMobile ? '44px 20px' : '70px 48px', borderRadius: 28,
            background: 'linear-gradient(135deg, #1e1b4b, #2e1065, #1e1b4b)',
            border: '1px solid rgba(0,229,255,0.3)',
            position: 'relative', overflow: 'hidden',
          }}>
            {/* Inner glow */}
            <div style={{
              position: 'absolute', top: '-40%', left: '30%',
              width: 400, height: 400, borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(0,229,255,0.2) 0%, transparent 70%)',
              pointerEvents: 'none',
            }} />

            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, #000000, #0077ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              boxShadow: '0 0 40px rgba(0,229,255,0.5)',
            }}>
              <Zap size={28} color="#fff" />
            </div>

            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, color: '#ffffff', letterSpacing: '-0.025em', marginBottom: 16 }}>
              Ready to transform how your<br />team finds answers?
            </h2>
            <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.65)', marginBottom: 40, lineHeight: 1.65 }}>
              Join 1,200+ enterprise teams using OpsMind AI to turn their SOP chaos into instant clarity.
            </p>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
              onClick={() => navigate('/chat', { state: { fresh: true } })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: isMobile ? '14px 20px' : '14px 36px', borderRadius: 14, border: 'none',
                background: '#fff', color: '#000000',
                fontSize: 15, fontWeight: 800,
                cursor: 'pointer', transition: 'all 0.18s',
                boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.3)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.25)'; }}
              >
                <Zap size={16} />
                Launch App — It's Free
              </button>
              <button
                onClick={() => navigate('/admin', { state: { fresh: true } })}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: isMobile ? '14px 20px' : '14px 28px', borderRadius: 14,
                border: '1px solid rgba(255,255,255,0.25)',
                background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.85)',
                fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s',
                width: isMobile ? '100%' : 'auto',
                justifyContent: 'center',
              }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
              >
                <Shield size={15} />
                View Admin Panel
              </button>
            </div>

            <p style={{ marginTop: 24, fontSize: 12.5, color: 'rgba(255,255,255,0.4)' }}>
              No credit card required · SOC 2 compliant · SSO supported
            </p>
          </div>
        </Reveal>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════════════════════ */}
      <footer style={{
        borderTop: `1px solid ${bdr}`, padding: '32px 5%',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: isMobile ? 16 : 0,
        textAlign: isMobile ? 'center' : 'left',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: 'linear-gradient(135deg, #000000, #0077ff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Zap size={12} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 700, color: text }}>OpsMind AI</span>
        </div>
        <p style={{ fontSize: 12.5, color: muted }}>© 2026 OpsMind AI. Enterprise SOP Intelligence.</p>
        <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Privacy', 'Terms', 'Security'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12.5, color: muted, textDecoration: 'none', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = text}
              onMouseLeave={e => e.currentTarget.style.color = muted}
            >{l}</a>
          ))}
        </div>
      </footer>
    </Motion.div>
  );
}
