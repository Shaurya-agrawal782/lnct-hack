import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { Wrench, ArrowLeft, AlertTriangle } from 'lucide-react';
import { createResource, getResourceById, updateResource } from '../../api/resourceApi';

export default function ResourceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState('other');
  const [status, setStatus] = useState('available');
  const [capacity, setCapacity] = useState('1');
  const [address, setAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [description, setDescription] = useState('');

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [error, setError] = useState(null);

  // Load existing details in edit mode
  useEffect(() => {
    if (isEditMode) {
      const loadResource = async () => {
        setFetching(true);
        setError(null);
        try {
          const res = await getResourceById(id);
          if (res.success) {
            const r = res.data.resource;
            setName(r.name);
            setType(r.type);
            setStatus(r.status);
            setCapacity(r.capacity?.toString() || '1');
            setAddress(r.currentLocation?.address || '');
            // coordinates[1] is Latitude, coordinates[0] is Longitude
            setLatitude(r.currentLocation?.coordinates?.[1]?.toString() || '');
            setLongitude(r.currentLocation?.coordinates?.[0]?.toString() || '');
            setContactPerson(r.contactPerson || '');
            setContactNumber(r.contactNumber || '');
            setDescription(r.description || '');
          } else {
            setError(res.message || 'Failed to retrieve resource details.');
          }
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || 'Error fetching resource details.');
        } finally {
          setFetching(false);
        }
      };
      loadResource();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate fields
    if (!name.trim() || !type || !status || !capacity || !address.trim() || !latitude || !longitude) {
      setError('Please fill in all required fields.');
      setLoading(false);
      return;
    }

    const latNum = parseFloat(latitude);
    const lngNum = parseFloat(longitude);
    const capNum = parseInt(capacity, 10);

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

    if (isNaN(capNum) || capNum < 0) {
      setError('Capacity must be a positive integer.');
      setLoading(false);
      return;
    }

    try {
      // Coordinates payload: [longitude, latitude]
      const payload = {
        name: name.trim(),
        type,
        status,
        capacity: capNum,
        currentLocation: {
          coordinates: [lngNum, latNum], // [longitude, latitude]
          address: address.trim()
        },
        contactPerson: contactPerson.trim() || undefined,
        contactNumber: contactNumber.trim() || undefined,
        description: description.trim() || undefined
      };

      let res;
      if (isEditMode) {
        res = await updateResource(id, payload);
      } else {
        res = await createResource(payload);
      }

      if (res.success) {
        navigate('/dashboard/resources');
      } else {
        setError(res.message || 'Failed to submit resource.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Error occurred while saving resource.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center p-12 min-h-[400px]">
        <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <span className="text-sm text-slate-400">Fetching resource inventory data...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Header with Back button */}
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard/resources"
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            {isEditMode ? 'Modify Resource' : 'Register Resource'}
          </h1>
          <p className="text-sm text-slate-400">
            {isEditMode ? 'Update existing emergency resource details' : 'Add a new asset to coordination grid'}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-6 md:p-8 shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-start space-x-2.5">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Name & Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Resource Name *</label>
              <input
                type="text"
                required
                maxLength={120}
                placeholder="e.g. Bhopal Central Ambulance 01"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Resource Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="ambulance">Ambulance</option>
                <option value="fire_truck">Fire Truck</option>
                <option value="rescue_team">Rescue Team</option>
                <option value="medical">Medical Staff</option>
                <option value="shelter">Shelter</option>
                <option value="supply">Supply Relief</option>
                <option value="volunteer_group">Volunteer Group</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Status & Capacity */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Status *</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-300 focus:outline-none focus:border-indigo-500"
              >
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="busy">Busy</option>
                <option value="maintenance">Maintenance</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Capacity / Crew Size *</label>
              <input
                type="number"
                min="0"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Location details */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Location Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. MP Nagar Fire Station, Bhopal"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Lat / Lng Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Latitude *</label>
              <input
                type="text"
                required
                placeholder="e.g. 23.2337"
                value={latitude}
                onChange={(e) => setLatitude(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Longitude *</label>
              <input
                type="text"
                required
                placeholder="e.g. 77.4302"
                value={longitude}
                onChange={(e) => setLongitude(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-900/60">
            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Contact Person (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Officer In-Charge"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-slate-200">Contact Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. +91 98765 XXXXX"
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-slate-200">Description (Optional)</label>
            <textarea
              rows={3}
              placeholder="e.g. Details regarding active equipment, emergency response capability..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-lg px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-900">
            <Link
              to="/dashboard/resources"
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
              <span>{isEditMode ? 'Save Changes' : 'Register Asset'}</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
