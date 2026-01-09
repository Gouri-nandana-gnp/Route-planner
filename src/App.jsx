import React, { useState, useEffect } from 'react';
import TomTomMap from './components/TomTomMap';
import MissionControl from './components/MissionControl';
import LoginPage from './components/LoginPage';
import FatigueAlert from './components/FatigueAlert';
import ManagerDashboard from './components/ManagerDashboard'; 
import * as ttServices from '@tomtom-international/web-sdk-services';

function App() {
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';

  // Navigation State
  const [view, setView] = useState('login'); // 'login', 'manager', 'mission', 'navigation'
  const [user, setUser] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loginTime, setLoginTime] = useState(null);
  const [showFatigueWarning, setShowFatigueWarning] = useState(false);
  const [driver, setDriver] = useState({ name: "", id: "" });

  // Handle Login Logic
  const handleLogin = (userData) => {
    setUser(userData);
    setLoginTime(new Date().toLocaleTimeString());
    
    // CONNECTION POINT: Switch view based on role
    if (userData.role === 'manager') {
      setView('manager');
    } else {
      setDriver({ name: userData.name, id: userData.id });
      setView('mission');
    }
  };

  // Logout Handler for Manager Dashboard
  const handleLogout = () => {
    setView('login');
    setUser(null);
    setRouteData(null);
    setMarkers([]);
  };

  // Route Planning (Driver Logic)
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
    }).catch(err => alert("Routing Error"));
  };

  // Fatigue Timer
  useEffect(() => {
    if (view === 'navigation') {
      const timer = setTimeout(() => setShowFatigueWarning(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {/* 1. Login View */}
      {view === 'login' && <LoginPage onLogin={handleLogin} />}

      {/* 2. Manager Portal Integration */}
      {view === 'manager' && (
        <ManagerDashboard user={user} onLogout={handleLogout} />
      )}

      {/* 3. Driver Mission Planning */}
      {view === 'mission' && (
        <MissionControl 
          driver={driver} loginTime={loginTime} apiKey={API_KEY}
          onPlanRoute={handleStartMission}
          onAddMarker={(pos, color) => setMarkers(prev => [...prev, { pos, color }])}
        />
      )}

      {/* 4. Map Navigation View */}
      {view === 'navigation' && (
        <div style={{ width: '100%', height: '100%', position: 'relative' }}>
          <button 
            onClick={() => setView('mission')} 
            style={{ position: 'absolute', zIndex: 1000, top: '20px', left: '20px', padding: '10px 20px', background: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' }}
          >
            ← Back
          </button>
          {showFatigueWarning && <FatigueAlert onDismiss={() => setShowFatigueWarning(false)} />}
          <TomTomMap apiKey={API_KEY} routeData={routeData} markers={markers} />
        </div>
      )}

    </div>
  );
}

export default App;