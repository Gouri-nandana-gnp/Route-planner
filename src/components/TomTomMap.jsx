import React, { useEffect, useRef } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const TomTomMap = ({ apiKey, routeData, markers = [] }) => {
  const mapElement = useRef();
  const mapInstance = useRef();
  const markersRef = useRef([]);

  // initialization - YOUR ORIGINAL WORKING CODE
  useEffect(() => {
    const map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [77.5946, 12.9716], 
      zoom: 12
    });
    
    map.on('load', () => {
      map.addTier(new tt.TrafficIncidentTier({ key: apiKey })); 
      map.addTier(new tt.TrafficFlowTilesTier({ key: apiKey })); 
      map.resize();
    });

    mapInstance.current = map;
    return () => map.remove();
  }, [apiKey]);

  // Route drawing - YOUR ORIGINAL CODE + 1 SECOND DELAY FIX
  useEffect(() => {
    if (mapInstance.current && routeData) {
      
      const drawLine = () => {
        const map = mapInstance.current;
        if (!map) return;

        if (map.getLayer('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }

        map.addLayer({
          'id': 'route',
          'type': 'line',
          'source': { 'type': 'geojson', 'data': routeData },
          'paint': { 
            'line-color': '#4285F4', // CHANGED TO BLUE
            'line-width': 8          // THICKER FOR VISIBILITY
          },
          'layout': {
            'line-join': 'round',
            'line-cap': 'round'
          }
        });

        const bounds = new tt.LngLatBounds();
        routeData.features[0].geometry.coordinates.forEach(point => bounds.extend(point));
        map.fitBounds(bounds, { padding: 50 });
      };

      // FIX: Wait 1 second so the map finishes loading tiles before we draw the line
      setTimeout(drawLine, 1000);
    }
  }, [routeData]);

  // Markers - YOUR ORIGINAL WORKING CODE
  useEffect(() => {
    if (mapInstance.current) {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      markers.forEach(marker => {
        const newMarker = new tt.Marker({
          color: marker.color
        })
        .setLngLat([marker.pos.lng, marker.pos.lat])
        .addTo(mapInstance.current);
        
        markersRef.current.push(newMarker);
      });
    }
  }, [markers]);

  return <div ref={mapElement} style={{ height: '100%', width: '100%', background: '#222' }} />;
};

export default TomTomMap;