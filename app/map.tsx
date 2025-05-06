import HomeScreen from '@/src/screens/HomeScreen';
import lighthouseStore from '@/src/store/lighthouseStore';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export default observer(function MapRoute() {
  useEffect(() => {
    lighthouseStore.init();
  }, []);
  
  return <HomeScreen />;
}); 