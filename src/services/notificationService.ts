import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

/**
 * Configure notification handlers and appearance
 */
export const configureNotifications = () => {
  // Configure how notifications appear when the app is in the foreground
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

/**
 * Request permissions for push notifications
 * @returns Promise with boolean indicating if permissions were granted
 */
export const requestNotificationPermissions = async (): Promise<boolean> => {
  // Create notification channel for Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('wind-alerts', {
      name: 'Wind Alerts',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
      sound: 'default',
    });
  }

  if (!Device.isDevice) {
    console.warn('Notifications require a physical device to test');
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Only ask if permissions have not already been determined
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Return true if permission is granted
  return finalStatus === 'granted';
};

/**
 * Get Expo push token for the device
 * Required for sending push notifications
 * @returns Promise with Expo push token
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  const hasPermission = await requestNotificationPermissions();
  
  if (!hasPermission) {
    console.warn('Push notifications permission not granted');
    return null;
  }

  if (!Device.isDevice) {
    console.warn('Push tokens require a physical device');
    return null;
  }

  try {
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? 
                      Constants?.easConfig?.projectId;
    
    if (!projectId) {
      console.warn('Project ID not found. Required for push notifications.');
      return null;
    }

    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });

    return pushToken.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Schedule a wind alert notification that will trigger when wind speed
 * exceeds the specified threshold
 * 
 * @param id Unique identifier for the location/station
 * @param name Name of the location/station
 * @param threshold Wind speed threshold in m/s
 * @returns Promise with notification identifier
 */
export const scheduleWindAlert = async (
  id: string,
  name: string,
  threshold: number
): Promise<string> => {
  // Request permissions first
  const hasPermission = await requestNotificationPermissions();
  
  if (!hasPermission) {
    throw new Error('Notification permissions not granted');
  }

  // Cancel any existing notifications with this ID
  await cancelNotification(id);

  // Schedule the new notification
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: `Wind Alert for ${name}`,
      body: `You'll be notified when wind speed exceeds ${threshold} m/s`,
      data: { id, name, threshold },
    },
    identifier: id,
    trigger: null, // Schedule immediately (just a confirmation notification)
  });
};

/**
 * Trigger a wind alert notification when wind speed exceeds threshold
 * Call this function when new weather data is received
 * 
 * @param id Location/station identifier
 * @param name Location/station name
 * @param windSpeed Current wind speed in m/s
 * @param threshold Alert threshold in m/s
 */
export const triggerWindAlert = async (
  id: string,
  name: string,
  windSpeed: number,
  threshold: number
): Promise<void> => {
  // Only trigger when wind speed exceeds threshold
  if (windSpeed >= threshold) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `High Wind Alert: ${name}`,
        body: `Current wind speed is ${windSpeed} m/s (exceeds your ${threshold} m/s threshold)`,
        data: { id, name, windSpeed, threshold },
        sound: 'default',
      },
      identifier: `${id}-${Date.now()}`, // Unique ID to allow multiple alerts
      trigger: null, // Send immediately
    });
  }
};

/**
 * Cancel a specific notification by ID
 * @param id Notification identifier
 */
export const cancelNotification = async (id: string): Promise<void> => {
  await Notifications.cancelScheduledNotificationAsync(id);
};

/**
 * Cancel all scheduled notifications
 */
export const cancelAllNotifications = async (): Promise<void> => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Get all scheduled notifications
 * @returns Array of scheduled notification requests
 */
export const getAllScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};

/**
 * Get badges count
 * @returns Current badge count
 */
export const getBadgeCount = async (): Promise<number> => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Set badge count
 * @param count Number to display on app badge
 * @returns Whether operation was successful
 */
export const setBadgeCount = async (count: number): Promise<boolean> => {
  return await Notifications.setBadgeCountAsync(count);
};
