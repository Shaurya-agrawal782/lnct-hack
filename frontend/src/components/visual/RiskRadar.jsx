import React from 'react';
import { useReducedMotion } from 'motion/react';

export default function RiskRadar() {
  const isReduced = useReducedMotion();

  return (
    <div className="w-full h-full aspect-square relative select-none pointer-events-none flex items-center justify-center p-4">
      {/* Outer Ring Border */}
      <div className="absolute inset-0 rounded-full border border-slate-800/40" />

      <svg className="w-full h-full text-slate-700" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Concentric Grid Rings */}
        <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" strokeDasharray="3 3" className="opacity-25" />
        <circle cx="100" cy="100" r="75" stroke="currentColor" strokeWidth="0.5" className="opacity-35" />
        <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="0.5" className="opacity-45" />
        <circle cx="100" cy="100" r="25" stroke="currentColor" strokeWidth="0.5" className="opacity-55" />

        {/* Crosshair Axes */}
        <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="0.5" className="opacity-35" />
        <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="0.5" className="opacity-35" />
        
        {/* Diagonal Axes */}
        <line x1="33" y1="33" x2="167" y2="167" stroke="currentColor" strokeWidth="0.25" className="opacity-15" />
        <line x1="167" y1="33" x2="33" y2="167" stroke="currentColor" strokeWidth="0.25" className="opacity-15" />

        {/* Command Center Telemetry dots (Status indicators on coordinates map) */}
        <circle cx="65" cy="55" r="1.5" fill="#3b82f6" className="animate-pulse" style={{ animationDelay: '0.2s', animationDuration: '3s' }} />
        <circle cx="145" cy="120" r="2" fill="#ef4444" className="animate-pulse" style={{ animationDelay: '1s', animationDuration: '4s' }} />
        <circle cx="115" cy="165" r="1.5" fill="#10b981" className="animate-pulse" style={{ animationDelay: '1.8s', animationDuration: '2.5s' }} />
        <circle cx="50" cy="130" r="2" fill="#f59e0b" className="animate-pulse" style={{ animationDelay: '0.6s', animationDuration: '3.5s' }} />

        {/* Rotating Radar Sweep Group - class provided for GSAP select & scoping */}
        <g className="radar-sweep-g" style={{ transformOrigin: '100px 100px' }}>
          {/* Main sweeping laser line */}
          <line x1="100" y1="100" x2="100" y2="5" stroke="#3b82f6" strokeWidth="1.5" className="opacity-80" />
          {/* Sweeping fade trail wedge */}
          {!isReduced && (
            <path
              d="M 100 100 L 100 5 A 95 95 0 0 1 155 23 Z"
              fill="url(#radar-sweep-gradient)"
              opacity="0.15"
            />
          )}
        </g>

        <defs>
          <linearGradient id="radar-sweep-gradient" x1="100" y1="100" x2="155" y2="23" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {/* Center Command Core */}
        <circle cx="100" cy="100" r="1.5" fill="#3b82f6" />
        <circle cx="100" cy="100" r="4" stroke="#3b82f6" strokeWidth="0.5" className="opacity-55" />
      </svg>
    </div>
  );
}
