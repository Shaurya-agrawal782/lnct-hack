import React from 'react';

export default function MetricCard({ 
  label, 
  value, 
  helperText, 
  icon: Icon, 
  accentStyle = 'text-white', 
  iconBgStyle = 'bg-indigo-500/10 text-indigo-400' 
}) {
  return (
    <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center space-x-4 hover:border-slate-700 transition duration-300">
      {Icon && (
        <div className={`p-3.5 rounded-xl ${iconBgStyle}`}>
          <Icon className="h-6 w-6" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider truncate">
          {label}
        </span>
        <span className={`text-3xl font-extrabold mt-1 block truncate ${accentStyle}`}>
          {value !== undefined ? value : '0'}
        </span>
        {helperText && (
          <span className="block text-xxs text-slate-500 font-medium mt-1 truncate">
            {helperText}
          </span>
        )}
      </div>
    </div>
  );
}
