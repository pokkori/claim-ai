"use client";
import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  life: number;
}

interface ConfettiLaunchProps {
  trigger: boolean;
  message?: string;
}

export default function ConfettiLaunch({ trigger, message }: ConfettiLaunchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<ConfettiParticle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!trigger) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const colors = [
      "#FF6B6B", "#4ECDC4", "#FFD93D", "#6C5CE7",
      "#A29BFE", "#FD79A8", "#00B894", "#FDCB6E",
    ];
    [[0.3], [0.7]].forEach(([xRatio]) => {
      for (let i = 0; i < 40; i++) {
        const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.8;
        const speed = 4 + Math.random() * 10;
        particles.current.push({
          x: canvas.width * xRatio,
          y: canvas.height,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 10,
          color: colors[Math.floor(Math.random() * colors.length)],
          rotation: Math.random() * Math.PI * 2,
          rotationSpeed: (Math.random() - 0.5) * 0.3,
          life: 1.0,
        });
      }
    });
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current = particles.current.filter((p) => p.life > 0);
      for (const p of particles.current) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.15;
        p.vx *= 0.99;
        p.rotation += p.rotationSpeed;
        p.life -= 0.012;
        ctx.save();
        ctx.globalAlpha = Math.pow(p.life, 0.5);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        ctx.restore();
      }
      if (particles.current.length > 0) {
        rafRef.current = requestAnimationFrame(loop);
      }
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [trigger]);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-50" />
      <AnimatePresence>
        {trigger && message && (
          <motion.div
            className="fixed top-1/3 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: [0, 1.2, 1], opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div
              className="px-6 py-3 rounded-2xl text-2xl font-black text-center"
              style={{
                background: "linear-gradient(135deg, #FFD700, #FF6B35)",
                boxShadow: "0 0 40px rgba(255,215,0,0.6)",
                color: "#1A1A2E",
              }}
            >
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
