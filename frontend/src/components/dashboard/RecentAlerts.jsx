import React from 'react';
import { Link } from 'react-router-dom';
import { Bell, Calendar, Mail, MailOpen } from 'lucide-react';

export default function RecentAlerts({ alerts = [], user }) {
  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'low':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">High</span>;
      case 'critical':
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">Critical</span>;
      default:
        return <span className="px-2 py-0.5 text-xxs font-semibold rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">{prio}</span>;
    }
  };

  const checkIsRead = (alert) => {
    if (!user) return true;
    return alert.readBy && alert.readBy.some(entry => entry.user === user._id || entry.user?._id === user._id);
  };

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-full hover:border-slate-850 transition duration-300">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Bell className="h-5 w-5 text-indigo-400" />
          <span>Recent Alerts</span>
        </h3>
        <Link 
          to="/dashboard/alerts" 
          className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
        >
          View All
        </Link>
      </div>

      {alerts.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 text-slate-500 text-sm font-medium">
          No recent alerts.
        </div>
      ) : (
        <div className="flex-1 divide-y divide-slate-900 overflow-y-auto space-y-3 pr-1">
          {alerts.map((alert) => {
            const isAlertRead = checkIsRead(alert);
            return (
              <div 
                key={alert._id} 
                className={`pt-3 first:pt-0 flex items-start justify-between gap-3 text-xs border-l-2 pl-3 transition ${
                  isAlertRead ? 'border-transparent text-slate-400' : 'border-indigo-500 text-slate-200 bg-indigo-500/5 rounded-r-lg'
                }`}
              >
                <div className="space-y-1 min-w-0 pb-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold truncate block max-w-[180px] md:max-w-[240px] ${isAlertRead ? 'text-slate-400' : 'text-slate-200'}`}>
                      {alert.title}
                    </span>
                  </div>
                  <p className="text-slate-400 text-xxs line-clamp-1">{alert.message}</p>
                  <div className="flex items-center space-x-2 text-xxs text-slate-500">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    <span>{new Date(alert.createdAt).toLocaleDateString()}</span>
                    <span>•</span>
                    {getPriorityBadge(alert.priority)}
                  </div>
                </div>

                <div className="flex items-center shrink-0 pt-0.5">
                  {isAlertRead ? (
                    <MailOpen className="h-4 w-4 text-slate-600" />
                  ) : (
                    <Mail className="h-4 w-4 text-indigo-400 animate-pulse" />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
