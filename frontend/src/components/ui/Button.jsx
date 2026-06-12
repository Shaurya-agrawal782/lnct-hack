import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/ui';

export default function Button({ 
  children, 
  className = '', 
  variant = 'primary', 
  size = 'md', 
  type = 'button', 
  disabled = false, 
  onClick, 
  ...props 
}) {
  const isReduced = useReducedMotion();

  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:opacity-95 active:opacity-100 shadow-sm',
    secondary: 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low shadow-sm',
    error: 'bg-error text-on-error hover:opacity-95 active:opacity-100 shadow-sm',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-low'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const isInteractive = (variant === 'primary' || variant === 'secondary') && !isReduced;

  const motionProps = isInteractive ? {
    whileHover: { y: -1, transition: { duration: 0.15 } },
    whileTap: { scale: 0.98, transition: { duration: 0.1 } }
  } : {};

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.button>
  );
}
