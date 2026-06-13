import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ArrowLeft,
  Calendar,
  MapPin,
  Activity
} from 'lucide-react';
import { trackIncidentByTicket } from '../api/trackingApi';

export default function TrackReport() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [ticketInput, setTicketInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [incident, setIncident] = useState(null);
  const [error, setError] = useState('');

  const ticketParam = searchParams.get('ticket');

  useEffect(() => {
    if (ticketParam) {
      setTicketInput(ticketParam);
      handleTrack(ticketParam);
    }
  }, [ticketParam]);

  const handleTrack = async (ticketNum) => {
    const target = ticketNum || ticketInput;
    if (!target.trim()) {
      setError('Please enter a ticket number.');
      return;
    }

    setLoading(true);
    setError('');
    setIncident(null);

    try {
      const result = await trackIncidentByTicket(target.trim());
      if (result && result.success) {
        setIncident(result.data);
        // Sync the URL search params if not already set
        if (searchParams.get('ticket') !== target.trim()) {
          setSearchParams({ ticket: target.trim() });
        }
      } else {
        setError('No report found for this ticket number.');
      }
    } catch (err) {
      setError(
        err.response?.data?.message || 
        'No report found for this ticket number. Please check the ticket number and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleTrack();
  };

  // Status progression stages to draw the timeline
  const stages = [
    { key: 'reported', label: 'Reported', color: 'text-slate-400 bg-slate-800' },
    { key: 'verified', label: 'Verified', color: 'text-indigo-400 bg-indigo-950/50' },
    { key: 'assigned', label: 'Assigned', color: 'text-blue-400 bg-blue-950/50' },
    { key: 'in-progress', label: 'In Progress', color: 'text-amber-400 bg-amber-950/50' },
    { key: 'resolved', label: 'Resolved / Closed', keyMatch: ['resolved', 'closed'], color: 'text-emerald-400 bg-emerald-950/50' }
  ];

  // Helper to determine the status history
  const getStageStatus = (stage) => {
    if (!incident) return 'upcoming';
    const statusIdx = {
      'reported': 1,
      'verified': 2,
      'assigned': 3,
      'in-progress': 4,
      'resolved': 5,
      'closed': 5
    };

    const currentIdx = statusIdx[incident.status] || 1;
    const stageKeys = stage.keyMatch || [stage.key];
    const maxStageIdx = Math.max(...stageKeys.map(k => statusIdx[k] || 1));

    if (incident.status === 'closed' && (stage.key === 'resolved')) {
      return 'completed';
    }

    if (currentIdx >= maxStageIdx) {
      return 'completed';
    } else if (currentIdx + 1 === maxStageIdx) {
      return 'current';
    }
    return 'upcoming';
  };

  const getSeverityBadgeColor = (severity) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-50 text-red-700 border border-red-200';
      case 'high':
        return 'bg-orange-50 text-orange-700 border border-orange-200';
      case 'medium':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border border-slate-200';
    }
  };

  return (
    <div className="bg-slate-50 text-slate-900 min-h-screen flex flex-col font-body-lg antialiased relative">
      {/* Subtle background glow elements */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[600px] h-[600px] bg-slate-200/40 rounded-full blur-[150px] pointer-events-none" />

      {/* Navbar header in dark navy */}
      <header className="relative z-10 w-full flex justify-between items-center px-6 md:px-12 h-16 bg-[#0B1628] border-b border-slate-900/60 shadow-md">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-400" />
          <Link to="/" className="font-semibold text-sm tracking-tight text-white hover:text-blue-300 transition-colors">
            DisasterConnect
          </Link>
        </div>
        <div>
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Landing Page
          </Link>
        </div>
      </header>

      <main className="flex-grow flex flex-col items-center justify-start py-12 px-4 relative z-10">
        <div className="max-w-3xl w-full space-y-8">
          
          {/* Header Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Track Incident Report Status
            </h1>
            <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">
              Enter your unique Incident Ticket Number to view real-time status updates and advisory safety notes.
            </p>
          </div>

          {/* Search Box */}
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm flex flex-col sm:flex-row gap-3">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Activity className="w-4 h-4 text-blue-500" />
              </div>
              <input
                type="text"
                placeholder="e.g. DC-20260613-29471"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded-xl text-slate-800 placeholder-slate-400 text-sm transition focus:outline-none"
                value={ticketInput}
                onChange={(e) => setTicketInput(e.target.value)}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white rounded-xl text-sm font-semibold shadow-md transition duration-150 flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  Track Status
                </>
              )}
            </button>
          </form>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm shadow-sm">
              <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-red-900">Lookup Failed</p>
                <p className="text-red-700/95 text-xs">{error}</p>
              </div>
            </div>
          )}

          {/* Incident Details Card */}
          {incident && (
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
              
              {/* Card Header */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {incident.type}
                    </span>
                    <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${getSeverityBadgeColor(incident.severity)}`}>
                      {incident.severity} severity
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mt-1.5 leading-snug">
                    {incident.title}
                  </h2>
                </div>
                <div className="text-left md:text-right">
                  <div className="text-xs text-slate-500">Ticket Number</div>
                  <div className="font-mono text-base font-bold text-blue-600 select-all">
                    {incident.ticketNumber}
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-8">
                
                {/* 1. Progress Status Timeline */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Live Response Status
                  </h3>
                  <div className="relative">
                    {/* Line connecting the points */}
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-slate-200 -z-10 hidden md:block" />
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {stages.map((stage) => {
                        const statusState = getStageStatus(stage);
                        const isCompleted = statusState === 'completed';
                        const isCurrent = statusState === 'current';
                        
                        return (
                          <div 
                            key={stage.key}
                            className={`flex md:flex-col items-center gap-3 md:gap-2 text-left md:text-center p-3 md:p-0 rounded-xl border border-transparent md:border-none transition ${
                              isCurrent ? 'bg-blue-50/50 border-blue-100 md:bg-transparent' : ''
                            }`}
                          >
                            {/* Circle Indicator */}
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border transition ${
                              isCompleted 
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-600 shadow-sm'
                                : isCurrent
                                ? 'bg-blue-600 border-blue-500 text-white animate-pulse shadow-md'
                                : 'bg-slate-50 border-slate-200 text-slate-400'
                            }`}>
                              {isCompleted ? (
                                <CheckCircle2 className="w-4 h-4" />
                              ) : (
                                <span className="text-xs font-bold">{stages.indexOf(stage) + 1}</span>
                              )}
                            </div>
                            
                            {/* Label */}
                            <div className="space-y-0.5">
                              <span className={`text-xs font-semibold block transition ${
                                isCompleted ? 'text-emerald-700' : isCurrent ? 'text-blue-600 font-bold' : 'text-slate-400'
                              }`}>
                                {stage.label}
                              </span>
                              {isCurrent && (
                                <span className="inline-block md:block text-[9px] font-bold text-blue-500 uppercase tracking-widest animate-pulse">
                                  Active State
                                  </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* 2. Public Advisory Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>Reported Location (Landmark/Note)</span>
                    </div>
                    <p className="text-sm text-slate-800 bg-slate-50 border border-slate-100 p-3 rounded-lg leading-relaxed">
                      {incident.address || 'No location details provided.'}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Filing Timestamp</span>
                    </div>
                    <p className="text-sm text-slate-800 bg-slate-50 border border-slate-100 p-3 rounded-lg">
                      {new Date(incident.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* 3. AI Safety Note */}
                {incident.aiSafetyNote && (
                  <div className="relative overflow-hidden rounded-xl border border-indigo-100 bg-indigo-50/50 p-5 shadow-sm mt-4">
                    <div className="absolute top-0 right-0 p-3 opacity-5">
                      <Sparkles className="w-16 h-16 text-indigo-600" />
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-1.5 bg-indigo-100 border border-indigo-200/60 rounded-lg text-indigo-600 shrink-0">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold text-indigo-700 tracking-wider uppercase block">
                          AI Advisory Safety Guidance
                        </span>
                        <p className="text-xs text-slate-700 leading-relaxed">
                          {incident.aiSafetyNote}
                        </p>
                        <span className="text-[9px] text-slate-400 block italic pt-1">
                          Advisory suggestion only. In immediate danger, contact local emergency dispatch services.
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. Incident Updates History (Chronological logs) */}
                {incident.publicTimeline && incident.publicTimeline.length > 0 && (
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Status History Timeline
                    </h3>
                    <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                      {incident.publicTimeline.map((item, idx) => (
                        <div key={idx} className="flex gap-3 text-xs bg-slate-50 border border-slate-100 hover:border-slate-200 p-3 rounded-lg transition">
                          <div className="text-slate-400 shrink-0 select-none font-mono">
                            {new Date(item.changedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                          <div className="space-y-1">
                            <span className="font-semibold text-slate-700 uppercase tracking-wide">
                              {item.status}
                            </span>
                            {item.note && (
                              <p className="text-slate-600 leading-relaxed">{item.note}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </div>
      </main>

      {/* Simple footer */}
      <footer className="relative z-10 w-full bg-white text-slate-400 py-6 px-6 border-t border-slate-200 text-center text-xs">
        <p>© 2026 DisasterConnect • Public Incident Tracking Module</p>
      </footer>
    </div>
  );
}
