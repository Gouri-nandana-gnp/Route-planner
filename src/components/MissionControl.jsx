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
      const response = await ttServices.services.fuzzySearch({ key: apiKey, query: query, limit: 5 });
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
      onAddMarker(point.pos, '#10b981'); // Start
    } else {
      setDeliveryList([...deliveryList, point]);
      setDeliveryQuery('');
      onAddMarker(point.pos, '#3b82f6'); // Stop
    }
    setSuggestions([]);
  };

  return (
    <div style={{ height: '100vh', overflowY: 'auto', background: '#f1f5f9', padding: '40px' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '30px' }}>Logistics Command Center</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
          <div style={card}>
            <h4 style={cardTitle}>Driver Info</h4>
            <p>ID: {driver.id}</p>
            <p>Name: {driver.name}</p>
            <p>Shift: {loginTime}</p>
          </div>
          <div style={card}>
            <h4 style={cardTitle}>Route Planning</h4>
            <input style={input} value={startQuery} onChange={(e) => handleSearch(e.target.value, 'start')} placeholder="Origin Address" />
            <div style={{position: 'relative', marginTop: '10px'}}>
              <input style={input} value={deliveryQuery} onChange={(e) => handleSearch(e.target.value, 'delivery')} placeholder="Add Delivery Address" />
              {suggestions.length > 0 && (
                <div style={dropdown}>
                  {suggestions.map((s, i) => (
                    <div key={i} onClick={() => selectSuggestion(s)} style={dropdownItem}>{s.address.freeformAddress}</div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={card}>
          <h4 style={cardTitle}>Itinerary</h4>
          {deliveryList.map((stop, i) => (
            <div key={i} style={itineraryItem}>📍 {stop.name}</div>
          ))}
          <button 
            style={btn} 
            disabled={!startPoint || deliveryList.length === 0}
            onClick={() => onPlanRoute(startPoint, deliveryList)}
          >
            OPTIMIZE & START MISSION
          </button>
        </div>
      </div>
    </div>
  );
};

const card = { background: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' };
const cardTitle = { margin: '0 0 15px 0', color: '#3b82f6' };
const input = { width: '100%', padding: '10px', border: '1px solid #cbd5e1', borderRadius: '6px', boxSizing: 'border-box' };
const dropdown = { position: 'absolute', background: 'white', width: '100%', zIndex: 10, boxShadow: '0 4px 6px rgba(0,0,0,0.1)', borderRadius: '6px' };
const dropdownItem = { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' };
const itineraryItem = { padding: '10px', background: '#f8fafc', marginBottom: '5px', borderRadius: '4px', fontSize: '14px' };
const btn = { width: '100%', padding: '15px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '15px' };

export default MissionControl;