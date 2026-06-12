import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Plus, Search, Filter, RefreshCw, Eye } from 'lucide-react';
import { getIncidents } from '../../api/incidentApi';
import useAuth from '../../hooks/useAuth';

export default function Incidents() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [severity, setSeverity] = useState('');
  const [type, setType] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchIncidentsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        page,
        limit: 10,
        sort: '-createdAt'
      };
      if (search.trim()) params.search = search;
      if (status) params.status = status;
      if (severity) params.severity = severity;
      if (type) params.type = type;

      const res = await getIncidents(params);
      if (res.success) {
        setIncidents(res.data.incidents);
        setTotalPages(res.data.pagination.totalPages);
      } else {
        setError(res.message || 'Failed to retrieve incidents');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while fetching incidents.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidentsData();
  }, [page, status, severity, type]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchIncidentsData();
  };

  const handleResetFilters = () => {
    setSearch('');
    setStatus('');
    setSeverity('');
    setType('');
    setPage(1);
  };

  // Helper styles for severity badges
  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'low':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>;
      case 'medium':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>;
      case 'high':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">High</span>;
      case 'critical':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse">Critical</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">{sev}</span>;
    }
  };

  // Helper styles for status badges
  const getStatusBadge = (stat) => {
    switch (stat) {
      case 'reported':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">Reported</span>;
      case 'verified':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">Verified</span>;
      case 'assigned':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">Assigned</span>;
      case 'in-progress':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">In Progress</span>;
      case 'resolved':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Resolved</span>;
      case 'closed':
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">Closed</span>;
      default:
        return <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">{stat}</span>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Incident Logs</h1>
            <p className="text-sm text-slate-400">View, update, and manage emergency incident dispatches</p>
          </div>
        </div>

        {/* Create incident button (always shown, but text is adaptive) */}
        <Link
          to="/dashboard/incidents/new"
          className="inline-flex items-center justify-center space-x-2 px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-lg shadow-indigo-600/20 transition-all duration-150"
        >
          <Plus className="h-4 w-4" />
          <span>Report Incident</span>
        </Link>
      </div>

      {/* Search and Filters Panel */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-4 md:p-6 space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-slate-500" />
            <input
              type="text"
              placeholder="Search keyword in title or description..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-slate-900/60">
          <div className="flex items-center space-x-1.5 text-xs text-slate-400 mr-2">
            <Filter className="h-3.5 w-3.5" />
            <span>Filters:</span>
          </div>

          {/* Type Filter */}
          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="fire">Fire</option>
            <option value="flood">Flood</option>
            <option value="medical">Medical</option>
            <option value="accident">Accident</option>
            <option value="crowd">Crowd</option>
            <option value="rescue">Rescue</option>
            <option value="other">Other</option>
          </select>

          {/* Severity Filter */}
          <select
            value={severity}
            onChange={(e) => { setSeverity(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>

          {/* Status Filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="reported">Reported</option>
            <option value="verified">Verified</option>
            <option value="assigned">Assigned</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Reset button */}
          {(search || type || severity || status) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center space-x-1 px-2.5 py-1.5 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              <RefreshCw className="h-3 w-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Content Section */}
      {loading ? (
        <div className="flex flex-col items-center justify-center p-12 min-h-[300px]">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <span className="text-sm text-slate-400">Loading incidents...</span>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6 text-center">
          <p className="text-sm text-red-400 font-semibold">{error}</p>
          <button
            onClick={fetchIncidentsData}
            className="mt-3 text-xs text-indigo-400 hover:underline inline-flex items-center gap-1.5"
          >
            <RefreshCw className="h-3 w-3" /> Try Again
          </button>
        </div>
      ) : incidents.length === 0 ? (
        <div className="p-8 bg-slate-950/40 border border-slate-800 rounded-2xl flex flex-col justify-center items-center text-center min-h-[300px]">
          <div className="w-14 h-14 rounded-full bg-slate-900 flex items-center justify-center text-slate-600 mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h2 className="text-lg font-semibold text-slate-200 mb-1">No Incidents Found</h2>
          <p className="text-sm text-slate-400 max-w-sm">
            {search || type || severity || status
              ? "No reports match your current filters. Try relaxing filters or search terms."
              : "No emergency incidents have been reported yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Table Container */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/40">
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Incident</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Type</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Severity</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Status</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Location/Address</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Reported At</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase">Responder</th>
                    <th className="p-4 text-xs font-semibold tracking-wider text-slate-400 uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-850">
                  {incidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-slate-900/30 transition-colors">
                      <td className="p-4 max-w-xs">
                        <div className="font-semibold text-white truncate text-sm">{incident.title}</div>
                        <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{incident.description}</div>
                      </td>
                      <td className="p-4 capitalize text-sm text-slate-300">{incident.type}</td>
                      <td className="p-4">{getSeverityBadge(incident.severity)}</td>
                      <td className="p-4">{getStatusBadge(incident.status)}</td>
                      <td className="p-4 max-w-xs">
                        <div className="text-sm text-slate-300 truncate">{incident.location?.address}</div>
                      </td>
                      <td className="p-4 text-xs text-slate-400">
                        {new Date(incident.createdAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4 text-sm">
                        {incident.assignedResponder ? (
                          <span className="text-indigo-400 font-medium">{incident.assignedResponder.name}</span>
                        ) : (
                          <span className="text-slate-500 italic text-xs">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <Link
                          to={`/dashboard/incidents/${incident._id}`}
                          className="inline-flex items-center space-x-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-400 hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 border border-indigo-500/15 hover:border-indigo-500/30 rounded-lg transition-all"
                        >
                          <Eye className="h-3.5 w-3.5" />
                          <span>View</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Simple Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-slate-400">
                Page {page} of {totalPages}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => Math.max(p - 1, 1))}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all"
                >
                  Previous
                </button>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => Math.min(p + 1, totalPages))}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all"
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
