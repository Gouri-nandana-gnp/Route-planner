import React, { useState } from 'react';
import TomTomMap from './components/TomTomMap';
import Sidebar from './components/Sidebar';
import LoginPage from './components/LoginPage'; // Import the new login page
import * as ttServices from '@tomtom-international/web-sdk-services';

function App() {
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state
  const [liveIncidents, setLiveIncidents] = useState([]);
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  // Driver Profile Detail
  const [driver, setDriver] = useState({
    name: "Alex Johnson",
    id: "DRV-9921",
    vehicle: "Heavy Truck - Plate: TN-01-AX",
    status: "Active"
  });

  const handleLogin = (credentials) => {
    // In a real app, you'd verify credentials here. 
    // For the hackathon, we simply log them in
    setDriver(prev => ({ ...prev, id: credentials.id, name: "Driver " + credentials.id }));
    setIsLoggedIn(true);
  };

  const handleAddMarker = (pos, color) => {
    setMarkers(prev => [...prev, { pos, color }]);
  };

  const handlePlanRoute = (start, stops) => {
    const locations = [start, ...stops].map(s => `${s.pos.lng},${s.pos.lat}`).join(':');
    
    ttServices.services.calculateRoute({
      key: API_KEY,
      locations: locations,
      computeBestOrder: true, // Optimizes the sequence of multiple stops
      traffic: true,         // Incorporates live traffic data
      routeType: 'fastest'   // Prioritizes the quickest arrival
    }).then(result => {
      setRouteData(result.toGeoJson());
    });
  };

  // 1. Show Login Page if not authenticated
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  // 2. Show Dashboard if authenticated
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
          markers={markers} 
        />
      </div>
    </div>
  );
}

export default App;