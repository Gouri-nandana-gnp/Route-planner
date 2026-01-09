import React, { useState } from 'react';
import TomTomMap from './components/TomTomMap';
import Sidebar from './components/Sidebar';

function App() {
  const [liveIncidents, setLiveIncidents] = useState([]);
  const API_KEY = 'PRlm8qnYX06Hehb10brSw6gmIJ6iWz7X';

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <Sidebar incidents={liveIncidents} />
      <div style={{ flexGrow: 1, position: 'relative' }}>
        <TomTomMap 
          apiKey={API_KEY} 
          setIncidents={setLiveIncidents} 
        />
      </div>
    </div>
  );
}

export default App;