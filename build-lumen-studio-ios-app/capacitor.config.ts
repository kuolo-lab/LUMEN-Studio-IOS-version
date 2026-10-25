import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.lumenstudio.app',
  appName: 'LUMEN Studio',
  webDir: 'dist',
  backgroundColor: '#0b0c0e',
  android: {
    allowMixedContent: false,
  },
  ios: {
    contentInset: 'never',
    backgroundColor: '#0b0c0e',
    scrollEnabled: true,
    preferredContentMode: 'mobile',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
    },
  },
};

export default config;
