import { Airport } from "./types";

export function haversineDistance(departure: Airport, arrival: Airport): number {
    const toRadians = (deg: number) => (deg * Math.PI) / 180;

    // Convert coordinates to radians
    const lat1 = toRadians(parseFloat(departure.latitude));
    const lon1 = toRadians(parseFloat(departure.longitude));
    const lat2 = toRadians(parseFloat(arrival.latitude));
    const lon2 = toRadians(parseFloat(arrival.longitude));

    // Earth's radius in nautical miles
    const R = 3444;

    // Haversine formula
    const dLat = lat2 - lat1;
    const dLon = lon2 - lon1;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance; // Distance in nautical miles
}
