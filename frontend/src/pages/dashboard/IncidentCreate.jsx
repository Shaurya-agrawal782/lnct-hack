import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createIncident } from '../../api/incidentApi';
import IncidentLocationPicker from '../../components/map/IncidentLocationPicker';

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

  // Location/Geotagging states
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [locationSuccess, setLocationSuccess] = useState(null);
  const [accuracy, setAccuracy] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
            setLocationError('Permission denied. Please allow location access or enter coordinates manually.');
            break;
          case err.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable. Please enter coordinates manually.');
            break;
          case err.TIMEOUT:
            setLocationError('Location request timed out. Please try again or enter manually.');
            break;
          default:
            setLocationError('An unknown error occurred while retrieving location.');
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
      <div className="flex items-center gap-4">
        <Link
          to="/dashboard/incidents"
          className="p-2 rounded-full text-on-surface-variant hover:bg-surface-container transition-colors flex items-center justify-center"
        >
          <span className="material-symbols-outlined">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">Report an Incident</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Please provide accurate details to ensure rapid response.</p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6 md:p-8 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Error Message */}
          {error && (
            <div className="bg-error-container border border-error text-error p-4 rounded-xl text-sm flex items-start space-x-2.5">
              <span className="material-symbols-outlined text-error shrink-0">warning</span>
              <span className="text-on-error-container font-medium">{error}</span>
            </div>
          )}

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
            <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Description *</label>
            <textarea
              required
              rows={4}
              maxLength={2000}
              placeholder="Provide a detailed description of the emergency status, hazards, or immediate resources required..."
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

          {/* Incident Location Section */}
          <div className="space-y-4 pt-4 border-t border-outline-variant/60 text-left">
            <div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">Incident Location</h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Use your current location or select the incident point on the map. Coordinates can still be edited manually.
              </p>
            </div>

            {/* Geolocation Button and Messages */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={locationLoading}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/15 text-primary rounded-lg font-label-md text-label-md font-bold transition disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">my_location</span>
                <span>{locationLoading ? 'Detecting location...' : 'Use Current Location'}</span>
              </button>

              {accuracy !== null && (
                <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100">
                  Accuracy: ±{Math.round(accuracy)}m
                </span>
              )}
            </div>

            {locationSuccess && (
              <div className="text-xs text-emerald-600 font-medium bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">check_circle</span>
                <span>{locationSuccess}</span>
              </div>
            )}

            {locationError && (
              <div className="text-xs text-error font-medium bg-error-container/40 border border-error/20 p-2.5 rounded-lg flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px]">error</span>
                <span>{locationError}</span>
              </div>
            )}

            {/* Map Picker */}
            <IncidentLocationPicker
              latitude={latitude}
              longitude={longitude}
              onPositionChange={handlePositionChange}
            />

            {/* Address field */}
            <div className="space-y-2">
              <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Location Address *</label>
              <input
                type="text"
                required
                placeholder="e.g. Street 40, Block B, Main Market Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
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
                  onChange={(e) => setLatitude(e.target.value)}
                  onBlur={(e) => {
                    const latNum = parseFloat(e.target.value);
                    const lngNum = parseFloat(longitude);
                    if (!isNaN(latNum) && latNum >= -90 && latNum <= 90 && !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
                      reverseGeocode(latNum, lngNum);
                    }
                  }}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <span className="text-[11px] font-label-sm text-on-surface-variant/60 block">Values between -90 and 90. Auto-filled from your location or map selection.</span>
              </div>

              <div className="space-y-2">
                <label className="block font-label-lg text-label-lg text-on-surface font-semibold">Longitude *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 77.4126"
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                  onBlur={(e) => {
                    const latNum = parseFloat(latitude);
                    const lngNum = parseFloat(e.target.value);
                    if (!isNaN(latNum) && latNum >= -90 && latNum <= 90 && !isNaN(lngNum) && lngNum >= -180 && lngNum <= 180) {
                      reverseGeocode(latNum, lngNum);
                    }
                  }}
                  className="w-full bg-surface border border-outline-variant rounded-lg px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
                <span className="text-[11px] font-label-sm text-on-surface-variant/60 block">Values between -180 and 180. Auto-filled from your location or map selection.</span>
              </div>
            </div>

            {/* Privacy/Product Note */}
            <div className="pt-2 text-[11px] text-on-surface-variant/60 italic flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-primary">info</span>
              <span>Your exact location is used only for this incident report and command response.</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex justify-between items-center pt-6 border-t border-outline-variant">
            <Link
              to="/dashboard/incidents"
              className="px-6 py-2 border border-outline-variant rounded font-label-md text-label-md text-on-surface font-semibold hover:bg-surface-container transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-primary text-on-primary rounded font-label-md text-label-md font-bold hover:bg-primary/90 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              {loading && <div className="w-4 h-4 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>}
              <span>Submit Incident</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
