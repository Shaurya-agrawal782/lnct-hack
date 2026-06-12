import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import Badge from '../ui/Badge';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const { connected, liveAlerts } = useSocket();

  if (!user) return null;

  return (
    <header className="bg-surface border-b border-outline-variant fixed top-0 w-full md:w-[calc(100%-280px)] z-50 flex justify-between items-center px-6 md:px-margin-desktop h-16">
      <div className="flex items-center space-x-3">
        {/* Hamburger menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 text-on-surface hover:bg-surface-container rounded-lg transition-colors flex items-center justify-center border border-outline-variant"
          title="Open Menu"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <h1 className="font-headline-md text-headline-md font-bold text-primary">DisasterConnect</h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 bg-surface-container-low rounded border border-outline-variant">
          <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">
            {connected ? 'Real-time Linked' : 'Off-line Sync'}
          </span>
        </div>

        <div className="h-6 w-px bg-outline-variant mx-2 hidden sm:block"></div>

        {/* Trailing Icon Actions */}
        <Link
          to="/dashboard/alerts"
          className="p-2 text-on-surface-variant hover:bg-surface-container-high rounded transition-colors relative"
          title="Notification Center"
        >
          <span className="material-symbols-outlined">notifications</span>
          {liveAlerts.length > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full"></span>
          )}
        </Link>

        {/* User Badge / Role Profile */}
        <div className="flex items-center space-x-3 ml-2">
          <div className="hidden sm:flex flex-col text-right">
            <span className="block text-sm font-semibold text-on-surface leading-none mb-1">
              {user.name}
            </span>
            <span className="block text-xs text-on-surface-variant leading-none">
              {user.email}
            </span>
          </div>
          <Badge variant={user.role === 'admin' ? 'error' : user.role === 'responder' ? 'primary' : 'success'} className="tracking-wider uppercase text-[10px]">
            {user.role}
          </Badge>
        </div>

        <Link
          to="/dashboard/incidents/new"
          className="hidden sm:flex items-center space-x-1 bg-error hover:opacity-90 text-on-error py-1.5 px-4 rounded-lg font-label-md text-label-md transition-all ml-3 border border-transparent shrink-0"
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>report</span>
          <span>Report Incident</span>
        </Link>
      </div>
    </header>
  );
}
