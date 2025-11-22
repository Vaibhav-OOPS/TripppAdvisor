'use client';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useEffect } from 'react';

// Custom marker icon for consistent appearance
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Animate/pan view when coords change
function MapController({ coords }: { coords: { lat: number; lon: number } }) {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo([coords.lat, coords.lon], 13, { duration: 1.2 });
    }
  }, [coords, map]);
  return null;
}

type PlaceMarker = {
  name: string;
  lat: number;
  lon: number;
};

type MapContentProps = {
  lat: number;
  lon: number;
  display: string;
  places?: PlaceMarker[];
};

export default function MapContent({ lat, lon, display, places = [] }: MapContentProps) {
  return (
    <div style={{ width: '100%', height: '100%' }}>
      <MapContainer
        center={[lat, lon]}
        zoom={13}
        scrollWheelZoom={true}
        style={{ height: '260px', width: '100%' }}
      >
        <MapController coords={{ lat, lon }} />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
        />

        {/* Main location marker */}
        <Marker position={[lat, lon]} icon={markerIcon}>
          <Popup>{display || `Location: ${lat.toFixed(4)}, ${lon.toFixed(4)}`}</Popup>
        </Marker>

        {/* Additional places markers */}
        {places.map((p, i) => (
          <Marker key={i} position={[p.lat, p.lon]} icon={markerIcon}>
            <Popup>{p.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
