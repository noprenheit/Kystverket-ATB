import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import { I18n } from 'i18n-js';
import { makeAutoObservable, runInAction } from 'mobx';

// Import translations
import en from './en.json';
import no from './no.json';

// Create i18n instance
const i18n = new I18n({
  en,
  no,
});

// Set default language to English
i18n.defaultLocale = 'en';
i18n.enableFallback = true;

// Language Store to handle language changes
class LanguageStore {
  currentLocale = 'en';

  constructor() {
    makeAutoObservable(this);
    this.initialize();
  }

  async initialize() {
    try {
      // Try to get saved language preference
      const savedLocale = await AsyncStorage.getItem('userLanguage');
      if (savedLocale) {
        runInAction(() => {
          this.currentLocale = savedLocale;
          i18n.locale = savedLocale;
        });
      } else {
        // If no saved preference, use device locale
        this.setDeviceLocale();
      }
    } catch (error) {
      console.error('Failed to initialize language settings', error);
      this.setDeviceLocale();
    }
  }

  setDeviceLocale() {
    const deviceLocale = this.getDeviceLocale();
    runInAction(() => {
      this.currentLocale = deviceLocale;
      i18n.locale = deviceLocale;
    });
  }

  getDeviceLocale() {
    const locale = Localization.locale || 'en';
    // Look for Norwegian or English specifically
    if (locale.startsWith('no') || locale.startsWith('nb') || locale.startsWith('nn')) {
      return 'no';
    }
    
    return 'en';
  }

  async setLocale(locale: 'en' | 'no') {
    try {
      await AsyncStorage.setItem('userLanguage', locale);
      runInAction(() => {
        this.currentLocale = locale;
        i18n.locale = locale;
      });
    } catch (error) {
      console.error('Failed to save language setting', error);
    }
  }

  get isNorwegian() {
    return this.currentLocale === 'no';
  }
}

export const languageStore = new LanguageStore();

// Create a t function that can be imported and used across the app
export const t = (key: string, options = {}) => i18n.t(key, options);

// Export the i18n instance in case it's needed
export default i18n;
