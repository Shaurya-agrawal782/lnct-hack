import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Eye, Calendar } from 'lucide-react';

export default function RecentIncidents({ incidents = [] }) {
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'low':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">High</span>;
      case 'critical':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">Critical</span>;
      default:
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">{sev}</span>;
    }
  };

  const getStatusBadge = (stat) => {
    switch (stat) {
      case 'reported':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Reported</span>;
      case 'verified':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Verified</span>;
      case 'assigned':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Assigned</span>;
      case 'in-progress':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">In Progress</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>;
      case 'closed':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Closed</span>;
      default:
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">{stat}</span>;
    }
  };

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-850 transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span>Recent Incidents</span>
        </h3>
        <Link 
          to="/dashboard/incidents" 
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          View All
        </Link>
      </div>

      {incidents.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-slate-500 text-sm font-medium">
          No recent incidents reported.
        </div>
      ) : (
        <div className="flex-1 divide-y divide-slate-900 overflow-y-auto space-y-3 pr-1">
          {incidents.map((incident) => (
            <div 
              key={incident._id} 
              className="pt-3 first:pt-0 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-slate-200 truncate block max-w-[180px] md:max-w-[240px]">
                    {incident.title}
                  </span>
                  <span className="text-slate-500 text-xxs uppercase tracking-wider font-mono">
                    ({incident.type})
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-xxs text-slate-400">
                  <Calendar className="h-3 w-3 text-slate-500" />
                  <span>{new Date(incident.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  {getSeverityBadge(incident.severity)}
                  <span>•</span>
                  {getStatusBadge(incident.status)}
                </div>
              </div>

              <div className="flex items-center justify-end shrink-0">
                <Link
                  to={`/dashboard/incidents/${incident._id}`}
                  className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 hover:bg-slate-800/80 text-slate-400 hover:text-indigo-400 transition"
                  title="View Details"
                >
                  <Eye className="h-4 w-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
