import React from 'react';
import { LogOut, User, Activity } from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Topbar() {
  const { user, logout } = useAuth();

  if (!user) return null;

  // Role tag styling mapping
  const roleBadges = {
    admin: 'bg-red-500/10 text-red-400 border-red-500/20',
    responder: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    citizen: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
  };

  const badgeClass = roleBadges[user.role] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';

  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/20 backdrop-blur-md px-6 flex items-center justify-between z-10">
      {/* Active Sync Status */}
      <div className="flex items-center space-x-2">
        <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
        <span className="text-xs font-semibold tracking-wide text-slate-400 uppercase hidden sm:inline">
          Live coordination active
        </span>
      </div>

      {/* User Actions */}
      <div className="flex items-center space-x-4">
        {/* User Card */}
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-slate-800 text-slate-300 border border-slate-700/50">
            <User className="h-4 w-4" />
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-sm font-semibold text-white leading-none mb-1">
              {user.name}
            </span>
            <span className="block text-xs text-slate-400 leading-none">
              {user.email}
            </span>
          </div>
          {/* Role badge */}
          <span className={`px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded border ${badgeClass}`}>
            {user.role}
          </span>
        </div>

        <div className="h-6 w-px bg-slate-800"></div>

        {/* Logout */}
        <button
          onClick={logout}
          className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/5 rounded-lg border border-transparent hover:border-red-500/10 transition-all duration-150"
          title="Sign Out"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden md:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
