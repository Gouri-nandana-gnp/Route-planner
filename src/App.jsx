import React, { useState, useEffect } from 'react';
import TomTomMap from './components/TomTomMap';
import MissionControl from './components/MissionControl';
import LoginPage from './components/LoginPage';
import FatigueAlert from './components/FatigueAlert';
import ManagerDashboard from './components/ManagerDashboard'; 
import * as ttServices from '@tomtom-international/web-sdk-services';

import { calculateAIPrediction } from './services/mlPredictor';
import PredictiveInsights from './components/PredictiveInsights';

function App() {
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';

  // Navigation State
  const [view, setView] = useState('login'); 
  const [user, setUser] = useState(null);
  const [routeData, setRouteData] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [loginTime, setLoginTime] = useState(null); 
  const [showFatigueWarning, setShowFatigueWarning] = useState(false);
  const [driver, setDriver] = useState({ name: "", id: "" });
  const [aiData, setAiData] = useState(null);
  
  // State to store points for the re-routing simulation
  const [activeMissionPoints, setActiveMissionPoints] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setLoginTime(new Date()); 
    if (userData.role === 'manager') {
      setView('manager');
    } else {
      setDriver({ name: userData.name, id: userData.id });
      setView('mission');
    }
  };

  const handleLogout = () => {
    setView('login');
    setUser(null);
    setRouteData(null);
    setMarkers([]);
    setAiData(null);
  };

  // UPDATED: Now accepts departureTime for Tomorrow's Prediction
  const handleStartMission = (start, stops, departureTime) => {
  if (!start) return;
  const locations = [start, ...stops].map(s => `${s.pos.lng},${s.pos.lat}`).join(':');

  // Convert selected time to ISO format, or use 'now'
  const departAtValue = departureTime ? new Date(departureTime).toISOString() : 'now';

  ttServices.services.calculateRoute({
    key: API_KEY,
    locations: locations,
    computeBestOrder: true, 
    traffic: true,
    departAt: departAtValue, // TOMORROW'S PREDICTION ENGINE
    travelMode: 'truck'
  }).then(result => {
    const trafficSec = result.routes[0].summary.trafficDelayInSeconds;

    // Send departureTime to the AI Predictor for context
    const prediction = calculateAIPrediction(trafficSec, loginTime, departureTime);
    setAiData(prediction); 

    setRouteData(result.toGeoJson());
    setView('navigation');
  }).catch(err => alert("Routing Error: Ensure departure time is not in the past."));
};

  // NEW: Simulation function with forced reroute (2.5km radius)
  const simulateTrafficIncident = () => {
    if (!routeData?.features?.[0] || !activeMissionPoints) return;

    try {
      const coords = routeData.features[0].geometry.coordinates;
      const midPoint = coords[Math.floor(coords.length * 0.4)];

      const blockZone = {
        type: 'circle',
        center: { lng: midPoint[0], lat: midPoint[1] },
        radius: 2500 
      };

      // Add visual Red Marker for the demo
      setMarkers(prev => [...prev, { pos: { lng: midPoint[0], lat: midPoint[1] }, color: '#ff0000' }]);

      const { start, stops, departureTime } = activeMissionPoints;
      const locations = [start, ...stops].map(s => `${s.pos.lng},${s.pos.lat}`).join(':');

      ttServices.services.calculateRoute({
        key: API_KEY,
        locations: locations,
        computeBestOrder: true,
        traffic: true,
        travelMode: 'truck',
        avoidAreas: [blockZone] // FORCES Detour
      }).then(result => {
        setRouteData(result.toGeoJson());
        setAiData(prev => ({
          ...prev,
          trafficMins: prev.trafficMins + 20,
          totalDelay: prev.totalDelay + 20,
          confidenceScore: "81.4",
          weatherCondition: "Alert: Detour"
        }));
        alert("🚨 AI ALERT: Major incident detected. Rerouting to safest path.");
      });
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (view === 'navigation') {
      const timer = setTimeout(() => setShowFatigueWarning(true), 10000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const backBtn = { 
    position: 'absolute', zIndex: 1000, top: '20px', left: '20px', 
    padding: '10px 20px', background: 'white', border: 'none', 
    borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.2)' 
  };

  const incidentBtn = {
    position: 'absolute', zIndex: 1000, bottom: '30px', right: '20px',
    padding: '12px 24px', background: '#ef4444', color: 'white',
    border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 15px rgba(239, 68, 68, 0.4)'
  };

  return (
    <div style={{ width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      {view === 'login' && <LoginPage onLogin={handleLogin} />}
      {view === 'manager' && <ManagerDashboard user={user} onLogout={handleLogout} />}
      
      {view === 'mission' && (
        <MissionControl 
          driver={driver} 
          loginTime={loginTime ? loginTime.toLocaleTimeString() : ""} 
          apiKey={API_KEY}
          onPlanRoute={handleStartMission}
          onAddMarker={(pos, color) => setMarkers(prev => [...prev, { pos, color }])}
        />
      )}

      {view === 'navigation' && (
        /* The container must be full height for the map to show */
        <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
          
          <button onClick={() => setView('mission')} style={backBtn}>← Back</button>
          
          <button onClick={simulateTrafficIncident} style={incidentBtn}>⚠️ SIMULATE ACCIDENT</button>
    
          <PredictiveInsights data={aiData} />

          {showFatigueWarning && <FatigueAlert onDismiss={() => setShowFatigueWarning(false)} />}
          
          {/* THE MAP */}
          <TomTomMap apiKey={API_KEY} routeData={routeData} markers={markers} />
        </div>
      )}

    </div>
  );
}

export default App;