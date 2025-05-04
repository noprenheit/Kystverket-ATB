import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import lighthouseStore from '../store/lighthouseStore';

const screenWidth = Dimensions.get('window').width;

// Define types for forecast data
interface ForecastHourData {
  temperature?: number;
  windSpeed?: number;
  windDirection?: string;
  waveHeight?: number;
  waveDirection?: string;
  tideLevel?: number;
  time?: string;
}

interface CurrentConditions {
  temperature: number;
  windSpeed: number;
  windDirection: string;
  waveHeight: number;
  waveDirection: string;
  tideLevel: number;
}

interface ForecastResponse {
  id: string;
  name: string;
  current: CurrentConditions;
  hourly: ForecastHourData[];
}

const DetailModal = observer(() => {
  const { detailId, forecasts } = lighthouseStore;
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Auto-refresh while the modal is open
  useEffect(() => {
    if (detailId) {
      // Immediate refresh when modal opens
      lighthouseStore.refreshOne(detailId);

      // Set up an interval for refreshing every minute
      const interval = setInterval(() => {
        lighthouseStore.refreshOne(detailId);
      }, 60000); // 60000ms = 1 minute

      setRefreshInterval(interval);
    }

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [detailId]);

  if (!detailId) return null;

  const forecast = forecasts.get(detailId) as ForecastResponse | undefined;
  if (!forecast) return null;

  const { current, hourly } = forecast;

  // Prepare data for the 48-hour forecast chart
  const forecastData = hourly?.slice(0, 48) || [];

  const temperatureData = {
    labels: forecastData.map((hour: ForecastHourData, index: number) => index % 6 === 0 ? `${index}h` : ''),
    datasets: [
      {
        data: forecastData.map((hour: ForecastHourData) => hour.temperature || 0),
        color: () => '#FF6384',
        strokeWidth: 2,
      },
    ],
  };

  const windData = {
    labels: forecastData.map((hour: ForecastHourData, index: number) => index % 6 === 0 ? `${index}h` : ''),
    datasets: [
      {
        data: forecastData.map((hour: ForecastHourData) => hour.windSpeed || 0),
        color: () => '#36A2EB',
        strokeWidth: 2,
      },
    ],
  };

  const waveData = {
    labels: forecastData.map((hour: ForecastHourData, index: number) => index % 6 === 0 ? `${index}h` : ''),
    datasets: [
      {
        data: forecastData.map((hour: ForecastHourData) => hour.waveHeight || 0),
        color: () => '#4BC0C0',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '1',
    },
  };

  const handleClose = () => {
    if (detailId) {
      // Clear the detail ID to effectively close the modal
      lighthouseStore.openDetail('');
    }
  };

  return (
    <Modal
      visible={!!detailId}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{forecast?.name || 'Lighthouse Details'}</Text>
          <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content}>
          {current && (
            <View style={styles.currentContainer}>
              <Text style={styles.sectionTitle}>Current Conditions</Text>

              <View style={styles.conditionRow}>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Temperature</Text>
                  <Text style={styles.conditionValue}>{current.temperature}°C</Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Wind</Text>
                  <Text style={styles.conditionValue}>
                    {current.windSpeed} m/s {current.windDirection}
                  </Text>
                </View>
              </View>

              <View style={styles.conditionRow}>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Waves</Text>
                  <Text style={styles.conditionValue}>
                    {current.waveHeight}m {current.waveDirection}
                  </Text>
                </View>
                <View style={styles.conditionItem}>
                  <Text style={styles.conditionLabel}>Tide</Text>
                  <Text style={styles.conditionValue}>{current.tideLevel}m</Text>
                </View>
              </View>
            </View>
          )}

          <View style={styles.forecastContainer}>
            <Text style={styles.sectionTitle}>48-Hour Forecast</Text>

            <Text style={styles.chartTitle}>Temperature (°C)</Text>
            <LineChart
              data={temperatureData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />

            <Text style={styles.chartTitle}>Wind Speed (m/s)</Text>
            <LineChart
              data={windData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />

            <Text style={styles.chartTitle}>Wave Height (m)</Text>
            <LineChart
              data={waveData}
              width={screenWidth - 40}
              height={220}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </View>
        </ScrollView>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2196F3',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  currentContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  conditionItem: {
    flex: 1,
  },
  conditionLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  forecastContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default DetailModal;
