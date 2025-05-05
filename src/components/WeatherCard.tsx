import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import React from 'react';
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { ForecastDay, ForecastResponse } from '../models/forecast';
import { SunriseIcon, SunsetIcon } from './SunIcons';

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
        <Text style={[styles.compassPoint, { top: 0, left: '50%' }]}>N</Text>
        <Text style={[styles.compassPoint, { top: '50%', right: 0 }]}>E</Text>
        <Text style={[styles.compassPoint, { bottom: 0, left: '50%' }]}>S</Text>
        <Text style={[styles.compassPoint, { top: '50%', left: 0 }]}>W</Text>
        
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

  // Choose Lottie animation based on condition code or text
  const pickAnimation = () => {
    const code = current.condition.code;
    if (code < 1030) return require('../assets/lottie/sunny.json');
    if (code < 1063) return require('../assets/lottie/cloudy.json');
    if (code < 1087) return require('../assets/lottie/rain.json');
    return require('../assets/lottie/fog.json');
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
            <LottieView
              source={pickAnimation()}
              autoPlay
              loop
              style={styles.lottie}
            />
            <View style={styles.weatherMatrix}>
              <View style={styles.iconColumn}>
                <Image
                  source={{ uri: `https:${current.condition.icon}` }}
                  style={styles.conditionIcon}
                />
              </View>
              <View style={styles.dataColumn}>
                <Text style={styles.currentTemp}>{Math.round(current.temp_c)}°C</Text>
                <View style={styles.textRow}>
                  <Text style={styles.currentDesc}>{current.condition.text}</Text>
                  <Text style={styles.feelsLike}>Feels like {Math.round(current.feelslike_c)}°C</Text>
                </View>
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
              <Text style={styles.detailLabel}>Wind</Text>
              <Text style={styles.detailValue}>{current.wind_kph} km/h</Text>
              <View style={styles.iconContainer}>
                <WindDirectionIndicator degree={current.wind_degree} />
              </View>
              <Text style={styles.detailSubvalue}>{current.wind_dir}</Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Humidity</Text>
              <Text style={styles.detailValue}>{current.humidity}%</Text>
              <View style={styles.iconContainer}>
                <Text style={styles.detailIcon}>💧</Text>
              </View>
              <Text style={styles.detailSubvalue}>&nbsp;</Text>
            </View>
            <View style={styles.detailSeparator} />
            <View style={styles.detailColumn}>
              <Text style={styles.detailLabel}>Visibility</Text>
              <Text style={styles.detailValue}>{current.vis_km} km</Text>
              <View style={styles.iconContainer}>
                <Text style={styles.detailIcon}>👁️</Text>
              </View>
              <Text style={styles.detailSubvalue}>&nbsp;</Text>
            </View>
          </View>

          {/* 3-Day Forecast */}
          <Text style={styles.forecastTitle}>3-Day Forecast</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.forecastScroll}
            contentContainerStyle={styles.forecastContent}
          >
            {forecast.forecastday.map((day: ForecastDay) => (
              <View key={day.date} style={styles.dayCard}>
                <Text style={styles.dayLabel}>
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                </Text>
                <Image
                  source={{ uri: `https:${current.condition.icon}` }}
                  style={styles.dayIcon}
                />
                <Text style={styles.dayTemp}>
                  {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
                </Text>
                <Text style={styles.rainChance}>☔ {day.day.daily_chance_of_rain}%</Text>
              </View>
            ))}
          </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lottie: {
    width: 120,
    height: 120,
  },
  weatherMatrix: {
    flexDirection: 'row',
    marginLeft: 12,
    width: 180,
  },
  iconColumn: {
    width: 60,
    justifyContent: 'center',
  },
  dataColumn: {
    flex: 1,
    justifyContent: 'center',
  },
  conditionIcon: {
    width: 60,
    height: 120,
  },
  currentTemp: {
    fontSize: 48,
    fontWeight: '800',
    color: '#fff',
  },
  textRow: {
    marginTop: 4,
  },
  currentDesc: {
    fontSize: 16,
    color: '#eef',
  },
  feelsLike: {
    fontSize: 14,
    color: '#eef',
    marginTop: 2,
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
  },
  forecastScroll: {
    maxHeight: 120,
  },
  forecastContent: {
    paddingHorizontal: 8,
  },
  dayCard: {
    width: 80,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    marginHorizontal: 6,
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
  rainChance: {
    fontSize: 11,
    color: '#eef',
  },
});

export default WeatherCard;
