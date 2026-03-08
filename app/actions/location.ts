"use server";

import { type GeoResult } from "@/lib/geo";

export async function searchCities(query: string): Promise<GeoResult[]> {
  if (!query.trim()) return [];
  try {
    const params = new URLSearchParams({
      name: query.trim(),
      count: "6",
      language: "en",
      format: "json",
    });
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?${params}&&countryCode=RW`,
    );
    if (!res.ok) return [];
    const data = await res.json();

    console.log(data);

    if (!data.results) return [];
    return data.results
      .filter(
        (r: { country_code?: string }) =>
          r.country_code?.toUpperCase() === "RW",
      )
      .map(
        (r: {
          name: string;
          admin1?: string;
          country?: string;
          latitude: number;
          longitude: number;
        }) => ({
          name: r.name,
          region: r.admin1,
          country: r.country ?? "Rwanda",
          lat: r.latitude,
          lon: r.longitude,
        }),
      );
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
