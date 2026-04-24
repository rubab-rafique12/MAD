import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { initializeFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCTu9RVn8Ah645z8JTKA8ec09YSc8vH9e0",
  authDomain: "fir-app-19c05.firebaseapp.com",
  projectId: "fir-app-19c05",
  storageBucket: "fir-app-19c05.firebasestorage.app",
  messagingSenderId: "912610437066",
  appId: "1:912610437066:web:34e3550b101613c7da5133",
  measurementId: "G-FT5E6WLD72"
};

const app = initializeApp(firebaseConfig);

// Web uses getAuth (browser persistence). Native uses initializeAuth with AsyncStorage.
export const auth =
  Platform.OS === 'web'
    ? getAuth(app)
    : initializeAuth(app, {
        persistence: getReactNativePersistence(ReactNativeAsyncStorage),
      });

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});