import React from 'react';
import RiskRadar from './RiskRadar';

/**
 * Spline scene can be plugged in later via VITE_SPLINE_SCENE_URL.
 * This slot allows modular integration of high-impact 3D Spline visuals
 * without bloating dependencies in normal runtime setups.
 */
export default function SplineSceneSlot() {
  const splineUrl = import.meta.env.VITE_SPLINE_SCENE_URL;

  if (splineUrl) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900/40">
        <iframe
          src={splineUrl}
          title="Tactical command 3D layout map"
          className="w-full h-full absolute inset-0 border-0 pointer-events-none"
          loading="lazy"
          allow="xr-spatial-tracking"
        />
      </div>
    );
  }

  // Default fallback to SVG risk radar visualization
  return <RiskRadar />;
}
