import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Activity, Map, Bell, Server } from 'lucide-react';

export default function AuthShell({ children }) {
  return (
    <div className="min-h-screen grid grid-cols-12 bg-background font-body-md text-body-md antialiased text-on-surface">
      {/* Left Column: Brand & Product Features (Desktop only) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-6 bg-[#0B1628] text-white flex-col justify-between p-12 relative overflow-hidden border-r border-[#1E293B]">
        {/* Decorative Grid and Ambient Glows */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div 
            className="absolute inset-0" 
            style={{ 
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', 
              backgroundSize: '24px 24px' 
            }}
          />
        </div>
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/10 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

        {/* Header Branding */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-2.5 text-white hover:opacity-90 transition-opacity">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center border border-primary/20 shadow-lg shadow-primary/20">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="font-headline-md text-headline-md font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
              DisasterConnect
            </span>
          </Link>
        </div>

        {/* Feature List */}
        <div className="relative z-10 my-auto py-12 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-container/20 border border-primary/30 text-primary-fixed-dim text-xs font-semibold mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Operational Command Center
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-8 leading-tight">
            Coordinating crisis response & safety in real-time.
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 border border-slate-700/50">
                <Map className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">Interactive Hazard Map</h4>
                <p className="text-slate-400 text-xs mt-0.5">Visualize ongoing incidents and crowd heatmaps with geo-spatial filtering.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 border border-slate-700/50">
                <Bell className="w-4 h-4 text-amber-500" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">Dynamic Safety Alerts</h4>
                <p className="text-slate-400 text-xs mt-0.5">Push critical notices to affected zones and broadcast evacuations instantly.</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-lg bg-slate-800/80 flex items-center justify-center shrink-0 border border-slate-700/50">
                <Activity className="w-4 h-4 text-emerald-500" />
              </div>
              <div>
                <h4 className="font-semibold text-slate-100 text-sm">Resource Management</h4>
                <p className="text-slate-400 text-xs mt-0.5">Track dispatcher assets, water, and medical supplies across staging areas.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Security Note */}
        <div className="relative z-10 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-primary" />
            <span>Secure session powered by HttpOnly cookies.</span>
          </div>
          <span className="text-[10px] text-slate-500 tracking-wider uppercase">DisasterConnect Protocol</span>
        </div>
      </div>

      {/* Right Column: Form (Desktop & Mobile) */}
      <div className="col-span-12 lg:col-span-7 xl:col-span-6 flex items-center justify-center p-6 md:p-12 bg-background min-h-screen relative">
        <div className="absolute top-6 left-6 lg:hidden">
          <Link to="/" className="inline-flex items-center gap-2 text-[#0B1628] font-bold">
            <Shield className="w-5 h-5 text-primary" />
            <span>DisasterConnect</span>
          </Link>
        </div>
        <div className="w-full max-w-[440px] py-12">
          {children}
        </div>
      </div>
    </div>
  );
}
