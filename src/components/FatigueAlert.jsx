import React from 'react';

const FatigueAlert = ({ onDismiss }) => {
  return (
    <div style={container}>
      <h4 style={{ color: '#ef4444', margin: '0 0 10px 0' }}>⚠️ AI Safety Warning</h4>
      <p style={{ fontSize: '13px', color: '#475569', lineHeight: '1.5' }}>
        Driving limit reaching threshold. AI has recalculating route to include a 15-minute rest period.
      </p>
      <button onClick={onDismiss} style={btn}>Acknowledge</button>
    </div>
  );
};

const container = {
  position: 'absolute', top: '80px', right: '20px', zIndex: 2000, width: '280px',
  background: 'white', borderLeft: '6px solid #ef4444', padding: '20px',
  borderRadius: '12px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
};

const btn = { background: '#ef4444', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' };

export default FatigueAlert;