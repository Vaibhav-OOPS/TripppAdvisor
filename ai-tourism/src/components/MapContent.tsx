'use client';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

export default function MapContent({ lat, lon, display }) {
  return (
    <MapContainer center={[lat, lon]} zoom={13} scrollWheelZoom={false} style={{ height: '260px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      <Marker position={[lat, lon]}>
        <Popup>{display}</Popup>
      </Marker>
    </MapContainer>
  );
}
