"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { motion } from "motion/react";

interface AnimatedScoreProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

export default function AnimatedScore({
  target,
  duration = 1200,
  prefix = "",
  suffix = "",
  className = "",
  onComplete,
}: AnimatedScoreProps) {
  const [current, setCurrent] = useState(0);
  const startTime = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const animate = useCallback(
    (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCurrent(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        onComplete?.();
      }
    },
    [target, duration, onComplete]
  );

  useEffect(() => {
    startTime.current = null;
    setCurrent(0);
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, animate]);

  return (
    <motion.span
      className={`font-black tabular-nums ${className}`}
      key={target}
      initial={{ scale: 0.8 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      {prefix}
      {current.toLocaleString()}
      {suffix}
    </motion.span>
  );
}
