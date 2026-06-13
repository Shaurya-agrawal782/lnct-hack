import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/dashboard/MetricCard';
import RecentIncidents from '../../components/dashboard/RecentIncidents';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import StatusBarChart from '../../components/charts/StatusBarChart';
import TypePieChart from '../../components/charts/TypePieChart';
import { motion } from 'motion/react';
import { fadeUp, staggerContainer, listItem, panelReveal } from '../../utils/motion';

export default function AdminDashboard({ data, user, fetchDashboardData }) {
  const { summary, incidentStats, resourceStats, alertStats } = data || {};

  const totalRes = summary?.resources?.total || 1;
  const availRes = summary?.resources?.available || 0;
  const availPercent = Math.min(Math.round((availRes / totalRes) * 100), 100);

  const busyRes = summary?.resources?.busy || 0;
  const busyPercent = Math.min(Math.round((busyRes / totalRes) * 100), 100);

  const maintRes = summary?.resources?.maintenance || 0;
  const maintPercent = Math.min(Math.round((maintRes / totalRes) * 100), 100);

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
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Command Overview</h1>
          <p className="text-sm text-slate-500 mt-1">Live incident, resource, and alert activity across the response network.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/map"
            className="px-4 py-2 border border-slate-200 text-slate-700 hover:bg-slate-100 transition rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">map</span>
            <span>Open Map</span>
          </Link>
          <Link
            to="/dashboard/incidents"
            className="px-4 py-2 bg-primary text-on-primary hover:opacity-90 transition rounded-lg text-xs font-bold inline-flex items-center gap-1.5 shadow-sm"
          >
            <span className="material-symbols-outlined text-sm">emergency</span>
            <span>View Incidents</span>
          </Link>
        </div>
      </motion.div>

      {/* Summary Stats */}
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={listItem}>
          <MetricCard
            label="Critical Incidents"
            value={summary?.incidents?.critical}
            helperText="High priority alerts"
            icon="campaign"
            accentStyle="text-red-600 font-bold"
            iconBgStyle="bg-red-50 text-red-600 border border-red-100"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="Active Incidents"
            value={summary?.incidents?.active}
            helperText="Requiring dispatch"
            icon="warning"
            accentStyle="text-amber-600 font-bold"
            iconBgStyle="bg-amber-50 text-amber-600 border border-amber-100"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="Available Resources"
            value={summary?.resources?.available}
            helperText="Ready for assignment"
            icon="home_repair_service"
            accentStyle="text-emerald-600 font-bold"
            iconBgStyle="bg-emerald-50 text-emerald-600 border border-emerald-100"
          />
        </motion.div>

        <motion.div variants={listItem}>
          <MetricCard
            label="Unread Alerts"
            value={summary?.alerts?.unread}
            helperText="Require broadcast review"
            icon="notifications_active"
            accentStyle="text-blue-600 font-bold"
            iconBgStyle="bg-blue-50 text-blue-600 border border-blue-100"
          />
        </motion.div>
      </motion.div>

      {/* Main Content Layout (2 Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Recent Incident Activity */}
        <motion.div 
          className="lg:col-span-8 flex flex-col"
          variants={panelReveal}
          initial="hidden"
          animate="visible"
        >
          <RecentIncidents incidents={incidentStats?.recentIncidents} />
        </motion.div>

        {/* Right Column: Alerts & Resource Snapshot */}
        <motion.div 
          className="lg:col-span-4 flex flex-col space-y-6"
          variants={panelReveal}
          initial="hidden"
          animate="visible"
        >
          <RecentAlerts alerts={alertStats?.recentAlerts} user={user} />

          <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm flex flex-col justify-between text-left">
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-900 flex items-center gap-2 border-b border-outline-variant pb-2 text-sm">
                <span className="material-symbols-outlined text-primary text-lg">inventory_2</span>
                Resource Stocks
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Global Availability</span>
                    <span className="text-emerald-600 font-bold">{availPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full" style={{ width: `${availPercent}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">Active Deployments</span>
                    <span className="text-amber-600 font-bold">{busyPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full" style={{ width: `${busyPercent}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-slate-500">In Maintenance</span>
                    <span className="text-error font-bold">{maintPercent}%</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-error h-full" style={{ width: `${maintPercent}%` }}></div>
                  </div>
                </div>
              </div>
            </div>
            
            <button 
              onClick={fetchDashboardData}
              className="mt-6 w-full py-2 border border-outline rounded text-on-surface hover:bg-surface-container-high transition text-xs font-bold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">sync</span>
              Refresh Database
            </button>
          </div>
        </motion.div>
      </div>

      {/* Operational Trends (Charts lower on page) */}
      <motion.div 
        className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-6"
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-50px" }}
      >
        <h2 className="text-base font-bold text-slate-900 border-b border-outline-variant pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-lg">timeline</span>
          Operational Trends
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <StatusBarChart data={incidentStats?.byStatus} title="Global Incidents Status Log" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <TypePieChart data={incidentStats?.byType} title="Global Incidents Type Distribution" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <StatusBarChart data={resourceStats?.byStatus} title="Global Resources Deployment Status" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <TypePieChart data={alertStats?.byPriority} title="Alert Broadcast Priority Scope" />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
