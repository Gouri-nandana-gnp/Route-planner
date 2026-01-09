import React from 'react';

const Sidebar = ({ incidents = [] }) => {
  return (
    <div style={{
      width: '350px',
      height: '100vh',
      backgroundColor: '#1a1a1a',
      color: 'white',
      padding: '20px',
      overflowY: 'auto',
      borderRight: '1px solid #333'
    }}>
      <h2 style={{ color: '#ff5500' }}>Live Fleet AI</h2>
      <hr style={{ borderColor: '#333' }} />
      
      <div style={{ marginBottom: '20px' }}>
        <h3>Real-time Incidents</h3>
        {incidents.length === 0 ? (
          <p style={{ color: '#888' }}>Scanning for traffic data...</p>
        ) : (
          incidents.map((incident, index) => (
            <div key={index} style={{
              background: '#2a2a2a',
              padding: '10px',
              borderRadius: '5px',
              marginBottom: '10px',
              borderLeft: '4px solid #ffcc00'
            }}>
              <strong>{incident.type || 'Traffic Alert'}</strong>
              <p style={{ fontSize: '12px', margin: '5px 0' }}>{incident.description}</p>
              <small style={{ color: '#ffcc00' }}>Delay: {incident.delay}s</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// THIS IS THE MISSING LINE CAUSING YOUR ERROR:
export default Sidebar;