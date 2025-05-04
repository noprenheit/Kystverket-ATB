import { I18n } from 'i18n-js';
import * as RNLocalize from 'react-native-localize';

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

// Get the best available language from the device
const getLocale = () => {
  const locales = RNLocalize.getLocales();
  if (locales.length === 0) return 'en';
  
  // Look for Norwegian or English specifically
  const deviceLocale = locales[0].languageCode;
  if (deviceLocale === 'no' || deviceLocale === 'nb' || deviceLocale === 'nn') {
    return 'no';
  }
  
  return 'en';
};

// Set the locale
i18n.locale = getLocale();

// Create a t function that can be imported and used across the app
export const t = (key: string, options = {}) => i18n.t(key, options);

// Export the i18n instance in case it's needed
export default i18n;
