import React, { useEffect, useRef } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';

// Added markers to the destructured props
const TomTomMap = ({ apiKey, routeData, markers = [] }) => {
  const mapElement = useRef();
  const mapInstance = useRef();
  const markersRef = useRef([]); // To keep track of markers for cleanup

  useEffect(() => {
    const map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [77.5946, 12.9716], // Bangalore
      zoom: 12
    });
    
    map.on('load', () => {
      // Feature 1: Live accident and traffic data
      map.addTier(new tt.TrafficIncidentTier({ key: apiKey })); 
      map.addTier(new tt.TrafficFlowTilesTier({ key: apiKey })); 
    });

    mapInstance.current = map;
    return () => map.remove();
  }, [apiKey]);

  // Handle drawing the optimized route
  useEffect(() => {
    if (mapInstance.current && routeData) {
      if (mapInstance.current.getLayer('route')) {
        mapInstance.current.removeLayer('route');
        mapInstance.current.removeSource('route');
      }

      mapInstance.current.addLayer({
        'id': 'route',
        'type': 'line',
        'source': { 'type': 'geojson', 'data': routeData },
        'paint': { 'line-color': '#00cc44', 'line-width': 6 }
      });

      // Auto-zoom to fit the route
      const bounds = new tt.LngLatBounds();
      routeData.features[0].geometry.coordinates.forEach(point => bounds.extend(point));
      mapInstance.current.fitBounds(bounds, { padding: 50 });
    }
  }, [routeData]);

  // Handle adding "Dots" (Markers) for Start and Delivery points
  useEffect(() => {
    if (mapInstance.current) {
      // Clear existing markers first to avoid duplicates
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      markers.forEach(marker => {
        const newMarker = new tt.Marker({
          color: marker.color // Green for start, Blue for deliveries
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