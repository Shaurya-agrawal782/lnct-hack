import React from 'react';
import { cn } from '../../utils/ui';

export default function Badge({ 
  children, 
  className = '', 
  variant = 'default',
  ...props 
}) {
  const baseStyle = 'inline-flex items-center justify-center px-2.5 py-0.5 text-xs font-semibold rounded-full border';
  
  const variants = {
    default: 'bg-surface-container text-on-surface-variant border-outline-variant',
    primary: 'bg-primary-container/10 text-primary border-primary/20',
    secondary: 'bg-secondary-container text-on-secondary-container border-outline-variant',
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    error: 'bg-error-container text-on-error-container border-error/20'
  };

  return (
    <span 
      className={cn(baseStyle, variants[variant] || variants.default, className)}
      {...props}
    >
      {children}
    </span>
  );
}
