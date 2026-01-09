import React, { useEffect, useRef } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const TomTomMap = ({ apiKey, routeData, markers = [] }) => {
  const mapElement = useRef();
  const mapInstance = useRef();
  const markersRef = useRef([]);

  // 1. Initialize Map
  useEffect(() => {
    const map = tt.map({
      key: apiKey,
      container: mapElement.current,
      center: [76.2673, 9.9312], // Kochi area based on your screenshot
      zoom: 10
    });

    map.on('load', () => {
      map.addTier(new tt.TrafficIncidentTier({ key: apiKey }));
      map.addTier(new tt.TrafficFlowTilesTier({ key: apiKey }));
      map.resize();
    });

    mapInstance.current = map;
    return () => map.remove();
  }, [apiKey]);

  // 2. Draw Route (Enhanced Logic)
  useEffect(() => {
    const map = mapInstance.current;

    if (map && routeData) {
      // Function to perform the actual drawing
      const addRouteLayer = () => {
        // Clean up previous route
        if (map.getLayer('route')) {
          map.removeLayer('route');
          map.removeSource('route');
        }

        // Add Source and Layer
        map.addSource('route', {
          type: 'geojson',
          data: routeData
        });

        map.addLayer({
          id: 'route',
          type: 'line',
          source: 'route',
          layout: {
            'line-join': 'round',
            'line-cap': 'round'
          },
          paint: {
            'line-color': '#007bff', // Bright Blue
            'line-width': 6,
            'line-opacity': 0.8
          }
        });

        // Zoom to fit the route
        const bounds = new tt.LngLatBounds();
        routeData.features[0].geometry.coordinates.forEach(point => bounds.extend(point));
        map.fitBounds(bounds, { padding: 50 });
      };

      // CRITICAL FIX: Wait for Style to load
      if (!map.isStyleLoaded()) {
        map.once('styledata', addRouteLayer);
      } else {
        addRouteLayer();
      }
    }
  }, [routeData]);

  // 3. Draw Markers (Using standard tt.Marker for reliability)
  useEffect(() => {
    const map = mapInstance.current;
    if (map) {
      // Clear old markers
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];

      // Add new markers
      markers.forEach(markerData => {
        const marker = new tt.Marker({
          color: markerData.color || '#333'
        })
          .setLngLat([markerData.pos.lng, markerData.pos.lat])
          .addTo(map);
        markersRef.current.push(marker);
      });
    }
  }, [markers]);

  return (
    <div 
      ref={mapElement} 
      style={{ width: '100vw', height: '100vh', position: 'absolute', top: 0, left: 0 }}
    ></div>
  );
};

export default TomTomMap;