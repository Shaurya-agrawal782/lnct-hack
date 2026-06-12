import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  ArrowRight, 
  AlertTriangle, 
  MapPin, 
  Layers, 
  Users, 
  Activity, 
  Send, 
  CheckCircle2, 
  TrendingUp, 
  Database, 
  Radio, 
  Map, 
  CheckCircle,
  FileText,
  Clock,
  Zap,
  Globe
} from 'lucide-react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';

export default function Landing() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-lg">
      
      {/* Navigation Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-6 md:px-margin-desktop h-16 bg-[#0B1628]/95 backdrop-blur-md border-b border-[#1E293B] transition-colors">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center border border-primary/20 shadow-lg">
            <Shield className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-headline-md text-lg font-bold tracking-tight text-white">
            DisasterConnect
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="text-slate-300 hover:text-white px-4 py-2 text-sm font-semibold transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="bg-primary text-on-primary px-4 py-2 text-sm rounded-lg font-semibold hover:bg-primary/90 transition-colors shadow-sm"
          >
            Create Citizen Profile
          </Link>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-grow pt-16">
        
        {/* A. Hero Section - Dark Tactical Layout */}
        <section className="w-full bg-[#0B1628] text-white py-16 md:py-28 relative overflow-hidden border-b border-[#1E293B]">
          {/* Subtle Grid and Radials */}
          <div className="absolute inset-0 pointer-events-none opacity-10">
            <div 
              className="absolute inset-0" 
              style={{ 
                backgroundImage: 'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)', 
                backgroundSize: '32px 32px' 
              }}
            />
          </div>
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/20 blur-[140px] pointer-events-none" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-emerald-500/10 blur-[120px] pointer-events-none" />

          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Left Column: Headline, Pitch, CTAs */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary-fixed-dim text-xs font-semibold w-fit">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Event Crowd Heatmap & Safety Alert System powered by DisasterConnect
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Coordinate emergencies <br />
                <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                  before they become disasters.
                </span>
              </h1>
              <p className="text-slate-300 text-base md:text-lg max-w-2xl leading-relaxed">
                A MERN-based command platform for incident reporting, real-time alerts, resource dispatch, interactive maps, and operational analytics. Built to bridge citizens and emergency services.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Link
                  to="/login"
                  className="bg-primary hover:bg-primary/90 text-on-primary px-6 py-3.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-primary/20 group"
                >
                  Access Command Center
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/register"
                  className="bg-slate-800 hover:bg-slate-700/80 border border-slate-700 text-white px-6 py-3.5 rounded-lg font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  Create Citizen Account
                </Link>
              </div>
            </div>

            {/* Right Column: Premium Interactive Mockup Card */}
            <div className="lg:col-span-5 w-full">
              <div className="bg-[#0f1b2d] border border-slate-800 rounded-xl p-6 shadow-2xl relative overflow-hidden backdrop-blur-sm">
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-indigo-500 to-emerald-500" />
                
                {/* Mockup Header */}
                <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[11px] uppercase tracking-wider font-bold text-slate-400">Tactical Feed (Static Preview)</span>
                  </div>
                  <Badge variant="primary" className="bg-primary-container/20 text-blue-400 border-none text-[10px]">
                    Live Sync Enabled
                  </Badge>
                </div>

                {/* Grid stats */}
                <div className="grid grid-cols-3 gap-3 mb-5">
                  <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Active Incidents</span>
                    <span className="text-xl font-bold text-emerald-400">12</span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Critical Alerts</span>
                    <span className="text-xl font-bold text-red-400">03</span>
                  </div>
                  <div className="bg-slate-900/60 border border-slate-800/80 p-2.5 rounded-lg">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold block">Dispatch Units</span>
                    <span className="text-xl font-bold text-blue-400">08</span>
                  </div>
                </div>

                {/* Operations Feed List */}
                <div className="space-y-3">
                  <div className="bg-[#15243b] border-l-4 border-red-500 p-3 rounded-r-lg text-left">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-red-400 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                        Flash Flooding: Sector 4
                      </span>
                      <span className="text-[10px] text-slate-400">2 mins ago</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Water level rising past safety gate 2. Evacuation warnings pushed to grid coordinates.
                    </p>
                  </div>

                  <div className="bg-[#15243b] border-l-4 border-amber-500 p-3 rounded-r-lg text-left">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        Crowd Heatmap Spike
                      </span>
                      <span className="text-[10px] text-slate-400">10 mins ago</span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Unusual citizen check-in volume reported near central distribution point.
                    </p>
                  </div>
                </div>

                {/* Tactical grid display mockup */}
                <div className="mt-4 border border-slate-800 rounded-lg p-2.5 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-2">
                    <Map className="w-3.5 h-3.5 text-slate-400" />
                    <span>Leaflet Vector Layer: <strong>Active</strong></span>
                  </div>
                  <span className="text-emerald-500">SYS OK</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* B. Problem Section - Light contrasting section */}
        <section className="w-full bg-slate-50 text-slate-900 py-16 md:py-24 border-b border-slate-200">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Operational Challenges</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-slate-900">
                Traditional crisis response is fragmented.
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Emergency dispatchers, responders, and citizens need a unified source of truth to act decisively when minutes determine outcomes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Problem 1 */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl text-left shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Clock className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-bold text-base text-slate-800">Delayed Reporting</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Hazard reports are bottlenecked, taking hours to filter through standard bureaucratic switchboards.
                  </p>
                </div>
              </div>
              {/* Problem 2 */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl text-left shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Users className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-bold text-base text-slate-800">Poor Coordination</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Responding units lack horizontal channels, creating communication blackholes.
                  </p>
                </div>
              </div>
              {/* Problem 3 */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl text-left shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Zap className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-bold text-base text-slate-800">Manual Dispatch</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Inventory levels and responder assignments are tracked manually, slowing down unit transit.
                  </p>
                </div>
              </div>
              {/* Problem 4 */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl text-left shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <Map className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-bold text-base text-slate-800">No Live Map Visibility</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Command centers operate blindly without interactive status points and hazard maps.
                  </p>
                </div>
              </div>
              {/* Problem 5 */}
              <div className="bg-white border border-slate-200 p-6 rounded-xl text-left shadow-sm flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center mb-4">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <h4 className="font-bold text-base text-slate-800">Weak Analytics</h4>
                  <p className="text-slate-500 text-xs mt-2 leading-relaxed">
                    Agencies lack analytical data to evaluate past operations and optimize resource reserves.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* C. Solution Section - Dark grid section */}
        <section className="w-full bg-slate-900 text-white py-16 md:py-24 border-b border-slate-800">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-4 text-left">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">The Solution</span>
                <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-white leading-tight">
                  Unified command system.
                </h2>
                <p className="text-slate-400 text-sm mt-3 leading-relaxed">
                  DisasterConnect provides an end-to-end framework, orchestrating communications across all roles dynamically.
                </p>
                <div className="mt-8 space-y-3">
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Instant real-time socket connections</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Leaflet interactive map plots</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Structured command workflows</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 text-left">
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-lg">
                  <div className="font-bold text-sm text-emerald-400 mb-1">Citizen Reporting</div>
                  <p className="text-slate-300 text-xs leading-relaxed">Citizens submit geolocation tags and hazard details on the fly.</p>
                </div>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-lg">
                  <div className="font-bold text-sm text-emerald-400 mb-1">Admin Dispatch</div>
                  <p className="text-slate-300 text-xs leading-relaxed">System operators deploy tactical units to incidents via real-time console.</p>
                </div>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-lg">
                  <div className="font-bold text-sm text-emerald-400 mb-1">Responder Status</div>
                  <p className="text-slate-300 text-xs leading-relaxed">Units update dispatchers immediately through localized tactical layout.</p>
                </div>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-lg">
                  <div className="font-bold text-sm text-emerald-400 mb-1">Resource Allocation</div>
                  <p className="text-slate-300 text-xs leading-relaxed">Monitor and distribute critical supplies at staging centers seamlessly.</p>
                </div>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-lg">
                  <div className="font-bold text-sm text-emerald-400 mb-1">Live Alerts</div>
                  <p className="text-slate-300 text-xs leading-relaxed">Broadcast warnings automatically to citizen dashboards in active zones.</p>
                </div>
                <div className="bg-[#1e293b]/50 border border-slate-800 p-5 rounded-lg">
                  <div className="font-bold text-sm text-emerald-400 mb-1">Map Monitoring</div>
                  <p className="text-slate-300 text-xs leading-relaxed">Track responder units, alerts, and report densities visually on a map.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* D. How It Works Section - Timeline */}
        <section className="w-full bg-white text-slate-900 py-16 md:py-24 border-b border-slate-200">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Operational Workflow</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-slate-900">
                A five-step unified timeline.
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Watch how information and actions propagate through our systems when a crisis is declared.
              </p>
            </div>

            {/* Timeline element */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
              {/* Timeline line desktop */}
              <div className="hidden md:block absolute top-[28px] left-[10%] right-[10%] h-[2px] bg-slate-200 z-0" />
              
              {/* Step 1 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-md">
                  1
                </div>
                <h4 className="font-bold text-base mt-4 text-slate-800">Report</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Citizens input geolocation details and upload incident records.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-md">
                  2
                </div>
                <h4 className="font-bold text-base mt-4 text-slate-800">Verify</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Dispatchers validate information on their live monitoring map.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-md">
                  3
                </div>
                <h4 className="font-bold text-base mt-4 text-slate-800">Dispatch</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Operational command coordinates and deploys response teams.
                </p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-md">
                  4
                </div>
                <h4 className="font-bold text-base mt-4 text-slate-800">Respond</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Field responders log status updates and manage safe zones.
                </p>
              </div>

              {/* Step 5 */}
              <div className="flex flex-col items-center relative z-10">
                <div className="w-14 h-14 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-lg border-4 border-white shadow-md">
                  5
                </div>
                <h4 className="font-bold text-base mt-4 text-slate-800">Analyze</h4>
                <p className="text-slate-500 text-xs mt-2 max-w-[200px] leading-relaxed">
                  Post-incident metrics compile data to prepare for future cycles.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* E. Role Section */}
        <section className="w-full bg-slate-50 text-slate-900 py-16 md:py-24 border-b border-slate-200">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop text-center">
            <div className="max-w-2xl mx-auto mb-16">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Access Management</span>
              <h2 className="text-3xl font-extrabold tracking-tight mt-2 text-slate-900">
                Who uses DisasterConnect?
              </h2>
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Roles are structured to isolate responder telemetry from civilian safety services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left max-w-5xl mx-auto">
              {/* Citizen Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center">
                      <Users className="w-4.5 h-4.5 text-slate-600" />
                    </div>
                    <h4 className="font-bold text-base text-slate-800">Citizen Account</h4>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Created instantly online. Submit local hazards, check interactive safety alert dashboards, and find emergency distribution centers.
                  </p>
                </div>
                <Link to="/register" className="text-primary font-semibold text-xs hover:underline mt-6 inline-flex items-center gap-1">
                  Register Profile <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Responder Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded bg-blue-50 flex items-center justify-center">
                      <Radio className="w-4.5 h-4.5 text-primary" />
                    </div>
                    <h4 className="font-bold text-base text-slate-800">Field Responder</h4>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Assigned by system operators. Claim dispatched incidents, coordinate team logistics, and update real-time maps.
                  </p>
                </div>
                <span className="text-slate-400 font-semibold text-xs mt-6 block">Assigned by Administrator</span>
              </div>

              {/* Admin Card */}
              <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 rounded bg-indigo-50 flex items-center justify-center">
                      <Shield className="w-4.5 h-4.5 text-indigo-600" />
                    </div>
                    <h4 className="font-bold text-base text-slate-800">System Administrator</h4>
                  </div>
                  <p className="text-slate-500 text-xs leading-relaxed">
                    Assigned locally. Allocate supplies, monitor incident reports, deploy response teams, and publish broadcast notices.
                  </p>
                </div>
                <Link to="/login" className="text-primary font-semibold text-xs hover:underline mt-6 inline-flex items-center gap-1">
                  Access Portal <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* F. Tech Stack Section */}
        <section className="w-full bg-slate-900 text-white py-16 md:py-20 border-b border-slate-800">
          <div className="max-w-container-max mx-auto px-6 md:px-margin-desktop text-center">
            <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-8">
              Full-Stack Architecture
            </h3>
            <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                React
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                Node.js
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                Express
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                MongoDB
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                Socket.io
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                Leaflet
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                Recharts
              </span>
              <span className="px-4 py-2 rounded-lg bg-slate-800/80 border border-slate-700/60 font-mono text-xs font-semibold text-slate-200 hover:border-slate-600 transition-colors">
                JWT
              </span>
            </div>
          </div>
        </section>

        {/* G. Demo Note Box */}
        <section className="w-full bg-white text-slate-900 py-12 border-b border-slate-200">
          <div className="max-w-xl mx-auto px-6">
            <div className="p-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl text-center space-y-3">
              <h4 className="text-sm font-bold text-slate-800 flex items-center justify-center gap-1.5">
                <FileText className="w-4 h-4 text-primary" />
                Local Evaluation Note
              </h4>
              <p className="text-slate-500 text-xs leading-relaxed">
                Evaluation credentials for the command system are documented in <code className="text-primary font-mono text-xs px-2 py-0.5 bg-slate-200/50 border border-slate-300/30 rounded">docs/DEMO_ACCOUNTS.md</code>. We do not expose passwords directly on public pages.
              </p>
            </div>
          </div>
        </section>

      </main>

      {/* H. Footer */}
      <footer className="w-full bg-slate-950 text-slate-400 py-12 px-6 md:px-margin-desktop border-t border-slate-800">
        <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-slate-400" />
            <span className="text-sm font-bold text-slate-300">DisasterConnect Command Center</span>
          </div>
          <div className="text-xs text-slate-500">
            Build for resilience. Developed for Hackathon evaluation.
          </div>
          <div className="flex gap-6 text-xs">
            <a className="hover:text-white transition-colors" href="#">Privacy</a>
            <a className="hover:text-white transition-colors" href="#">Terms</a>
            <a className="hover:text-white transition-colors" href="#">Security API</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
