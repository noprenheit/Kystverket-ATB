import { observer } from 'mobx-react-lite';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import DetailModal from '../components/DetailModal';
import MapView from '../components/MapView';
import SearchBar from '../components/SearchBar';

const HomeScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <SearchBar />
      <MapView />
      <DetailModal />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default observer(HomeScreen);
