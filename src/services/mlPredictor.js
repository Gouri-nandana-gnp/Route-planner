export const calculateAIPrediction = (trafficDelaySec, driverStartTime, departureTime) => {
    const trafficMins = Math.round(trafficDelaySec / 60);

    // Check if this is a future prediction
    const isFuture = departureTime && new Date(departureTime) > new Date();
    const targetDate = isFuture ? new Date(departureTime) : new Date();
    const hour = targetDate.getHours();

    // Weather Simulation (ML Rule-based)
    // Afternoon (14-18) is simulated as rainy
    let weatherDelay = (hour >= 14 && hour <= 18) ? 20 : 5; 
    let weatherCondition = weatherDelay > 10 ? "Heavy Rain" : "Clear Skies";

    // Driver fatigue is only for live missions
    let driverDelay = 0;
    if (!isFuture && driverStartTime) {
        const shiftHours = Math.abs(new Date() - new Date(driverStartTime)) / 36e5;
        driverDelay = shiftHours > 6 ? 12 : 0; 
    }

    const totalDelay = trafficMins + weatherDelay + driverDelay;
    
    // Future predictions have lower confidence due to uncertainty
    const baseConfidence = isFuture ? 91.5 : 97.8;

    return {
        totalDelay,
        trafficMins,
        weatherDelay,
        weatherCondition,
        driverDelay,
        isFuture,
        confidenceScore: (baseConfidence - (totalDelay / 5)).toFixed(1)
    };
};