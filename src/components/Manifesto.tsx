'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './manifesto.module.css';

const phrases = [
  { id: '01', text: "Todo comienza con una idea.", image: "/images/manifesto-01.png" },
  { id: '02', text: "Las ideas crean posibilidades.", image: "/images/manifesto-02.png" },
  { id: '03', text: "Las posibilidades crean proyectos.", image: "/images/manifesto-03.png" },
  { id: '04', text: "Los proyectos crean impacto.", image: "/images/manifesto-04.png" },
  { id: '05', text: "Bienvenido a 117.", image: "/images/manifesto-05.png" }
];

interface PhraseCardProps {
  phrase: { id: string; text: string; image: string };
  index: number;
  totalPhrases: number;
  scrollYProgress: any;
}

function PhraseCard({ phrase, index, totalPhrases, scrollYProgress }: PhraseCardProps) {
  const isLast = index === totalPhrases - 1;
  const start = index * 0.12;
  const end = start + 0.12;

  const opacity = useTransform(
    scrollYProgress,
    [start, start + 0.04, end, end + 0.06],
    [0, 1, 1, index === totalPhrases - 1 ? 1 : 0.85]
  );

  const y = useTransform(
    scrollYProgress,
    [start, start + 0.08],
    [60, 0]
  );

  const imageScale = useTransform(
    scrollYProgress,
    [start, start + 0.15],
    [1.15, 1]
  );

  return (
    <motion.div
      className={styles.phraseCard}
      style={{ opacity, y }}
    >
      {/* Number */}
      <div className={`${styles.id} ${isLast ? styles.idAccent : ''}`}>
        {phrase.id}
      </div>

      {/* Text */}
      <h2 className={`${styles.text} ${isLast ? styles.textAccent : ''}`}>
        {phrase.text}
      </h2>

      {/* Pulse icon for last card */}
      {isLast && <div className={styles.pulseIcon} />}

      {/* Separator line */}
      <div className={styles.separator} />

      {/* Cosmic Image */}
      <div className={styles.imageContainer}>
        <motion.div className={styles.imageWrapper} style={{ scale: imageScale }}>
          <Image
            src={phrase.image}
            alt={phrase.text}
            fill
            sizes="(max-width: 1024px) 100vw, 20vw"
            style={{ objectFit: 'cover' }}
            priority={index < 2}
          />
        </motion.div>
        {/* Dark gradient overlay from top to blend with card */}
        <div className={styles.imageOverlay} />
      </div>
    </motion.div>
  );
}

export default function Manifesto() {
  const containerRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <section className={styles.manifestoSection} ref={containerRef}>
      <div className={styles.stickyContainer}>
        <div className={styles.grid}>
          {phrases.map((phrase, index) => (
            <PhraseCard
              key={phrase.id}
              phrase={phrase}
              index={index}
              totalPhrases={phrases.length}
              scrollYProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
