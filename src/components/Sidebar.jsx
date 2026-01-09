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
    } else {
      setDeliveryList([...deliveryList, point]);
      setDeliveryQuery('');
    }
    
    // Show marker on map: green for start, blue for stops
    onAddMarker(point.pos, activeInput === 'start' ? 'green' : 'blue'); 
    setSuggestions([]);
  };

  return (
    <div className="sidebar" style={{ width: '380px', padding: '20px', background: '#fff', height: '100vh', borderRight: '1px solid #ddd' }}>
      <h2>Driver Dashboard</h2>
      
      {/* STARTING POINT BOX */}
      <div style={{ marginBottom: '15px' }}>
        <label>Starting Point</label>
        <input 
          style={{ width: '100%', padding: '10px' }}
          value={startQuery}
          onChange={(e) => handleSearch(e.target.value, 'start')}
          placeholder="Enter origin..."
        />
      </div>

      {/* DELIVERY POINTS BOX */}
      <div style={{ marginBottom: '15px' }}>
        <label>Add Delivery Stop</label>
        <input 
          style={{ width: '100%', padding: '10px' }}
          value={deliveryQuery}
          onChange={(e) => handleSearch(e.target.value, 'delivery')}
          placeholder="Enter destination..."
        />
      </div>

      {/* SEARCH SUGGESTIONS */}
      {suggestions.length > 0 && (
        <div style={{ border: '1px solid #ccc', borderRadius: '4px', marginBottom: '10px' }}>
          {suggestions.map((s, i) => (
            <div 
              key={i} 
              onClick={() => selectSuggestion(s)}
              style={{ padding: '10px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
            >
              {s.address.freeformAddress}
            </div>
          ))}
        </div>
      )}

      {/* STOP LIST */}
      <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {deliveryList.map((stop, i) => (
          <div key={i} style={{ padding: '8px', background: '#f8f9fa', marginBottom: '5px' }}>
            {i + 1}. {stop.name}
          </div>
        ))}
      </div>

      <button 
        onClick={() => onPlanRoute(startPoint, deliveryList)}
        style={{ width: '100%', padding: '15px', background: '#28a745', color: '#fff', border: 'none', marginTop: '10px', fontWeight: 'bold' }}
        disabled={!startPoint || deliveryList.length === 0}
      >
        OPTIMIZE AI ROUTE
      </button>
    </div>
  );
};

export default Sidebar;