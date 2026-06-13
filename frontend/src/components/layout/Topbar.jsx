import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';

export default function Topbar({ onMenuClick }) {
  const { user } = useAuth();
  const { connected, liveAlerts } = useSocket();
  const location = useLocation();

  if (!user) return null;

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'Emergency Operations Command';
    if (path === '/dashboard/incidents/new') return 'Report Incident';
    if (path === '/dashboard/incidents') return 'Incident Management';
    if (path.startsWith('/dashboard/incidents/')) return 'Incident Details';
    if (path.startsWith('/dashboard/resources')) return 'Resource Inventory';
    if (path.startsWith('/dashboard/map')) return 'Live Incident Map';
    if (path.startsWith('/dashboard/alerts')) return 'Broadcast Alerts';
    if (path.startsWith('/dashboard/reports')) return 'Operational Reports';
    if (path.startsWith('/dashboard/responders')) return 'Field Responders';
    if (path.startsWith('/dashboard/groups')) return 'Incident Groups';
    return 'DisasterConnect';
  };

  return (
    <header className="bg-[#FFFFFF] border-b border-[#DDE3EA] fixed top-0 w-full md:w-[calc(100%-260px)] z-50 flex justify-between items-center px-6 md:px-margin-desktop h-16">
      <div className="flex items-center space-x-3">
        {/* Hamburger menu button for mobile */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-1.5 text-slate-800 hover:bg-slate-100 rounded-lg transition-colors flex items-center justify-center border border-slate-200"
          title="Open Menu"
        >
          <span className="material-symbols-outlined text-[20px]">menu</span>
        </button>
        <h1 className="text-lg font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center space-x-2">
        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 bg-slate-50 rounded-md border border-[#DDE3EA]">
          <span className={`w-1.5 h-1.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-[11px] font-semibold text-slate-600 uppercase tracking-wider">
            {connected ? 'CONNECTED' : 'OFFLINE'}
          </span>
        </div>

        <div className="h-5 w-px bg-[#DDE3EA] mx-2 hidden sm:block"></div>

        {/* Trailing Icon Actions */}
        <Link
          to="/dashboard/alerts"
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors relative flex items-center justify-center"
          title="Notification Center"
        >
          <span className="material-symbols-outlined text-[20px]">notifications</span>
          {liveAlerts.length > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-600 rounded-full"></span>
          )}
        </Link>

        {/* User Badge / Role Profile */}
        <div className="flex items-center space-x-3 ml-2">
          <div className="hidden sm:flex flex-col text-right leading-none">
            <span className="text-sm font-semibold text-slate-800 mb-0.5">
              {user.name}
            </span>
            <span className="text-xs text-slate-500">
              {user.email}
            </span>
          </div>
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
            user.role === 'admin' 
              ? 'bg-red-50 text-red-700 border-red-200' 
              : user.role === 'responder' 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-green-50 text-green-700 border-green-200'
          }`}>
            {user.role === 'admin' ? 'Command Admin' : user.role === 'responder' ? 'Field Responder' : 'Citizen Reporter'}
          </span>
        </div>

        {user.role === 'citizen' && (
          <Link
            to="/dashboard/incidents/new"
            className="hidden sm:flex items-center space-x-1.5 bg-[#EF4444] hover:bg-[#DC2626] text-white py-1.5 px-3 rounded-lg font-semibold text-[13px] transition-all ml-3 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">report</span>
            <span>Report Incident</span>
          </Link>
        )}
      </div>
    </header>
  );
}
