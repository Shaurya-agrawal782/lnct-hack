import React from 'react';
import { Wrench } from 'lucide-react';

export default function Resources() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
          <Wrench className="h-6 w-6" />
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">Resource Management</h1>
      </div>

      <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center items-center text-center min-h-[400px]">
        <div className="w-16 h-16 rounded-full bg-slate-850/50 flex items-center justify-center text-slate-500 mb-4 animate-pulse">
          <Wrench className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-semibold text-slate-200 mb-1">Resource Database & Inventory</h2>
        <p className="text-sm text-slate-400 max-w-sm">
          Coming in next module. Full inventory grids for tracking dispatching and availability of food, personnel, and medical kits.
        </p>
      </div>
    </div>
  );
}
