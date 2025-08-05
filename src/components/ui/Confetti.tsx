import React, { useEffect, useState } from 'react';

interface ConfettiProps {
  active: boolean;
  duration?: number;
  particleCount?: number;
}

const Confetti: React.FC<ConfettiProps> = ({
  active,
  duration = 3000,
  particleCount = 50,
}) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    left: number;
    delay: number;
    color: string;
  }>>([]);

  useEffect(() => {
    if (active) {
      const colors = ['#dc2626', '#ea580c', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'];
      const newParticles = Array.from({ length: particleCount }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 1000,
        color: colors[Math.floor(Math.random() * colors.length)],
      }));
      
      setParticles(newParticles);
      
      setTimeout(() => {
        setParticles([]);
      }, duration);
    }
  }, [active, duration, particleCount]);

  if (!active || particles.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-2 h-2 animate-confetti"
          style={{
            left: `${particle.left}%`,
            backgroundColor: particle.color,
            animationDelay: `${particle.delay}ms`,
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;