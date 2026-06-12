import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/ui';

export default function Badge({ 
  children, 
  className = '', 
  variant = 'default',
  pulse = false,
  ...props 
}) {
  const isReduced = useReducedMotion();
  const baseStyle = 'inline-flex items-center justify-center gap-1.5 px-2.5 py-0.5 text-xs font-semibold rounded-full border';
  
  const variants = {
    default: 'bg-surface-container text-on-surface-variant border-outline-variant',
    primary: 'bg-primary-container/10 text-primary border-primary/20',
    secondary: 'bg-secondary-container text-on-secondary-container border-outline-variant',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-error-container text-on-error-container border-error/20'
  };

  const dotColors = {
    default: 'bg-on-surface-variant',
    primary: 'bg-primary',
    secondary: 'bg-on-secondary-container',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    error: 'bg-error'
  };

  const dotColorClass = dotColors[variant] || dotColors.default;

  return (
    <span 
      className={cn(baseStyle, variants[variant] || variants.default, className)}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={cn("absolute inline-flex h-full w-full rounded-full", dotColorClass)}></span>
          {!isReduced && (
            <motion.span 
              className={cn("absolute inline-flex h-full w-full rounded-full", dotColorClass)}
              animate={{
                scale: [1, 2.2],
                opacity: [0.8, 0]
              }}
              transition={{
                repeat: Infinity,
                duration: 2.0,
                ease: "easeOut"
              }}
            />
          )}
        </span>
      )}
      {children}
    </span>
  );
}
