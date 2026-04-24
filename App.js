import React, { useState } from 'react';
import { View } from 'react-native';
import HomeScreen from './frontend/screens/HomeScreen';
import ProfileScreen from './frontend/screens/ProfileScreen';
import SettingsScreen from './frontend/screens/SettingsScreen';
import ContactScreen from './frontend/screens/ContactScreen';

import React, { useState } from "react";
import { View } from "react-native";
import Home from "./Home";

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');

  if (currentScreen === 'home') {
    return (
      <View>
        <Home
          goToSettings={() => setCurrentScreen('settings')}
          goToContact={() => setCurrentScreen('contact')}
        />
      </View>
    );
  }
}

  if (currentScreen === 'profile') {
    return (
      <View style={{ flex: 1 }}>
        <ProfileScreen 
          goToHome={() => setCurrentScreen('home')}
        />
      </View>
    );
  }

  if (currentScreen === 'settings') {
    return (
      <View style={{ flex: 1 }}>
        <SettingsScreen 
          goToHome={() => setCurrentScreen('home')}
        />
      </View>
    );
  }

  if (currentScreen === 'contact') {
    return (
      <View style={{ flex: 1 }}>
        <ContactScreen 
          goToHome={() => setCurrentScreen('home')}
        />
      </View>
    );
  }
