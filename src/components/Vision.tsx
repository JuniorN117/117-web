'use client';

import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './vision.module.css';

const visionPoints = [
  'Construir tecnología útil.',
  'Crear arte que inspire.',
  'Compartir conocimiento.',
  'Vivir con propósito.',
  'Dejar una huella positiva.',
];

const transmissions = [
  { date: '01.06.2026', text: 'Atlas v1 sigue evolucionando.' },
  { date: '18.05.2026', text: 'Nueva composición terminada.' },
  { date: '07.04.2026', text: 'Capítulo 11 del libro iniciado.' },
  { date: '22.03.2026', text: 'Nuevas ideas en desarrollo.' },
];

export default function Vision() {
  return (
    <section className={`section ${styles.visionSection}`}>
      <div className={styles.grid}>
        {/* Left column: Vision */}
        <motion.div
          className={styles.left}
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.sectionLabel}>VISIÓN</div>
          <ul className={styles.visionList}>
            {visionPoints.map((point, i) => (
              <li key={i} className={styles.visionItem}>
                {point}
              </li>
            ))}
          </ul>
          <a href="#" className={styles.cta}>
            CONOCE LA VISIÓN
            <ArrowRight size={14} />
          </a>
        </motion.div>

        {/* Center: Monolith artwork */}
        <motion.div
          className={styles.center}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.monolithWrapper}>
            <Image
              src="/images/vision.png"
              alt="Visión 117 — El camino hacia la luz"
              fill
              sizes="(max-width: 1024px) 100vw, 33vw"
              style={{ objectFit: 'cover' }}
            />
            <div className={styles.monolithGlow} />
          </div>
        </motion.div>

        {/* Right column: Transmisiones */}
        <motion.div
          className={styles.right}
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className={styles.sectionLabel}>TRANSMISIONES</div>
          <p className={styles.transDesc}>
            Registro de lo que se construye día a día.
          </p>
          <div className={styles.timeline}>
            {transmissions.map((t, i) => (
              <div key={i} className={styles.timelineItem}>
                <span className={styles.date}>{t.date}</span>
                <span className={styles.timelineText}>{t.text}</span>
              </div>
            ))}
          </div>
          <a href="#" className={styles.viewAll}>
            VER TODAS LAS TRANSMISIONES <ArrowRight size={12} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
