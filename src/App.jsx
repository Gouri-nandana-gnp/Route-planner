import React, { useState, useEffect } from 'react';
import TomTomMap from './components/TomTomMap';
import MissionControl from './components/MissionControl';
import LoginPage from './components/LoginPage';
import FatigueAlert from './components/FatigueAlert';
import * as ttServices from '@tomtom-international/web-sdk-services';

function App() {
  // Use your API Key
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';

  // Application State
  const [view, setView] = useState('login'); // 'login', 'mission', 'navigation'
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loginTime, setLoginTime] = useState(null);
  const [showFatigueWarning, setShowFatigueWarning] = useState(false);
  const [driver, setDriver] = useState({ name: "", id: "", vehicle: "Logistics Heavy Truck" });

  /**
   * 1. HACKATHON FEATURE: Driver Fatigue Protection
   * Automatically triggers a warning after being in navigation for 10 seconds.
   * In a real app, this would be based on actual shift time (loginTime).
   */
  useEffect(() => {
    let timer;
    if (view === 'navigation') {
      timer = setTimeout(() => {
        setShowFatigueWarning(true);
      }, 10000); // 10 seconds for demo purposes
    }
    return () => clearTimeout(timer);
  }, [view]);

  /**
   * 2. Handle Login
   * Receives data from LoginPage.jsx
   */
  const handleLogin = (driverData) => {
    setDriver({
      name: driverData.name || "Alex Johnson",
      id: driverData.id || "DRV-9921",
      vehicle: "Heavy Duty Truck (AI-Engine Active)"
    });
    setLoginTime(new Date().toLocaleTimeString());
    setView('mission');
  };

  /**
   * 3. MAIN LOGIC: AI Route Optimization
   * This calls the TomTom Routing API with Truck and Eco parameters.
   */
 const handleStartMission = (start, stops) => {
    if (!start || stops.length === 0) {
      alert("Error: Please set both a starting point and at least one delivery stop.");
      return;
    }

    // TomTom Routing API expects format: "lng,lat:lng,lat:lng,lat"
    const locations = [start, ...stops]
      .map(s => `${s.pos.lng},${s.pos.lat}`)
      .join(':');

    console.log("AI Engine - Optimizing Route for locations:", locations);

    ttServices.services.calculateRoute({
      key: API_KEY,
      locations: locations,
      computeBestOrder: true,   // Re-orders stops for the fastest path
      traffic: true,            // Avoids traffic jams
      travelMode: 'truck',       // Truck-specific route
      routeType: 'fastest',      // or 'eco'
      // removed vehicleLoadType to fix the validation error
    })
    .then(result => {
      const geoJson = result.toGeoJson();
      console.log("Optimization Complete:", geoJson);
      setRouteData(geoJson);
      setView('navigation');
    })
    .catch(err => {
      console.error("Routing Optimization Failed:", err);
      // Detailed error logging
      if (err.data && err.data.error) {
          alert(`Optimization Error: ${err.data.error.description}`);
      } else {
          alert("Optimization Engine Error. Please check coordinates or network.");
      }
    });
  };

  /**
   * 4. Marker Management
   * Used by MissionControl to place pins on the map
   */
  const handleAddMarker = (pos, color) => {
    setMarkers(prev => [...prev, { pos, color }]);
  };

  // RENDER LOGIC
  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden', background: '#f8fafc' }}>
      
      {/* View 1: Authentication */}
      {view === 'login' && (
        <LoginPage onLogin={handleLogin} />
      )}

      {/* View 2: Mission Planning (Mission Control) */}
      {view === 'mission' && (
        <MissionControl 
          driver={driver} 
          loginTime={loginTime}
          onPlanRoute={handleStartMission}
          onAddMarker={handleAddMarker}
          apiKey={API_KEY}
        />
      )}

      {/* View 3: Live Navigation Map */}
      {view === 'navigation' && (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          
          {/* Navigation Overlay Header */}
          <div style={navHeaderStyle}>
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <button onClick={() => setView('mission')} style={backBtnStyle}>
                  ← Back to Mission Control
                </button>
                <div style={{ color: 'white', fontWeight: 'bold' }}>
                    LIVE: {driver.name} | {driver.vehicle}
                </div>
            </div>
            <div style={badgeStyle}>
                <span style={pulseDot}></span> AI ROUTE OPTIMIZATION ACTIVE
            </div>
          </div>

          {/* HACKATHON FEATURE: Fatigue Alert Popup */}
          {showFatigueWarning && (
            <FatigueAlert onDismiss={() => setShowFatigueWarning(false)} />
          )}

          {/* The TomTom Map Component */}
          <TomTomMap 
            apiKey={API_KEY} 
            routeData={routeData}
            markers={markers} 
          />
        </div>
      )}
    </div>
  );
}

// STYLES
const navHeaderStyle = {
  position: 'absolute', top: 0, left: 0, right: 0, height: '70px',
  background: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', 
  justifyContent: 'space-between', padding: '0 25px', zIndex: 1000,
  backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)'
};

const backBtnStyle = {
  background: '#334155', color: 'white', border: 'none', padding: '10px 18px', 
  borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s'
};

const badgeStyle = {
  background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', 
  padding: '8px 15px', borderRadius: '20px', fontSize: '12px', 
  fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px',
  border: '1px solid #10b981'
};

const pulseDot = {
  height: '10px', width: '10px', backgroundColor: '#10b981', 
  borderRadius: '50%', display: 'inline-block',
  boxShadow: '0 0 0 rgba(16, 185, 129, 0.4)',
  animation: 'pulse 2s infinite'
};

// Add this to your index.css for the pulse effect
/*
@keyframes pulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
}
*/

export default App;