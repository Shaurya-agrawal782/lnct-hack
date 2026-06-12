import React, { useState, useEffect } from 'react';
import { Bell, CheckSquare, Eye, RefreshCw, AlertTriangle, AlertOctagon, MailOpen, Inbox } from 'lucide-react';
import { getMyAlerts, markAlertRead, markAllAlertsRead } from '../../api/alertApi';
import useSocket from '../../hooks/useSocket';
import useAuth from '../../hooks/useAuth';

export default function Alerts() {
  const { user } = useAuth();
  const { liveAlerts, clearLiveAlerts } = useSocket();

  const [dbAlerts, setDbAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadOnly, setUnreadOnly] = useState(false);

  // Pagination
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAlertsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getMyAlerts({
        page,
        limit: 10,
        unreadOnly
      });
      if (res.success) {
        setDbAlerts(res.data.alerts);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setError(res.message || 'Failed to retrieve alerts.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading alerts.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsData();
  }, [page, unreadOnly]);

  const handleMarkSingleRead = async (id) => {
    try {
      const res = await markAlertRead(id);
      if (res.success) {
        // Update both live state and db state
        setDbAlerts(prev => prev.map(a => a._id === id ? res.data.alert : a));
      }
    } catch (err) {
      console.error('Failed to mark alert read:', err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      const res = await markAllAlertsRead();
      if (res.success) {
        clearLiveAlerts();
        fetchAlertsData();
      }
    } catch (err) {
      console.error('Failed to mark all alerts read:', err);
    }
  };

  // Helper styles for priority badges
  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'low':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">High</span>;
      case 'critical':
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">Critical</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-500/10 text-slate-400 border border-slate-500/20">{prio}</span>;
    }
  };

  const getTypeLabel = (type) => {
    const labels = {
      incident_created: 'New Incident',
      incident_assigned: 'Dispatch Assignment',
      status_updated: 'Incident Status Shift',
      resource_updated: 'Resource Modified',
      system: 'System Alert'
    };
    return labels[type] || type.replace('_', ' ');
  };

  const isRead = (alert) => {
    if (!user) return true;
    return alert.readBy && alert.readBy.some(entry => entry.user === user._id || entry.user?._id === user._id);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <Bell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Notification Center</h1>
            <p className="text-sm text-slate-400">View safety dispatches and coordinate task logs in real-time</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkAllRead}
            disabled={dbAlerts.length === 0 && liveAlerts.length === 0}
            className="inline-flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-650 hover:bg-indigo-550 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow transition"
          >
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Mark All Read</span>
          </button>
          
          <button
            onClick={fetchAlertsData}
            disabled={loading}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Filter panel */}
      <div className="flex items-center gap-4 text-sm font-medium">
        <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Filters:</span>
        <button
          onClick={() => { setUnreadOnly(false); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs transition ${!unreadOnly ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-850'}`}
        >
          All Notifications
        </button>
        <button
          onClick={() => { setUnreadOnly(true); setPage(1); }}
          className={`px-3 py-1.5 rounded-lg text-xs transition ${unreadOnly ? 'bg-indigo-600 text-white font-semibold shadow' : 'text-slate-400 hover:text-white bg-slate-900/40 border border-slate-850'}`}
        >
          Unread Only
        </button>
      </div>

      {/* Live Alerts overlay section */}
      {liveAlerts.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span>Incoming Live Notifications ({liveAlerts.length})</span>
            </h2>
            <button
              onClick={clearLiveAlerts}
              className="text-[10px] text-slate-500 hover:text-slate-300"
            >
              Clear Live Overlay
            </button>
          </div>

          <div className="space-y-2">
            {liveAlerts.map((alert) => (
              <div
                key={`live-${alert._id}`}
                className="bg-indigo-950/20 border-2 border-indigo-500/30 rounded-2xl p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 shadow-xl transition-all duration-300"
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    {getPriorityBadge(alert.priority)}
                    <span className="text-xs font-bold text-indigo-300">{getTypeLabel(alert.type)}</span>
                    <span className="text-[10px] text-slate-500">Just Now</span>
                  </div>
                  <h3 className="text-sm font-bold text-white leading-snug">{alert.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{alert.message}</p>
                </div>
                <div className="shrink-0 flex md:flex-col items-end gap-2">
                  <button
                    onClick={() => handleMarkSingleRead(alert._id)}
                    className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/15 border border-indigo-500/20 rounded transition"
                  >
                    <MailOpen className="h-3 w-3" />
                    <span>Acknowledge</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Historical DB Alerts list */}
      {loading && dbAlerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 min-h-[200px]">
          <div className="w-8 h-8 border-3 border-indigo-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <span className="text-xs text-slate-400">Retrieving alert logs...</span>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-sm text-red-400 font-semibold">{error}</p>
        </div>
      ) : dbAlerts.length === 0 ? (
        <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center items-center text-center min-h-[250px]">
          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-slate-650 mb-3">
            <Inbox className="h-5 w-5" />
          </div>
          <h2 className="text-base font-semibold text-slate-300 mb-1">Logs Clear</h2>
          <p className="text-xs text-slate-500 max-w-sm">
            {unreadOnly ? "You do not have any unread notifications." : "Your emergency notification inbox is empty."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl divide-y divide-slate-900 overflow-hidden shadow-xl">
            {dbAlerts.map((alert) => {
              const read = isRead(alert);
              return (
                <div
                  key={alert._id}
                  className={`p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-4 transition-colors ${read ? 'bg-transparent' : 'bg-indigo-500/5 hover:bg-indigo-500/10 border-l-2 border-indigo-500'}`}
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getPriorityBadge(alert.priority)}
                      <span className="text-xs font-semibold text-slate-300">{getTypeLabel(alert.type)}</span>
                      <span className="text-[10px] text-slate-500">
                        {new Date(alert.createdAt).toLocaleString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white leading-snug">{alert.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{alert.message}</p>
                  </div>
                  
                  <div className="shrink-0 flex items-center gap-2">
                    {!read && (
                      <button
                        onClick={() => handleMarkSingleRead(alert._id)}
                        className="inline-flex items-center space-x-1 px-2.5 py-1 text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/10 rounded transition"
                      >
                        <MailOpen className="h-3 w-3" />
                        <span>Mark Read</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
