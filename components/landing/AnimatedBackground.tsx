'use client';

import { useEffect, useRef } from 'react';

const characters = [
  '你', '好', '世', '界',  // Chinese
  'こ', 'ん', 'に', 'ち', // Japanese
  '안', '녕', '하', '세', // Korean
  'Я', 'Ж', 'Ф', 'Щ',    // Russian
  'ا', 'ب', 'ج', 'د',    // Arabic
  'α', 'β', 'γ', 'δ',    // Greek
  'א', 'ב', 'ג', 'ד'     // Hebrew
];

interface Particle {
  x: number;
  y: number;
  char: string;
  speed: number;
  opacity: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: Particle[] = [];
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: characters[Math.floor(Math.random() * characters.length)],
      speed: 0.3 + Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.25,
      size: 20 + Math.random() * 28,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02
    });

    const initParticles = () => {
      particles = Array.from({ length: 75 }, createParticle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.font = `${particle.size}px serif`;
        ctx.fillText(particle.char, 0, 0);
        ctx.restore();
        
        particle.y -= particle.speed;
        particle.rotation += particle.rotationSpeed;
        
        if (particle.y < -50) {
          particle.y = canvas.height + 50;
          particle.x = Math.random() * canvas.width;
          particle.rotation = Math.random() * Math.PI * 2;
        }
      });
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', () => {
      resizeCanvas();
      initParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.15]"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}