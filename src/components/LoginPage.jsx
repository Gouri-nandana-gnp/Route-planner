import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [driverId, setDriverId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (driverId && password) {
      onLogin({ id: driverId, name: "Operator " + driverId });
    }
  };

  return (
    <div style={{ height: '100vh', width: '100vw', display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a' }}>
      <div style={{ width: '350px', padding: '40px', background: 'white', borderRadius: '16px', textAlign: 'center' }}>
        <h2 style={{ color: '#3b82f6', margin: '0 0 10px 0' }}>Fleet AI</h2>
        <p style={{ color: '#64748b', fontSize: '14px', marginBottom: '30px' }}>Secure Driver Access</p>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Driver ID" style={inputStyle} onChange={(e) => setDriverId(e.target.value)} />
          <input type="password" placeholder="Password" style={inputStyle} onChange={(e) => setPassword(e.target.value)} />
          <button type="submit" style={buttonStyle}>Login to Mission Control</button>
        </form>
      </div>
    </div>
  );
};

const inputStyle = { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #e2e8f0', boxSizing: 'border-box' };
const buttonStyle = { width: '100%', padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' };

export default LoginPage;