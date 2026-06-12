import React from 'react';
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
  const baseStyle = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-primary text-on-primary hover:opacity-90 active:opacity-100',
    secondary: 'bg-surface border border-outline-variant text-on-surface hover:bg-surface-container-low',
    error: 'bg-error text-on-error hover:opacity-90 active:opacity-100',
    ghost: 'bg-transparent text-on-surface hover:bg-surface-container-low'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
}
