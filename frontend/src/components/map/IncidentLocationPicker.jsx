import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom pulsing blue pin icon matching the theme color (#1D4ED8)
const pickerIcon = L.divIcon({
  className: 'custom-leaflet-icon-picker',
  html: `
    <div class="relative flex items-center justify-center w-8 h-8">
      <span class="absolute inline-flex h-full w-full rounded-full bg-blue-600 opacity-20 animate-ping"></span>
      <span class="relative inline-flex rounded-full h-4.5 w-4.5 bg-blue-600 border-2 border-white shadow-lg"></span>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16]
});

// Helper component to center the map when parent coordinates change
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] !== undefined && center[1] !== undefined) {
      map.setView(center, map.getZoom() || 15);
    }
  }, [center, map]);
  return null;
}

// Helper component to capture map click events
function MapEventsHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    }
  });
  return null;
}

export default function IncidentLocationPicker({ latitude, longitude, onPositionChange }) {
  // Bhopal/LNCT coordinates: [23.2599, 77.4126]
  const defaultCenter = [23.2599, 77.4126];
  
  const latVal = parseFloat(latitude);
  const lngVal = parseFloat(longitude);
  const hasValidPosition = !isNaN(latVal) && !isNaN(lngVal) && latVal >= -90 && latVal <= 90 && lngVal >= -180 && lngVal <= 180;
  
  const position = hasValidPosition ? [latVal, lngVal] : null;
  const center = position || defaultCenter;

  const handleDragEnd = (e) => {
    const marker = e.target;
    if (marker) {
      const latLng = marker.getLatLng();
      onPositionChange(latLng.lat, latLng.lng);
    }
  };

  return (
    <div className="w-full h-[300px] md:h-[340px] rounded-xl overflow-hidden border border-outline-variant relative z-0">
      <MapContainer
        center={center}
        zoom={position ? 15 : 12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Recenter view when coordinate updates occur */}
        <ChangeView center={position} />
        
        {/* Click listener for placing the marker */}
        <MapEventsHandler onMapClick={onPositionChange} />

        {/* Selected location marker */}
        {position && (
          <Marker
            position={position}
            icon={pickerIcon}
            draggable={true}
            eventHandlers={{
              dragend: handleDragEnd
            }}
          />
        )}
      </MapContainer>
      <div className="absolute bottom-2 left-2 bg-white/90 backdrop-blur-sm border border-outline-variant rounded px-2.5 py-1 text-[10px] text-on-surface-variant z-[1000] font-semibold shadow-sm pointer-events-none">
        {position ? '✓ Drag blue marker or click map to relocate' : '⚠ Click anywhere on the map to set location'}
      </div>
    </div>
  );
}
