import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    plugins: [
      "expo-localization"
    ],
    extra: {
      weatherApiKey: process.env.WEATHER_API_KEY,
    },
  };
}; 