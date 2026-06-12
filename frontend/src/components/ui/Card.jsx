import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { cn } from '../../utils/ui';

export default function Card({ 
  children, 
  className = '', 
  hover = false,
  ...props 
}) {
  const isReduced = useReducedMotion();

  const isInteractive = hover && !isReduced;

  const motionProps = isInteractive ? {
    whileHover: { 
      y: -3, 
      boxShadow: '0 8px 24px -4px rgba(0, 0, 0, 0.04), 0 2px 8px -2px rgba(0, 0, 0, 0.04)',
      borderColor: 'rgba(29, 78, 216, 0.2)'
    },
    transition: { duration: 0.2, ease: 'easeOut' }
  } : {};

  return (
    <motion.div 
      className={cn(
        'bg-surface border border-outline-variant rounded-xl p-6 shadow-sm transition-colors duration-200', 
        hover && 'hover:shadow-md',
        className
      )}
      {...motionProps}
      {...props}
    >
      {children}
    </motion.div>
  );
}
