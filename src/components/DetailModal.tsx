import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  StyleSheet
} from 'react-native';
import { ForecastResponse } from '../models/forecast';
import lighthouseStore from '../store/lighthouseStore';
import WeatherCard from './WeatherCard';

const { width, height } = Dimensions.get('window');

const DetailModal = observer(() => {
  const { detailId, forecasts } = lighthouseStore;
  const [loading, setLoading] = useState(false);
  const [refreshInterval, setRefreshInterval] = useState<ReturnType<typeof setInterval> | null>(null);

  // Auto refresh while the modal is open
  useEffect(() => {
    if (detailId) {
      setLoading(true);

      const refreshData = async () => {
        try {
          await lighthouseStore.refreshOne(detailId);
        } finally {
          setLoading(false);
        }
      };
      
      refreshData();

      // Refresh data every X minutes
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

  const handleClose = () => {
    if (refreshInterval) {
      clearInterval(refreshInterval);
    }
    lighthouseStore.openDetail('');
  };

  if (!detailId) return null;

  const forecastData = forecasts.get(detailId) as ForecastResponse | undefined;
  
  if (!forecastData || loading) return null;

  return (
    <WeatherCard 
      visible={!!detailId}
      onClose={handleClose}
      data={forecastData} 
    />
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
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  weatherCardContainer: {
    position: 'relative',
  },
  closeButtonContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 100,
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    width: 220,
    height: 350,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    width: 220,
    height: 350,
    borderRadius: 20,
    backgroundColor: 'white',
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
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