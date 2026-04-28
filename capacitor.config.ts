import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'lk.asiri.mobile',
  appName: 'Asiri Mobile',
  webDir: 'www',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#001e36'
    },
    SplashScreen: {
      launchShowDuration: 0
    }
  }
};

export default config;