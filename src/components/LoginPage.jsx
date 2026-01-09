import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({ id: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logic: Pass 'manager' or 'driver' role back to App.jsx
    const role = isAdmin ? "manager" : "driver";
    onLogin({ 
        id: formData.id, 
        name: `${isAdmin ? 'Manager' : 'Operator'} ${formData.id}`, 
        role: role 
    });
  };

  return (
    <div style={fullPageBg}>
      <div style={cardContainer}>
        <div style={headerSection}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', margin: '0' }}>Fleet Management</h2>
          <p style={{ fontSize: '14px', color: '#6b7280', marginTop: '4px' }}>Access your vehicle & driver dashboard</p>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', background: '#f9fafb' }}>
          <button 
            type="button"
            onClick={() => { setIsAdmin(false); setFormData({id:'', password:''}); }}
            style={!isAdmin ? activeDriverTab : inactiveTab}
          >
            DRIVER LOGIN
          </button>
          <button 
            type="button"
            onClick={() => { setIsAdmin(true); setFormData({id:'', password:''}); }}
            style={isAdmin ? activeManagerTab : inactiveTab}
          >
            MANAGER LOGIN
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={labelStyle}>{isAdmin ? "Manager ID" : "Driver ID"}</label>
            <input 
              type="text" name="id" value={formData.id}
              onChange={handleInputChange} placeholder={isAdmin ? "M-1001" : "DRV-9912"}
              style={inputStyle} required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Password</label>
            <input 
              type="password" name="password" value={formData.password}
              onChange={handleInputChange} placeholder="••••••••"
              style={inputStyle} required
            />
          </div>

          <button 
            type="submit" 
            style={{...submitBtnBase, backgroundColor: isAdmin ? '#2563eb' : '#16a34a'}}
          >
            Login as {isAdmin ? "Manager" : "Driver"}
          </button>
        </form>
        <div style={footerStyle}>Vehicle & Driver Tracking System v2.0</div>
      </div>
    </div>
  );
};

// Styles
const fullPageBg = { height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f3f4f6', fontFamily: 'sans-serif' };
const cardContainer = { background: 'white', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', width: '100%', maxWidth: '400px', overflow: 'hidden' };
const headerSection = { padding: '24px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' };
const labelStyle = { display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '8px' };
const inputStyle = { width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #d1d5db', boxSizing: 'border-box' };
const footerStyle = { padding: '16px', background: '#f9fafb', textAlign: 'center', fontSize: '12px', color: '#9ca3af' };
const inactiveTab = { flex: 1, padding: '16px 0', fontSize: '14px', fontWeight: '600', border: 'none', background: 'transparent', color: '#9ca3af', cursor: 'pointer' };
const activeDriverTab = { flex: 1, padding: '16px 0', fontSize: '14px', fontWeight: '600', border: 'none', background: 'white', color: '#16a34a', borderBottom: '3px solid #16a34a', cursor: 'pointer' };
const activeManagerTab = { flex: 1, padding: '16px 0', fontSize: '14px', fontWeight: '600', border: 'none', background: 'white', color: '#2563eb', borderBottom: '3px solid #2563eb', cursor: 'pointer' };
const submitBtnBase = { width: '100%', padding: '12px', borderRadius: '8px', color: 'white', fontWeight: 'bold', fontSize: '18px', border: 'none', cursor: 'pointer' };

export default LoginPage;