import React, { useState, useEffect } from 'react';
import TomTomMap from './components/TomTomMap';
import MissionControl from './components/MissionControl';
import LoginPage from './components/LoginPage';
import FatigueAlert from './components/FatigueAlert';
import * as ttServices from '@tomtom-international/web-sdk-services';

function App() {
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';
  const [view, setView] = useState('login'); 
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loginTime, setLoginTime] = useState(null);
  const [showFatigueWarning, setShowFatigueWarning] = useState(false);
  const [driver, setDriver] = useState({ name: "Alex Johnson", id: "DRV-9921" });

  useEffect(() => {
    if (view === 'navigation') {
      const timer = setTimeout(() => setShowFatigueWarning(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleLogin = (data) => {
    setDriver({ name: data.name || "Alex Johnson", id: data.id || "DRV-9921" });
    setLoginTime(new Date().toLocaleTimeString());
    setView('mission');
  };

  const handleStartMission = (start, stops) => {
    if (!start) return;
    const locations = [start, ...stops].map(s => `${s.pos.lng},${s.pos.lat}`).join(':');

    ttServices.services.calculateRoute({
      key: API_KEY,
      locations: locations,
      computeBestOrder: true, 
      traffic: true,
      travelMode: 'truck'
    }).then(result => {
      setRouteData(result.toGeoJson());
      setView('navigation');
    }).catch(err => {
      console.error(err);
      alert("Route optimization failed.");
    });
  };

  const backBtn = { 
    position: 'absolute', zIndex: 1000, top: '20px', left: '20px', 
    padding: '10px 20px', background: 'white', border: 'none', 
    borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', 
    boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      {view === 'login' && <LoginPage onLogin={handleLogin} />}
      {view === 'mission' && (
        <MissionControl 
          driver={driver} loginTime={loginTime} apiKey={API_KEY}
          onPlanRoute={handleStartMission}
          onAddMarker={(pos, color) => setMarkers(prev => [...prev, { pos, color }])}
        />
      )}
      {view === 'navigation' && (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <button onClick={() => setView('mission')} style={backBtn}>← Edit Mission</button>
          {showFatigueWarning && <FatigueAlert onDismiss={() => setShowFatigueWarning(false)} />}
          <TomTomMap apiKey={API_KEY} routeData={routeData} markers={markers} />
        </div>
      )}
    </div>
  );
}

export default App;