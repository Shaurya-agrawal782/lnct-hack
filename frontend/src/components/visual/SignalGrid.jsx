import React from 'react';

export default function SignalGrid() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-[0.06]">
      {/* Coordinate grid lines using CSS gradients */}
      <div 
        className="absolute inset-0" 
        style={{ 
          backgroundImage: 'linear-gradient(to right, #3b82f6 1px, transparent 1px), linear-gradient(to bottom, #3b82f6 1px, transparent 1px)', 
          backgroundSize: '48px 48px' 
        }}
      />
      {/* Technical grid markers to give it a command dashboard look */}
      <div className="absolute top-[20%] left-[25%] w-1 h-1 rounded-full bg-blue-500" />
      <div className="absolute top-[60%] left-[75%] w-1 h-1 rounded-full bg-blue-400" />
      <div className="absolute top-[80%] left-[45%] w-1 h-1 rounded-full bg-blue-500" />
      <div className="absolute top-[35%] left-[85%] w-1 h-1 rounded-full bg-blue-400" />
    </div>
  );
}
