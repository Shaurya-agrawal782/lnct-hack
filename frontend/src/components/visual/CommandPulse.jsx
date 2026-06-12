import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/ui';

export default function CommandPulse({ className = '', variant = 'success', size = 'md' }) {
  const isReduced = useReducedMotion();

  const variantColors = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-red-500',
  };

  const ringColors = {
    primary: 'border-primary/40',
    success: 'border-emerald-500/40',
    warning: 'border-amber-500/40',
    error: 'border-red-500/40',
  };

  const colorClass = variantColors[variant] || variantColors.success;
  const ringColorClass = ringColors[variant] || ringColors.success;

  const sizeStyles = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3'
  };

  const sizeStyle = sizeStyles[size] || sizeStyles.md;

  return (
    <div className={cn("relative flex items-center justify-center shrink-0", sizeStyle, className)}>
      <span className={cn("absolute rounded-full w-full h-full", colorClass)} />
      {!isReduced && (
        <motion.span
          className={cn("absolute rounded-full border-2 w-full h-full", ringColorClass)}
          animate={{
            scale: [1, 2.4],
            opacity: [0.8, 0]
          }}
          transition={{
            repeat: Infinity,
            duration: 2.0,
            ease: "easeOut"
          }}
        />
      )}
    </div>
  );
}
