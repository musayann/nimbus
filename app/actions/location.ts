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

    if (!data.results) return [];

    interface RawResult {
      name: string;
      admin1?: string;
      admin2?: string;
      admin3?: string;
      admin4?: string;
      country?: string;
      country_code?: string;
      latitude: number;
      longitude: number;
    }
    const results = data.results.map((r: RawResult) => {
      const admin2 = r.admin2?.replace("District", "").trim();
      if (
        ![r.admin1, r.admin2, r.admin3, r.admin4].some(
          (a) => a?.toLowerCase() === r.name.toLowerCase(),
        )
      ) {
        r.name = admin2 ?? r.name;
      }
      return {
        ...r,
        admin2: admin2,
      };
    });
    console.log(results);
    return results
      .filter((r: RawResult) => r.country_code?.toUpperCase() === "RW")
      .map((r: RawResult) => {
        const n = r.name.toLowerCase();
        let region: string | undefined;
        if (r.admin3?.toLowerCase() === n || r.admin4?.toLowerCase() === n) {
          region = r.admin2;
        } else if (r.admin2?.toLowerCase() === n) {
          region = r.admin1;
        }
        return {
          name: r.name,
          region,
          country: r.country ?? "Rwanda",
          lat: r.latitude,
          lon: r.longitude,
        };
      });
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
