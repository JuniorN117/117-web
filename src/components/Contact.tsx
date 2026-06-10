'use client';

import { ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';
import styles from './contact.module.css';

const socials = [
  { name: 'INSTAGRAM', href: '#' },
  { name: 'YOUTUBE', href: '#' },
  { name: 'GITHUB', href: '#' },
  { name: 'LINKEDIN', href: '#' },
];

export default function Contact() {
  return (
    <section className={`section ${styles.contactSection}`}>
      <motion.div
        className={styles.content}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true, amount: 0.3 }}
      >
        <h2 className={styles.title}>
          Si compartes esta visión,<br />
          construyamos algo juntos.
        </h2>

        <a href="#" className={styles.cta}>
          CONTACTAR <ArrowUpRight size={14} />
        </a>
      </motion.div>

      <footer className={styles.footer}>
        <div className={styles.footerLeft}>
          <span className={styles.logo}>117</span>
          <span className={styles.copyright}>Todos los derechos reservados.</span>
        </div>

        <nav className={styles.socials}>
          {socials.map((s) => (
            <a key={s.name} href={s.href} className={styles.socialLink}>
              {s.name}
            </a>
          ))}
        </nav>
      </footer>
    </section>
  );
}
