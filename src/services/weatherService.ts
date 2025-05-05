import axios from 'axios';
import Constants from 'expo-constants';
import { ForecastResponse } from '../models/forecast';

/**
 * Fetches weather forecast from WeatherAPI.com
 */
export const fetchForecast = async (
  lat: number,
  lon: number,
  placeName?: string
): Promise<ForecastResponse & { originalPlaceName?: string }> => {
  // Expo Constants exposes your app.json "extra" fields here:
  const API_KEY =
    // for SDK ≤ 48:
    Constants.manifest?.extra?.weatherApiKey
    // for SDK ≥ 49, or EAS builds:
    ?? (Constants.expoConfig?.extra as any)?.weatherApiKey;

  if (!API_KEY) {
    throw new Error(
      'Weather API key is not defined—check expo.extra.weatherApiKey in app.json'
    );
  }

  try {
    const response = await axios.get(
      'https://api.weatherapi.com/v1/forecast.json',
      {
        params: {
          key: API_KEY,
          q: `${lat},${lon}`,
          days: 2,
          aqi: 'no',
          alerts: 'no',
          tide: 'yes',
          marine: 'yes',
        },
      }
    );

    // Add the original place name to the response data
    const data = response.data as ForecastResponse;
    return {
      ...data,
      originalPlaceName: placeName
    };
  } catch (error) {
    console.error('Error fetching weather forecast:', error);
    throw error;
  }
};