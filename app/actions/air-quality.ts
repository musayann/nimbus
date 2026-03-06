"use server";

import type {
  AirQuality,
  AirQualityLevel,
  Coordinates,
} from "@/components/weather/types";

interface REMAReading {
  PM25?: number;
  PM10?: number;
  NO2?: number;
  O3?: number;
  [key: string]: unknown;
}

interface REMAFeature {
  geometry: {
    coordinates: [number, number]; // [lon, lat]
  };
  properties: {
    aqi: number;
    lvl: string;
    data: REMAReading[];
  };
}

interface REMAResponse {
  features: REMAFeature[];
}

function haversineDistance(a: Coordinates, b: Coordinates): number {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const sinLat = Math.sin(dLat / 2);
  const sinLon = Math.sin(dLon / 2);
  const h =
    sinLat * sinLat +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      sinLon *
      sinLon;
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function mapLevel(lvl: string): AirQualityLevel {
  const l = lvl.toLowerCase();
  if (l.includes("hazardous")) return "Hazardous";
  if (l.includes("very")) return "Very Unhealthy";
  if (l.includes("sensitive")) return "Unhealthy for Sensitive Groups";
  if (l.includes("unhealthy")) return "Unhealthy";
  if (l.includes("moderate")) return "Moderate";
  return "Good";
}

export async function fetchAirQuality(
  coords: Coordinates,
): Promise<AirQuality | null> {
  try {
    const res = await fetch("https://aq.rema.gov.rw/load_json", {
      next: { revalidate: 300 },
    } as RequestInit);
    if (!res.ok) return null;

    const json: REMAResponse = await res.json();
    const features = json.features;
    if (!features || features.length === 0) return null;

    let nearest = features[0];
    let minDist = Infinity;

    for (const f of features) {
      const [lon, lat] = f.geometry.coordinates;
      const dist = haversineDistance(coords, { lat, lon });
      if (dist < minDist) {
        minDist = dist;
        nearest = f;
      }
    }
    const { aqi, lvl, data } = nearest.properties;
    const latest = data[data.length - 1] ?? {};

    return {
      aqi,
      level: mapLevel(lvl),
      pm25: latest.PM25 ?? 0,
      pm10: latest.PM10 ?? 0,
      o3: latest.O3 ?? 0,
      no2: latest.NO2 ?? 0,
    };
  } catch (e) {
    console.log(e);
    return null;
  }
}
