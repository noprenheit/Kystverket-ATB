import lighthouseStore from '@/src/store/lighthouseStore';
import { Redirect } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';


export default observer(function Index() {
  useEffect(() => {
    lighthouseStore.init();
  }, []);
  
  return <Redirect href="/map" />;
});

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
