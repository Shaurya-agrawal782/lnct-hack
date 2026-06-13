import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Filter items matching user role
  const getNavItems = () => {
    switch (user.role) {
      case 'admin':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
          { name: 'Incidents', path: '/dashboard/incidents', icon: 'emergency' },
          { name: 'Resources', path: '/dashboard/resources', icon: 'inventory_2' },
          { name: 'Interactive Map', path: '/dashboard/map', icon: 'map' },
          { name: 'Alerts', path: '/dashboard/alerts', icon: 'notifications_active' },
          { name: 'Reports', path: '/dashboard/reports', icon: 'bar_chart' },
          { name: 'Responders', path: '/dashboard/responders', icon: 'badge' },
          { name: 'Incident Groups', path: '/dashboard/groups', icon: 'folder_zip' }
        ];
      case 'responder':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
          { name: 'My Incidents', path: '/dashboard/incidents', icon: 'emergency' },
          { name: 'Resources', path: '/dashboard/resources', icon: 'inventory_2' },
          { name: 'Interactive Map', path: '/dashboard/map', icon: 'map' },
          { name: 'Alerts', path: '/dashboard/alerts', icon: 'notifications_active' }
        ];
      case 'citizen':
        return [
          { name: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
          { name: 'Report Incident', path: '/dashboard/incidents/new', icon: 'report' },
          { name: 'My Reports', path: '/dashboard/incidents', icon: 'emergency' },
          { name: 'Alerts', path: '/dashboard/alerts', icon: 'notifications_active' }
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();
  const primaryPaths = ['/dashboard', '/dashboard/incidents', '/dashboard/incidents/new', '/dashboard/map', '/dashboard/alerts', '/dashboard/groups'];
  const primaryItems = navItems.filter(item => primaryPaths.includes(item.path));
  const operationsItems = navItems.filter(item => !primaryPaths.includes(item.path));

  return (
    <>
      {/* Backdrop for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/45 z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`flex flex-col bg-[#07111F] text-inverse-on-surface h-full w-[260px] fixed left-0 top-0 pt-5 pb-6 border-r border-[rgba(255,255,255,0.08)] z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        {/* Header */}
        <div className="px-5 mb-5 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="material-symbols-outlined text-[#2563EB] text-[22px] shrink-0">shield</span>
            <div className="flex flex-col">
              <span className="text-white font-bold text-base leading-none tracking-tight">DisasterConnect</span>
              <span className="text-[10px] text-[#94A3B8] font-semibold tracking-wider uppercase mt-0.5">Command Center</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-slate-400 hover:text-white flex items-center justify-center p-1"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* CTA Section */}
        <div className="px-4 mb-4">
          {user.role === 'citizen' && (
            <Link
              to="/dashboard/incidents/new"
              onClick={onClose}
              className="w-full bg-[#EF4444] hover:bg-[#DC2626] text-white h-[44px] rounded-[10px] transition flex items-center justify-center space-x-2 shadow-sm font-semibold text-[14px]"
            >
              <span className="material-symbols-outlined text-[18px]">report</span>
              <span>Report Incident</span>
            </Link>
          )}
          {user.role === 'admin' && (
            <Link
              to="/dashboard/incidents"
              onClick={onClose}
              className="w-full bg-[#2563EB] hover:bg-[#1d4ed8] text-white h-[44px] rounded-[10px] transition flex items-center justify-center space-x-2 shadow-sm font-semibold text-[14px]"
            >
              <span className="material-symbols-outlined text-[18px]">flight_takeoff</span>
              <span>Dispatch</span>
            </Link>
          )}
        </div>

        {/* Main Tabs */}
        <div className="flex-1 overflow-y-auto px-4 space-y-4 sidebar-scroll">
          {/* Primary Section */}
          {primaryItems.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-semibold text-[#94A3B8]/40 uppercase tracking-wider">
                Primary
              </div>
              {primaryItems.map((item, index) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3.5 h-[44px] rounded-[10px] transition-all duration-150 border ${
                      isActive
                        ? 'bg-[#102A56] text-[#FFFFFF] border-[#2563EB]/30 border-l-[3px] border-l-[#2563EB] font-semibold'
                        : 'text-[#94A3B8] border-transparent hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                    <span className="text-[14px] leading-none">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Operations Section */}
          {operationsItems.length > 0 && (
            <div className="space-y-1">
              <div className="px-3 py-1 text-[10px] font-semibold text-[#94A3B8]/40 uppercase tracking-wider">
                Operations
              </div>
              {operationsItems.map((item, index) => {
                const isActive = location.pathname === item.path;

                return (
                  <Link
                    key={index}
                    to={item.path}
                    onClick={onClose}
                    className={`flex items-center space-x-3 px-3.5 h-[44px] rounded-[10px] transition-all duration-150 border ${
                      isActive
                        ? 'bg-[#102A56] text-[#FFFFFF] border-[#2563EB]/30 border-l-[3px] border-l-[#2563EB] font-semibold'
                        : 'text-[#94A3B8] border-transparent hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[20px] shrink-0">{item.icon}</span>
                    <span className="text-[14px] leading-none">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Tabs */}
        <div className="px-4 pt-3 border-t border-[rgba(255,255,255,0.08)] mt-auto">
          <button
            onClick={() => {
              onClose?.();
              logout();
            }}
            className="w-full flex items-center space-x-3 px-3.5 h-[44px] rounded-[10px] text-[#94A3B8] hover:text-white hover:bg-white/5 border border-transparent transition-all duration-150 text-left"
          >
            <span className="material-symbols-outlined text-[20px] shrink-0">logout</span>
            <span className="text-[14px] font-medium leading-none">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
