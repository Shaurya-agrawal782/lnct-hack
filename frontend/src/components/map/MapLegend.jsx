import React from 'react';

export default function MapLegend() {
  return (
    <div className="bg-surface border border-outline-variant rounded-xl p-4 space-y-4 shadow-sm text-xs text-left">
      {/* Map Markers Section */}
      <div className="space-y-2">
        <h3 className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Map Markers</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
              <span className="absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-20 animate-pulse"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500 border border-white"></span>
            </div>
            <span className="text-on-surface-variant font-medium">Incident Report (Critical)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-5 h-5 shrink-0">
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-500 border border-white"></span>
            </div>
            <span className="text-on-surface-variant font-medium">Incident Report (Medium)</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <div className="w-5 h-5 rounded bg-violet-500 flex items-center justify-center border border-white shadow-sm shrink-0">
              <span className="text-[7px] font-bold text-white">R</span>
            </div>
            <span className="text-on-surface-variant font-medium">Resource Marker</span>
          </div>
        </div>
      </div>

      {/* Crowd Risk Density Zones Section */}
      <div className="space-y-2 pt-3 border-t border-outline-variant/60">
        <h3 className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Risk Density Zones</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2.5">
            <span className="w-4 h-4 rounded-full border border-dashed border-red-500 bg-red-500/20 inline-block shrink-0"></span>
            <span className="text-on-surface-variant font-medium">Critical Density Zone</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-4 h-4 rounded-full border border-dashed border-amber-500 bg-amber-500/20 inline-block shrink-0"></span>
            <span className="text-on-surface-variant font-medium">Warning Density Zone</span>
          </div>
          <div className="flex items-center space-x-2.5">
            <span className="w-4 h-4 rounded-full border border-dashed border-emerald-500 bg-emerald-500/20 inline-block shrink-0"></span>
            <span className="text-on-surface-variant font-medium">Normal Density Zone</span>
          </div>
        </div>
      </div>

      {/* Resource Status Section */}
      <div className="space-y-2 pt-3 border-t border-outline-variant/60">
        <h3 className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Resource Status</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-emerald-500 border border-white inline-block shadow-sm shrink-0"></span>
            <span className="text-on-surface-variant font-medium">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-violet-500 border border-white inline-block shadow-sm shrink-0"></span>
            <span className="text-on-surface-variant font-medium">Assigned</span>
          </div>
        </div>
      </div>
    </div>
  );
}
