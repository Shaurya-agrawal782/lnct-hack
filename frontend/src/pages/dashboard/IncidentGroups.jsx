import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { fadeUp, staggerContainer, listItem, panelReveal } from '../../utils/motion';
import MetricCard from '../../components/dashboard/MetricCard';
import { getIncidentGroups, getIncidentGroupById, updateIncidentGroupStatus } from '../../api/incidentGroupApi';
import useAuth from '../../hooks/useAuth';

export default function IncidentGroups() {
  const { user } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  // Selected group details
  const [selectedGroupId, setSelectedGroupId] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState(null);

  // Resolution form state
  const [resolutionNote, setResolutionNote] = useState('');
  const [resolvingStatus, setResolvingStatus] = useState('resolved'); // 'resolved' or 'closed'
  const [actionSubmitting, setActionSubmitting] = useState(false);
  const [showConfirmResolve, setShowConfirmResolve] = useState(false);

  const fetchGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (statusFilter) params.status = statusFilter;
      if (typeFilter) params.type = typeFilter;
      if (searchTerm.trim()) params.search = searchTerm.trim();

      const res = await getIncidentGroups(params);
      if (res.success) {
        setGroups(res.data.groups || []);
      } else {
        setError(res.message || 'Failed to retrieve incident groups.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while loading incident groups.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, [statusFilter, typeFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchGroups();
  };

  const handleResetFilters = () => {
    setStatusFilter('');
    setTypeFilter('');
    setSearchTerm('');
    // Trigger immediate reload
    setTimeout(() => {
      fetchGroups();
    }, 50);
  };

  const handleSelectGroup = async (groupId) => {
    setSelectedGroupId(groupId);
    setSelectedGroup(null);
    setDetailsLoading(true);
    setDetailsError(null);
    setShowConfirmResolve(false);
    setResolutionNote('');

    try {
      const res = await getIncidentGroupById(groupId);
      if (res.success) {
        setSelectedGroup(res.data.group);
      } else {
        setDetailsError(res.message || 'Failed to load group details.');
      }
    } catch (err) {
      console.error(err);
      setDetailsError(err.response?.data?.message || 'Error loading group details.');
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleResolveGroupSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGroup) return;

    setActionSubmitting(true);
    setDetailsError(null);
    try {
      const res = await updateIncidentGroupStatus(selectedGroup._id, resolvingStatus, resolutionNote);
      if (res.success) {
        setSuccess(`Incident Group "${selectedGroup.groupNumber}" marked as ${resolvingStatus}.`);
        setEditingStatusDone(resolvingStatus);
      } else {
        setDetailsError(res.message || 'Failed to update group status.');
      }
    } catch (err) {
      console.error(err);
      setDetailsError(err.response?.data?.message || 'Error updating group status.');
    } finally {
      setActionSubmitting(false);
      setShowConfirmResolve(false);
    }
  };

  const setEditingStatusDone = (newStatus) => {
    // Update local groups listing
    setGroups(prev => prev.map(g => g._id === selectedGroup._id ? { ...g, status: newStatus } : g));
    setSelectedGroup(null);
    setSelectedGroupId(null);
    // Auto clear success alert after 5s
    setTimeout(() => setSuccess(null), 5000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-50 text-red-700 border border-red-200">Active</span>;
      case 'in-progress':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case 'resolved':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">Resolved</span>;
      case 'closed':
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-600 border border-slate-200">Closed</span>;
      default:
        return <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-slate-50 text-slate-700 border border-slate-200">{status}</span>;
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'critical':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-red-50 text-red-700 border border-red-200 uppercase tracking-wider">Critical</span>;
      case 'high':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-orange-50 text-orange-700 border border-orange-200 uppercase tracking-wider">High</span>;
      case 'medium':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wider">Medium</span>;
      case 'low':
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-50 text-slate-700 border border-slate-200 uppercase tracking-wider">Low</span>;
      default:
        return <span className="px-2 py-0.5 text-[9px] font-bold rounded bg-slate-50 text-slate-700 border border-slate-200 uppercase">{severity}</span>;
    }
  };

  const getTypeBadge = (type) => {
    return <span className="px-2 py-0.5 text-[10px] font-semibold rounded bg-blue-50 text-blue-700 border border-blue-200 capitalize">{type}</span>;
  };

  // Stats summaries
  const totalGroups = groups.length;
  const activeGroups = groups.filter(g => g.status === 'active' || g.status === 'in-progress').length;
  const resolvedGroups = totalGroups - activeGroups;

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-100">
            <span className="material-symbols-outlined text-[24px]">folder_zip</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Smart Incident Grouping
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage duplicate reports from nearby locations grouped automatically within 3-hour windows
            </p>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-lg flex items-center gap-2 text-sm shadow-sm animate-pulse">
          <span className="material-symbols-outlined text-emerald-600">check_circle</span>
          <span>{success}</span>
        </div>
      )}

      {/* Metrics Section */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={listItem}>
          <MetricCard
            label="Total Case Groups"
            value={totalGroups}
            helperText="Aggregated duplicate events"
            icon="folder_zip"
            accentStyle="text-slate-900 font-bold"
            iconBgStyle="bg-blue-50 text-blue-600 border border-blue-100"
          />
        </motion.div>
        <motion.div variants={listItem}>
          <MetricCard
            label="Active Groups"
            value={activeGroups}
            helperText="Awaiting dispatcher resolution"
            icon="warning"
            accentStyle="text-red-600 font-bold"
            iconBgStyle="bg-red-50 text-red-600 border border-red-100"
          />
        </motion.div>
        <motion.div variants={listItem}>
          <MetricCard
            label="Resolved Groups"
            value={resolvedGroups}
            helperText="Completed dispatch groups"
            icon="check_circle"
            accentStyle="text-emerald-600 font-bold"
            iconBgStyle="bg-emerald-50 text-emerald-600 border border-emerald-100"
          />
        </motion.div>
      </motion.div>

      {/* Filter and Search Panel */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 md:p-6 space-y-4 shadow-sm">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[20px]">search</span>
            <input
              type="text"
              placeholder="Search groups by GRP number or location summary..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition rounded-lg cursor-pointer"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-2">
            <span className="material-symbols-outlined text-[16px] text-slate-400">filter_list</span>
            <span>Filters:</span>
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-700 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer"
          >
            <option value="">All Types</option>
            <option value="fire">Fire</option>
            <option value="flood">Flood</option>
            <option value="medical">Medical</option>
            <option value="accident">Accident</option>
            <option value="crowd">Crowd Safety</option>
            <option value="rescue">Rescue</option>
            <option value="other">Other</option>
          </select>

          {/* Reset Filters */}
          {(statusFilter || typeFilter || searchTerm) && (
            <button
              onClick={handleResetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[16px]">restart_alt</span>
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Table/Directory view */}
        <div className="lg:col-span-12">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 min-h-[300px] space-y-3">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-slate-500">Loading incident groups...</span>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl text-center">
              <p className="font-semibold">{error}</p>
              <button onClick={fetchGroups} className="mt-3 text-xs text-blue-600 hover:underline font-bold inline-flex items-center gap-1 cursor-pointer">
                <span className="material-symbols-outlined text-[14px]">refresh</span> Retry
              </button>
            </div>
          ) : groups.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-xl flex flex-col justify-center items-center text-center min-h-[250px] shadow-sm">
              <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-4">
                <span className="material-symbols-outlined text-[28px]">folder_zip</span>
              </div>
              <h2 className="text-sm font-semibold text-slate-900 mb-1">No Incident Groups Found</h2>
              <p className="text-xs text-slate-500 max-w-sm">
                No reports fit the grouping criteria or filters selected.
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Group Number</th>
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Type & Severity</th>
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Location Summary</th>
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Timeline</th>
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Cases</th>
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase">Status</th>
                      <th className="p-3 text-[10px] font-bold tracking-wider text-slate-500 uppercase text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {groups.map((group) => (
                      <tr key={group._id} className="hover:bg-slate-50/50 transition text-xs">
                        <td className="p-3 font-bold text-slate-900">{group.groupNumber}</td>
                        <td className="p-3 space-y-1">
                          <div>{getTypeBadge(group.type)}</div>
                          <div>{getSeverityBadge(group.severitySummary)}</div>
                        </td>
                        <td className="p-3 max-w-xs truncate font-medium text-slate-800">{group.locationSummary}</td>
                        <td className="p-3 text-[10px] text-slate-500 space-y-0.5">
                          <div>First: {new Date(group.firstReportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                          <div>Last: {new Date(group.lastReportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        </td>
                        <td className="p-3 font-semibold text-blue-600 text-sm">
                          <span className="inline-flex items-center gap-1">
                            <span className="material-symbols-outlined text-[15px]">tag</span>
                            <span>{group.incidentCount}</span>
                          </span>
                        </td>
                        <td className="p-3">{getStatusBadge(group.status)}</td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => handleSelectGroup(group._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 font-bold bg-blue-50 text-blue-600 border border-blue-100 hover:bg-blue-100/80 transition rounded-lg cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[15px]">visibility</span>
                            <span>View Group</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Group Modal */}
      <AnimatePresence>
        {selectedGroupId && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div 
              className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative flex flex-col gap-4 text-left"
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
            >
              {/* Modal Header */}
              <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                <div>
                  <h2 className="text-base font-bold text-slate-900 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-blue-600">folder_zip</span>
                    Group Details: {selectedGroup?.groupNumber || '...'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Review and resolve linked incident reports
                  </p>
                </div>
                <button 
                  onClick={() => setSelectedGroupId(null)}
                  className="text-slate-500 hover:text-slate-800 p-1 rounded-lg hover:bg-slate-100 transition flex items-center justify-center cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {detailsLoading ? (
                <div className="flex flex-col items-center justify-center p-12 min-h-[200px] space-y-3">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span className="text-xs text-slate-500">Retrieving linked reports...</span>
                </div>
              ) : detailsError ? (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-xs">
                  {detailsError}
                </div>
              ) : selectedGroup ? (
                <div className="space-y-4">
                  {/* Summary Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div>
                      <div className="text-slate-500 font-semibold">Incident Type</div>
                      <div className="mt-1 font-bold">{getTypeBadge(selectedGroup.type)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-semibold">Severity Summary</div>
                      <div className="mt-1 font-bold">{getSeverityBadge(selectedGroup.severitySummary)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-semibold">Group Status</div>
                      <div className="mt-1 font-bold">{getStatusBadge(selectedGroup.status)}</div>
                    </div>
                    <div>
                      <div className="text-slate-500 font-semibold">Report Count</div>
                      <div className="mt-1 font-bold text-sm text-blue-600">#{selectedGroup.incidentCount}</div>
                    </div>
                  </div>

                  <div className="text-xs space-y-1 text-slate-700">
                    <div><span className="text-slate-500 font-semibold">Location Address Summary:</span> <span className="font-medium text-slate-900">{selectedGroup.locationSummary}</span></div>
                    <div><span className="text-slate-500 font-semibold">First Incident:</span> <span className="font-medium text-slate-900">{new Date(selectedGroup.firstReportedAt).toLocaleString()}</span></div>
                    <div><span className="text-slate-500 font-semibold">Last Incident:</span> <span className="font-medium text-slate-900">{new Date(selectedGroup.lastReportedAt).toLocaleString()}</span></div>
                  </div>

                  {/* Linked Incidents List */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Linked Citizen Incident Reports</h3>
                    <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[250px] overflow-y-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-slate-50 border-b border-slate-200">
                            <th className="p-2 text-[9px] font-bold text-slate-500 uppercase">Ticket</th>
                            <th className="p-2 text-[9px] font-bold text-slate-500 uppercase">Title</th>
                            <th className="p-2 text-[9px] font-bold text-slate-500 uppercase">Severity</th>
                            <th className="p-2 text-[9px] font-bold text-slate-500 uppercase">Status</th>
                            <th className="p-2 text-[9px] font-bold text-slate-500 uppercase">Location</th>
                            <th className="p-2 text-[9px] font-bold text-slate-500 uppercase text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {selectedGroup.incidents?.map(inc => (
                            <tr key={inc._id} className="hover:bg-slate-50/50">
                              <td className="p-2 font-bold text-slate-900">{inc.ticketNumber}</td>
                              <td className="p-2 truncate max-w-[120px]" title={inc.title}>{inc.title}</td>
                              <td className="p-2">{getSeverityBadge(inc.severity)}</td>
                              <td className="p-2">
                                <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold ${
                                  inc.status === 'resolved' ? 'bg-emerald-50 text-emerald-800 border border-emerald-100' :
                                  inc.status === 'closed' ? 'bg-slate-100 text-slate-700 border border-slate-200' : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}>
                                  {inc.status}
                                </span>
                              </td>
                              <td className="p-2 truncate max-w-[120px]" title={inc.location?.address}>{inc.location?.address}</td>
                              <td className="p-2 text-right">
                                <Link
                                  to={`/dashboard/incidents/${inc._id}`}
                                  target="_blank"
                                  className="text-blue-600 font-bold hover:underline"
                                >
                                  Details
                                </Link>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Resolution Notes Panel (Admin Control) */}
                  {['active', 'in-progress'].includes(selectedGroup.status) ? (
                    <div className="border-t border-slate-200 pb-2 pt-4 space-y-3">
                      <h3 className="text-xs font-bold text-blue-600 uppercase tracking-wider">Group Command Resolution</h3>
                      
                      {!showConfirmResolve ? (
                        <div className="space-y-3">
                          <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-1">
                              <input
                                type="radio"
                                id="status-resolved"
                                name="res-status"
                                checked={resolvingStatus === 'resolved'}
                                onChange={() => setResolvingStatus('resolved')}
                                className="accent-blue-600"
                              />
                              <label htmlFor="status-resolved" className="text-xs font-bold text-slate-800 cursor-pointer">Mark Resolved</label>
                            </div>
                            <div className="flex items-center gap-1">
                              <input
                                type="radio"
                                id="status-closed"
                                name="res-status"
                                checked={resolvingStatus === 'closed'}
                                onChange={() => setResolvingStatus('closed')}
                                className="accent-blue-600"
                              />
                              <label htmlFor="status-closed" className="text-xs font-bold text-slate-800 cursor-pointer">Mark Closed</label>
                            </div>
                          </div>

                          <div>
                            <label className="block text-[10px] font-semibold text-slate-500 mb-1 uppercase tracking-wider">Resolution Note</label>
                            <textarea
                              rows="2"
                              value={resolutionNote}
                              onChange={(e) => setResolutionNote(e.target.value)}
                              placeholder="Describe actions taken, dispatch summaries, or safety confirmation details..."
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                              required
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              if (!resolutionNote.trim()) {
                                setDetailsError('Please enter a resolution note before resolving.');
                                return;
                              }
                              setDetailsError(null);
                              setShowConfirmResolve(true);
                            }}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg text-xs shadow-sm transition flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">task_alt</span>
                            <span>Resolve Whole Group</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-xl text-xs space-y-3">
                          <div className="flex items-center gap-1.5 font-bold">
                            <span className="material-symbols-outlined text-amber-600">warning</span>
                            <span>Confirm Bulk Operation</span>
                          </div>
                          <p>
                            This will mark all linked unresolved reports as <strong>{resolvingStatus}</strong> and send notifications/SMS alerts to all linked citizen reporters.
                          </p>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={handleResolveGroupSubmit}
                              disabled={actionSubmitting}
                              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-3 py-1.5 rounded transition shrink-0 cursor-pointer"
                            >
                              {actionSubmitting ? 'Resolving...' : 'Yes, Resolve Group'}
                            </button>
                            <button
                              type="button"
                              onClick={() => setShowConfirmResolve(false)}
                              className="bg-white border border-slate-200 text-slate-700 font-semibold px-3 py-1.5 rounded hover:bg-slate-50 transition shrink-0 cursor-pointer"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    // Resolved display notes
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                      <div className="font-bold text-emerald-700 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[16px]">check_circle</span>
                        <span>Resolved Case File</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold">Resolved Date:</span> <span className="font-medium text-slate-900">{selectedGroup.resolvedAt ? new Date(selectedGroup.resolvedAt).toLocaleString() : 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 font-semibold">Resolution Note:</span>
                        <p className="mt-1 p-2 bg-white border border-slate-200 rounded italic text-slate-800 font-medium">
                          {selectedGroup.resolutionNote || 'No resolution details logged.'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : null}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
