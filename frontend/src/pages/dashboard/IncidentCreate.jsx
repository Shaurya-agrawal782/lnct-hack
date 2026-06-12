import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';
import { createIncident } from '../../api/incidentApi';

export default function IncidentCreate() {
  const navigate = useNavigate();

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('other');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate fields
    if (!title.trim() || !description.trim() || !address.trim() || !latitude || !longitude) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);

    if (isNaN(latNum) || latNum < -90 || latNum > 90) {
      setError('Please enter a valid Latitude between -90 and 90.');
      setLoading(false);
      return;
    }

    if (isNaN(lngNum) || lngNum < -180 || lngNum > 180) {
      setError('Please enter a valid Longitude between -180 and 180.');
      setLoading(false);
      return;
    }

    try {
      // Assemble payload with coordinate order [longitude, latitude]
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        severity,
        location: {
          coordinates: [lngNum, latNum], // [lng, lat]
          address: address.trim()
        }
      };

      const res = await createIncident(payload);
      if (res.success) {
        navigate('/dashboard/incidents');
      } else {
        setError(res.message || 'Failed to report incident.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'An error occurred while creating the incident report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Back button and title */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/incidents"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Report Incident</h1>
          <p className="text-sm text-slate-400">File a new emergency incident report</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start space-x-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Title field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Incident Title *</label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Chemical leak in warehouse, Road blockage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Description *</label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              placeholder="Provide a detailed description of the emergency status, hazards, or immediate resources required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Type & Severity Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Incident Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="fire">Fire</option>
                <option value="flood">Flood</option>
                <option value="medical">Medical</option>
                <option value="accident">Accident</option>
                <option value="crowd">Crowd</option>
                <option value="rescue">Rescue</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Severity Level *</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          {/* Address field */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Location Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. Street 40, Block B, Main Market Area"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Coordinates (Latitude & Longitude) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Latitude *</label>
              <input
                type="text"
                required
                placeholder="e.g. 23.2599"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <span className="text-[10px] text-slate-500 block">Values between -90 and 90</span>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Longitude *</label>
              <input
                type="text"
                required
                placeholder="e.g. 77.4126"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <span className="text-[10px] text-slate-500 block">Values between -180 and 180</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900">
            <Link
              to="/dashboard/incidents"
              className="px-5 py-2.5 text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-650 hover:bg-indigo-550 rounded-lg shadow-lg shadow-indigo-650/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 inline-flex items-center space-x-2"
            >
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>Submit Incident</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
