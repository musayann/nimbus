"use server";

import { parseGeoResults, type GeoResult } from "@/lib/geo";
export type { GeoResult };

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({
      q: query.trim(),
      countrycodes: "RW",
      format: "json",
      limit: "6",
      addressdetails: "1",
      "accept-language": "en",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      { headers: { "User-Agent": "Igicu Weather App" } },
    );
    if (!res.ok) return [];
    const data = await res.json();

    return parseGeoResults(data);
  } catch {
    return [];
  }
}

export async function reverseGeocode(
  lat: number,
  lon: number,
): Promise<GeoResult | null> {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lon.toString(),
      format: "json",
      zoom: "10",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params}`,
      { headers: { "User-Agent": "Igicu Weather App" } },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.address?.country_code !== "rw") return null;
    const name =
      data.address?.city ??
      data.address?.town ??
      data.address?.village ??
      data.address?.municipality ??
      data.name;
    if (!name) return null;
    return { name, country: "Rwanda", lat, lon };
  } catch {
    return null;
  }
}
