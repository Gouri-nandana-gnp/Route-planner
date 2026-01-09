import React, { useEffect, useRef } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const TomTomMap = ({ apiKey }) => {
  const mapElement = useRef();

  useEffect(() => {
    console.log("Initializing TomTom Map..."); // Check if this shows in Console

    let map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [77.5946, 12.9716], // Bangalore
      zoom: 12
    });

    map.on('load', () => {
      console.log("Map successfully loaded!");
      map.addTier(new tt.TrafficFlowTilesTier({ key: apiKey }));
      map.addTier(new tt.TrafficIncidentTier({ key: apiKey }));
    });

    return () => map.remove();
  }, [apiKey]);

  // Adding a background color helps debug. 
  // If you see a GREY screen, the div is there but the map isn't.
  // If you see a WHITE screen, the div itself has 0 height.
  return (
    <div 
      ref={mapElement} 
      style={{ height: '100vh', width: '100%', backgroundColor: '#cccccc' }} 
    />
  );
};

export default TomTomMap;