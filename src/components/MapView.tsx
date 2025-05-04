import { observer } from 'mobx-react-lite';
import React from 'react';
import { Dimensions, Platform, StyleSheet, Text, View } from 'react-native';
import lighthouseStore from '../store/lighthouseStore';
import LighthouseMarker from './LightHouseMarker';

// Norway's geographical center coordinates (approximate)
const NORWAY_REGION = {
  latitude: 62.0,   // Central latitude of Norway
  longitude: 10.0,  // Central longitude of Norway
  latitudeDelta: 10.0,  // Zoom level - larger number = more zoomed out
  longitudeDelta: 10.0,
};

const MapViewComponent = observer(() => {
  // Only import react-native-maps when running on native platforms
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.map}>
          <View style={styles.webMapPlaceholder}>
            <Text>Map not available on web platform</Text>
            <Text>The app needs to be run on iOS or Android to view the map</Text>
          </View>
        </View>
      </View>
    );
  }

  // Dynamic import for native platforms only
  const { default: MapView, PROVIDER_DEFAULT, UrlTile } = require('react-native-maps');

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_DEFAULT}
        initialRegion={NORWAY_REGION}
      >
        {/* OpenStreetMap tile overlay */}
        <UrlTile 
          urlTemplate="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
          flipY={false}
        />
        
        {/* Render lighthouse markers */}
        {lighthouseStore.filtered.map(lighthouse => (
          <LighthouseMarker
            key={lighthouse.id}
            id={lighthouse.id}
            lat={lighthouse.lat}
            lon={lighthouse.lon}
            name={lighthouse.name}
          />
        ))}
      </MapView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  webMapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  }
});

export default MapViewComponent;
