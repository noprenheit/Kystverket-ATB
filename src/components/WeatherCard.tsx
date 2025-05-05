import { languageStore, t } from '@/src/i18n';
import { conditionMappings, windDirectionMappings } from '@/src/i18n/mappings';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View
} from 'react-native';
import { ForecastDay, ForecastResponse } from '../models/forecast';
import HumidityIcon from './icons/HumidityIcon';
import LighthouseIcon from './icons/LightHouseIcon';
import { SunriseIcon, SunsetIcon } from './icons/SunIcons';
import VisibilityIcon from './icons/VisibilityIcon';

interface WeatherCardProps {
  visible: boolean;
  onClose: () => void;
  data: ForecastResponse & { originalPlaceName?: string }; // updated type
}

// Wind Direction Indicator Component
const WindDirectionIndicator: React.FC<{ degree: number }> = ({ degree }) => {
  return (
    <View style={styles.compassContainer}>
      <View style={styles.compassRing}>
        <Text style={[styles.compassPoint, { top: 0, left: '50%' }]}>{t('weather.compass.north')}</Text>
        <Text style={[styles.compassPoint, { top: '50%', right: 0 }]}>{t('weather.compass.east')}</Text>
        <Text style={[styles.compassPoint, { bottom: 0, left: '50%' }]}>{t('weather.compass.south')}</Text>
        <Text style={[styles.compassPoint, { top: '50%', left: 0 }]}>{t('weather.compass.west')}</Text>
        
        <View 
          style={[
            styles.compassArrow,
            { transform: [{ rotate: `${degree}deg` }] }
          ]}
        >
          <View style={styles.arrowHead} />
          <View style={styles.arrowTail} />
        </View>
      </View>
    </View>
  );
};

const WeatherCard: React.FC<WeatherCardProps> = ({ visible, onClose, data }) => {
  if (!data) return null;
  const { location, current, forecast } = data;
  const { width, height } = useWindowDimensions();
  const cardW = width * 0.9;
  const cardH = height * 0.7;

  // Format time to convert from 12-hour (AM/PM) to 24-hour format
  const formatTime = (timeString: string) => {
    // Extract time parts
    const timeRegex = /(\d+):(\d+)\s?(AM|PM)/i;
    const match = timeString.match(timeRegex);
    
    if (!match) return timeString;
    
    let [, hours, minutes, period] = match;
    let hoursNum = parseInt(hours, 10);
    
    // Convert to 24-hour format
    if (period.toUpperCase() === 'PM' && hoursNum < 12) {
      hoursNum += 12;
    } else if (period.toUpperCase() === 'AM' && hoursNum === 12) {
      hoursNum = 0;
    }
    
    // Format with leading zeros
    return `${hoursNum.toString().padStart(2, '0')}:${minutes}`;
  };

  // Translate weather condition
  const getTranslatedCondition = (condition: string) => {
    const translationKey = conditionMappings[condition];
    return translationKey ? t(translationKey) : condition;
  };

  // Translate wind direction
  const getTranslatedWindDirection = (direction: string) => {
    const translationKey = windDirectionMappings[direction];
    return translationKey ? t(translationKey) : direction;
  };

  // Format date with localized weekday names
  const getLocalizedWeekday = (dateStr: string) => {
    const date = new Date(dateStr);
    // Get the weekday using the current language
    const locale = languageStore.currentLocale === 'no' ? 'nb-NO' : 'en-US';
    const weekday = date.toLocaleDateString(locale, { weekday: 'long' });
    
    // Capitalize the first letter
    return weekday.charAt(0).toUpperCase() + weekday.slice(1);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <LinearGradient
          colors={['#4facfe', '#00f2fe']}
          style={[styles.card, { width: cardW, height: cardH }]}
        >
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>

          {/* Location & Time */}
          <Text style={styles.location}>{data.originalPlaceName || `${location.name}, ${location.country}`}</Text>
          <Text style={styles.time}>{location.localtime}</Text>

          {/* Current Weather */}
          <View style={styles.currentSection}>
            <View style={styles.weatherMatrix}>
              <View style={styles.lighthouseColumn}>
                <LighthouseIcon width={60} height={60} />
              </View>
              <View style={styles.iconColumn}>
                <Image
                  source={{ uri: `https:${current.condition.icon}` }}
                  style={styles.conditionIcon}
                />
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.currentTemp}>{Math.round(current.temp_c)}°C</Text>
                <Text style={styles.currentDesc}>{getTranslatedCondition(current.condition.text)}</Text>
                <Text style={styles.feelsLike}>{t('weather.feels_like')} {Math.round(current.feelslike_c)}°C</Text>
              </View>
            </View>
          </View>

          {/* Sun Times */}
          <View style={styles.sunSection}>
            <View style={styles.sunItem}>
              <SunriseIcon width={60} height={60} />
              <Text style={styles.sunText}>{formatTime(forecast.forecastday[0].astro.sunrise)}</Text>
            </View>
            <View style={styles.sunItem}>
              <SunsetIcon width={60} height={60} />
              <Text style={styles.sunText}>{formatTime(forecast.forecastday[0].astro.sunset)}</Text>
            </View>
          </View>

          {/* Current Weather Details */}
          <View style={styles.weatherDetails}>
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>{t('weather.wind')}</Text>
              <Text style={styles.detailValue}>{current.wind_kph} km/h</Text>
              <View style={styles.iconContainer}>
                <WindDirectionIndicator degree={current.wind_degree} />
              </View>
              <Text style={styles.detailSubvalue}>{getTranslatedWindDirection(current.wind_dir)}</Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>{t('weather.humidity')}</Text>
              <Text style={styles.detailValue}>{current.humidity}%</Text>
              <View style={styles.iconContainer}>
                <HumidityIcon width={24} height={24} />
              </View>
              <Text style={styles.detailSubvalue}>&nbsp;</Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>{t('weather.visibility')}</Text>
              <Text style={styles.detailValue}>{current.vis_km} km</Text>
              <View style={styles.iconContainer}>
                <VisibilityIcon width={24} height={24} />
              </View>
              <Text style={styles.detailSubvalue}>&nbsp;</Text>
            </View>
          </View>

          {/* 3-Day Forecast */}
          <Text style={styles.forecastTitle}>{t('weather.extended_forecast')}</Text>
          <View style={styles.forecastContainer}>
            {forecast.forecastday.map((day: ForecastDay, index: number) => {
              // Determine day label (today, tomorrow, or day of week)
              let dayLabel = '';
              if (index === 0) {
                dayLabel = t('weather.today');
              } else if (index === 1) {
                dayLabel = t('weather.tomorrow');
              } else {
                dayLabel = getLocalizedWeekday(day.date);
              }
              
              return (
                <View key={day.date} style={styles.dayCard}>
                  <Text style={styles.dayLabel}>
                    {dayLabel}
                  </Text>
                  <Image
                    source={{ uri: `https:${day.day.condition.icon}` }}
                    style={styles.dayIcon}
                  />
                  <Text style={styles.dayTemp}>
                    {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                  </Text>
                </View>
              );
            })}
          </View>
        </LinearGradient>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 20,
    padding: 20,
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    color: '#fff',
  },
  location: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
    marginTop: 8,
  },
  time: {
    fontSize: 14,
    color: '#eef',
    textAlign: 'center',
    marginBottom: 16,
  },
  currentSection: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
  },
  weatherMatrix: {
    flexDirection: 'row',
    width: '100%',
    paddingHorizontal: 15,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lighthouseColumn: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lighthouseEmoji: {
    fontSize: 60,
  },
  iconColumn: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dataColumn: {
    width: '33.33%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  conditionIcon: {
    width: 80,
    height: 80,
  },
  currentTemp: {
    fontSize: 32,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
  },
  currentDesc: {
    fontSize: 14,
    color: '#eef',
    marginTop: 2,
    textAlign: 'center',
  },
  feelsLike: {
    fontSize: 12,
    color: '#eef',
    marginTop: 2,
    textAlign: 'center',
  },
  weatherDetails: {
    flexDirection: 'row',
    marginVertical: 12,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 12,
    height: 130,
  },
  detailColumn: {
    flex: 1,
    flexBasis: '33.33%',
    maxWidth: '33.33%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailSeparator: {
    width: 1,
    height: '80%',
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignSelf: 'center',
  },
  detailLabel: {
    color: '#eef',
    fontSize: 12,
    marginBottom: 6,
    textAlign: 'center',
  },
  detailValue: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  detailSubvalue: {
    color: '#eef',
    fontSize: 12,
    textAlign: 'center',
  },
  iconContainer: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 6,
  },
  detailIcon: {
    fontSize: 24,
  },
  compassContainer: {
    alignItems: 'center',
    width: 40,
    height: 40,
  },
  compassRing: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  compassPoint: {
    position: 'absolute',
    fontSize: 8,
    color: '#fff',
    fontWeight: '500',
    marginLeft: -4,
    marginTop: -4,
  },
  compassArrow: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  arrowHead: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderBottomWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: '#FF5252',
    position: 'absolute',
    top: 2,
    transform: [{ rotate: '180deg' }]
  },
  arrowTail: {
    width: 2,
    height: 12,
    backgroundColor: '#FF5252',
    position: 'absolute',
    top: 10,
  },
  sunSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
    paddingHorizontal: 30,
    width: '100%',
  },
  sunItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sunText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginLeft: 6,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginTop: 8,
    marginBottom: 4,
    marginLeft: 8,
    textAlign: 'center',
  },
  forecastContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  dayCard: {
    width: '32%',
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    alignItems: 'center',
  },
  dayLabel: {
    fontSize: 12,
    color: '#fff',
    marginBottom: 4,
  },
  dayIcon: {
    width: 40,
    height: 40,
    marginBottom: 4,
  },
  dayTemp: {
    fontSize: 13,
    color: '#fff',
    fontWeight: '600',
  },
});

export default WeatherCard;
