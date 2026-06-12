import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Shield, 
  LayoutDashboard, 
  AlertTriangle, 
  Wrench, 
  Map, 
  Bell, 
  BarChart3 
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return null;

  // Base navigation menu options
  const allNavItems = [
    {
      name: 'Dashboard',
      path: '/dashboard',
      icon: LayoutDashboard,
      roles: ['admin', 'responder', 'citizen']
    },
    {
      name: 'Incidents',
      path: '/dashboard/incidents',
      icon: AlertTriangle,
      roles: ['admin', 'responder']
    },
    {
      name: 'Report Incident',
      path: '/dashboard/incidents',
      icon: AlertTriangle,
      roles: ['citizen'] // For citizens, we label it "Report Incident"
    },
    {
      name: 'Resources',
      path: '/dashboard/resources',
      icon: Wrench,
      roles: ['admin']
    },
    {
      name: 'Interactive Map',
      path: '/dashboard/map',
      icon: Map,
      roles: ['admin', 'responder']
    },
    {
      name: 'Alerts',
      path: '/dashboard/alerts',
      icon: Bell,
      roles: ['admin', 'responder', 'citizen']
    },
    {
      name: 'Reports',
      path: '/dashboard/reports',
      icon: BarChart3,
      roles: ['admin']
    }
  ];

  // Filter items matching user role
  const navItems = allNavItems.filter(item => item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden md:flex">
      <div className="p-6">
        <div className="flex items-center space-x-2.5 mb-8">
          <Shield className="h-8 w-8 text-indigo-500" />
          <span className="text-xl font-bold tracking-tight text-white">DisasterConnect</span>
        </div>

        <nav className="space-y-1.5">
          {navItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center space-x-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ${
                  isActive 
                    ? 'bg-indigo-650 text-white shadow-lg shadow-indigo-650/20' 
                    : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-slate-900 text-center text-xs text-slate-500">
        DisasterConnect Coordination
      </div>
    </aside>
  );
}
