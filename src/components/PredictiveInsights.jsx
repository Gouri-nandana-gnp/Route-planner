import React from 'react';

const PredictiveInsights = ({ data }) => {
  if (!data) return null;

  return (
    <div style={containerStyle}>
      <h4 style={headerStyle}>AI PREDICTIVE INSIGHTS</h4>
      
      <div style={rowStyle}>
        <span>Traffic Impact:</span>
        <span style={{color: '#f59e0b'}}>+{data.trafficMins} min</span>
      </div>

      <div style={rowStyle}>
        <span>Weather ({data.weatherCondition}):</span>
        <span style={{color: '#3b82f6'}}>+{data.weatherDelay} min</span>
      </div>

      <div style={rowStyle}>
        <span>Driver Fatigue Adj:</span>
        <span style={{color: '#ef4444'}}>+{data.driverDelay} min</span>
      </div>

      <hr style={{margin: '10px 0', border: '0.1px solid #eee'}} />

      <div style={rowStyle}>
        <strong>Final Adjusted ETA:</strong>
        <strong style={{color: '#10b981'}}>+{data.totalDelay} min</strong>
      </div>

      <div style={confidenceStyle}>
        ML Confidence Score: {data.confidenceScore}%
      </div>
    </div>
  );
};

const containerStyle = {
  position: 'absolute', bottom: '30px', left: '20px', zIndex: 1000,
  width: '240px', background: 'white', padding: '15px', borderRadius: '12px',
  boxShadow: '0 8px 24px rgba(0,0,0,0.15)', fontFamily: 'sans-serif'
};
const headerStyle = { margin: '0 0 12px 0', fontSize: '12px', color: '#64748b', letterSpacing: '1px' };
const rowStyle = { display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' };
const confidenceStyle = { fontSize: '10px', marginTop: '10px', textAlign: 'center', color: '#94a3b8' };

export default PredictiveInsights;