import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function StatusBarChart({ data = {}, title }) {
  // Convert object mapping (e.g. status: count) to array of { name, count }
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key.charAt(0).toUpperCase() + key.slice(1).replace('-', ' '),
    count: value,
    rawKey: key
  }));

  // Clean custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-2.5 shadow-xl text-xs">
          <p className="font-semibold text-slate-300">{payload[0].payload.name}</p>
          <p className="text-indigo-400 font-bold mt-0.5">
            Count: <span className="text-white">{payload[0].value}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  // Color mapping based on status
  const getColor = (key) => {
    const colors = {
      reported: '#38bdf8', // sky-400
      verified: '#6366f1', // indigo-500
      assigned: '#8b5cf6', // violet-500
      'in-progress': '#f59e0b', // amber-500
      resolved: '#10b981', // emerald-500
      closed: '#64748b', // slate-500
      // Resource statuses
      available: '#10b981',
      busy: '#ef4444',
      maintenance: '#f59e0b',
      offline: '#64748b',
    };
    return colors[key] || '#6366f1';
  };

  return (
    <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 flex flex-col h-[300px] hover:border-slate-850 transition duration-300">
      {title && (
        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
          {title}
        </h4>
      )}
      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 10, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
            />
            <YAxis 
              stroke="#64748b" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 41, 59, 0.4)' }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.rawKey)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
