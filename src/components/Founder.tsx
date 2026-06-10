'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { motion, useScroll, useTransform, useInView, useMotionValue, useSpring } from 'framer-motion';
import styles from './founder.module.css';

/* ── Animated counter ── */
function AnimatedCounter({ target, label, suffix = '' }: { target: number; label: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [inView, target]);

  return (
    <div className={styles.stat} ref={ref}>
      <span className={styles.statNumber}>{count}{suffix}</span>
      <span className={styles.statLabel}>{label}</span>
    </div>
  );
}

/* ── Floating particles canvas ── */
function ParticleField({ containerRef }: { containerRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = canvas.width = canvas.offsetWidth;
    let h = canvas.height = canvas.offsetHeight;

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth;
      h = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particles
    const count = 80;
    const particles: Array<{
      x: number; y: number; vx: number; vy: number;
      r: number; baseAlpha: number; phase: number;
    }> = [];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 2 + 0.5,
        baseAlpha: Math.random() * 0.4 + 0.1,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    const parent = containerRef.current;
    if (parent) parent.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, w, h);
      const time = performance.now() * 0.001;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Draw connections
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            const alpha = (1 - dist / 120) * 0.08;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(226, 226, 226, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Update & draw particles
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        // Mouse repulsion
        const dx = p.x - mx;
        const dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 150 && dist > 0) {
          const force = (150 - dist) / 150 * 0.5;
          p.x += (dx / dist) * force;
          p.y += (dy / dist) * force;
        }

        // Wrap edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Pulsing glow
        const pulse = Math.sin(time * 1.5 + p.phase) * 0.3 + 0.7;
        const alpha = p.baseAlpha * pulse;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(226, 226, 226, ${alpha})`;
        ctx.shadowBlur = p.r * 4;
        ctx.shadowColor = 'rgba(226, 226, 226, 0.3)';
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) parent.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [containerRef]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute', inset: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none', zIndex: 0,
      }}
    />
  );
}

/* ── Main Founder Component ── */
export default function Founder() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const bgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 1.05]);

  // Mouse tracking for light effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    mouseX.set(x);
    mouseY.set(y);
  }, [mouseX, mouseY]);

  // Text animation variants
  const containerVariants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: 0.08, delayChildren: 0.3 },
    },
  };

  const wordVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1, y: 0, filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  };

  const descriptionWords = [
    'Construyo', 'herramientas,', 'arte', 'y', 'experiencias',
    'que', 'nacen', 'de', 'una', 'misma', 'convicción:'
  ];

  const accentLine1 = ['las', 'ideas', 'solo', 'cambian', 'el', 'mundo'];
  const accentLine2 = ['cuando', 'se', 'convierten', 'en', 'acción.'];

  return (
    <section
      className={styles.founderSection}
      ref={sectionRef}
      onMouseMove={handleMouseMove}
    >
      {/* Particle constellation canvas */}
      <ParticleField containerRef={sectionRef} />

      {/* Mouse-following ambient light */}
      <motion.div
        className={styles.mouseLight}
        style={{
          left: smoothX,
          top: smoothY,
        }}
      />

      {/* Film grain overlay */}
      <div className={styles.filmGrain} />

      {/* Cinematic horizontal lines */}
      <div className={styles.scanlines} />

      <div className={styles.grid}>
        {/* ── Left: Portrait ── */}
        <motion.div
          className={styles.portraitColumn}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className={styles.imageContainer} ref={imageContainerRef}>
            {/* Glowing aura behind the portrait */}
            <div className={styles.auraGlow} />

            {/* Animated orbital rings */}
            <div className={styles.orbitalSystem}>
              <div className={`${styles.orbit} ${styles.orbit1}`}>
                <div className={styles.orbitDot} />
              </div>
              <div className={`${styles.orbit} ${styles.orbit2}`}>
                <div className={styles.orbitDot} />
              </div>
              <div className={`${styles.orbit} ${styles.orbit3}`}>
                <div className={styles.orbitDot} />
              </div>
            </div>

            {/* Corner brackets */}
            <div className={`${styles.bracket} ${styles.bracketTL}`} />
            <div className={`${styles.bracket} ${styles.bracketTR}`} />
            <div className={`${styles.bracket} ${styles.bracketBL}`} />
            <div className={`${styles.bracket} ${styles.bracketBR}`} />

            {/* Portrait */}
            <motion.div className={styles.imageWrapper} style={{ y: parallaxY }}>
              <Image
                src="/images/founder.png"
                alt="Junior Nieves — Fundador de 117"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
                priority
              />
              {/* Subtle vignette overlay on the image */}
              <div className={styles.imageVignette} />
            </motion.div>
          </div>

          {/* Coordinates label */}
          <div className={styles.coordLabel}>
            <span className={styles.coordDot} />
            18.4655° N, 66.1057° W
          </div>
        </motion.div>

        {/* ── Right: Content ── */}
        <motion.div
          className={styles.content}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Label with animated line */}
          <div className={styles.labelRow}>
            <motion.div
              className={styles.labelLine}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              viewport={{ once: true }}
            />
            <span className={styles.label}>EL FUNDADOR</span>
          </div>

          {/* Name with dramatic reveal */}
          <motion.h2
            className={styles.name}
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.3 }}
            viewport={{ once: true }}
          >
            Junior<br />Nieves
          </motion.h2>

          {/* Animated divider */}
          <motion.div
            className={styles.divider}
            initial={{ width: 0 }}
            whileInView={{ width: 60 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            viewport={{ once: true }}
          />

          {/* Word-by-word text reveal */}
          <motion.div
            className={styles.description}
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            <p className={styles.descLine}>
              {descriptionWords.map((word, i) => (
                <motion.span key={i} variants={wordVariants} className={styles.word}>
                  {word}
                </motion.span>
              ))}
            </p>
            <p className={styles.descLineAccent}>
              {accentLine1.map((word, i) => (
                <motion.span key={`a1-${i}`} variants={wordVariants} className={styles.word}>
                  {word}
                </motion.span>
              ))}
            </p>
            <p className={styles.descLineAccent}>
              {accentLine2.map((word, i) => (
                <motion.span key={`a2-${i}`} variants={wordVariants} className={styles.word}>
                  {word}
                </motion.span>
              ))}
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            className={styles.statsRow}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.8 }}
            viewport={{ once: true }}
          >
            <AnimatedCounter target={7} label="PROYECTOS" suffix="+" />
            <div className={styles.statDivider} />
            <AnimatedCounter target={3} label="DISCIPLINAS" />
            <div className={styles.statDivider} />
            <AnimatedCounter target={1} label="VISIÓN" />
          </motion.div>

          {/* CTA */}
          <motion.a
            href="#"
            className={styles.cta}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
            viewport={{ once: true }}
            whileHover={{ x: 4 }}
          >
            <span className={styles.ctaText}>CONOCE MÁS</span>
            <span className={styles.ctaLine} />
            <ArrowRight size={14} className={styles.ctaIcon} />
          </motion.a>
        </motion.div>
      </div>

      {/* Bottom ambient gradient */}
      <div className={styles.bottomGradient} />
    </section>
  );
}
