import React, { useState } from 'react';
import TomTomMap from './components/TomTomMap';
import Sidebar from './components/Sidebar';
import * as ttServices from '@tomtom-international/web-sdk-services';

function App() {
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';
  const [liveIncidents, setLiveIncidents] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  // Driver Profile Detail
  const [driver] = useState({
    name: "Alex Johnson",
    id: "DRV-9921",
    vehicle: "Heavy Truck - Plate: TN-01-AX",
    status: "Active"
  });

  // Function to show "Dots" on the map
  const handleAddMarker = (pos, color) => {
    setMarkers(prev => [...prev, { pos, color }]);
  };

  // Unified Logic to connect all points
  const handlePlanRoute = (startPoint, stops) => {
    if (!startPoint || stops.length === 0) return;

    // Combine start and stops into one array for the service
    const locations = [startPoint, ...stops]
      .map(s => `${s.pos.lng},${s.pos.lat}`)
      .join(':');

    ttServices.services.calculateRoute({
      key: API_KEY,
      locations: locations,
      computeBestOrder: true, // "AI Re-scoring": Finds the most efficient sequence
      traffic: true,           // Real-time accident avoidance
      routeType: 'fastest'     // Optimized for logistics speed
    }).then(result => {
      setRouteData(result.toGeoJson());
    }).catch(err => {
      console.error("Routing error:", err);
    });
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#f4f7f9' }}>
      <Sidebar 
        driver={driver} 
        onPlanRoute={handlePlanRoute}
        onAddMarker={handleAddMarker}
        apiKey={API_KEY}
      />
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <TomTomMap 
          apiKey={API_KEY} 
          setIncidents={setLiveIncidents} 
          routeData={routeData}
          markers={markers} // Critical: pass the dots to the map
        />
      </div>
    </div>
  );
}

export default App;