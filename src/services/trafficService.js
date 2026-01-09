import * as ttServices from '@tomtom-international/web-sdk-services';

const planMultiStopRoute = (apiKey, origin, stops, destination) => {
    // Merge all stops into a single array for the API
    const locations = [origin, ...stops, destination]
        .map(loc => `${loc.lng},${loc.lat}`)
        .join(':');

    ttServices.services.calculateRoute({
        key: apiKey,
        locations: locations,
        computeBestOrder: true, // This is the AI optimization part!
        routeType: 'eco',       // Feature 3: Fuel-efficient path
        traffic: true,         // Feature 2: Real-time traffic adjustment
        travelMode: 'truck'     // Ensures route is safe for logistics vehicles
    }).then((response) => {
        // Feature 1: Get predicted delay for the entire trip
        const totalDelay = response.routes[0].summary.trafficDelayInSeconds;
        console.log(`Total Logistics Delay: ${totalDelay} seconds`);
        
        // DRAW THE ROUTE (Logic to pass to your Map component)
        displayRouteOnMap(response.toGeoJson());
    });
};