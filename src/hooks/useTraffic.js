import { useState, useEffect } from 'react';

export const useTraffic = (apikey, bbox) => {
  const [incidents, setIncidents] = useState([]);
  const [stats, setStats] = useState({ highRiskZones: 0, averageDelay: 0 });

  const fetchTraffic = async () => {
    try {
      // Calling HERE Traffic API v7
      const url = `https://traffic.ls.hereapi.com/traffic/6.3/incidents.json?apiKey=${apikey}&bbox=${bbox}`;
      const response = await fetch(url);
      const data = await response.json();
      
      const items = data.TRAFFIC_ITEMS?.TRAFFIC_ITEM || [];
      
      // LOGIC: Score the incidents for the jury
      const highRisk = items.filter(i => i.CRITICALITY.ID >= 3).length;
      
      setIncidents(items);
      setStats({
        highRiskZones: highRisk,
        totalIncidents: items.length
      });
    } catch (err) {
      console.error("Traffic Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchTraffic();
    const interval = setInterval(fetchTraffic, 60000); // Refresh every 1 min
    return () => clearInterval(interval);
  }, []);

  return { incidents, stats };
};