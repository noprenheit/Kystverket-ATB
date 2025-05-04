import DetailScreen from '@/src/screens/DetailScreen';
import lighthouseStore from '@/src/store/lighthouseStore';
import { useLocalSearchParams } from 'expo-router';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';

export default observer(function DetailRoute() {
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Open the detail in the store when this screen is shown
  useEffect(() => {
    if (id) {
      lighthouseStore.openDetail(id);
    }
  }, [id]);
  
  // Make sure we have an ID
  if (!id) {
    return null;
  }
  
  return <DetailScreen id={id} />;
});
