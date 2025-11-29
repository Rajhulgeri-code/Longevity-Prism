import React, { useEffect, useRef, useState } from 'react';
import type { FusionAnswers, MotivationType, RhythmType, FrictionType } from '../App';

interface FusionCanvasProps {
  answers: FusionAnswers;
}

// Liquid color palettes for motivation (foundation colors)
const motivationLiquidColors: Record<MotivationType, { base: string; particles: string[] }> = {
  steady: { base: '#7C8B9F', particles: ['#9CA9BA', '#B4BEC8', '#6B7A8E'] },
  strong: { base: '#3D4A5C', particles: ['#525F71', '#687486', '#2E3A4A'] },
  clear: { base: '#A8D8F0', particles: ['#C7E6F5', '#E0F2F9', '#89C6E8'] },
  connected: { base: '#F4B896', particles: ['#F8CDB0', '#FBE2CA', '#F0A37C'] },
  free: { base: '#7DD8B8', particles: ['#9EE5CA', '#BFF2DC', '#5CCBA6'] },
  growing: { base: '#6FCF97', particles: ['#8FD9AD', '#AFE3C3', '#4FC581'] },
  alive: { base: '#F08E8E', particles: ['#F5AAAA', '#FAC6C6', '#EB7272'] },
  balanced: { base: '#B19CD9', particles: ['#C5B3E6', '#D9CAF3', '#9D85CC'] },
  secure: { base: '#85B3E8', particles: ['#A1C7F0', '#BDDCF8', '#699FE0'] },
  light: { base: '#F5DA9A', particles: ['#F9E6B4', '#FDF2CE', '#F1CE80'] }
};

// Flow patterns for rhythm (how liquid moves)
const rhythmFlowTypes = {
  discipline: { swirl: 0.1, spread: 0.3, dropSpeed: 1.2, turbulence: 0.05 },
  consistency: { swirl: 0.05, spread: 0.25, dropSpeed: 1.0, turbulence: 0.03 },
  momentum: { swirl: 0.25, spread: 0.5, dropSpeed: 1.8, turbulence: 0.15 },
  intention: { swirl: 0.15, spread: 0.35, dropSpeed: 1.3, turbulence: 0.08 },
  curiosity: { swirl: 0.3, spread: 0.6, dropSpeed: 1.5, turbulence: 0.2 },
  adaptability: { swirl: 0.2, spread: 0.55, dropSpeed: 1.4, turbulence: 0.18 },
  persistence: { swirl: 0.08, spread: 0.28, dropSpeed: 0.9, turbulence: 0.04 },
  structure: { swirl: 0.05, spread: 0.22, dropSpeed: 1.0, turbulence: 0.02 },
  intuition: { swirl: 0.35, spread: 0.65, dropSpeed: 1.6, turbulence: 0.25 },
  collaboration: { swirl: 0.18, spread: 0.45, dropSpeed: 1.2, turbulence: 0.12 }
};

// Tension effects for friction (disturbances in the liquid)
const frictionTensionTypes = {
  overload: { fracture: 0.8, ripple: 0.9, darkness: 0.3 },
  distraction: { fracture: 0.6, ripple: 0.7, darkness: 0.2 },
  doubt: { fracture: 0.5, ripple: 0.6, darkness: 0.25 },
  tension: { fracture: 0.9, ripple: 0.8, darkness: 0.35 },
  delay: { fracture: 0.3, ripple: 0.4, darkness: 0.15 },
  fog: { fracture: 0.2, ripple: 0.3, darkness: 0.4 },
  disorder: { fracture: 0.7, ripple: 0.85, darkness: 0.28 },
  depletion: { fracture: 0.4, ripple: 0.5, darkness: 0.3 },
  resistance: { fracture: 0.65, ripple: 0.7, darkness: 0.32 },
  weight: { fracture: 0.35, ripple: 0.45, darkness: 0.38 }
};

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  layer: number;
}

// Helper function to add alpha to any color format
const addAlphaToColor = (color: string, alpha: number): string => {
  // If it's already rgba format, extract and modify
  if (color.startsWith('rgba')) {
    const match = color.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
    if (match) {
      return `rgba(${match[1]}, ${match[2]}, ${match[3]}, ${alpha})`;
    }
  }
  // If it's hex format, convert to rgba
  if (color.startsWith('#')) {
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Default fallback
  return color;
};

export const FusionCanvas: React.FC<FusionCanvasProps> = ({ answers }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>();
  const timeRef = useRef(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const fillLevelRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const width = 560;
    const height = 485;
    canvas.width = width;
    canvas.height = height;

    // Reset state
    timeRef.current = 0;
    fillLevelRef.current = 0;

    // Initialize particles based on answers
    const initializeParticles = () => {
      const newParticles: Particle[] = [];
      let particleDelay = 0;
      
      if (answers.motivation) {
        const motivationData = motivationLiquidColors[answers.motivation];
        const particleCount = 200;
        
        for (let i = 0; i < particleCount; i++) {
          const colorIndex = Math.floor(Math.random() * motivationData.particles.length);
          newParticles.push({
            x: Math.random() * width,
            y: -Math.random() * 300 - particleDelay,
            vx: (Math.random() - 0.5) * 0.8,
            vy: Math.random() * 1.5 + 1,
            radius: Math.random() * 30 + 15,
            color: motivationData.particles[colorIndex],
            alpha: Math.random() * 0.4 + 0.5,
            layer: 0
          });
          particleDelay += 0.5;
        }
      }

      if (answers.rhythm) {
        const flowData = rhythmFlowTypes[answers.rhythm];
        const particleCount = 120;
        
        for (let i = 0; i < particleCount; i++) {
          const baseColor = answers.motivation 
            ? motivationLiquidColors[answers.motivation].base 
            : '#9CA9BA';
          
          newParticles.push({
            x: Math.random() * width,
            y: -Math.random() * 400 - particleDelay,
            vx: (Math.random() - 0.5) * flowData.spread * 1.2,
            vy: Math.random() * flowData.dropSpeed + 0.8,
            radius: Math.random() * 25 + 12,
            color: baseColor,
            alpha: Math.random() * 0.35 + 0.35,
            layer: 1
          });
          particleDelay += 0.3;
        }
      }

      if (answers.friction) {
        const tensionData = frictionTensionTypes[answers.friction];
        const particleCount = 100;
        
        for (let i = 0; i < particleCount; i++) {
          newParticles.push({
            x: Math.random() * width,
            y: -Math.random() * 350 - particleDelay,
            vx: (Math.random() - 0.5) * tensionData.ripple * 0.7,
            vy: Math.random() * 1.8 + 0.6,
            radius: Math.random() * 20 + 10,
            color: addAlphaToColor('#000000', tensionData.darkness),
            alpha: Math.random() * 0.4 + 0.25,
            layer: 2
          });
          particleDelay += 0.2;
        }
      }

      particlesRef.current = newParticles;
      setIsAnimating(true);
    };

    initializeParticles();

    // Animation loop
    const animate = () => {
      timeRef.current += 0.016;
      
      ctx.clearRect(0, 0, width, height);

      // Calculate fill level based on settled particles
      const settledParticles = particlesRef.current.filter(p => p.y > height * 0.7);
      const targetFillLevel = Math.min(0.85, settledParticles.length / particlesRef.current.length);
      fillLevelRef.current += (targetFillLevel - fillLevelRef.current) * 0.02;

      // Draw liquid fill background (bottom-up gradient)
      if (answers.motivation && fillLevelRef.current > 0.01) {
        const motivationData = motivationLiquidColors[answers.motivation];
        const fillHeight = height * fillLevelRef.current;
        
        // Main liquid body
        const liquidGradient = ctx.createLinearGradient(0, height - fillHeight, 0, height);
        liquidGradient.addColorStop(0, motivationData.base + '20');
        liquidGradient.addColorStop(0.5, motivationData.base + '40');
        liquidGradient.addColorStop(1, motivationData.base + '60');
        ctx.fillStyle = liquidGradient;
        ctx.fillRect(0, height - fillHeight, width, fillHeight);
        
        // Top shimmer (liquid surface)
        const shimmerGradient = ctx.createLinearGradient(0, height - fillHeight - 30, 0, height - fillHeight + 10);
        shimmerGradient.addColorStop(0, motivationData.base + '00');
        shimmerGradient.addColorStop(0.5, motivationData.base + '50');
        shimmerGradient.addColorStop(1, motivationData.base + '20');
        ctx.fillStyle = shimmerGradient;
        ctx.fillRect(0, height - fillHeight - 30, width, 40);
      }

      // Update and draw particles with liquid behavior
      const flowData = answers.rhythm ? rhythmFlowTypes[answers.rhythm] : null;
      const tensionData = answers.friction ? frictionTensionTypes[answers.friction] : null;

      particlesRef.current.forEach((particle) => {
        const liquidSurface = height - (height * fillLevelRef.current);
        
        // Gravity (stronger above liquid surface)
        if (particle.y < liquidSurface) {
          particle.vy += 0.08;
        } else {
          // Slow down in liquid
          particle.vy *= 0.92;
          particle.vx *= 0.95;
        }

        // Apply swirl motion when in liquid
        if (flowData && particle.y > liquidSurface) {
          const swirl = Math.sin(timeRef.current * 0.5 + particle.x * 0.02) * flowData.swirl * 2;
          particle.vx += swirl;
          
          // Turbulence
          if (Math.random() < 0.03) {
            particle.vx += (Math.random() - 0.5) * flowData.turbulence * 2;
            particle.vy += (Math.random() - 0.5) * flowData.turbulence;
          }
        }

        // Tension effects (ripples and disturbances)
        if (tensionData && particle.layer === 2) {
          const ripple = Math.sin(timeRef.current * 3 + particle.x * 0.03) * tensionData.ripple * 0.5;
          particle.vx += ripple;
          
          if (particle.y > liquidSurface) {
            const disturbance = Math.cos(timeRef.current * 2 + particle.y * 0.02) * tensionData.fracture * 0.3;
            particle.vy += disturbance;
          }
        }

        // Update position
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Boundary bounce (soft)
        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -0.6;
          particle.x = Math.max(0, Math.min(width, particle.x));
        }

        // Settle at bottom
        if (particle.y > height - particle.radius * 0.5) {
          particle.y = height - particle.radius * 0.5;
          particle.vy *= -0.15;
          particle.vx *= 0.9;
          
          // Spread out on settling
          if (Math.abs(particle.vy) < 0.5) {
            particle.vy = 0;
          }
        }

        // Draw particle with enhanced blur and glow
        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.filter = 'blur(2px)';
        
        // Create radial gradient for soft, diffused edges
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.radius * 1.5
        );
        particleGradient.addColorStop(0, particle.color);
        particleGradient.addColorStop(0.4, addAlphaToColor(particle.color, 0.67));
        particleGradient.addColorStop(0.7, addAlphaToColor(particle.color, 0.33));
        particleGradient.addColorStop(1, addAlphaToColor(particle.color, 0));
        
        ctx.fillStyle = particleGradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius * 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
      });

      // Continue animation if particles are still pouring or settling
      const allSettled = particlesRef.current.every(p => 
        p.y >= height - p.radius - 10 && Math.abs(p.vy) < 0.2
      );

      if (!allSettled || timeRef.current < 5) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [answers]);

  return (
    <div
      style={{
        width: '0',
        height: '0',
        borderLeft: '280px solid transparent',
        borderRight: '280px solid transparent',
        borderTop: '485px solid rgba(255, 255, 255, 0.98)',
        overflow: 'hidden',
        position: 'relative',
        filter: 'drop-shadow(0 10px 30px rgba(0,0,0,0.15))',
        backdropFilter: 'blur(20px)',
        transition: 'all 0.5s ease-in-out'
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: '-485px',
          left: '-280px',
          width: '560px',
          height: '485px',
          clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
          mixBlendMode: 'normal'
        }}
      />
    </div>
  );
};
