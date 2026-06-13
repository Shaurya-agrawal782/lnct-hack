import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createIncident } from '../../api/incidentApi';
import { analyzeReportDraft } from '../../api/aiApi';
import IncidentLocationPicker from '../../components/map/IncidentLocationPicker';
import useAuth from '../../hooks/useAuth';

export default function IncidentCreate() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('other');
  const [severity, setSeverity] = useState('medium');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [landmark, setLandmark] = useState('');

  // AI assistant states
  const [aiDraft, setAiDraft] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState(null);
  const [aiUnavailableMessage, setAiUnavailableMessage] = useState(null);

  const handleAnalyze = async () => {
    if (!aiDraft.trim()) {
      setAiError('Please enter some description or rough draft of what happened.');
      return;
    }
    if (aiDraft.trim().length < 10) {
      setAiError('Please describe the situation in at least 10 characters.');
      return;
    }

    setAiLoading(true);
    setAiError(null);
    setAiUnavailableMessage(null);
    setAiSuggestions(null);

    try {
      const payload = {
        text: aiDraft.trim(),
        location: address || undefined,
        coordinates: (latitude && longitude) ? {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
        } : undefined
      };

      const res = await analyzeReportDraft(payload);
      if (res.success) {
        setAiSuggestions(res.data);
      } else {
        setAiUnavailableMessage(res.message || 'AI Report Assistant is currently unavailable.');
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to analyze the report draft.';
      setAiError(errMsg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleApplySuggestions = () => {
    if (!aiSuggestions) return;
    setTitle(aiSuggestions.suggestedTitle || '');
    setDescription(aiSuggestions.improvedDescription || '');
    setType(aiSuggestions.suggestedType || 'other');
    setSeverity(aiSuggestions.suggestedSeverity || 'medium');
    setAiSuggestions(null);
    setAiDraft('');
  };

  // Location/Geotagging states
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationSuccess, setLocationSuccess] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successTicket, setSuccessTicket] = useState(null);

  // Reverse Geocoding helper using OpenStreetMap Nominatim
  const reverseGeocode = async (lat, lng) => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`, {
        headers: {
          'Accept-Language': 'en-US,en;q=0.9',
        }
      });
      if (res.ok) {
        const data = await res.json();
        if (data.display_name) {
          setAddress(data.display_name);
        }
      }
    } catch (err) {
      console.error('Reverse geocoding error:', err);
    }
  };

  const handlePositionChange = (lat, lng) => {
    setLatitude(lat.toFixed(6));
    setLongitude(lng.toFixed(6));
    setLocationSuccess('Location updated from map picker.');
    setLocationError(null);
    reverseGeocode(lat, lng);
  };

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }

    setLocationLoading(true);
    setLocationError(null);
    setLocationSuccess(null);
    setAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng, accuracy: acc } = position.coords;
        setLatitude(lat.toFixed(6));
        setLongitude(lng.toFixed(6));
        setAccuracy(acc);
        setLocationLoading(false);
        setLocationSuccess('Location captured. You can adjust the marker if needed.');
        reverseGeocode(lat, lng);
      },
      (err) => {
        console.error('Geolocation error:', err);
        setLocationLoading(false);
        switch (err.code) {
          case err.PERMISSION_DENIED:
            setLocationError('Location permission is required to submit an incident report. Please allow location access and try again.');
            break;
          default:
            setLocationError('Unable to fetch current location. Please try again in an open area or enable location services.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate fields
    if (!title.trim() || !description.trim()) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    if (!latitude || !longitude) {
      setError('Current location is required to report an incident.');
      setLoading(false);
      return;
    }

    if (!isAdmin && !landmark.trim()) {
      setError('Please enter a landmark or nearby place to help responders locate the incident.');
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
      const finalAddress = !isAdmin && landmark.trim()
        ? `${landmark.trim()} — Detected: ${address.trim()}`
        : address.trim();

      // Assemble payload with coordinate order [longitude, latitude]
      const payload = {
        title: title.trim(),
        description: description.trim(),
        type,
        severity,
        location: {
          coordinates: [lngNum, latNum], // [lng, lat]
          address: finalAddress
        }
      };

      const res = await createIncident(payload);
      if (res.success) {
        const ticket = res.data?.incident?.ticketNumber || null;
        setSuccessTicket(ticket);
        // Scroll to top so user sees the success banner
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
    <div className="space-y-6 max-w-3xl mx-auto text-left">
      {/* Back button and title */}
      <div className="flex items-center gap-4 pb-4 border-b border-outline-variant">
        <Link
          to="/dashboard/incidents"
          className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center border border-outline-variant"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-slate-900 tracking-tight">File Emergency Report</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Log incident parameters for command center dispatch.</p>
        </div>
      </div>

      {/* EMERGENCY SERVICE NOTE */}
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm flex items-start space-x-3 shadow-sm">
        <span className="material-symbols-outlined text-red-600 shrink-0 text-[20px] font-bold mt-0.5">warning</span>
        <div className="space-y-1 text-left">
          <h4 className="font-bold text-red-950">Official Emergency Advisory</h4>
          <p className="text-red-800 text-xs leading-relaxed font-medium">
            Call official emergency services first. Use DisasterConnect to share GPS location, request coordinate mapping, and track response operations.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-xl text-sm flex items-start space-x-2.5">
            <span className="material-symbols-outlined text-red-600 shrink-0">warning</span>
            <span className="text-red-950 font-medium">{error}</span>
          </div>
        )}

        {/* Success Banner with Ticket */}
        {successTicket && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-3 text-left">
            <div className="flex items-center gap-2 text-emerald-800">
              <span className="material-symbols-outlined text-emerald-600">check_circle</span>
              <span className="font-bold text-base">Incident Reported Successfully!</span>
            </div>
            <p className="text-sm text-emerald-700">
              Your incident has been submitted and is now in the command queue. Save your ticket number to track its status publicly.
            </p>
            <div className="bg-white border border-emerald-200 rounded-lg px-4 py-3 flex items-center justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-0.5">Your Ticket Number</div>
                <div className="font-mono text-xl font-extrabold text-emerald-800 select-all">{successTicket}</div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => navigator.clipboard?.writeText(successTicket)}
                  className="px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded text-xs font-bold transition flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">content_copy</span> Copy
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/dashboard/incidents')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold transition"
                >
                  Go to My Reports
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Card Section 1: Incident Details */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-slate-900 border-b border-outline-variant pb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-blue-600 text-lg">description</span>
            1. Incident Parameters
          </h3>

          {/* Title field */}
          <div className="space-y-2">
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Incident Title *</label>
            <input
              type="text"
              required
              maxLength={120}
              placeholder="e.g. Chemical leak in warehouse, Road blockage"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Description field */}
          <div className="space-y-2">
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Detailed Description *</label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              placeholder="Provide details of the emergency status, hazards, or immediate resources required..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Type & Severity Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Incident Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
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
              <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Severity Level *</label>
              <select
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>
        </div>

        {/* Card Section 2: AI Assistant */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-slate-900 border-b border-outline-variant pb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-blue-600 text-lg">psychology</span>
            2. AI Report Assistant (Optional)
          </h3>
          <p className="text-body-sm text-on-surface-variant leading-relaxed">
            Type what happened in your own words (e.g. Hindi, English, Hinglish). The AI engine will analyze and fill the parameters above.
          </p>

          <div className="space-y-2">
            <textarea
              rows={2}
              placeholder="e.g. main gate ke pass bahut bheed hai log dhakka de rahe hain kuch log gir gaye hain"
              value={aiDraft}
              onChange={(e) => setAiDraft(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          <div className="flex justify-between items-center flex-wrap gap-2">
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={aiLoading}
              className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-label-md text-label-md font-bold transition flex items-center gap-2 disabled:opacity-50"
            >
              {aiLoading ? (
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
              )}
              <span>Analyze Draft</span>
            </button>
            
            {aiSuggestions && (
              <button
                type="button"
                onClick={() => {
                  setAiSuggestions(null);
                  setAiDraft('');
                }}
                className="text-body-sm text-blue-600 hover:underline font-semibold"
              >
                Clear Suggestions
              </button>
            )}
          </div>

          {/* AI Message boxes */}
          {aiError && (
            <div className="text-xs text-red-600 font-medium bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{aiError}</span>
            </div>
          )}

          {aiUnavailableMessage && (
            <div className="text-xs text-on-surface-variant font-medium bg-slate-50 border border-outline-variant/60 p-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-blue-600">info</span>
              <span>{aiUnavailableMessage}</span>
            </div>
          )}

          {/* AI Suggestions Box */}
          {aiSuggestions && (
            <div className="bg-slate-50 border border-blue-200 rounded-lg p-4 space-y-4 shadow-sm">
              <div className="border-b border-outline-variant/60 pb-2 flex justify-between items-center">
                <span className="text-xs font-bold text-blue-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">auto_awesome</span> AI Suggestion ({aiSuggestions.confidence} confidence)
                </span>
                <span className="text-[10px] text-on-surface-variant italic">Review suggestions before applying</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div>
                  <span className="font-semibold text-on-surface-variant block mb-0.5">Suggested Title:</span>
                  <span className="text-on-surface font-bold text-body-sm">{aiSuggestions.suggestedTitle}</span>
                </div>
                <div>
                  <span className="font-semibold text-on-surface-variant block mb-0.5">Suggested Type:</span>
                  <span className="text-on-surface font-bold text-body-sm capitalize">{aiSuggestions.suggestedType}</span>
                </div>
                <div>
                  <span className="font-semibold text-on-surface-variant block mb-0.5">Suggested Severity:</span>
                  <span className="text-on-surface font-bold text-body-sm capitalize">{aiSuggestions.suggestedSeverity}</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="font-semibold text-on-surface-variant text-xs block">Improved Description:</span>
                <p className="text-body-sm text-on-surface bg-white p-2.5 rounded border border-outline-variant leading-relaxed">
                  {aiSuggestions.improvedDescription}
                </p>
              </div>

              <div className="flex gap-2 pt-2 border-t border-outline-variant/60">
                <button
                  type="button"
                  onClick={handleApplySuggestions}
                  className="px-4 py-2 bg-blue-600 text-white rounded font-label-md text-label-md font-bold hover:bg-blue-500 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-[16px]">check</span>
                  Apply Suggestions
                </button>
                <button
                  type="button"
                  onClick={() => setAiSuggestions(null)}
                  className="px-4 py-2 border border-outline-variant rounded font-label-md text-label-md text-on-surface font-semibold hover:bg-slate-50 transition-colors"
                >
                  Discard
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Card Section 3: Location Verification */}
        <div className="bg-white border border-outline-variant rounded-xl p-6 space-y-5 shadow-sm">
          <h3 className="font-bold text-slate-900 border-b border-outline-variant pb-2 flex items-center gap-2 text-sm uppercase tracking-wider">
            <span className="material-symbols-outlined text-blue-600 text-lg">my_location</span>
            3. Location Verification
          </h3>

          <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
            Specify the location details below. Use the GPS button to lock coordinates automatically.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleUseCurrentLocation}
              disabled={locationLoading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg font-label-md text-label-md font-bold transition disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-[18px]">my_location</span>
              <span>{locationLoading ? 'Detecting Location...' : 'Detect GPS Coordinates'}</span>
            </button>

            {accuracy !== null && (
              <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                Accuracy Range: ±{Math.round(accuracy)}m
              </span>
            )}
          </div>

          {locationSuccess && (
            <div className="text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              <span>{locationSuccess}</span>
            </div>
          )}

          {locationError && (
            <div className="text-xs text-red-600 font-medium bg-red-50 border border-red-100 p-2.5 rounded-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px]">error</span>
              <span>{locationError}</span>
            </div>
          )}

          {/* Map Picker */}
          {isAdmin ? (
            <IncidentLocationPicker
              latitude={latitude}
              longitude={longitude}
              onPositionChange={handlePositionChange}
            />
          ) : (
            <div className="bg-slate-50 border border-outline-variant rounded-xl p-4 text-xs text-on-surface-variant font-medium text-slate-500 italic">
              Interactive map picker is restricted to dispatcher administrators. Citizens must lock location using device GPS coordinates.
            </div>
          )}

          {/* Landmark / Specific Place */}
          <div className="space-y-2">
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold">
              Specific Landmark / Location Notes {!isAdmin && '*'}
            </label>
            <input
              type="text"
              required={!isAdmin}
              placeholder="e.g. Near main gate, Parking Lot B, block A elevator"
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
            />
          </div>

          {/* Address field */}
          <div className="space-y-2">
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Location Address *</label>
            <input
              type="text"
              required
              placeholder="Detect location or type street address..."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              readOnly={!isAdmin}
              className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors read-only:opacity-75 read-only:bg-slate-50"
            />
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Latitude *</label>
              <input
                type="text"
                required
                placeholder="e.g. 23.2599"
                value={latitude}
                onChange={(e) => isAdmin && setLatitude(e.target.value)}
                readOnly={!isAdmin}
                onBlur={(e) => {
                  if (!isAdmin) return;
                  const latNum = parseFloat(e.target.value);
                  const lngNum = parseFloat(longitude);
                  if (!isNaN(latNum) && latNum >= -90 && latNum <= 90 && !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
                    reverseGeocode(latNum, lngNum);
                  }
                }}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors read-only:opacity-75 read-only:bg-slate-50"
              />
            </div>

            <div className="space-y-2">
              <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Longitude *</label>
              <input
                type="text"
                required
                placeholder="e.g. 77.4126"
                value={longitude}
                onChange={(e) => isAdmin && setLongitude(e.target.value)}
                readOnly={!isAdmin}
                onBlur={(e) => {
                  if (!isAdmin) return;
                  const latNum = parseFloat(latitude);
                  const lngNum = parseFloat(e.target.value);
                  if (!isNaN(latNum) && latNum >= -90 && latNum <= 90 && !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
                    reverseGeocode(latNum, lngNum);
                  }
                }}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors read-only:opacity-75 read-only:bg-slate-50"
              />
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
          <Link
            to="/dashboard/incidents"
            className="px-6 py-2 border border-outline-variant rounded font-label-md text-label-md text-on-surface font-semibold hover:bg-slate-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg font-label-md text-label-md font-bold hover:bg-red-500 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            <span>Submit Report</span>
          </button>
        </div>
      </form>
    </div>
  );
}
