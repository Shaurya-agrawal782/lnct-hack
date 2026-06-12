import React from 'react';
import { cn } from '../../utils/ui';

export default function Select({ 
  children,
  className = '', 
  error = false, 
  ...props 
}) {
  return (
    <select
      className={cn(
        'w-full bg-surface border rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all appearance-none cursor-pointer',
        error ? 'border-error focus:ring-error/15' : 'border-outline-variant focus:border-primary',
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}
