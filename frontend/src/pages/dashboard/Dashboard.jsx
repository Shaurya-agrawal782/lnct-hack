import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Wrench, 
  Bell, 
  Activity,
  CheckCircle,
  RefreshCw,
  Layers
} from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import useSocket from '../../hooks/useSocket';
import { getDashboardOverview } from '../../api/analyticsApi';

import MetricCard from '../../components/dashboard/MetricCard';
import RecentIncidents from '../../components/dashboard/RecentIncidents';
import RecentAlerts from '../../components/dashboard/RecentAlerts';
import StatusBarChart from '../../components/charts/StatusBarChart';
import TypePieChart from '../../components/charts/TypePieChart';

export default function Dashboard() {
  const { user } = useAuth();
  const { connected } = useSocket();
  
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getDashboardOverview();
      if (res.success) {
        setData(res.data);
      } else {
        setError(res.message || 'Failed to load dashboard analytics');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while fetching dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!user) return null;

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <RefreshCw className="h-8 w-8 text-indigo-500 animate-spin" />
        <span className="text-slate-400 text-sm font-medium">Loading dashboard overview...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-900/40 rounded-2xl flex flex-col items-center justify-center min-h-[250px] space-y-4">
        <AlertTriangle className="h-10 w-10 text-red-500" />
        <h3 className="text-lg font-bold text-white">Failed to Load Dashboard Data</h3>
        <p className="text-red-400/80 text-sm text-center max-w-md">{error}</p>
        <button
          onClick={fetchDashboardData}
          className="px-4 py-2 bg-red-900/30 hover:bg-red-900/50 border border-red-800 text-red-300 rounded-xl text-xs font-semibold flex items-center space-x-2 transition"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Retry Loading</span>
        </button>
      </div>
    );
  }

  const { summary, incidentStats, resourceStats, alertStats } = data || {};

  // Custom welcome message based on role
  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'admin':
        return 'Here is the global operational dashboard overview.';
      case 'responder':
        return 'Here is your active response checklist, assigned incidents, and real-time alerts.';
      case 'citizen':
        return 'Track your filed incident reports and check local public warning broadcasts.';
      default:
        return 'Access levels and real-time incident reports.';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome banner */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 md:p-8 flex items-center justify-between shadow-lg">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2">
            Welcome back, {user.name}
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            {getWelcomeMessage()}{' '}
            <span className="font-semibold text-indigo-400 uppercase tracking-wide">
              [{user.role}]
            </span>
          </p>
        </div>

        {/* Socket connection indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs shadow-inner">
          <span className={`h-2.5 w-2.5 rounded-full ${connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
          <span className="text-slate-400 font-semibold">{connected ? 'Live Sync' : 'Offline'}</span>
        </div>
      </div>

      {/* Grid of status cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        <MetricCard
          label="Total Incidents"
          value={summary?.incidents?.total}
          helperText={user.role === 'admin' ? 'Global incidents count' : user.role === 'responder' ? 'Your assigned incidents' : 'Your reported incidents'}
          icon={Layers}
          iconBgStyle="bg-blue-500/10 text-blue-400"
        />

        <MetricCard
          label="Active Incidents"
          value={summary?.incidents?.active}
          helperText="Reported, Verified, Assigned, In-Progress"
          icon={AlertTriangle}
          iconBgStyle="bg-yellow-500/10 text-yellow-400"
          accentStyle="text-yellow-400"
        />

        <MetricCard
          label="Critical Incidents"
          value={summary?.incidents?.critical}
          helperText="High priority crisis"
          icon={AlertTriangle}
          iconBgStyle="bg-red-500/10 text-red-400"
          accentStyle="text-red-500"
        />

        {user.role !== 'citizen' ? (
          <MetricCard
            label="Available Resources"
            value={summary?.resources?.available}
            helperText="Ready for deployment"
            icon={Wrench}
            iconBgStyle="bg-emerald-500/10 text-emerald-400"
          />
        ) : (
          <MetricCard
            label="Available Resources"
            value="N/A"
            helperText="Not available for citizen role"
            icon={Wrench}
            iconBgStyle="bg-slate-800/40 text-slate-600"
            accentStyle="text-slate-600"
          />
        )}

        <MetricCard
          label="Unread Alerts"
          value={summary?.alerts?.unread}
          helperText="Requires attention"
          icon={Bell}
          iconBgStyle="bg-pink-500/10 text-pink-400"
          accentStyle="text-pink-400"
        />

        <MetricCard
          label="Resolved Incidents"
          value={summary?.incidents?.resolved}
          helperText="Closed or complete status"
          icon={CheckCircle}
          iconBgStyle="bg-emerald-500/10 text-emerald-400"
        />
      </div>

      {/* Charts section */}
      <div>
        <h2 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Activity className="h-5 w-5 text-indigo-400" />
          <span>Analytical Reports</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <StatusBarChart data={incidentStats?.byStatus} title={user.role === 'admin' ? 'Global Incidents by Status' : 'Your Incidents by Status'} />
          <TypePieChart data={incidentStats?.byType} title={user.role === 'admin' ? 'Global Incidents by Type' : 'Your Incidents by Type'} />
          {user.role !== 'citizen' && (
            <StatusBarChart data={resourceStats?.byStatus} title="Global Resources by Status" />
          )}
          <TypePieChart data={alertStats?.byPriority} title="Your Alerts by Priority" />
        </div>
      </div>

      {/* Recents list section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentIncidents incidents={incidentStats?.recentIncidents} />
        <RecentAlerts alerts={alertStats?.recentAlerts} user={user} />
      </div>
    </div>
  );
}
