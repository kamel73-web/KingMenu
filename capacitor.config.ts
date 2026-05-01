import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.kingmenu',
  appName: 'King Menu',
  webDir: 'dist',
  ios: {
    contentInset: 'always',
  },
  android: {
    backgroundColor: '#1C1410',
  },
  plugins: {
    StatusBar: {
      style: 'Dark',
      backgroundColor: '#1C1410',
      overlaysWebView: false,
    },
  },
};

export default config;
