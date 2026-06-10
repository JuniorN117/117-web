'use client';

import { useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import styles from './heroTransition.module.css';

/* ── Draw the rocket (sleek minimal SVG-style on canvas) ── */
function drawRocket(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  tilt: number,
  glowIntensity: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  // Rocket glow halo
  if (glowIntensity > 0.05) {
    const halo = ctx.createRadialGradient(0, 0, 0, 0, 0, 40);
    halo.addColorStop(0, `rgba(226, 226, 226, ${0.06 * glowIntensity})`);
    halo.addColorStop(0.5, `rgba(214, 159, 76, ${0.03 * glowIntensity})`);
    halo.addColorStop(1, 'transparent');
    ctx.beginPath();
    ctx.arc(0, 0, 40, 0, Math.PI * 2);
    ctx.fillStyle = halo;
    ctx.fill();
  }

  // ── Body (elongated capsule shape) ──
  ctx.beginPath();
  ctx.moveTo(0, -28);       // Nose tip
  ctx.bezierCurveTo(5, -22, 6, -12, 6, 0);
  ctx.lineTo(6, 14);
  ctx.lineTo(4, 18);
  ctx.lineTo(-4, 18);
  ctx.lineTo(-6, 14);
  ctx.lineTo(-6, 0);
  ctx.bezierCurveTo(-6, -12, -5, -22, 0, -28);
  ctx.closePath();

  // Metallic gradient fill
  const bodyGrad = ctx.createLinearGradient(-6, -28, 6, 18);
  bodyGrad.addColorStop(0, 'rgba(220, 220, 230, 0.95)');
  bodyGrad.addColorStop(0.3, 'rgba(200, 200, 210, 0.9)');
  bodyGrad.addColorStop(0.6, 'rgba(160, 160, 175, 0.85)');
  bodyGrad.addColorStop(1, 'rgba(140, 140, 155, 0.8)');
  ctx.fillStyle = bodyGrad;
  ctx.fill();

  // Body highlight stripe
  ctx.beginPath();
  ctx.moveTo(-1, -24);
  ctx.lineTo(1, -24);
  ctx.lineTo(1, 16);
  ctx.lineTo(-1, 16);
  ctx.closePath();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.fill();

  // ── Window ──
  ctx.beginPath();
  ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(100, 180, 255, 0.7)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(0, -10, 2.5, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(200, 220, 255, 0.4)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // ── Fins (left & right) ──
  // Left fin
  ctx.beginPath();
  ctx.moveTo(-6, 10);
  ctx.lineTo(-12, 20);
  ctx.lineTo(-8, 22);
  ctx.lineTo(-5, 18);
  ctx.closePath();
  ctx.fillStyle = 'rgba(180, 180, 195, 0.8)';
  ctx.fill();

  // Right fin
  ctx.beginPath();
  ctx.moveTo(6, 10);
  ctx.lineTo(12, 20);
  ctx.lineTo(8, 22);
  ctx.lineTo(5, 18);
  ctx.closePath();
  ctx.fillStyle = 'rgba(180, 180, 195, 0.8)';
  ctx.fill();

  // ── Nozzle ──
  ctx.beginPath();
  ctx.moveTo(-3, 18);
  ctx.lineTo(-4, 22);
  ctx.lineTo(4, 22);
  ctx.lineTo(3, 18);
  ctx.closePath();
  ctx.fillStyle = 'rgba(120, 120, 135, 0.9)';
  ctx.fill();

  ctx.restore();
}

/* ── Draw exhaust flame + smoke trail ── */
function drawFlame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  intensity: number,
  time: number,
  tilt: number,
) {
  if (intensity < 0.02) return;

  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(tilt);
  ctx.scale(scale, scale);

  // Main flame core (inner hot white-yellow)
  const flameLen = 25 + intensity * 45 + Math.sin(time * 12) * 6;
  const flameWidth = 3 + intensity * 3 + Math.sin(time * 15) * 1;

  // Outer flame glow (amber/orange)
  const outerGrad = ctx.createLinearGradient(0, 22, 0, 22 + flameLen * 1.3);
  outerGrad.addColorStop(0, `rgba(255, 160, 40, ${0.6 * intensity})`);
  outerGrad.addColorStop(0.3, `rgba(255, 100, 20, ${0.4 * intensity})`);
  outerGrad.addColorStop(0.7, `rgba(255, 50, 10, ${0.15 * intensity})`);
  outerGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.moveTo(-flameWidth * 1.5, 22);
  ctx.quadraticCurveTo(
    -flameWidth * 0.8 + Math.sin(time * 18) * 2,
    22 + flameLen * 0.6,
    Math.sin(time * 10) * 1.5,
    22 + flameLen * 1.3
  );
  ctx.quadraticCurveTo(
    flameWidth * 0.8 + Math.sin(time * 14) * 2,
    22 + flameLen * 0.6,
    flameWidth * 1.5,
    22
  );
  ctx.closePath();
  ctx.fillStyle = outerGrad;
  ctx.fill();

  // Inner flame core (white-hot)
  const innerGrad = ctx.createLinearGradient(0, 22, 0, 22 + flameLen * 0.7);
  innerGrad.addColorStop(0, `rgba(255, 255, 240, ${0.9 * intensity})`);
  innerGrad.addColorStop(0.4, `rgba(255, 220, 120, ${0.6 * intensity})`);
  innerGrad.addColorStop(1, 'transparent');

  ctx.beginPath();
  ctx.moveTo(-flameWidth * 0.6, 22);
  ctx.quadraticCurveTo(
    Math.sin(time * 20) * 1,
    22 + flameLen * 0.4,
    Math.sin(time * 8) * 0.5,
    22 + flameLen * 0.7
  );
  ctx.quadraticCurveTo(
    Math.sin(time * 16) * 1,
    22 + flameLen * 0.4,
    flameWidth * 0.6,
    22
  );
  ctx.closePath();
  ctx.fillStyle = innerGrad;
  ctx.fill();

  // Flame glow bloom
  ctx.beginPath();
  ctx.arc(0, 22 + 5, 8 + intensity * 8, 0, Math.PI * 2);
  const bloomGrad = ctx.createRadialGradient(0, 22 + 5, 0, 0, 22 + 5, 8 + intensity * 8);
  bloomGrad.addColorStop(0, `rgba(255, 200, 80, ${0.3 * intensity})`);
  bloomGrad.addColorStop(0.5, `rgba(255, 120, 30, ${0.1 * intensity})`);
  bloomGrad.addColorStop(1, 'transparent');
  ctx.fillStyle = bloomGrad;
  ctx.fill();

  ctx.restore();
}

/* ── Smoke trail particle system ── */
interface SmokeParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  life: number;
  maxLife: number;
}

export default function HeroTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const smokeRef = useRef<SmokeParticle[]>([]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  // Content animations
  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const labelOpacity = useTransform(scrollYProgress, [0.25, 0.45, 0.7, 0.9], [0, 1, 1, 0]);
  const labelY = useTransform(scrollYProgress, [0.25, 0.45], [30, 0]);
  const topFade = useTransform(scrollYProgress, [0, 0.3], [0, 1]);
  const bottomFade = useTransform(scrollYProgress, [0.6, 1], [1, 0]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let w = canvas.width = canvas.offsetWidth * 2;
    let h = canvas.height = canvas.offsetHeight * 2;
    ctx.scale(2, 2);

    const handleResize = () => {
      w = canvas.width = canvas.offsetWidth * 2;
      h = canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    window.addEventListener('resize', handleResize);

    // ── Background particles (Warp Speed) ──
    const count = 150;
    interface Particle {
      x: number;
      y: number;
      z: number; // For 3D warp effect
      speed: number;
      size: number;
      hue: number;
    }
    const particles: Particle[] = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: Math.random() * 2000 + 100,
        speed: Math.random() * 5 + 2,
        size: Math.random() * 2 + 0.5,
        hue: Math.random() > 0.8 ? 1 : 0,
      });
    }

    // ── Smoke particle pool ──
    const smoke = smokeRef.current;

    const render = () => {
      const displayW = w / 2;
      const displayH = h / 2;
      ctx.clearRect(0, 0, displayW, displayH);
      const time = performance.now() * 0.001;
      const scroll = scrollYProgress.get(); // 0 to 1
      const cx = displayW / 2;
      const cy = displayH / 2;
      
      // Rocket intensity based on scroll
      const intensity = Math.sin(scroll * Math.PI);

      // ── Warp Particles ──
      // Warp speed increases as you scroll through the middle
      const warpSpeed = 10 + intensity * 60;

      particles.forEach(p => {
        // Move particles towards camera
        p.z -= p.speed * (warpSpeed * 0.2);

        // Reset if passed camera
        if (p.z < 10) {
          p.z = 2000;
          p.x = (Math.random() - 0.5) * 2000;
          p.y = (Math.random() - 0.5) * 2000;
        }

        // 3D to 2D projection
        const fov = 300;
        const scale = fov / p.z;
        const px = cx + p.x * scale;
        const py = cy + p.y * scale;

        // Fade based on Z distance
        const alpha = Math.min(1, (2000 - p.z) / 1000) * (intensity * 0.8 + 0.2);

        if (px >= 0 && px <= displayW && py >= 0 && py <= displayH && alpha > 0.01) {
          ctx.beginPath();
          ctx.arc(px, py, p.size * scale * 2, 0, Math.PI * 2);
          if (p.hue === 1) {
            ctx.fillStyle = `rgba(214, 159, 76, ${alpha})`;
            ctx.shadowColor = 'rgba(214, 159, 76, 0.5)';
          } else {
            ctx.fillStyle = `rgba(226, 226, 226, ${alpha})`;
            ctx.shadowColor = 'rgba(226, 226, 226, 0.5)';
          }
          ctx.shadowBlur = p.size * scale * 5;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Motion trails for particles
          if (intensity > 0.2) {
            const prevScale = fov / (p.z + p.speed * warpSpeed * 0.5);
            const prevX = cx + p.x * prevScale;
            const prevY = cy + p.y * prevScale;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(prevX, prevY);
            ctx.strokeStyle = p.hue === 1 ? `rgba(214, 159, 76, ${alpha * 0.5})` : `rgba(226, 226, 226, ${alpha * 0.5})`;
            ctx.lineWidth = p.size * scale;
            ctx.stroke();
          }
        }
      });

      // ══════════════════════════════════════
      //  🚀 ROCKET — Scroll-driven Flight + Warp
      // ══════════════════════════════════════

      // Rocket moves from bottom to top as you scroll
      // Starts below screen (displayH + 150) and ends above (-150)
      const rocketYBase = (displayH + 150) - (scroll * (displayH + 300));
      
      const rocketX = cx + Math.sin(time * 3) * (5 + intensity * 15);
      const rocketY = rocketYBase + Math.cos(time * 2.5) * (5 + intensity * 10);
      
      const rocketScale = 1.2 + intensity * 0.2; // slightly grows at max speed
      const rocketTilt = Math.sin(time * 5) * (0.02 + intensity * 0.05);
      const flameIntensity = Math.min(1, intensity * 1.5 + 0.2); // Huge flame in middle

      // ── Smoke trail ──
      // Spawn smoke particles behind the rocket
      if (scroll > 0) {
        for (let s = 0; s < 2; s++) {
          smoke.push({
            x: rocketX + (Math.random() - 0.5) * 4 * rocketScale,
            y: rocketY + 22 * rocketScale + Math.random() * 5,
            vx: (Math.random() - 0.5) * 1.5,
            vy: Math.random() * 2 + 1 + intensity * 3, // smoke blasts downwards faster
            size: Math.random() * 3 + 2,
            alpha: 0.3 + Math.random() * 0.2,
            life: 0,
            maxLife: 50 + Math.random() * 30,
          });
        }
      }

      // Draw & update smoke
      for (let i = smoke.length - 1; i >= 0; i--) {
        const s = smoke[i];
        s.life++;
        s.x += s.vx;
        s.y += s.vy;
        s.vx *= 0.98;
        s.vy *= 0.995;
        s.size += 0.15;

        const lifeRatio = s.life / s.maxLife;
        const smokeAlpha = s.alpha * (1 - lifeRatio);

        if (s.life >= s.maxLife || smokeAlpha < 0.005) {
          smoke.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 180, 190, ${smokeAlpha * 0.5})`;
        ctx.fill();
      }

      while (smoke.length > 300) smoke.shift();

      // ── Exhaust spark particles ──
      const sparkCount = Math.floor(flameIntensity * 6);
      for (let i = 0; i < sparkCount; i++) {
        const sparkX = rocketX + (Math.random() - 0.5) * 8 * rocketScale;
        const sparkY = rocketY + (20 + Math.random() * 30) * rocketScale;
        const sparkSize = Math.random() * 2 + 0.5;
        const sparkAlpha = Math.random() * 0.8 * flameIntensity;

        ctx.beginPath();
        ctx.arc(sparkX, sparkY, sparkSize, 0, Math.PI * 2);
        const isAmber = Math.random() > 0.4;
        ctx.fillStyle = isAmber
          ? `rgba(255, 180, 50, ${sparkAlpha})`
          : `rgba(255, 255, 200, ${sparkAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = isAmber ? 'rgba(255, 150, 30, 0.6)' : 'rgba(255, 255, 180, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // ── Draw flame behind rocket ──
      drawFlame(ctx, rocketX, rocketY, rocketScale, flameIntensity, time, rocketTilt);

      // ── Draw rocket ──
      drawRocket(ctx, rocketX, rocketY, rocketScale, rocketTilt, flameIntensity);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [scrollYProgress]);

  return (
    <div className={styles.transition} ref={containerRef}>
      {/* Canvas for particles + rocket */}
      <canvas ref={canvasRef} className={styles.canvas} />

      {/* Top gradient */}
      <motion.div className={styles.gradientTop} style={{ opacity: topFade }} />

      {/* Bottom gradient */}
      <motion.div className={styles.gradientBottom} style={{ opacity: bottomFade }} />

      {/* Center connector content */}
      <div className={styles.centerContent}>
        <motion.div className={styles.verticalLine} style={{ scaleY: lineScale }} />

        <motion.div className={styles.diamond} style={{ opacity: labelOpacity }} />

        <motion.div
          className={styles.label}
          style={{ opacity: labelOpacity, y: labelY }}
        >
          <span className={styles.labelText}>MANIFIESTO</span>
          <span className={styles.labelSub}>5 principios · 1 propósito</span>
        </motion.div>
        
        <motion.div className={styles.verticalLine} style={{ scaleY: lineScale }} />
      </div>

      {/* Decorative horizontal lines */}
      <motion.div className={styles.horizLine1} style={{ opacity: labelOpacity }} />
      <motion.div className={styles.horizLine2} style={{ opacity: labelOpacity }} />
    </div>
  );
}
