import React from 'react';
import { Link } from 'react-router-dom';
import MetricCard from '../../components/dashboard/MetricCard';
import RecentIncidents from '../../components/dashboard/RecentIncidents';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import StatusBarChart from '../../components/charts/StatusBarChart';
import TypePieChart from '../../components/charts/TypePieChart';

export default function ResponderDashboard({ data, user, fetchDashboardData }) {
  const { summary, incidentStats, alertStats } = data || {};

  return (
    <div className="space-y-6 text-left">
      
      {/* Metric Cards - Focused on Responder active items */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Assigned Incidents"
          value={summary?.incidents?.total}
          helperText="My response log queue"
          icon="assignment"
          accentStyle="text-primary"
          iconBgStyle="bg-primary-container/15 text-primary"
        />

        <MetricCard
          label="Active Incidents"
          value={summary?.incidents?.active}
          helperText="Assigned in-progress items"
          icon="warning"
          accentStyle="text-amber-600"
          iconBgStyle="bg-amber-100 text-amber-800"
        />

        <MetricCard
          label="Unread Alerts"
          value={summary?.alerts?.unread}
          helperText="New dispatch alerts"
          icon="notifications_active"
          accentStyle="text-error font-bold"
          iconBgStyle="bg-error-container/20 text-error animate-pulse"
        />
      </div>

      {/* Quick Actions Panel */}
      <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
          Field Quick Actions
        </h3>
        <div className="grid grid-cols-3 gap-4">
          <Link
            to="/dashboard/incidents"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition text-center space-y-2 group"
          >
            <span className="material-symbols-outlined text-blue-600 text-[24px]">assignment</span>
            <span className="text-xs font-bold text-slate-800">View My Incidents</span>
          </Link>

          <Link
            to="/dashboard/map"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition text-center space-y-2 group"
          >
            <span className="material-symbols-outlined text-blue-600 text-[24px]">map</span>
            <span className="text-xs font-bold text-slate-800">Open Map</span>
          </Link>

          <Link
            to="/dashboard/alerts"
            className="flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 hover:border-slate-300 transition text-center space-y-2 group"
          >
            <span className="material-symbols-outlined text-blue-600 text-[24px]">notifications_active</span>
            <span className="text-xs font-bold text-slate-800">View Alerts</span>
          </Link>
        </div>
      </div>

      {/* My Response Queue Charts */}
      <div className="bg-surface border border-outline-variant rounded-xl p-5 shadow-sm space-y-6">
        <h2 className="text-lg font-bold text-slate-900 border-b border-outline-variant pb-3 flex items-center gap-2">
          <span className="material-symbols-outlined text-blue-600">bar_chart</span>
          My Response Queue Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 col-span-1 md:col-span-2">
            <StatusBarChart data={incidentStats?.byStatus} title="Assigned Incidents Status Log" />
          </div>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
            <TypePieChart data={incidentStats?.byType} title="Assigned Incident Types" />
          </div>
        </div>
      </div>

      {/* Recent Assigned Incidents */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <RecentIncidents incidents={incidentStats?.recentIncidents} />
        </div>
        <div className="lg:col-span-4 flex flex-col justify-between p-5 bg-surface border border-outline-variant rounded-xl shadow-sm">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Operational Guidelines</h3>
            <ul className="text-xs text-slate-500 space-y-2 list-disc pl-4">
              <li>Log status changes promptly on task arrival and departure.</li>
              <li>Coordinate with dispatchers for staging resource requests.</li>
              <li>View resource stock lists to locate nearby water/rations.</li>
            </ul>
          </div>
          <button 
            onClick={fetchDashboardData}
            className="mt-6 w-full py-2 border border-slate-200 rounded text-slate-700 hover:bg-slate-100 transition text-xs font-bold flex items-center justify-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">sync</span>
            Refresh Database
          </button>
        </div>
      </div>

      {/* Alerts */}
      <div className="w-full">
        <RecentAlerts alerts={alertStats?.recentAlerts} user={user} />
      </div>

    </div>
  );
}
