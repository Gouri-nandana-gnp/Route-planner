import React, { useState } from 'react';
import * as ttServices from '@tomtom-international/web-sdk-services';

const Sidebar = ({ apiKey, onPlanRoute, onAddMarker }) => {
  const [startPoint, setStartPoint] = useState(null);
  const [startQuery, setStartQuery] = useState('');
  const [deliveryQuery, setDeliveryQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [activeInput, setActiveInput] = useState(''); // 'start' or 'delivery'

  // Fetch suggestions as user types
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
    const point = {
      name: result.address.freeformAddress,
      pos: result.position
    };

    if (activeInput === 'start') {
      setStartPoint(point);
      setStartQuery(point.name);
      // Clear existing start marker and add new one
      onAddMarker(point.pos, 'green', true); 
    } else {
      // APPEND to the list instead of replacing
      setDeliveryList(prevList => [...prevList, point]);
      setDeliveryQuery('');
      // Add a new marker without clearing old ones
      onAddMarker(point.pos, 'blue', false); 
    }
    
    setSuggestions([]);
  };

  return (
    <div className="sidebar" style={{ 
      width: '380px', 
      padding: '20px', 
      background: '#ffffff', 
      height: '100vh', 
      borderRight: '1px solid #ddd',
      zIndex: 10,
      color: '#333'
    }}>
      <h2 style={{ color: '#0052cc' }}>Logistics Console</h2>
      
      {/* Starting Point Input */}
      <div style={{ marginBottom: '15px' }}>
        <label style={{ fontWeight: 'bold' }}>Origin</label>
        <input 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #0052cc', color: '#000' }}
          value={startQuery}
          onChange={(e) => handleSearch(e.target.value, 'start')}
          placeholder="Set starting location..."
        />
      </div>

      {/* Multi-Delivery Input */}
      <div style={{ marginBottom: '15px', position: 'relative' }}>
        <label style={{ fontWeight: 'bold' }}>Add Delivery Stops</label>
        <input 
          style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '2px solid #ddd', color: '#000' }}
          value={deliveryQuery}
          onChange={(e) => handleSearch(e.target.value, 'delivery')}
          placeholder="Type next destination..."
        />

        {/* Floating Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ 
            position: 'absolute', top: '100%', left: 0, right: 0, 
            background: 'white', border: '1px solid #ccc', zIndex: 2000,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            {suggestions.map((s, i) => (
              <div key={i} onClick={() => selectSuggestion(s)} style={{ padding: '12px', cursor: 'pointer', borderBottom: '1px solid #eee' }}>
                {s.address.freeformAddress}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* SCROLLABLE ITINERARY LIST */}
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #eee', borderRadius: '8px', padding: '10px' }}>
        <h4 style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#666' }}>STOPS IN QUEUE</h4>
        {deliveryList.map((stop, i) => (
          <div key={i} style={{ padding: '10px', background: '#f0f4ff', marginBottom: '8px', borderRadius: '6px', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <span>{i + 1}. {stop.name.split(',')[0]}</span>
            <button onClick={() => setDeliveryList(deliveryList.filter((_, idx) => idx !== i))} style={{ border: 'none', background: 'none', color: 'red', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
      </div>

      <button 
        onClick={() => onPlanRoute(startPoint, deliveryList)}
        style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', borderRadius: '8px', marginTop: '20px', fontWeight: 'bold', cursor: 'pointer' }}
        disabled={!startPoint || deliveryList.length === 0}
      >
        GENERATE OPTIMIZED ROUTE
      </button>
    </div>
  );
}
export default Sidebar;