import throttle from 'lodash.throttle';
import { action, computed, makeAutoObservable, observable, runInAction } from 'mobx';
import { ForecastResponse } from '../models/forecast';
import { LighthouseInternal, convertToInternalFormat } from '../models/lighthouse';
import * as cacheService from '../services/cacheService';
import { fetchForecast } from '../services/weatherService';

class LighthouseStore {
  // Observables
  lighthouses: LighthouseInternal[] = [];
  forecasts = new Map<string, ForecastResponse>();
  filter: string = '';
  detailId: string | null = null;

  // Refresh interval in milliseconds (30 minutes)
  private readonly REFRESH_INTERVAL = 30 * 60 * 1000;
  // Throttle time in milliseconds (60 seconds)
  private readonly THROTTLE_TIME = 60 * 1000;

  constructor() {
    makeAutoObservable(this, {
      lighthouses: observable,
      forecasts: observable,
      filter: observable,
      detailId: observable,
      filtered: computed,
      init: action,
      openDetail: action,
      setFilter: action,
      refreshOne: action,
    });
  }

  /**
   * Initialize the lighthouse store
   * Loads lighthouse data from cache and sets up automatic refresh
   */
  async init() {
    // Load lighthouses from cache
    const cachedLighthouses = await cacheService.loadLighthousesJson();
    
    runInAction(() => {
      if (cachedLighthouses) {
        // Convert the API format to internal format
        this.lighthouses = cachedLighthouses.map(convertToInternalFormat);
      }
    });

    // Set up automatic refresh every 30 minutes
    setInterval(() => {
      this.lighthouses.forEach(lighthouse => {
        this._refresh(lighthouse.id);
      });
    }, this.REFRESH_INTERVAL);
  }

  /**
   * Private method to refresh forecast for a specific lighthouse
   * @param id The lighthouse ID
   */
  private async _refresh(id: string) {
    try {
      const lighthouse = this.lighthouses.find(lh => lh.id === id);
      if (!lighthouse) return;

      // Fetch forecast data
      const forecastData = await fetchForecast(lighthouse.lat, lighthouse.lon, lighthouse.name);
      
      // Cache the forecast data
      await cacheService.cacheForecast(id, forecastData);
      
      // Update the state
      runInAction(() => {
        this.forecasts.set(id, forecastData);
      });
    } catch (error) {
      console.error(`Error refreshing forecast for lighthouse ${id}:`, error);
      
      // Try to load from cache if fetch fails
      const cachedForecast = await cacheService.loadCachedForecast(id);
      if (cachedForecast) {
        runInAction(() => {
          this.forecasts.set(id, cachedForecast);
        });
      }
    }
  }

  /**
   * Non-throttled refresh method for immediate updates
   * @param id The lighthouse ID
   */
  refreshOne(id: string) {
    this._refresh(id);
  }

  /**
   * Throttled version of the refresh method to prevent too many API calls
   */
  refreshOneThrottled = throttle((id: string) => {
    this._refresh(id);
  }, this.THROTTLE_TIME);

  /**
   * Open the detail view for a specific lighthouse
   * @param id The lighthouse ID to view details for
   */
  openDetail(id: string) {
    // Only refresh if we're opening a different lighthouse detail or
    // if we're closing the current detail (id === '')
    if (id !== this.detailId || id === '') {
      this.detailId = id;
      if (id) {
        // Use the non-throttled version for immediate response
        this.refreshOne(id);
      }
    }
  }

  /**
   * Computed property that filters lighthouses based on the filter text
   */
  get filtered() {
    const filterText = this.filter.toLowerCase().trim();
    if (!filterText) return this.lighthouses;
    
    return this.lighthouses.filter(lighthouse => 
      lighthouse.name.toLowerCase().includes(filterText)
    );
  }

  /**
   * Set the filter value for lighthouse search
   */
  setFilter(value: string) {
    this.filter = value;
  }
}

// Create and export singleton instance
const lighthouseStore = new LighthouseStore();
export default lighthouseStore;
