import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a hackathon, you can hardcode a check or just allow any non-empty ID
    if (driverId && password) {
      onLogin({ id: driverId, name: "Driver " + driverId });
    }
  };

  return (
    <div style={{
      height: '100vh', width: '100vw', display: 'flex', 
      justifyContent: 'center', alignItems: 'center', background: '#f0f2f5'
    }}>
      <div style={{
        width: '400px', padding: '40px', background: 'white', 
        borderRadius: '12px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', textAlign: 'center'
      }}>
        <h2 style={{ color: '#0052cc', marginBottom: '10px' }}>Logistics Fleet AI</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Driver Authentication Portal</p>
        
        <form onSubmit={handleSubmit}>
          <input 
            type="text" 
            placeholder="Driver ID (e.g., DRV-9921)" 
            style={inputStyle} 
            value={driverId}
            onChange={(e) => setDriverId(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Password" 
            style={inputStyle} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" style={buttonStyle}>Login to Console</button>
        </form>
        
        <p style={{ marginTop: '20px', fontSize: '12px', color: '#888' }}>
          By logging in, you agree to real-time GPS tracking for route optimization.
        </p>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%', padding: '12px', marginBottom: '15px', 
  borderRadius: '6px', border: '1px solid #ddd', fontSize: '16px', boxSizing: 'border-box'
};

const buttonStyle = {
  width: '100%', padding: '14px', background: '#0052cc', color: 'white', 
  border: 'none', borderRadius: '6px', fontSize: '16px', fontWeight: 'bold', cursor: 'pointer'
};

export default LoginPage;