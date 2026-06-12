import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/dashboard/MetricCard';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import Badge from '../../components/ui/Badge';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, listItem, panelReveal } from '../../utils/motion';

export default function CitizenDashboard({ data, user, fetchDashboardData }) {
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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Citizen Reporting</h1>
          <p className="text-sm text-slate-500 mt-1">Submit incident reports and track updates from the response team.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/incidents/new"
            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white transition rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">report</span>
            <span>Report New Incident</span>
          </Link>
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 transition rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            <span>Refresh Feed</span>
          </button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={listItem}>
          <MetricCard
            label="My Reports"
            value={summary?.incidents?.total}
            helperText="My total submitted cases"
            icon="history"
            accentStyle="text-primary"
            iconBgStyle="bg-primary-container/15 text-primary"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="Open Reports"
            value={summary?.incidents?.active}
            helperText="Awaiting resolution"
            icon="pending_actions"
            accentStyle="text-amber-600"
            iconBgStyle="bg-amber-100 text-amber-800"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="Resolved Reports"
            value={summary?.incidents?.resolved}
            helperText="Cases successfully closed"
            icon="check_circle"
            accentStyle="text-emerald-600"
            iconBgStyle="bg-emerald-100 text-emerald-800"
          />
        </motion.div>
      </motion.div>

      {/* Main Grid (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: My Incident Reports Table */}
        <motion.div 
          className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm overflow-hidden flex flex-col"
          variants={panelReveal}
          initial="hidden"
          animate="visible"
        >
          <div className="px-5 py-4 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">history</span>
              My Incident Reports
            </h3>
          </div>

          <div className="overflow-x-auto flex-grow">
            {incidents.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 px-6 text-center space-y-2">
                <span className="material-symbols-outlined text-slate-300 text-5xl">report_off</span>
                <p className="text-sm font-medium text-slate-800">No incident reports yet</p>
                <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                  Submit a new report using the button above to alert the emergency response team.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 font-label-sm text-label-sm text-slate-500 border-b border-slate-200">
                    <th className="px-5 py-3 font-bold">Incident Details</th>
                    <th className="px-5 py-3 font-bold">Severity</th>
                    <th className="px-5 py-3 font-bold">Current Status</th>
                    <th className="px-5 py-3 font-bold">Reported Date</th>
                    <th className="px-5 py-3 font-bold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="font-body-sm text-body-sm text-slate-700 divide-y divide-slate-100">
                  {incidents.map((incident) => (
                    <tr key={incident._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-5 py-3 font-semibold text-slate-900 max-w-[200px] truncate">
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
                      <td className="px-5 py-3 text-xs text-slate-500 font-mono">
                        {formatTime(incident.createdAt)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          to={`/dashboard/incidents/${incident._id}`}
                          className="px-3 py-1 bg-slate-100 text-slate-700 hover:bg-slate-200 transition text-xs font-semibold rounded-lg inline-flex items-center gap-0.5"
                        >
                          <span>Track</span>
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

        {/* Right Column: Live Safety Alerts & Info Card */}
        <motion.div 
          className="lg:col-span-4 flex flex-col space-y-6"
          variants={panelReveal}
          initial="hidden"
          animate="visible"
        >
          <RecentAlerts alerts={alertStats?.recentAlerts} user={user} />

          <div className="p-5 bg-blue-50 border border-blue-200 rounded-xl text-left space-y-3">
            <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-700">info</span>
              Verification & Dispatch Policy
            </h4>
            <p className="text-xs text-blue-800 leading-relaxed">
              Your report is reviewed by the command team before responders and resources are assigned. Once validated, dispatch details and notifications will display here immediately.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
