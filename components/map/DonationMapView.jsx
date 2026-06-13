import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const orangeIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});

const selectedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
  iconSize: [34, 52], iconAnchor: [17, 52], popupAnchor: [1, -44], shadowSize: [41, 41],
});

function FlyToSelected({ donations, selectedId }) {
  const map = useMap();
  useEffect(() => {
    if (!selectedId) return;
    const d = donations.find(d => d.id === selectedId);
    if (d) map.flyTo([d.pickup_lat, d.pickup_lng], 17, { duration: 1 });
  }, [selectedId]);
  return null;
}

function FitBounds({ donations }) {
  const map = useMap();
  useEffect(() => {
    if (donations.length === 0) return;
    if (donations.length === 1) {
      map.setView([donations[0].pickup_lat, donations[0].pickup_lng], 16);
    } else {
      const bounds = L.latLngBounds(donations.map(d => [d.pickup_lat, d.pickup_lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [donations.length]);
  return null;
}

export default function DonationMapView({ donations, selectedId, onSelect }) {
  const valid = (donations || []).filter(
    d => d.pickup_lat != null && d.pickup_lng != null &&
         !isNaN(Number(d.pickup_lat)) && !isNaN(Number(d.pickup_lng))
  );

  const center = valid.length > 0
    ? [Number(valid[0].pickup_lat), Number(valid[0].pickup_lng)]
    : [20.5937, 78.9629];

  return (
    <MapContainer center={center} zoom={valid.length > 0 ? 13 : 5} className="w-full h-full z-0" scrollWheelZoom>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        maxZoom={19}
      />
      <FitBounds donations={valid} />
      <FlyToSelected donations={valid} selectedId={selectedId} />
      {valid.map(d => (
        <Marker
          key={d.id}
          position={[Number(d.pickup_lat), Number(d.pickup_lng)]}
          icon={d.id === selectedId ? selectedIcon : orangeIcon}
          eventHandlers={{ click: () => onSelect(d.id) }}
        >
          <Popup minWidth={180}>
            <div style={{ fontFamily: 'sans-serif', fontSize: 12 }}>
              <strong style={{ display: 'block', marginBottom: 4 }}>{d.title}</strong>
              <div><strong>Qty:</strong> {d.quantity}</div>
              {d.freshness_hours && <div><strong>Fresh:</strong> {d.freshness_hours}h</div>}
              <div style={{ marginTop: 4, color: '#333' }}>📍 {d.pickup_address}</div>
              {d.donor_name && <div style={{ color: '#777', marginTop: 2 }}>By {d.donor_name}</div>}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
