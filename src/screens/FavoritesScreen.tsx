import { t } from '@/src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { LighthouseInternal } from '../models/lighthouse';
import lighthouseStore from '../store/lighthouseStore';

const FavoritesScreen: React.FC = () => {
  const [favorites, setFavorites] = useState<LighthouseInternal[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favIds = await AsyncStorage.getItem('favoriteLighthouses');
      const favoriteIds = favIds ? JSON.parse(favIds) : [];
      
      const lighthouseFavorites = lighthouseStore.lighthouses.filter(
        lighthouse => favoriteIds.includes(lighthouse.id)
      );
      
      setFavorites(lighthouseFavorites);
    } catch (error) {
      console.error('Failed to load favorites', error);
    }
  };

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>{t('favorites.no_favorites')}</Text>
        <Text style={styles.emptySubtext}>{t('favorites.add_favorites_hint')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.favoriteItem}>
            <Text style={styles.itemTitle}>{item.name}</Text>
            <Text style={styles.itemSubtitle}>{`${t('favorites.latitude')}: ${item.lat}, ${t('favorites.longitude')}: ${item.lon}`}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  favoriteItem: {
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#666',
  },
});

export default observer(FavoritesScreen); 