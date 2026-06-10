'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import dynamic from 'next/dynamic';
import styles from './hero.module.css';

const Spline = dynamic(() => import('@splinetool/react-spline'), {
  ssr: false,
});

const DISCIPLINES = ['INGENIERÍA', 'ARTE', 'TECNOLOGÍA'];

export default function Hero() {
  const { scrollY } = useScroll();
  const y       = useTransform(scrollY, [0, 700], [0, 180]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);
  const scale   = useTransform(scrollY, [0, 600], [1, 0.95]);

  // Cycle highlighted discipline word
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActiveIdx(prev => (prev + 1) % DISCIPLINES.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <section className={styles.heroSection}>

      {/* ── SPLINE background ── */}
      <div 
        className={styles.splineBackground}
        onWheelCapture={(e) => e.stopPropagation()}
      >
        <Spline scene="https://prod.spline.design/vCmxFvYJlpB4geCS/scene.splinecode" />
      </div>

      {/* ── Radial overlay ── */}
      <div className={styles.overlay} />

      {/* ── Centered content ── */}
      <motion.div className={styles.center} style={{ y, opacity, scale }}>

        {/* Big "117" */}
        <h1 className={styles.title}>117</h1>

        {/* Dynamic disciplines */}
        <div className={styles.disciplines}>
          {DISCIPLINES.map((word, i) => (
            <span key={word} className={styles.disciplineWrapper}>
              <motion.span
                className={styles.disciplineWord}
                animate={
                  activeIdx === i
                    ? { color: '#ffffff', textShadow: '0 0 24px rgba(255,255,255,0.9), 0 2px 10px rgba(0,0,0,0.9)', opacity: 1, letterSpacing: '0.32em' }
                    : { color: 'rgba(255,255,255,0.75)', textShadow: '0 2px 8px rgba(0,0,0,0.8)', opacity: 0.8, letterSpacing: '0.26em' }
                }
                transition={{ duration: 0.6, ease: 'easeInOut' }}
              >
                {word}
              </motion.span>
              {i < DISCIPLINES.length - 1 && (
                <span className={styles.dotSep}>·</span>
              )}
            </span>
          ))}
        </div>

        {/* Welcome label */}
        <p className={styles.welcomeLabel}>BIENVENIDO A 117</p>

        {/* Impact tagline — display treatment */}
        <h2 className={styles.tagline}>
          Del pensamiento<br />a la realidad.
        </h2>

      </motion.div>

      {/* ── Bottom bar ── */}
      <div className={styles.bottomBar}>
        <span className={styles.since}>BUILDING SINCE 2025</span>
        <span className={styles.scroll}>SCROLL TO EXPLORE →</span>
      </div>

    </section>
  );
}
