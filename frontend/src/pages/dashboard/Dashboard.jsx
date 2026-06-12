import React from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  Bell, 
  Activity 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Dashboard() {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            You are logged in with role access levels of{' '}
            <span className="font-semibold text-indigo-400 uppercase tracking-wide">
              {user.role}
            </span>.
          </p>
        </div>
      </div>

      {/* Grid of status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-yellow-500/10 text-yellow-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Active Incidents
            </span>
            <span className="text-3xl font-extrabold text-white mt-1 block">0</span>
          </div>
        </div>

        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-indigo-500/10 text-indigo-400">
            <Wrench className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Available Resources
            </span>
            <span className="text-3xl font-extrabold text-white mt-1 block">0</span>
          </div>
        </div>

        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-pink-500/10 text-pink-400">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Critical Alerts
            </span>
            <span className="text-3xl font-extrabold text-white mt-1 block">0</span>
          </div>
        </div>

        <div className="p-6 bg-slate-950/40 border border-slate-800 rounded-2xl flex items-center space-x-4">
          <div className="p-3.5 rounded-xl bg-emerald-500/10 text-emerald-400">
            <Activity className="h-6 w-6" />
          </div>
          <div>
            <span className="block text-xs text-slate-400 font-semibold uppercase tracking-wider">
              Response Status
            </span>
            <span className="text-3xl font-extrabold text-emerald-400 mt-1 block">Active</span>
          </div>
        </div>
      </div>

      {/* Primary content area grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 p-6 bg-slate-950/20 border border-slate-800 rounded-2xl min-h-[300px] flex flex-col justify-center items-center text-center">
          <span className="text-slate-500 text-sm font-medium">
            Visualization analytics and mapping will load here.
          </span>
        </div>
        <div className="p-6 bg-slate-950/20 border border-slate-800 rounded-2xl flex flex-col justify-center items-center text-center">
          <span className="text-slate-500 text-sm font-medium">
            Critical emergency log highlights.
          </span>
        </div>
      </div>
    </div>
  );
}
