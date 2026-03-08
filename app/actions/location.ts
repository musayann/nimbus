"use server";

import { type GeoResult } from "@/lib/geo";

interface RawResult {
  name: string;
  admin1?: string;
  admin2?: string;
  admin3?: string;
  admin4?: string;
  country?: string;
  country_code?: string;
  feature_code?: string;
  latitude: number;
  longitude: number;
}

function normalizeNames(results: RawResult[]): RawResult[] {
  return results.map((r) => {
    const admin2 = r.admin2?.replace("District", "").trim();
    const matchesAdmin = [r.admin1, r.admin2, r.admin3, r.admin4].some(
      (a) => a?.toLowerCase() === r.name.toLowerCase(),
    );
    return {
      ...r,
      name: matchesAdmin ? r.name : (admin2 ?? r.name),
      admin2,
    };
  });
}

function filterByCountry(results: RawResult[], code: string): RawResult[] {
  return results.filter(
    (r) => r.country_code?.toUpperCase() === code.toUpperCase(),
  );
}

const FEATURE_CODE_PRIORITY: Record<string, number> = { PPLC: 0, PPL: 1 };

function deduplicateByFeatureCode(results: GeoResult[]): GeoResult[] {
  const bestByName = new Map<string, { index: number; result: GeoResult }>();
  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const key = r.name.toLowerCase();
    const existing = bestByName.get(key);
    const priority = FEATURE_CODE_PRIORITY[r.feature_code ?? ""] ?? 2;
    if (
      !existing ||
      priority <
        (FEATURE_CODE_PRIORITY[existing.result.feature_code ?? ""] ?? 2)
    ) {
      bestByName.set(key, { index: existing?.index ?? i, result: r });
    }
  }
  return [...bestByName.values()]
    .sort((a, b) => a.index - b.index)
    .map((v) => v.result);
}

function rankByRelevance(results: GeoResult[], query: string): GeoResult[] {
  const q = query.toLowerCase();
  return results.toSorted((a, b) => {
    const aName = a.name.toLowerCase();
    const bName = b.name.toLowerCase();
    const aScore = aName === q ? 0 : aName.startsWith(q) ? 1 : 2;
    const bScore = bName === q ? 0 : bName.startsWith(q) ? 1 : 2;
    if (aScore !== bScore) return aScore - bScore;
    const aPriority = FEATURE_CODE_PRIORITY[a.feature_code ?? ""] ?? 2;
    const bPriority = FEATURE_CODE_PRIORITY[b.feature_code ?? ""] ?? 2;
    return aPriority - bPriority;
  });
}

function resolveRegion(r: RawResult): GeoResult {
  const n = r.name.toLowerCase();
  const matchesName = (v?: string) => v?.toLowerCase() === n;
  const nameIsAdmin =
    matchesName(r.admin2) || matchesName(r.admin3) || matchesName(r.admin4);

  const parts = nameIsAdmin
    ? [r.admin2, r.admin1].filter((v) => v && !matchesName(v))
    : [r.admin1].filter((v) => v && !matchesName(v));

  const region = parts.join(", ") || undefined;

  return {
    name: r.name,
    region,
    feature_code: r.feature_code,
    country: r.country ?? "Rwanda",
    lat: r.latitude,
    lon: r.longitude,
  };
}

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
    const normalized = normalizeNames(data.results);
    const filtered = filterByCountry(normalized, "RW");
    const results = filtered.map(resolveRegion);
    const deduplicated = deduplicateByFeatureCode(results);
    const ranked = rankByRelevance(deduplicated, query.trim());
    return ranked;
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
