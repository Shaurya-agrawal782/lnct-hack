import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  MapPin, 
  Users, 
  BarChart, 
  AlertTriangle, 
  CheckCircle, 
  Cpu, 
  Layers, 
  Activity, 
  ArrowRight,
  Lock,
  Server,
  Bell
} from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/70 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-indigo-500" />
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              DisasterConnect
            </span>
          </div>
          <nav className="flex space-x-4 items-center">
            <Link 
              to="/login" 
              className="px-4 py-2 text-sm font-medium text-slate-350 hover:text-white transition-colors duration-200"
            >
              Sign In
            </Link>
            <Link 
              to="/register" 
              className="px-4 py-2 text-sm font-medium bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg shadow-lg shadow-indigo-650/30 transition-all duration-200 active:scale-95"
            >
              Register
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Body Wrapper */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 px-4 md:py-32 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-900">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-950/20 via-transparent to-transparent pointer-events-none"></div>
          
          <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-950/30 text-indigo-400 text-xs font-semibold tracking-wide uppercase mb-2">
              <span>Event Crowd Heatmap & Safety Alert System</span>
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white mb-2 leading-tight">
              Event Crowd Heatmap & <br className="hidden sm:inline" />Safety Alert System
            </h1>
            <h2 className="text-xl sm:text-2xl font-bold text-indigo-450 tracking-tight mb-6 flex items-center justify-center gap-2">
              powered by <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">DisasterConnect</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
              A MERN-based emergency coordination platform for incident reporting, live alerts, resource dispatch, map monitoring, and operational analytics. DisasterConnect starts with event crowd safety and scales to broader disaster and emergency response.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-8">
              <Link
                to="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-550 rounded-xl shadow-xl shadow-indigo-600/20 transition-all duration-200 hover:translate-y-[-1px]"
              >
                Sign In to Platform
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/register"
                className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-slate-350 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-xl border border-slate-700 transition-all duration-200 hover:translate-y-[-1px]"
              >
                Create Citizen Account
              </Link>
            </div>
          </div>
        </section>

        {/* Problem & Solution Split Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/60">
          <div className="grid lg:grid-cols-2 gap-12 items-stretch">
            {/* The Problem */}
            <div className="p-8 bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-lg bg-rose-500/10 text-rose-500 mb-6">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Critical Event & Emergency Vulnerabilities</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  During large-scale events or emergency situations, traditional systems struggle to coordinate effectively, resulting in critical gaps:
                </p>
                <ul className="space-y-4">
                  {[
                    { title: "Delayed Reporting", desc: "Delayed public reports prevent rapid operational intervention." },
                    { title: "Poor Coordination", desc: "Fragmented communications between citizens, coordinators, and dispatchers." },
                    { title: "Manual Resource Assignment", desc: "Slow, inefficient deployment of personnel, medical kits, and critical items." },
                    { title: "Lack of Live Map Visibility", desc: "No central real-time view of event crowd heatmap or hazard regions." },
                    { title: "Weak Post-Incident Analytics", desc: "Inability to analyze response patterns or dispatcher metrics." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-rose-500 mt-2"></span>
                      <div>
                        <span className="font-semibold text-slate-200 text-sm">{item.title}:</span>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* The Solution */}
            <div className="p-8 bg-indigo-950/20 rounded-2xl border border-indigo-500/20 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none"></div>
              <div>
                <div className="inline-flex p-3 rounded-lg bg-indigo-500/10 text-indigo-450 mb-6">
                  <Shield className="h-6 w-6" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">The Solution: DisasterConnect</h3>
                <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                  DisasterConnect provides a centralized, modern web platform designed to streamline event safety operations and scale to disaster management:
                </p>
                <ul className="space-y-4">
                  {[
                    { title: "Centralized Response Control", desc: "One real-time operational dashboard for administrators and field teams." },
                    { title: "Immediate Incident Management", desc: "Citizen-driven reporting with quick validation pipelines." },
                    { title: "Geospatial Operations", desc: "Live mapping of incident severity levels, crowd heatmaps, and resource locations." },
                    { title: "Dynamic Resource Workflows", desc: "Assign resources to incidents and auto-release them on resolution." },
                    { title: "Real-time Notifications", desc: "Instant alert broadcasts using Socket.io to keep all roles aligned." }
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-3">
                      <CheckCircle className="h-4 w-4 text-emerald-450 mt-1 flex-shrink-0" />
                      <div>
                        <span className="font-semibold text-slate-200 text-sm">{item.title}</span>
                        <p className="text-slate-400 text-xs mt-0.5">{item.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 px-4 bg-slate-950/50 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h3 className="text-3xl font-bold text-white">How It Works</h3>
              <p className="text-slate-450 text-sm">
                A streamlined coordination pipeline linking citizens, administrators, and field responders.
              </p>
            </div>

            <div className="grid md:grid-cols-5 gap-8 relative">
              {[
                { step: "1", title: "Report", desc: "Citizen reports an incident with description, severity, and map coordinates." },
                { step: "2", title: "Verify & Dispatch", desc: "Admin reviews, assigns a field responder, and deploys critical resources." },
                { step: "3", title: "Respond", desc: "Assigned responder receives notification and updates incident progress status." },
                { step: "4", title: "Alert & Map Sync", desc: "Live Leaflet maps and system alerts update immediately for all active users." },
                { step: "5", title: "Analyze & Close", desc: "Recharts dashboards compile analytics, resources auto-release on incident resolution." }
              ].map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center space-y-4 p-4 bg-slate-900/40 rounded-xl border border-slate-800">
                  <div className="w-10 h-10 rounded-full bg-indigo-950 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-950">
                    {item.step}
                  </div>
                  <h4 className="font-bold text-white text-base">{item.title}</h4>
                  <p className="text-slate-400 text-xs leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-3xl font-bold text-white">Core Capabilities</h3>
            <p className="text-slate-450 text-sm">
              Tailored modules built to handle critical coordination tasks seamlessly.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Lock, title: "Auth & Access", desc: "JWT-based authentication and role-based permissions (Admin, Responder, Citizen)." },
              { icon: AlertTriangle, title: "Incident Tracking", desc: "Log, track, and manage emergencies from creation to resolution." },
              { icon: Users, title: "Resource Management", desc: "Track availability, location, and quantities of emergency supplies." },
              { icon: MapPin, title: "Interactive Map", desc: "Visualize incident heatmaps and responder positions on OpenStreetMap grids." },
              { icon: Bell, title: "Real-time Alerts", desc: "Instant Socket.io alerts communicate safety warnings to citizens and responders." },
              { icon: BarChart, title: "Analytics Dashboard", desc: "Visualize key response metrics, resource efficiency, and active counts." },
              { icon: Activity, title: "Resource Workflows", desc: "Deploy food/medical kits to incidents and automatically release them upon resolution." }
            ].map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div key={idx} className="p-6 bg-slate-950/20 rounded-xl border border-slate-800 hover:border-slate-700 transition duration-200">
                  <Icon className="h-8 w-8 text-indigo-400 mb-4" />
                  <h4 className="text-lg font-semibold text-white mb-2">{feature.title}</h4>
                  <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-20 px-4 bg-slate-950/50 border-t border-slate-800/60">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h3 className="text-3xl font-bold text-white">System Roles & Permissions</h3>
              <p className="text-slate-455 text-sm">
                Each actor in DisasterConnect gets a specialized panel designed for their workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  role: "Admin",
                  desc: "System operators and agency commanders.",
                  points: [
                    "Full read/write permissions for all data",
                    "Verify incidents & assign responders",
                    "Dispatch and manage resource stocks",
                    "View system-wide analytics & reports"
                  ]
                },
                {
                  role: "Responder",
                  desc: "Field coordinators and emergency personnel.",
                  points: [
                    "View assigned incident details & active tasks",
                    "Update status of incidents (Investigating, Active, Resolved)",
                    "Access Leaflet map with responder routing",
                    "Receive real-time location/hazard updates"
                  ]
                },
                {
                  role: "Citizen",
                  desc: "General public and event attendees.",
                  points: [
                    "Report local safety incidents immediately",
                    "View personal incident submission history",
                    "Receive global safety alerts and notifications",
                    "Securely manage login profile"
                  ]
                }
              ].map((roleInfo, idx) => (
                <div key={idx} className="p-8 bg-slate-900/60 rounded-2xl border border-slate-800 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xl font-bold text-indigo-400 mb-2">{roleInfo.role}</h4>
                    <p className="text-slate-400 text-xs mb-6">{roleInfo.desc}</p>
                    <ul className="space-y-3">
                      {roleInfo.points.map((pt, pIdx) => (
                        <li key={pIdx} className="flex items-center space-x-2 text-slate-300 text-sm">
                          <CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0" />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section className="py-20 px-4 max-w-7xl mx-auto border-t border-slate-800/60">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-3xl font-bold text-white">Built with Modern Technologies</h3>
            <p className="text-slate-455 text-sm">
              DisasterConnect utilizes a robust and modern software stack for live updates and scalability.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: "Frontend", name: "React / Vite", desc: "Single page app with fast updates", icon: Cpu },
              { label: "Backend", name: "Node.js / Express", desc: "Robust API server architecture", icon: Server },
              { label: "Database", name: "MongoDB / Mongoose", desc: "Flexible document-based storage", icon: Layers },
              { label: "Real-time Map", name: "Leaflet / OSM", desc: "Interactive GIS data layer", icon: MapPin },
              { label: "WebSockets", name: "Socket.io", desc: "Live event dispatch and safety alerts", icon: Bell },
              { label: "Data Viz", name: "Recharts", desc: "Beautiful reports and statistics", icon: BarChart },
              { label: "Security", name: "JWT Auth / Cookies", desc: "Secure session management", icon: Lock },
              { label: "Activity Logs", name: "Morgan / Mongoose Logs", desc: "Clear operational logs", icon: Activity }
            ].map((tech, idx) => {
              const Icon = tech.icon;
              return (
                <div key={idx} className="p-6 bg-slate-950/30 rounded-xl border border-slate-800/80 hover:border-slate-800 hover:bg-slate-950/50 transition">
                  <Icon className="h-6 w-6 text-indigo-400 mx-auto mb-3" />
                  <span className="text-[10px] uppercase tracking-wider text-indigo-500 font-semibold">{tech.label}</span>
                  <h4 className="font-semibold text-white mt-1 text-sm">{tech.name}</h4>
                  <p className="text-slate-450 text-xs mt-1">{tech.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Demo Credentials Note Section */}
        <section className="py-12 px-4 max-w-5xl mx-auto mb-16">
          <div className="p-6 bg-slate-950/60 rounded-2xl border border-dashed border-slate-700 text-center space-y-3">
            <h4 className="text-base font-semibold text-white">Looking for Evaluation Credentials?</h4>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto">
              Seeded user profiles (Admin, Responder, Citizen) are configured for immediate testing. Refer to the demo credential mapping in <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded text-xs">docs/DEMO_ACCOUNTS.md</code> in the project directory for secure access.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-center text-sm text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-4">
          <p className="font-medium text-slate-400">Event Crowd Heatmap & Safety Alert System</p>
          <p>© 2026 DisasterConnect. All rights reserved. Created for Hackathon Presentation & Demonstration.</p>
        </div>
      </footer>
    </div>
  );
}

