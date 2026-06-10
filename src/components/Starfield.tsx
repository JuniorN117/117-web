'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  z: number;
  size: number;
  alpha: number;
  type: 'star' | 'nebula';
  color?: string;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let w = canvas.width = window.innerWidth;
    let h = canvas.height = window.innerHeight;

    const stars: Star[] = [];
    const numStars = 600;
    
    // Mouse tracking for parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse coordinates from -1 to 1
      targetMouseX = (e.clientX / w) * 2 - 1;
      targetMouseY = (e.clientY / h) * 2 - 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);

    // Initialize stars
    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * w * 2 - w, // wider range to allow parallax
        y: Math.random() * h * 2 - h,
        z: Math.random() * 2 + 0.1, // z determines size, speed (parallax depth)
        size: Math.random() * 1.5,
        alpha: Math.random(),
        type: 'star'
      });
    }

    // Add some nebulas (large, blurred, colored clouds)
    const colors = ['rgba(138, 43, 226, 0.05)', 'rgba(0, 240, 255, 0.05)', 'rgba(255, 215, 0, 0.03)'];
    for(let i = 0; i < 8; i++) {
      stars.push({
        x: Math.random() * w * 2 - w,
        y: Math.random() * h * 2 - h,
        z: Math.random() * 0.5 + 0.1, // very far background
        size: Math.random() * 400 + 200,
        alpha: 1,
        type: 'nebula',
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    let animationFrame: number;

    const render = () => {
      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Clear with very dark semi-transparent black for slight trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
      ctx.fillRect(0, 0, w, h);

      stars.forEach((star) => {
        // Parallax offset based on depth (z)
        const parallaxX = mouseX * 50 * star.z;
        const parallaxY = mouseY * 50 * star.z;
        
        let drawX = star.x - parallaxX;
        let drawY = star.y - parallaxY;

        // Wrap around screen seamlessly
        if (drawX < -w/2) star.x += w * 2;
        if (drawX > w * 1.5) star.x -= w * 2;
        if (drawY < -h/2) star.y += h * 2;
        if (drawY > h * 1.5) star.y -= h * 2;

        if (star.type === 'nebula') {
          // Draw nebula puff
          const grad = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, star.size);
          grad.addColorStop(0, star.color || 'rgba(255,255,255,0)');
          grad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Twinkle effect
          star.alpha += (Math.random() - 0.5) * 0.05;
          if (star.alpha < 0.1) star.alpha = 0.1;
          if (star.alpha > 1) star.alpha = 1;

          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
          ctx.beginPath();
          ctx.arc(drawX, drawY, star.size * star.z, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrame = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrame);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
        background: '#030303' // deep space black
      }} 
    />
  );
}
