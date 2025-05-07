import AsyncStorage from '@react-native-async-storage/async-storage';
import lighthousesData from '../assets/LightHouses.json';
import { ForecastResponse } from '../models/forecast';
import { Lighthouse } from '../models/lighthouse';

const LIGHTHOUSES_KEY = 'lighthouses';
const FORECAST_KEY_PREFIX = 'forecast_';

export const loadLighthousesJson = async (): Promise<Lighthouse[] | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(LIGHTHOUSES_KEY);
    if (jsonValue != null) {
      return JSON.parse(jsonValue);
    }
    
    // Fallback to local JSON file if nothing in cache
    return lighthousesData as Lighthouse[];
  } catch (error) {
    console.error('Error loading lighthouses from cache:', error);
    // Still fallback to local JSON data on error
    return lighthousesData as Lighthouse[];
  }
};

export const cacheForecast = async (id: string, data: ForecastResponse): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(`${FORECAST_KEY_PREFIX}${id}`, jsonValue);
  } catch (error) {
    console.error(`Error caching forecast for lighthouse ${id}:`, error);
  }
};

export const loadCachedForecast = async (id: string): Promise<ForecastResponse | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(`${FORECAST_KEY_PREFIX}${id}`);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error(`Error loading cached forecast for lighthouse ${id}:`, error);
    return null;
  }
};
