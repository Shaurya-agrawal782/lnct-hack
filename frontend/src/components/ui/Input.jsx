import React from 'react';
import { cn } from '../../utils/ui';

export default function Input({ 
  className = '', 
  type = 'text', 
  error = false, 
  icon,
  ...props 
}) {
  return (
    <div className="relative w-full">
      {icon && (
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-[20px]">
          {icon}
        </span>
      )}
      <input
        type={type}
        className={cn(
          'w-full bg-surface border rounded-lg py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all',
          icon ? 'pl-10 pr-3' : 'px-4',
          error ? 'border-error focus:ring-error/15' : 'border-outline-variant focus:border-primary',
          className
        )}
        {...props}
      />
    </div>
  );
}
