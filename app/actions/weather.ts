"use server";

import type {
  WeatherCondition,
  CurrentWeather,
  ForecastDay,
  HourlyItem,
} from "@/components/weather/types";

function mapWmoCode(code: number): {
  condition: WeatherCondition;
  description: string;
} {
  if (code === 0) return { condition: "sunny", description: "Clear sky" };
  if (code <= 2)
    return { condition: "partly-cloudy", description: "Partly cloudy" };
  if (code === 3) return { condition: "cloudy", description: "Overcast" };
  if (code >= 45 && code <= 48)
    return { condition: "foggy", description: "Foggy" };
  if (code >= 51 && code <= 57)
    return { condition: "rainy", description: "Drizzle" };
  if (code >= 61 && code <= 67)
    return { condition: "rainy", description: "Rain" };
  if (code >= 71 && code <= 77)
    return { condition: "snow", description: "Snow" };
  if (code >= 80 && code <= 82)
    return { condition: "rainy", description: "Rain showers" };
  if (code >= 95 && code <= 99)
    return { condition: "stormy", description: "Thunderstorm" };
  return { condition: "cloudy", description: "Cloudy" };
}

function degreesToCardinal(deg: number): string {
  const directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  const index = Math.round(deg / 45) % 8;
  return directions[index];
}

function wmoToEmoji(code: number): string {
  if (code === 0) return "\u2600\uFE0F";
  if (code <= 2) return "\u26C5";
  if (code === 3) return "\uD83C\uDF25";
  if (code >= 45 && code <= 48) return "\uD83C\uDF2B\uFE0F";
  if (code >= 51 && code <= 67) return "\uD83C\uDF27";
  if (code >= 71 && code <= 77) return "\uD83C\uDF28";
  if (code >= 80 && code <= 82) return "\uD83C\uDF26";
  if (code >= 95 && code <= 99) return "\u26C8\uFE0F";
  return "\uD83C\uDF25";
}

export async function fetchWeather(
  lat: number,
  lon: number,
): Promise<{
  current: Omit<CurrentWeather, "city" | "country" | "coordinates">;
  forecast: ForecastDay[];
  hourly: HourlyItem[];
} | null> {
  try {
    const params = new URLSearchParams({
      latitude: lat.toString(),
      longitude: lon.toString(),
      timezone: "auto",
      forecast_days: "6",
      current:
        "temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_direction_10m,surface_pressure,visibility,uv_index,dew_point_2m",
      hourly: "temperature_2m,weather_code",
      daily:
        "weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,uv_index_max,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,relative_humidity_2m_max",
    });

    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?${params}`,
      { next: { revalidate: 600 } } as RequestInit,
    );
    if (!res.ok) return null;

    const data = await res.json();

    console.log(data);

    // Current weather
    const { condition, description } = mapWmoCode(data.current.weather_code);
    const sunriseTime = data.daily.sunrise[0].split("T")[1].slice(0, 5);
    const sunsetTime = data.daily.sunset[0].split("T")[1].slice(0, 5);

    const current: Omit<CurrentWeather, "city" | "country" | "coordinates"> = {
      temperature: Math.round(data.current.temperature_2m),
      feelsLike: Math.round(data.current.apparent_temperature),
      condition,
      description,
      humidity: data.current.relative_humidity_2m,
      dewPoint: Math.round(data.current.dew_point_2m),
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: degreesToCardinal(data.current.wind_direction_10m),
      visibility: Math.round(data.current.visibility / 1000),
      uvIndex: data.current.uv_index,
      pressure: Math.round(data.current.surface_pressure),
      precipitation: data.current.precipitation,
      sunrise: sunriseTime,
      sunset: sunsetTime,
      high: Math.round(data.daily.temperature_2m_max[0]),
      low: Math.round(data.daily.temperature_2m_min[0]),
      lastUpdated: "Just now",
    };

    // Forecast (days 1-5)
    const forecast: ForecastDay[] = [];
    const dateFmt = new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const dayFmt = new Intl.DateTimeFormat("en-US", { weekday: "short" });

    for (let i = 1; i <= 5; i++) {
      const d = new Date(data.daily.time[i]);
      const wmo = mapWmoCode(data.daily.weather_code[i]);
      forecast.push({
        date: i === 1 ? "Tomorrow" : dateFmt.format(d),
        dayName: dayFmt.format(d),
        condition: wmo.condition,
        description: wmo.description,
        high: Math.round(data.daily.temperature_2m_max[i]),
        low: Math.round(data.daily.temperature_2m_min[i]),
        humidity: data.daily.relative_humidity_2m_max[i],
        windSpeed: Math.round(data.daily.wind_speed_10m_max[i]),
        chanceOfRain: data.daily.precipitation_probability_max[i],
      });
    }

    // Hourly (next 12 hours from current hour)
    const nowISO = data.current.time;
    const currentHourIndex = data.hourly.time.findIndex(
      (t: string) => t === nowISO,
    );
    const startIndex = currentHourIndex >= 0 ? currentHourIndex : 0;
    const hourly: HourlyItem[] = [];
    for (let i = 0; i < 12; i++) {
      const idx = startIndex + i;
      if (idx >= data.hourly.time.length) break;
      const time = data.hourly.time[idx];
      const hour = i === 0 ? "Now" : time.split("T")[1].slice(0, 5);
      hourly.push({
        hour,
        temp: Math.round(data.hourly.temperature_2m[idx]),
        icon: wmoToEmoji(data.hourly.weather_code[idx]),
      });
    }

    return { current, forecast, hourly };
  } catch {
    return null;
  }
}
