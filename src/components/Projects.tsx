'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import styles from './projects.module.css';

const projects = [
  {
    title: 'ATLAS',
    description: 'IA que potencia ideas y decisiones.',
    status: 'ACTIVO',
    statusColor: '#00F0FF',
    image: '/images/atlas.png',
  },
  {
    title: '117 BOOK',
    description: 'Reflexiones y principios para una vida con propósito.',
    status: 'EN DESARROLLO',
    statusColor: '#FFD700',
    image: '/images/book.png',
  },
  {
    title: 'FUTURE APPS',
    description: 'Nuevas aplicaciones en investigación.',
    status: 'INVESTIGACIÓN',
    statusColor: '#007BFF',
    image: '/images/apps.png',
  },
  {
    title: 'MUSIC',
    description: 'Creando canciones que conectan.',
    status: 'CREANDO',
    statusColor: '#8A2BE2',
    image: '/images/music.png',
  }
];

export default function Projects() {
  return (
    <section className={`section ${styles.projectsSection}`}>
      <motion.div
        className={styles.header}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
      >
        <h2 className={styles.label}>LO QUE ESTOY CONSTRUYENDO</h2>
      </motion.div>

      <div className={styles.grid}>
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            className={styles.card}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: i * 0.1 }}
            viewport={{ once: true, amount: 0.2 }}
          >
            {/* Card background image */}
            <div className={styles.cardBg}>
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                style={{ objectFit: 'cover' }}
              />
              <div className={styles.cardOverlay} />
            </div>

            {/* Card content */}
            <div className={styles.cardContent}>
              <h3 className={styles.title}>{project.title}</h3>
              <p className={styles.description}>{project.description}</p>

              <div className={styles.statusContainer}>
                <div
                  className={styles.statusDot}
                  style={{ backgroundColor: project.statusColor, boxShadow: `0 0 8px ${project.statusColor}` }}
                />
                <div className={styles.statusText} style={{ color: project.statusColor }}>
                  ESTADO<br />{project.status}
                </div>
              </div>
            </div>

            {/* Hover glow border */}
            <div
              className={styles.hoverGlow}
              style={{ '--glow-color': project.statusColor } as React.CSSProperties}
            />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
