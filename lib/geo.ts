export interface GeoResult {
  name: string;
  region?: string;
  country: string;
  lat: number;
  lon: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function parseGeoResults(data: any[]): GeoResult[] {
  const seen = new Set<string>();
  const results: GeoResult[] = [];

  for (const r of data) {
    const cls = r.class ?? "";
    if (cls !== "place" && cls !== "boundary") continue;
    if ((r.place_rank ?? 0) < 8) continue;

    const addr = r.address ?? {};
    let name: string;
    let region: string | undefined;

    if (addr.village) {
      name = addr.village;
      region = addr.county;
    } else if (addr.suburb) {
      name = addr.suburb;
      region = addr.city ?? addr.city_district;
    } else if (addr.city) {
      if (addr.county && addr.county !== addr.city) {
        name = addr.city;
        region = addr.county;
      } else {
        name = addr.city;
        region = addr.state;
      }
    } else {
      const parts = (r.display_name ?? "")
        .split(",")
        .map((s: string) => s.trim());
      name = parts[0];
      region = parts[1];
    }

    if (!name) continue;
    const key = `${name}|${region ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);

    results.push({
      name,
      region,
      country: "Rwanda",
      lat: parseFloat(r.lat),
      lon: parseFloat(r.lon),
    });
  }
  return results;
}
