import EnglishIcon from '@/src/components/icons/EnglishIcon';
import NorwegianIcon from '@/src/components/icons/NorwegianIcon';
import { languageStore, t } from '@/src/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';

// Settings interface
interface Settings {
  useMetric: boolean;
  darkMapStyle: boolean;
  enableNotifications: boolean;
}

const SettingsScreen: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    useMetric: false,
    darkMapStyle: false,
    enableNotifications: false
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

  // Switch language handler
  const toggleLanguage = (locale: 'no' | 'en') => {
    languageStore.setLocale(locale);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.units')}</Text>
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text>{t('settings.use_metric')}</Text>
            <Text style={styles.tbdText}>(TBD)</Text>
          </View>
          <Switch
            value={settings.useMetric}
            onValueChange={(value) => updateSetting('useMetric', value)}
            disabled={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.map')}</Text>
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text>{t('settings.dark_map_style')}</Text>
            <Text style={styles.tbdText}>(TBD)</Text>
          </View>
          <Switch
            value={settings.darkMapStyle}
            onValueChange={(value) => updateSetting('darkMapStyle', value)}
            disabled={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={styles.setting}>
          <View style={styles.settingTextContainer}>
            <Text>{t('settings.enable_notifications')}</Text>
            <Text style={styles.tbdText}>(TBD)</Text>
          </View>
          <Switch
            value={settings.enableNotifications}
            onValueChange={(value) => updateSetting('enableNotifications', value)}
            disabled={true}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('settings.language')}</Text>
        <View style={styles.languageContainer}>
          <TouchableOpacity 
            onPress={() => toggleLanguage('no')}
            style={styles.flagOption}
          >
            <View style={[
              styles.flagFrame,
              languageStore.isNorwegian && styles.selectedFlagFrame
            ]}>
              <NorwegianIcon width={40} height={30} />
            </View>
            <Text style={[styles.flagLabel, languageStore.isNorwegian && styles.selectedLabel]}>
              {t('settings.language_norwegian')}
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            onPress={() => toggleLanguage('en')}
            style={styles.flagOption}
          >
            <View style={[
              styles.flagFrame,
              !languageStore.isNorwegian && styles.selectedFlagFrame
            ]}>
              <EnglishIcon width={40} height={30} />
            </View>
            <Text style={[styles.flagLabel, !languageStore.isNorwegian && styles.selectedLabel]}>
              {t('settings.language_english')}
            </Text>
          </TouchableOpacity>
        </View>
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
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: 10,
  },
  flagOption: {
    alignItems: 'center',
  },
  flagFrame: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: 'transparent',
    marginBottom: 5,
  },
  selectedFlagFrame: {
    borderColor: 'blue',
  },
  flagLabel: {
    marginTop: 5,
  },
  selectedLabel: {
    fontWeight: 'bold',
  },
  settingTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tbdText: {
    marginLeft: 8,
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
  },
});

export default observer(SettingsScreen);
