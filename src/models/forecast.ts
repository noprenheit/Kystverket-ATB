// Current weather condition interface
export interface CurrentWeather {
  last_updated: string;
  temp_c: number;
  condition: {
    text: string;
    icon: string;
  };
  wind_kph: number;
  wind_degree: number;
  wind_dir: string;
  humidity: number;
  feelslike_c: number;
  vis_km: number;
}

// Daily forecast data
export interface DayForecast {
  maxtemp_c: number;
  mintemp_c: number;
  daily_chance_of_rain: number;
  condition: {
    icon: string;
  };
}

// Astro data for each day
export interface AstroData {
  sunrise: string;
  sunset: string;
}

// Single day in the forecast
export interface ForecastDay {
  date: string;
  day: DayForecast;
  astro: AstroData;
}

// Weather API forecast response
export interface ForecastData {
  forecastday: ForecastDay[];
}

// Main response structure from Weather API
export interface ForecastResponse {
  location: {
    name: string;
    region: string;
    country: string;
    lat: number;
    lon: number;
    tz_id: string;
    localtime_epoch: number;
    localtime: string;
  };
  current: CurrentWeather;
  forecast: ForecastData;
}
