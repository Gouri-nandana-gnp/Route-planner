import React, { useState } from 'react';
import * as ttServices from '@tomtom-international/web-sdk-services';

const MissionControl = ({ driver, loginTime, onPlanRoute, onAddMarker, apiKey }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [startQuery, setStartQuery] = useState('');
  const [deliveryQuery, setDeliveryQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [activeInput, setActiveInput] = useState('');

  const handleSearch = async (query, type) => {
    setActiveInput(type);
    if (type === 'start') setStartQuery(query);
    else setDeliveryQuery(query);

    if (query.length > 2) {
      const response = await ttServices.services.fuzzySearch({
        key: apiKey,
        query: query,
        limit: 5
      });
      setSuggestions(response.results);
    } else {
      setSuggestions([]);
    }
  };

  const selectSuggestion = (result) => {
    const point = { name: result.address.freeformAddress, pos: result.position };
    if (activeInput === 'start') {
      setStartPoint(point);
      setStartQuery(point.name);
      onAddMarker(point.pos, 'green'); // Start marker
    } else {
      setDeliveryList([...deliveryList, point]);
      setDeliveryQuery('');
      onAddMarker(point.pos, 'blue'); // Delivery marker
    }
    setSuggestions([]);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '40px', color: '#1a1a1a', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h1 style={{ color: '#0052cc', fontSize: '2.5rem', marginBottom: '30px' }}>Driver Mission Control</h1>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Driver Info Card */}
          <div style={cardStyle}>
            <h3 style={cardHeaderStyle}>Personal & Vehicle Details</h3>
            <div style={infoRow}><span>Driver Name:</span> <strong>{driver.name}</strong></div>
            <div style={infoRow}><span>Driver ID:</span> <strong>{driver.id}</strong></div>
            <div style={infoRow}><span>Assigned Vehicle:</span> <strong>{driver.vehicle}</strong></div>
            <div style={infoRow}><span>Shift Started:</span> <strong>{loginTime}</strong></div>
          </div>

          {/* Route Planning Card */}
          <div style={cardStyle}>
            <h3 style={cardHeaderStyle}>Mission Destinations</h3>
            <div style={{position: 'relative', marginBottom: '15px'}}>
               <label style={labelStyle}>Set Origin (Start Point)</label>
               <input style={inputStyle} value={startQuery} onChange={(e) => handleSearch(e.target.value, 'start')} placeholder="Search starting point..." />
            </div>
            <div style={{position: 'relative'}}>
               <label style={labelStyle}>Add Delivery Stop</label>
               <input style={inputStyle} value={deliveryQuery} onChange={(e) => handleSearch(e.target.value, 'delivery')} placeholder="Type destination address..." />
               
               {suggestions.length > 0 && (
                  <div style={suggestionBoxStyle}>
                    {suggestions.map((s, i) => (
                      <div key={i} onClick={() => selectSuggestion(s)} style={suggestionItemStyle}>{s.address.freeformAddress}</div>
                    ))}
                  </div>
               )}
            </div>
          </div>
        </div>

        {/* Itinerary List */}
        <div style={{ ...cardStyle, marginTop: '30px' }}>
          <h3 style={cardHeaderStyle}>Current Itinerary Stops</h3>
          {deliveryList.length === 0 ? <p style={{color: '#888'}}>No delivery stops added yet.</p> : (
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
               {deliveryList.map((stop, i) => (
                <div key={i} style={stopItemStyle}>
                  <span style={indexStyle}>{i + 1}</span> {stop.name}
                </div>
              ))}
            </div>
          )}
          
          <button 
            onClick={() => onPlanRoute(startPoint, deliveryList)}
            disabled={!startPoint || deliveryList.length === 0}
            style={{...btnStyle, background: (!startPoint || deliveryList.length === 0) ? '#ccc' : '#28a745'}}
          >
            CONFIRM MISSION & OPTIMIZE ROUTE
          </button>
        </div>
      </div>
    </div>
  );
};

const cardStyle = { background: 'white', padding: '25px', borderRadius: '15px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', border: '1px solid #e0e0e0' };
const cardHeaderStyle = { color: '#0052cc', borderBottom: '2px solid #f0f2f5', paddingBottom: '15px', marginTop: 0, marginBottom: '20px' };
const infoRow = { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #fafafa', fontSize: '1.1rem' };
const labelStyle = { display: 'block', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.9rem', color: '#666' };
const inputStyle = { width: '100%', padding: '12px', border: '2px solid #ddd', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', color: '#000' };
const suggestionBoxStyle = { position: 'absolute', width: '100%', background: 'white', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '8px', marginTop: '5px' };
const suggestionItemStyle = { padding: '12px', cursor: 'pointer', borderBottom: '1px solid #eee', color: '#333' };
const stopItemStyle = { background: '#f8faff', padding: '15px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '15px', border: '1px solid #eef2ff', color: '#333' };
const indexStyle = { background: '#0052cc', color: 'white', width: '25px', height: '25px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: '0.8rem' };
const btnStyle = { width: '100%', padding: '20px', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', fontSize: '1.2rem', marginTop: '25px' };

export default MissionControl;