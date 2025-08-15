// Expo app config with env-injected Apollo URI
const { config } = require('dotenv');
config();

module.exports = {
  expo: {
    name: 'rate-repository-app',
    slug: 'rate-repository-app',
    scheme: 'rateapp',
    version: '1.0.0',
    orientation: 'portrait',
    platforms: ['ios', 'android', 'web'],
    extra: {
      apolloUri: process.env.APOLLO_URI || 'http://localhost:4000/graphql',
    },
  },
};