import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Callout, Marker } from 'react-native-maps';
import lighthouseStore from '../store/lighthouseStore';
import InfoIcon from './InfoIcon';

interface LighthouseMarkerProps {
  id: string;
  lat: number;
  lon: number;
  name: string;
}

const LighthouseMarker: React.FC<LighthouseMarkerProps> = ({ id, lat, lon, name }) => {
  const handlePress = async () => {
    try {
      await lighthouseStore.refreshOne(id);
      lighthouseStore.openDetail(id);
    } catch (error) {
      console.error('Error fetching lighthouse data:', error);
    }
  };

  return (
    <Marker
      coordinate={{
        latitude: lat,
        longitude: lon,
      }}
      pinColor="#2196F3"
    >
      <Callout 
        tooltip 
        onPress={handlePress}
      >
        <TouchableOpacity 
          style={styles.callout}
          onPress={handlePress}
          activeOpacity={0.7}
        >
          <Text style={styles.calloutTitle} numberOfLines={1}>{name}</Text>
          <InfoIcon size={20} />
        </TouchableOpacity>
      </Callout>
    </Marker>
  );
};

const styles = StyleSheet.create({
  callout: {
    backgroundColor: 'white',
    borderRadius: 6,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    maxWidth: 250,
  },
  calloutTitle: {
    fontWeight: '600',
    fontSize: 14,
    marginRight: 8,
  }
});

export default LighthouseMarker;
