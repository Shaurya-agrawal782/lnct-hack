import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/dashboard/MetricCard';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import Badge from '../../components/ui/Badge';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, listItem, panelReveal } from '../../utils/motion';

export default function ResponderDashboard({ data, user, fetchDashboardData }) {
  const { summary, incidentStats, alertStats } = data || {};
  const incidents = incidentStats?.recentIncidents || [];

  const formatTime = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' ' + new Date(dateStr).toLocaleDateString([], { month: 'short', day: 'numeric' });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-outline-variant"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">My Response Queue</h1>
          <p className="text-sm text-slate-500 mt-1">Assigned incidents, status updates, and operational alerts for field response.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/map"
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 transition rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            <span>Open Map</span>
          </Link>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-primary text-on-primary hover:opacity-90 transition rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Refresh Tasks</span>
          </button>
        </div>
      </motion.div>

      {/* Focus Metrics */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={listItem}>
          <MetricCard
            label="Assigned Incidents"
            value={summary?.incidents?.total}
            helperText="My response log queue"
            icon="assignment"
            accentStyle="text-primary"
            iconBgStyle="bg-primary-container/15 text-primary"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="In Progress"
            value={summary?.incidents?.active}
            helperText="Assigned active tasks"
            icon="warning"
            accentStyle="text-amber-600"
            iconBgStyle="bg-amber-100 text-amber-800"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="Unread Alerts"
            value={summary?.alerts?.unread}
            helperText="New dispatch alerts"
            icon="notifications_active"
            accentStyle="text-error font-bold"
            iconBgStyle="bg-error-container/20 text-error"
          />
        </motion.div>
      </motion.div>

      {/* Main Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Assigned Incidents Queue */}
        <motion.div 
          className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col"
          variants={panelReveal}
          initial="hidden"
          animate="visible"
        >
          <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">assignment</span>
              Active Task Queue
            </h3>
          </div>

          <div className="overflow-x-auto flex-grow">
            {incidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-2">
                <span className="material-symbols-outlined text-slate-300 text-5xl">assignment_late</span>
                <p className="text-sm font-medium text-slate-800">No incidents assigned yet</p>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  New assignments will appear here when command dispatches a case.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-label-sm text-label-sm text-slate-500 border-b border-slate-200">
                    <th className="px-5 py-3 font-bold">Incident</th>
                    <th className="px-5 py-3 font-bold">Severity</th>
                    <th className="px-5 py-3 font-bold">Status</th>
                    <th className="px-5 py-3 font-bold">Location</th>
                    <th className="px-5 py-3 font-bold">Updated</th>
                    <th className="px-5 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm text-slate-700 divide-y divide-slate-100">
                  {incidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900 max-w-[180px] truncate">
                        {incident.title}
                        <span className="block text-[10px] text-slate-400 font-mono font-normal uppercase mt-0.5">{incident.type}</span>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={incident.severity === 'critical' ? 'error' : incident.severity === 'high' ? 'warning' : incident.severity === 'medium' ? 'warning' : 'success'}>
                          {incident.severity}
                        </Badge>
                      </td>
                      <td className="px-5 py-3">
                        <Badge variant={incident.status === 'resolved' ? 'success' : incident.status === 'in-progress' ? 'warning' : incident.status === 'assigned' ? 'primary' : 'default'}>
                          {incident.status === 'in-progress' ? 'Active' : incident.status}
                        </Badge>
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500 max-w-[150px] truncate" title={incident.location?.address}>
                        {incident.location?.address}
                      </td>
                      <td className="px-5 py-3 text-xs text-slate-500 font-mono">
                        {formatTime(incident.updatedAt || incident.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/dashboard/incidents/${incident._id}`}
                          className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-semibold rounded-lg inline-flex items-center gap-0.5"
                        >
                          <span>Manage</span>
                          <span className="material-symbols-outlined text-xs">chevron_right</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </motion.div>

        {/* Right Column: Live Alerts & Guidelines */}
        <motion.div 
          className="lg:col-span-4 flex flex-col space-y-6"
          variants={panelReveal}
          initial="hidden"
          animate="visible"
        >
          <RecentAlerts alerts={alertStats?.recentAlerts} user={user} />

          <div className="p-5 bg-surface border border-outline-variant rounded-xl shadow-sm text-left">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-lg">fact_check</span>
              Operational Guidelines
            </h3>
            <ul className="text-xs text-slate-500 mt-3 space-y-2 list-disc pl-4 leading-relaxed">
              <li>Log status changes promptly on task arrival and departure.</li>
              <li>Coordinate with dispatchers for staging resource requests.</li>
              <li>View resource stock lists to locate nearby water/rations.</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
