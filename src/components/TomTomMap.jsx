import React, { useEffect, useRef } from 'react';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import * as tt from '@tomtom-international/web-sdk-maps';

const TomTomMap = ({ apiKey, routeData, markers = [] }) => {
  const mapElement = useRef();
  const mapInstance = useRef();
  const markersRef = useRef([]);

  useEffect(() => {
    const map = tt.map({
      key: apiKey, // Pass the apiKey prop here
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

  useEffect(() => {
    if (mapInstance.current && routeData) {
      if (mapInstance.current.getLayer('route')) {
        mapInstance.current.removeLayer('route');
        mapInstance.current.removeSource('route');
      }

      mapInstance.current.addLayer({
        id: 'route',
        type: 'line',
        source: { type: 'geojson', data: routeData },
        paint: { 'line-color': '#28a745', 'line-width': 6 }
      });

      const bounds = new tt.LngLatBounds();
      routeData.features[0].geometry.coordinates.forEach(point => bounds.extend(point));
      mapInstance.current.fitBounds(bounds, { padding: 50 });
    }
  }, [routeData]);

  useEffect(() => {
    if (mapInstance.current && markers.length > 0) {
      if (mapInstance.current.getSource('markers')) {
        mapInstance.current.removeSource('markers');
        mapInstance.current.removeLayer('markers');
      }

      mapInstance.current.addSource('markers', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: markers
        }
      });

      mapInstance.current.addLayer({
        id: 'markers',
        type: 'circle',
        source: 'markers',
        paint: {
          'circle-radius': 5,
          'circle-color': marker => marker.color
        }
      });

      mapInstance.current.getSource('markers').setData({
        type: 'FeatureCollection',
        features: markers
      });
    }
  }, [markers]);

  return (
    <div ref={mapElement} style={{ width: '100%', height: '100%' }}></div>
  );
};

export default TomTomMap;