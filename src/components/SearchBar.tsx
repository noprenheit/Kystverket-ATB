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
      lighthouseStore.setFilter(searchText);
    }, 300);
    
    // Clean up the timeout on component unmount or when searchText changes
    return () => clearTimeout(debounceTimeout);
  }, [searchText]);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={searchText}
        onChangeText={setSearchText}
        placeholder="Search lighthouses..."
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
