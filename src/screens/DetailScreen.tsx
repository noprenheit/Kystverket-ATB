import { observer } from 'mobx-react-lite';
import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import lighthouseStore from '../store/lighthouseStore';

interface DetailScreenProps {
  id: string;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ id }) => {
  const lighthouse = lighthouseStore.lighthouses.find(lh => lh.id === id);
  const forecast = lighthouseStore.forecasts.get(id);
  
  if (!lighthouse) {
    return (
      <View style={styles.container}>
        <Text>Lighthouse not found</Text>
      </View>
    );
  }
  
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{lighthouse.name}</Text>
      
      {/* Location information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text>Latitude: {lighthouse.lat}</Text>
        <Text>Longitude: {lighthouse.lon}</Text>
      </View>
      
      {/* Weather forecast if available */}
      {forecast ? (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weather Forecast</Text>
          <Text>Temperature: {forecast.current.temp_c}°C</Text>
          <Text>Conditions: {forecast.current.condition.text}</Text>
          <Text>Wind: {forecast.current.wind_kph} km/h</Text>
        </View>
      ) : (
        <View style={styles.section}>
          <Text>Loading forecast data...</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});

export default observer(DetailScreen);
