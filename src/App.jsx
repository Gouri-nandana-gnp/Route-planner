import React, { useState } from 'react';
import TomTomMap from './components/TomTomMap';
import MissionControl from './components/MissionControl';
import LoginPage from './components/LoginPage';
import * as ttServices from '@tomtom-international/web-sdk-services';

function App() {
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';
  const [view, setView] = useState('login'); // 'login', 'mission', 'navigation'
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loginTime, setLoginTime] = useState(null);
  const [driver] = useState({ name: "Alex Johnson", id: "DRV-9921", vehicle: "Heavy Truck" });

  const handleLogin = (credentials) => {
    setLoginTime(new Date().toLocaleString()); // Record start for fatigue tracking
    setView('mission');
  };

  const handleStartMission = (start, stops) => {
    const locations = [start, ...stops].map(s => `${s.pos.lng},${s.pos.lat}`).join(':');
    
    ttServices.services.calculateRoute({
      key: API_KEY,
      locations: locations,
      computeBestOrder: true, // AI Optimization
      traffic: true,         // Real-time accident data
      routeType: 'fastest'
    }).then(result => {
      setRouteData(result.toGeoJson());
      setView('navigation'); // Transition to full-screen map
    });
  };
  const handleAddMarker = (pos, color) => {
    setMarkers(prev => [...prev, { pos, color }]);
  };

  // Rendering logic for full-screen transitions
  if (view === 'login') return <LoginPage onLogin={handleLogin} />;

  if (view === 'mission') {
    return (
      <MissionControl 
        driver={driver} 
        loginTime={loginTime}
        onPlanRoute={handleStartMission}
        onAddMarker={handleAddMarker}
        apiKey={API_KEY}
      />
    );
  }

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Floating Back Button to return to Mission Control */}
      <button 
        onClick={() => setView('mission')}
        style={{
          position: 'absolute', top: '20px', left: '20px', zIndex: 1000,
          padding: '12px 24px', background: 'white', border: 'none',
          borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
        }}
      >
        ← Edit Mission
      </button>
      
      <TomTomMap 
        apiKey={API_KEY} 
        routeData={routeData}
        markers={markers} 
      />
    </div>
  );
}

export default App;
