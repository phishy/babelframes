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
  char?: string;
  speed: number;
  opacity: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color?: string;
  type: 'character' | 'particle';
  vx?: number;
  vy?: number;
}

const COLORS = [
  '#FF69B4', // Pink
  '#4169E1', // Royal Blue
  '#32CD32', // Lime Green
  '#FFD700', // Gold
  '#FF4500', // Orange Red
  '#9370DB', // Medium Purple
];

export function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timeRef = useRef(0);

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

    const createCharacterParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      char: characters[Math.floor(Math.random() * characters.length)],
      speed: 0.3 + Math.random() * 0.4,
      opacity: 0.15 + Math.random() * 0.25,
      size: 20 + Math.random() * 28,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.02,
      type: 'character'
    });

    const createColorParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      speed: 0.2 + Math.random() * 0.3,
      opacity: 0.1 + Math.random() * 0.2,
      size: 3 + Math.random() * 4,
      rotation: 0,
      rotationSpeed: 0,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: 'particle',
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2
    });

    const initParticles = () => {
      particles = [
        ...Array.from({ length: 50 }, createCharacterParticle),
        ...Array.from({ length: 30 }, createColorParticle)
      ];
    };

    const drawWave = (time: number) => {
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 2;
      
      for (let x = 0; x < canvas.width; x += 5) {
        const y = Math.sin(x * 0.02 + time * 0.002) * 20 + 
                 Math.cos(x * 0.01 + time * 0.001) * 15;
        if (x === 0) {
          ctx.moveTo(x, canvas.height / 2 + y);
        } else {
          ctx.lineTo(x, canvas.height / 2 + y);
        }
      }
      ctx.stroke();
    };

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw wave
      drawWave(time);
      
      particles.forEach(particle => {
        ctx.save();
        
        if (particle.type === 'character') {
          ctx.translate(particle.x, particle.y);
          ctx.rotate(particle.rotation);
          ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
          ctx.font = `${particle.size}px serif`;
          ctx.fillText(particle.char!, 0, 0);
          
          particle.y -= particle.speed;
          particle.rotation += particle.rotationSpeed;
          
          if (particle.y < -50) {
            particle.y = canvas.height + 50;
            particle.x = Math.random() * canvas.width;
            particle.rotation = Math.random() * Math.PI * 2;
          }
        } else {
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `${particle.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
          ctx.fill();
          
          // Update position with smooth wave-like motion
          particle.x += (particle.vx || 0) + Math.sin(time * 0.001 + particle.y * 0.01) * 0.5;
          particle.y += (particle.vy || 0) + Math.cos(time * 0.001 + particle.x * 0.01) * 0.5;
          
          // Wrap around screen
          if (particle.x < -50) particle.x = canvas.width + 50;
          if (particle.x > canvas.width + 50) particle.x = -50;
          if (particle.y < -50) particle.y = canvas.height + 50;
          if (particle.y > canvas.height + 50) particle.y = -50;
        }
        
        ctx.restore();
      });
      
      timeRef.current = time;
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate(0);

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