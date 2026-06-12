import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import { getIncidents } from '../../api/incidentApi';
import { getResources } from '../../api/resourceApi';
import useAuth from '../../hooks/useAuth';
import MapFilters from '../../components/map/MapFilters';
import MapLegend from '../../components/map/MapLegend';
import MapMarker from '../../components/map/MapMarker';
import { geoJsonToLeafletPosition } from '../../utils/geo';

// Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

export default function MapView() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState([]);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // View mode state: markers, density, hybrid
  const [viewMode, setViewMode] = useState('hybrid');

  // Filters state
  const [filters, setFilters] = useState({
    showIncidents: true,
    showResources: true,
    incidentStatus: '',
    incidentSeverity: '',
    incidentType: '',
    resourceStatus: '',
    resourceType: ''
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch records
      const [incidentRes, resourceRes] = await Promise.all([
        getIncidents({ limit: 100, sort: '-createdAt' }),
        getResources({ limit: 100, sort: '-createdAt' })
      ]);

      if (incidentRes.success) {
        setIncidents(incidentRes.data.incidents);
      } else {
        setError(incidentRes.message || 'Failed to fetch incidents data');
      }

      if (resourceRes.success) {
        setResources(resourceRes.data.resources);
      } else {
        setError(resourceRes.message || 'Failed to fetch resources data');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while loading map records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleResetFilters = () => {
    setFilters({
      showIncidents: true,
      showResources: true,
      incidentStatus: '',
      incidentSeverity: '',
      incidentType: '',
      resourceStatus: '',
      resourceType: ''
    });
  };

  // Client-side filtering logic
  const filteredIncidents = incidents.filter(inc => {
    if (!filters.showIncidents) return false;
    if (filters.incidentStatus && inc.status !== filters.incidentStatus) return false;
    if (filters.incidentSeverity && inc.severity !== filters.incidentSeverity) return false;
    if (filters.incidentType && inc.type !== filters.incidentType) return false;
    return true;
  });

  const filteredResources = resources.filter(res => {
    if (!filters.showResources) return false;
    if (filters.resourceStatus && res.status !== filters.resourceStatus) return false;
    if (filters.resourceType && res.type !== filters.resourceType) return false;
    return true;
  });

  // Calculate density zones by grouping nearby incidents (2 decimal grid = ~1.1km grid)
  const getDensityZones = () => {
    const grouped = {};
    filteredIncidents.forEach(inc => {
      const position = geoJsonToLeafletPosition(inc.location);
      if (!position) return;
      const [lat, lng] = position;

      const latGrid = Math.round(lat * 100) / 100;
      const lngGrid = Math.round(lng * 100) / 100;
      const key = `${latGrid.toFixed(2)},${lngGrid.toFixed(2)}`;

      if (!grouped[key]) {
        grouped[key] = {
          latSum: 0,
          lngSum: 0,
          count: 0,
          maxSeverity: 'low',
          incidents: []
        };
      }

      grouped[key].latSum += lat;
      grouped[key].lngSum += lng;
      grouped[key].count += 1;
      grouped[key].incidents.push(inc);

      const severities = { low: 0, medium: 1, high: 2, critical: 3 };
      if (severities[inc.severity] > severities[grouped[key].maxSeverity]) {
        grouped[key].maxSeverity = inc.severity;
      }
    });

    return Object.values(grouped).map(group => {
      const centerLat = group.latSum / group.count;
      const centerLng = group.lngSum / group.count;
      return {
        position: [centerLat, centerLng],
        count: group.count,
        maxSeverity: group.maxSeverity,
        incidents: group.incidents
      };
    });
  };

  const getDensityZoneStyles = (severity, count) => {
    const colorMap = {
      critical: '#EF4444',
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981'
    };
    const color = colorMap[severity] || '#3B82F6';
    const radius = 300 + (count - 1) * 150;
    const fillOpacity = 0.2 + Math.min(count * 0.1, 0.6);

    return {
      color,
      fillColor: color,
      radius,
      fillOpacity,
      weight: 1.5,
      dashArray: '4, 4'
    };
  };

  const densityZones = getDensityZones();

  // Calculations for summary card
  const totalIncidentsCount = filteredIncidents.length;
  const totalResourcesCount = filteredResources.length;

  const activeIncidentsCount = filteredIncidents.filter(i => ['reported', 'verified', 'assigned', 'in-progress'].includes(i.status)).length;
  const criticalIncidentsCount = filteredIncidents.filter(i => i.severity === 'critical').length;
  const availableResourcesCount = filteredResources.filter(r => r.status === 'available').length;
  const assignedResourcesCount = filteredResources.filter(r => r.status === 'assigned').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-outline-variant">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">map</span>
          </div>
          <div className="text-left">
            <h1 className="font-headline-lg text-headline-lg font-bold text-on-background tracking-tight">Map Command Center</h1>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {user?.role === 'admin'
                ? 'Track incidents, resources, and crowd-risk density zones across the response area.'
                : 'Geospatial overview of active incident reports, responder units, and neighborhood risk zones.'
              }
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200 shadow-sm">
            <button
              onClick={() => setViewMode('markers')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'markers'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Markers
            </button>
            <button
              onClick={() => setViewMode('density')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'density'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Density
            </button>
            <button
              onClick={() => setViewMode('hybrid')}
              className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                viewMode === 'hybrid'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Hybrid
            </button>
          </div>

          <button
            onClick={fetchData}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 font-label-md text-label-md font-bold text-on-surface bg-surface border border-outline-variant disabled:opacity-40 rounded-lg hover:bg-surface-container transition shadow-sm"
          >
            <span className={`material-symbols-outlined ${loading ? 'animate-spin' : ''}`}>refresh</span>
            <span>Refresh Map</span>
          </button>
        </div>
      </div>

      {/* Statistics Panels (Top widgets) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total incidents widget */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center justify-between shadow-sm text-left">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Incidents Shown</span>
            <span className="text-2xl font-extrabold text-on-surface">{totalIncidentsCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-error-container text-error flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">emergency</span>
          </div>
        </div>

        {/* Critical incidents widget */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center justify-between shadow-sm text-left">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Critical Severity</span>
            <span className="text-2xl font-extrabold text-error">{criticalIncidentsCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-error-container text-error animate-pulse flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">warning</span>
          </div>
        </div>

        {/* Total resources widget */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center justify-between shadow-sm text-left">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Resources Shown</span>
            <span className="text-2xl font-extrabold text-on-surface">{totalResourcesCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">inventory_2</span>
          </div>
        </div>

        {/* Available resources widget */}
        <div className="bg-surface border border-outline-variant rounded-xl p-4 flex items-center justify-between shadow-sm text-left">
          <div className="space-y-1">
            <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider block">Available Assets</span>
            <span className="text-2xl font-extrabold text-emerald-600">{availableResourcesCount}</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
            <span className="material-symbols-outlined text-[24px]">build</span>
          </div>
        </div>
      </div>

      {/* Map Control Filters */}
      <MapFilters
        filters={filters}
        setFilters={setFilters}
        onReset={handleResetFilters}
        onRefresh={fetchData}
      />

      {/* Primary Map Window */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* React Leaflet Map container (occupies 3/4 width on desktop) */}
        <div className="lg:col-span-3 h-[60vh] md:h-[65vh] relative rounded-2xl border border-outline-variant bg-surface overflow-hidden shadow-sm z-0">
          {loading ? (
            <div className="absolute inset-0 bg-surface/85 backdrop-blur-sm flex flex-col items-center justify-center z-50">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
              <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">Rendering map grid...</span>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-50 bg-surface">
              <span className="material-symbols-outlined text-error text-[48px] mb-3">warning</span>
              <p className="font-label-lg text-label-lg text-error font-semibold">{error}</p>
              <button
                onClick={fetchData}
                className="mt-4 px-4 py-2 font-label-md text-label-md text-on-primary bg-primary hover:bg-primary/95 rounded-lg transition"
              >
                Reload Map Data
              </button>
            </div>
          ) : (
            <MapContainer
              center={[23.2599, 77.4126]} // Bhopal defaults
              zoom={12}
              style={{ width: '100%', height: '100%' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Render Incidents (markers and hybrid modes only) */}
              {(viewMode === 'markers' || viewMode === 'hybrid') && filteredIncidents.map(incident => (
                <MapMarker key={incident._id} type="incident" data={incident} />
              ))}

              {/* Render Density Zones (density and hybrid modes only) */}
              {(viewMode === 'density' || viewMode === 'hybrid') && densityZones.map((zone, idx) => {
                const styles = getDensityZoneStyles(zone.maxSeverity, zone.count);
                return (
                  <Circle
                    key={idx}
                    center={zone.position}
                    radius={styles.radius}
                    pathOptions={{
                      color: styles.color,
                      fillColor: styles.fillColor,
                      fillOpacity: styles.fillOpacity,
                      weight: styles.weight,
                      dashArray: styles.dashArray
                    }}
                  >
                    <Popup>
                      <div className="p-2.5 text-xs text-left text-slate-800 space-y-1.5 max-w-[200px]">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wide text-[9px] flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-slate-500" style={{ backgroundColor: styles.color }}></span>
                          Crowd Risk Density Zone
                        </h4>
                        <div className="grid grid-cols-2 gap-1 text-[10px] leading-relaxed pt-1">
                          <div>
                            <span className="text-slate-400 block">Reports:</span>
                            <span className="font-bold text-slate-700">{zone.count} cases</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block">Max Severity:</span>
                            <span className="font-bold capitalize" style={{ color: styles.color }}>{zone.maxSeverity}</span>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 italic pt-1 border-t border-slate-100">
                          Aggregated from submitted incident logs. Individual citizen location is not exposed.
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                );
              })}

              {/* Render Resources */}
              {filteredResources.map(resource => (
                <MapMarker key={resource._id} type="resource" data={resource} />
              ))}
            </MapContainer>
          )}
        </div>

        {/* Legend & Info panel (occupies 1/4 width on desktop) */}
        <div className="space-y-4">
          {/* Map Legend */}
          <MapLegend />

          {/* Operational Summary Panel */}
          <div className="bg-surface border border-outline-variant rounded-xl p-4 space-y-3 shadow-sm text-xs text-left">
            <h3 className="font-bold text-on-surface flex items-center gap-1.5 font-label-md text-label-md border-b pb-2">
              <span className="material-symbols-outlined text-primary text-[18px]">analytics</span>
              <span>Map Data Summary</span>
            </h3>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Active Incidents:</span>
                <span className="font-bold text-slate-900">{activeIncidentsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Critical Incidents:</span>
                <span className="font-bold text-rose-600">{criticalIncidentsCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Available Assets:</span>
                <span className="font-bold text-emerald-600">{availableResourcesCount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500">Assigned Assets:</span>
                <span className="font-bold text-violet-600">{assignedResourcesCount}</span>
              </div>
            </div>
          </div>

          {/* Layer info details */}
          <div className="bg-surface border border-outline-variant rounded-xl p-4 space-y-2 text-xs shadow-sm text-left">
            <h4 className="font-bold text-on-surface flex items-center gap-1.5 font-label-md text-label-md">
              <span className="material-symbols-outlined text-primary text-[18px]">layers</span>
              <span>Crowd Risk Density</span>
            </h4>
            <p className="text-on-surface-variant leading-relaxed">
              Heat-style density view based on submitted reports. Density zones are aggregated from incident reports. Individual citizen locations are not exposed.
            </p>
            <div className="pt-2 border-t border-outline-variant/60 text-[10px] text-on-surface-variant/60 italic">
              Structured to support live crowd-risk heatmap layers.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

