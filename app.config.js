import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      weatherApiKey: process.env.WEATHER_API_KEY,
    },
  };
}; 