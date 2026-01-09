// mlPredictor.js
export const calculateAIPrediction = (trafficDelaySec, driverStartTime) => {
    // 1. Traffic Logic (from TomTom)
    const trafficMins = Math.round(trafficDelaySec / 60);

    // 2. Simulated Weather Logic (Predictive ML)
    // In a real app, you'd fetch a Weather API here. 
    // For the hackathon, we simulate a "Storm Impact" based on the time of day.
    const hour = new Date().getHours();
    const weatherDelay = (hour > 14 && hour < 18) ? 22 : 5; // Heavy rain simulation in afternoon
    const weatherCondition = weatherDelay > 10 ? "Heavy Rain" : "Clear Skies";

    // 3. Driver Availability/Fatigue Logic
    // If the driver has been logged in for > 6 hours, delay increases due to safety speed reduction
    const loginTime = new Date(driverStartTime);
    const currentTime = new Date();
    const shiftHours = Math.abs(currentTime - loginTime) / 36e5;
    const driverDelay = shiftHours > 6 ? 15 : 0; 

    const totalDelay = trafficMins + weatherDelay + driverDelay;

    return {
        totalDelay,
        trafficMins,
        weatherDelay,
        weatherCondition,
        driverDelay,
        confidenceScore: (98 - (totalDelay / 5)).toFixed(1) // ML Confidence
    };
};