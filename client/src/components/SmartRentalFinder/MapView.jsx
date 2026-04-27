import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom component to update map view
const ChangeView = ({ center, zoom }) => {
  const map = useMap();
  map.setView(center, zoom);
  return null;
};

const MapView = ({ rentals, pickup, dropoff, cityCoords }) => {
  const defaultCenter = cityCoords ? [cityCoords.lat, cityCoords.lon] : [12.9716, 77.5946]; // Bangalore default
  const zoom = 12;

  const pickupIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  const dropoffIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
  });

  return (
    <div className="w-full h-full rounded-[32px] overflow-hidden shadow-inner bg-slate-100 border border-slate-100 relative z-0">
      <MapContainer center={defaultCenter} zoom={zoom} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        {cityCoords && <ChangeView center={[cityCoords.lat, cityCoords.lon]} zoom={12} />}

        {rentals.map((rental) => (
          <Marker key={rental.id} position={[rental.lat, rental.lon]}>
            <Popup>
              <div className="p-1">
                <p className="font-bold text-slate-900">{rental.name}</p>
                <p className="text-xs text-slate-500">{rental.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {pickup && (
          <Marker position={[pickup.lat, pickup.lon]} icon={pickupIcon}>
            <Popup><b>Pickup Point:</b><br/>{pickup.name}</Popup>
          </Marker>
        )}

        {dropoff && (
          <Marker position={[dropoff.lat, dropoff.lon]} icon={dropoffIcon}>
            <Popup><b>Drop-off Point:</b><br/>{dropoff.name}</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
