import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    Modal,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import { ForecastResponse } from '../models/forecast';
import lighthouseStore from '../store/lighthouseStore';

const { width, height } = Dimensions.get('window');

const DetailModal = observer(() => {
  const { detailId, forecasts } = lighthouseStore;
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Auto-refresh while the modal is open
  useEffect(() => {
    if (detailId) {
      // Show loading indicator
      setLoading(true);
      
      // Refresh data
      const refreshData = async () => {
        try {
          await lighthouseStore.refreshOne(detailId);
        } finally {
          setLoading(false);
        }
      };
      
      refreshData();

      // Set up an interval for refreshing
      const interval = setInterval(() => {
        refreshData();
      }, 300000); // 300000ms = 5 minutes

      setRefreshInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
    
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [detailId]);

  // Handle modal close properly
  const handleClose = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    lighthouseStore.openDetail('');
  };

  if (!detailId) return null;

  const forecastData = forecasts.get(detailId) as ForecastResponse | undefined;

  // Function to get the next tide information
  const getNextTide = () => {
    if (!forecastData?.forecast?.forecastday?.[0]?.tides?.[0]?.tide) {
      return null;
    }

    const tides = forecastData.forecast.forecastday[0].tides[0].tide;
    const now = new Date();
    
    // Find the next tide after current time
    const nextTide = tides.find((tide: any) => {
      const tideTime = new Date(forecastData.forecast.forecastday[0].date + ' ' + tide.tide_time);
      return tideTime > now;
    }) || tides[0]; // If no next tide today, use the first one
    
    return nextTide;
  };

  const nextTide = getNextTide();

  // Get weather icon
  const getWeatherIcon = (code: number) => {
    // This is a simplified version, you'd want to map condition codes to appropriate emoji
    if (code >= 1000 && code < 1003) return '☀️'; // Sunny or partly cloudy
    if (code >= 1003 && code < 1030) return '🌤️'; // Cloudy variations
    if (code >= 1030 && code < 1063) return '🌫️'; // Foggy, misty
    if (code >= 1063 && code < 1087) return '🌧️'; // Rainy variations
    if (code >= 1087 && code < 1114) return '⛈️'; // Thunderstorm
    if (code >= 1114 && code < 1200) return '❄️'; // Snow variations
    if (code >= 1200 && code < 1300) return '🌨️'; // Rain/snow mix
    return '🌡️'; // Default
  };

  return (
    <Modal
      visible={!!detailId}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalCard}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#2196F3" />
              <Text style={styles.loadingText}>Loading weather data...</Text>
            </View>
          ) : forecastData ? (
            <>
              {/* Header with location name and close button */}
              <View style={styles.cardHeader}>
                <Text style={styles.locationName}>{forecastData.location.name}</Text>
                <TouchableOpacity 
                  onPress={handleClose}
                  style={styles.closeButton}
                  hitSlop={{top: 15, right: 15, bottom: 15, left: 15}}
                >
                  <Text style={styles.closeText}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Current weather section */}
              <View style={styles.section}>
                <Text style={styles.weatherMain}>
                  {getWeatherIcon(forecastData.current.condition.code)} {forecastData.current.temp_c} °C – {forecastData.current.condition.text}
                </Text>
                <Text style={styles.weatherSubInfo}>
                  Feels like {forecastData.current.feelslike_c} °C | Wind {forecastData.current.wind_kph} km/h {forecastData.current.wind_dir}
                </Text>
                <Text style={styles.weatherSubInfo}>
                  Visibility {forecastData.current.vis_km} km
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Sun information */}
              <View style={styles.section}>
                <Text style={styles.sectionText}>
                  🌅 Sunrise: {forecastData.forecast.forecastday[0].astro.sunrise}   
                  🌇 Sunset: {forecastData.forecast.forecastday[0].astro.sunset}
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Marine information */}
              <View style={styles.section}>
                {nextTide ? (
                  <Text style={styles.sectionText}>
                    🌊 Next Tide: {nextTide.tide_type === 'high' ? 'High' : 'Low'} @ {nextTide.tide_time} ({nextTide.tide_height_mt} m)
                  </Text>
                ) : null}

                <Text style={styles.sectionText}>
                  💧 Water temp: {forecastData.current.feelslike_c || forecastData.forecast?.forecastday?.[0]?.day?.maxtemp_c || 'N/A'} °C
                </Text>
              </View>

              {/* Divider */}
              <View style={styles.divider} />

              {/* Forecast for today and tomorrow */}
              <View style={styles.section}>
                <Text style={styles.sectionText}>
                  📅 Today: H {forecastData.forecast.forecastday[0].day.maxtemp_c} °C / L {forecastData.forecast.forecastday[0].day.mintemp_c} °C  
                  ☔ {forecastData.forecast.forecastday[0].day.daily_chance_of_rain}%
                </Text>
                {forecastData.forecast.forecastday[1] ? (
                  <Text style={styles.sectionText}>
                    📅 Tomorrow: H {forecastData.forecast.forecastday[1].day.maxtemp_c} °C / L {forecastData.forecast.forecastday[1].day.mintemp_c} °C 
                    ☔ {forecastData.forecast.forecastday[1].day.daily_chance_of_rain}%
                  </Text>
                ) : null}
              </View>
            </>
          ) : (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Could not load weather data</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleClose}>
                <Text style={styles.retryText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    width: width * 0.9,
    maxHeight: height * 0.9,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  closeButton: {
    padding: 4,
  },
  closeText: {
    fontSize: 18,
    color: '#666',
    fontWeight: 'bold',
  },
  section: {
    paddingVertical: 8,
  },
  weatherMain: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  weatherSubInfo: {
    fontSize: 15,
    color: '#444',
    marginBottom: 2,
  },
  sectionText: {
    fontSize: 15,
    color: '#333',
    marginBottom: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  loadingContainer: {
    padding: 24,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    padding: 24,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 4,
  },
  retryText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default DetailModal;
