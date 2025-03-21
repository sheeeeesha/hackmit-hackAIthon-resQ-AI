// import React, { useEffect, useRef, useState } from 'react';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';

// // Fix for Leaflet marker icons in Next.js
// const defaultIcon = L.icon({
//   iconUrl: '/marker-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
// });

// export default function MapView({ emergency }) {
//   const [isClient, setIsClient] = useState(false);
//   const mapRef = useRef(null);
//   const [position, setPosition] = useState([40.7128, -74.0060]);
//   const [locationName, setLocationName] = useState('');

//   useEffect(() => {
//     setIsClient(true);
//     if (emergency?.location) {
//       setLocationName(emergency.location);
//       const mockGeocode = (address) => {
//         return [40.7128 + (Math.random() - 0.5) * 0.05, -74.0060 + (Math.random() - 0.5) * 0.05];
//       };
//       const coordinates = mockGeocode(emergency.location);
//       setPosition(coordinates);
//       if (mapRef.current) {
//         mapRef.current.setView(coordinates, 13);
//       }
//     }
//   }, [emergency]);

//   if (!isClient) return null; // Render nothing on the server

//   // Rest of your MapView component
//   return (
//     <div className="h-full w-full relative">
//       {/* ... your map content ... */}
//       <MapContainer
//         center={position}
//         zoom={13}
//         style={{ height: '100%', width: '100%' }}
//         whenCreated={(map) => {
//           mapRef.current = map;
//         }}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         <Marker position={position} icon={defaultIcon}>
//           <Popup>
//             {/* ... popup content ... */}
//           </Popup>
//         </Marker>
//       </MapContainer>
//     </div>
//   );
// }

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for Leaflet marker icons in Next.js
const defaultIcon = L.icon({
  iconUrl: '/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

export default function MapView({ emergency }) {
  const [isClient, setIsClient] = useState(false);
  const mapRef = useRef(null);
  const [position, setPosition] = useState([40.7128, -74.0060]); // Default position
  const [locationName, setLocationName] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (emergency?.location) {
      setLocationName(emergency.location);
      setLoading(true); // Start loading

      // Replace with your real geocoding logic here
      const geocode = async (address) => {
        try {
          // Example using a mock geocoding delay
          await new Promise((resolve) => setTimeout(resolve, 500));
          const coordinates = [40.7128 + (Math.random() - 0.5) * 0.05, -74.0060 + (Math.random() - 0.5) * 0.05];
          setPosition(coordinates);
          setLoading(false); // Stop loading
          return coordinates;
        } catch (error) {
          console.error('Geocoding error:', error);
          setLoading(false); // Stop loading on error
          return null;
        }
      };

      geocode(emergency.location).then((coordinates) => {
        if (coordinates && mapRef.current) {
          mapRef.current.setView(coordinates, 13);
        }
      });
    }
  }, [emergency]);

  if (!isClient) return null;

  return (
    <div className="h-full w-full relative">
      {loading && (
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 bg-opacity-50 flex justify-center items-center">
          Loading...
        </div>
      )}
      <MapContainer
        center={position}
        zoom={13}
        style={{ height: '100%', width: '100%' }}
        whenCreated={(map) => {
          mapRef.current = map;
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={position} icon={defaultIcon}>
          <Popup>
            {locationName}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}