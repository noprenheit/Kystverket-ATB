import { languageStore, t } from '@/src/i18n';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import lighthouseStore from '../store/lighthouseStore';

const SearchBar: React.FC = () => {
  // Local state for debouncing
  const [searchText, setSearchText] = useState(lighthouseStore.filter);
  
  // Debounce effect - updates the store after user stops typing
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      // Always update the filter in the store
      lighthouseStore.setFilter(searchText);
    }, 300);
    
    // Clean up the timeout on component unmount or when searchText changes
    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  // Force the component to respond to language changes
  const currentLanguage = languageStore.currentLocale;

  // Handle text changes with immediate filter clearing when empty
  const handleTextChange = (text: string) => {
    setSearchText(text);
    // If text is cleared, immediately update the filter instead of waiting for debounce
    if (text === '') {
      lighthouseStore.setFilter('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={handleTextChange}
        placeholder={t('weather.search_placeholder')}
        placeholderTextColor="#999"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  input: {
    height: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
});

export default observer(SearchBar);
