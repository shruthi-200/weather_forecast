// src/components/StarField.tsx
import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  speed: number;
  brightness: number;
}

const StarField: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const starsRef = useRef<Star[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create stars
    const createStars = () => {
      const stars: Star[] = [];
      const starCount = 200;

      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 1.5 + 0.5,
          speed: Math.random() * 0.5 + 0.1,
          brightness: Math.random() * 0.5 + 0.5,
        });
      }
      return stars;
    };

    starsRef.current = createStars();

    // Animation
    const animate = () => {
      ctx.fillStyle = 'rgba(4, 7, 29, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      starsRef.current.forEach((star) => {
        // Move stars
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }

        // Draw stars
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.brightness})`;
        ctx.fill();

        // Add twinkling effect
        star.brightness = 0.5 + Math.sin(Date.now() * 0.001 + star.x) * 0.3;
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ background: 'linear-gradient(to bottom, #04071d, #0c1445)' }}
    />
  );
};

export default StarField;