import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

// Settings interface
interface Settings {
  useMetric: boolean;
  darkMapStyle: boolean;
  enableNotifications: boolean;
}

const SettingsScreen: React.FC = () => {
  // Settings state
  const [settings, setSettings] = useState<Settings>({
    useMetric: true,
    darkMapStyle: false,
    enableNotifications: true
  });

  // Load settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const savedSettings = await AsyncStorage.getItem('userSettings');
        if (savedSettings) {
          setSettings(JSON.parse(savedSettings));
        }
      } catch (error) {
        console.error('Failed to load settings', error);
      }
    };
    
    loadSettings();
  }, []);

  // Save settings when they change
  const updateSetting = async (key: keyof Settings, value: boolean) => {
    try {
      const newSettings = { ...settings, [key]: value };
      setSettings(newSettings);
      await AsyncStorage.setItem('userSettings', JSON.stringify(newSettings));
    } catch (error) {
      console.error('Failed to save settings', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Units</Text>
        <View style={styles.setting}>
          <Text>Use Metric Units</Text>
          <Switch
            value={settings.useMetric}
            onValueChange={(value) => updateSetting('useMetric', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map</Text>
        <View style={styles.setting}>
          <Text>Dark Map Style</Text>
          <Switch
            value={settings.darkMapStyle}
            onValueChange={(value) => updateSetting('darkMapStyle', value)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <View style={styles.setting}>
          <Text>Enable Notifications</Text>
          <Switch
            value={settings.enableNotifications}
            onValueChange={(value) => updateSetting('enableNotifications', value)}
          />
        </View>
        <Text style={styles.helpText}>
          Receive notifications for weather alerts and updates
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  helpText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
});

export default observer(SettingsScreen);
