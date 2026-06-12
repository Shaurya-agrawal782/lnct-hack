import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import useAuth from '../hooks/useAuth';

export default function RoleRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-slate-400">Verifying roles...</span>
        </div>
      </div>
    );
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6 p-8 bg-slate-950/40 border border-slate-800 rounded-2xl shadow-xl">
          <div className="flex justify-center">
            <div className="p-4 bg-red-500/10 rounded-full text-red-500">
              <ShieldAlert className="h-16 w-16" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white tracking-tight">Access Denied</h2>
          <p className="text-slate-400 text-sm">
            Your account role <span className="font-semibold text-slate-200">({user?.role || 'anonymous'})</span> does not have permissions to access this page.
          </p>
          <div className="pt-4">
            <Link
              to="/dashboard"
              className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/20 transition"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
