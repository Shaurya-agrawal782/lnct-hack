import React from 'react';
import { cn } from '../../utils/ui';

export default function Card({ 
  children, 
  className = '', 
  ...props 
}) {
  return (
    <div 
      className={cn('bg-surface border border-outline-variant rounded-xl p-6 shadow-sm', className)}
      {...props}
    >
      {children}
    </div>
  );
}
