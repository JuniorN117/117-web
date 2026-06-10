'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './philosophy.module.css';

const quotes = [
  { id: '01', text: 'La diferencia entre ser y no ser, es el hacer.' },
  { id: '02', text: 'No te conformes, pero agradece tu estado.' },
  { id: '03', text: 'No sé por qué hago lo que no quiero sabiendo lo que quiero.' },
];

export default function Philosophy() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section className={styles.philosophySection} ref={containerRef}>
      <div className={styles.stickyContainer}>
        <div className={styles.label}>FILOSOFÍA</div>
        <p className={styles.sublabel}>Principios que guían cada decisión.</p>

        <div className={styles.content}>
          {/* Left: Main quote */}
          <div className={styles.quoteArea}>
            <div className={styles.quoteMark}>&ldquo;</div>
            {quotes.map((quote, index) => {
              const start = index * 0.33;
              const peak = start + 0.15;
              const end = start + 0.33;

              return (
                <QuoteItem
                  key={quote.id}
                  text={quote.text}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  peak={peak}
                  end={end}
                  isLast={index === quotes.length - 1}
                />
              );
            })}
          </div>

          {/* Right: Numbered list */}
          <div className={styles.list}>
            {quotes.map((quote, index) => {
              const start = index * 0.33;
              const peak = start + 0.1;

              return (
                <ListItem
                  key={quote.id}
                  id={quote.id}
                  text={quote.text}
                  scrollYProgress={scrollYProgress}
                  start={start}
                  peak={peak}
                />
              );
            })}
            <a href="#" className={styles.viewMore}>
              VER MÁS <span className={styles.arrow}>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* Extracted to avoid hooks-in-loop issue */
function QuoteItem({
  text,
  scrollYProgress,
  start,
  peak,
  end,
  isLast,
}: {
  text: string;
  scrollYProgress: any;
  start: number;
  peak: number;
  end: number;
  isLast: boolean;
}) {
  const opacity = useTransform(
    scrollYProgress,
    [start, peak, end - 0.05, end],
    [0, 1, 1, isLast ? 1 : 0]
  );
  const y = useTransform(scrollYProgress, [start, peak], [30, 0]);

  return (
    <motion.div className={styles.quoteWrapper} style={{ opacity, y }}>
      <h3 className={styles.quoteText}>{text}</h3>
    </motion.div>
  );
}

function ListItem({
  id,
  text,
  scrollYProgress,
  start,
  peak,
}: {
  id: string;
  text: string;
  scrollYProgress: any;
  start: number;
  peak: number;
}) {
  const opacity = useTransform(scrollYProgress, [start, peak], [0.3, 1]);

  return (
    <motion.div className={styles.listItem} style={{ opacity }}>
      <span className={styles.listId}>{id}</span>
      <p className={styles.listText}>{text}</p>
    </motion.div>
  );
}
