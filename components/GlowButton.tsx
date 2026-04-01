'use client';
import { useState } from 'react';

interface GlowButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'danger';
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit';
  'aria-label'?: string;
  'aria-busy'?: boolean;
}

export function GlowButton({
  children,
  variant = 'primary',
  onClick,
  disabled,
  className,
  type = 'button',
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy,
}: GlowButtonProps) {
  const [pressed, setPressed] = useState(false);
  const color = variant === 'primary' ? '#6366f1' : '#ef4444';
  const colorDark = variant === 'primary' ? '#4f46e5' : '#dc2626';

  return (
    <button
      type={type}
      onClick={onClick}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
      aria-busy={ariaBusy}
      style={{
        background: disabled
          ? `rgba(${variant === 'primary' ? '99,102,241' : '239,68,68'},0.3)`
          : `linear-gradient(135deg, ${color}CC, ${colorDark}99)`,
        border: `1px solid ${disabled ? `rgba(${variant === 'primary' ? '99,102,241' : '239,68,68'},0.2)` : color + '88'}`,
        borderRadius: '14px',
        padding: '14px 28px',
        color: disabled ? 'rgba(255,255,255,0.5)' : '#FFFFFF',
        fontWeight: 700,
        fontSize: '16px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transform: pressed && !disabled ? 'scale(0.96)' : 'scale(1)',
        boxShadow: pressed || disabled
          ? `0 2px 8px ${color}40`
          : `0 0 20px ${color}60, 0 4px 16px ${color}40`,
        transition: 'transform 0.15s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s ease',
        letterSpacing: '0.02em',
        minHeight: '44px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </button>
  );
}
