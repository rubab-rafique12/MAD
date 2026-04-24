import React, { useState } from 'react';
import { ScrollView, View, Text, Switch, TouchableOpacity } from 'react-native';
import { globalStyles } from '../globalStyles';
import { FontAwesome } from '@expo/vector-icons';

export default function SettingsScreen({ goToHome }) {
  const [darkMode, setDarkMode] = useState(false);
  const [gradeScale, setGradeScale] = useState(false);
  const [notifications, setNotifications] = useState(true);

  // Background color toggle (light mode palette)
  const [bgColor, setBgColor] = useState('#F5F5F7'); 
  const colors = ['#F5F5F7', '#FFD700', '#87CEEB', '#FFB6C1', '#E0E0E0']; 

  const changeBgColor = () => {
    const currentIndex = colors.indexOf(bgColor);
    const nextIndex = (currentIndex + 1) % colors.length;
    setBgColor(colors[nextIndex]);
  };

  // Dynamic colors for dark mode
  const screenBg = darkMode ? '#121212' : bgColor;
  const cardBg = darkMode ? '#1E1E1E' : '#FFF';
  const textColor = darkMode ? '#EDEDED' : '#2C3E50';
  const switchTrackColor = { false: '#767577', true: '#81b0ff' };
  const switchThumbColor = darkMode ? '#3498DB' : '#f4f3f4';

  return (
    <ScrollView
      style={[globalStyles.container, { backgroundColor: screenBg }]}
      contentContainerStyle={{ padding: 10, paddingBottom: 40 }}
    >
      <Text style={[globalStyles.title, { color: textColor }]}>
        Settings
      </Text>
      
      <View style={[globalStyles.card, { backgroundColor: cardBg }]}>
        <View style={globalStyles.row}>
          <View style={globalStyles.iconRow}>
            <FontAwesome name="moon-o" size={20} color="#3498DB" />
            <Text style={[globalStyles.text, { marginLeft: 10, color: textColor }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            value={darkMode}
            onValueChange={setDarkMode}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        </View>
        
        <View style={globalStyles.row}>
          <View style={globalStyles.iconRow}>
            <FontAwesome name="calculator" size={20} color="#3498DB" />
            <Text style={[globalStyles.text, { marginLeft: 10, color: textColor }]}>
              Grade Scale (4.0/5.0)
            </Text>
          </View>
          <Switch
            value={gradeScale}
            onValueChange={setGradeScale}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        </View>
        
        <View style={globalStyles.row}>
          <View style={globalStyles.iconRow}>
            <FontAwesome name="bell" size={20} color="#3498DB" />
            <Text style={[globalStyles.text, { marginLeft: 10, color: textColor }]}>
              Notifications
            </Text>
          </View>
          <Switch
            value={notifications}
            onValueChange={setNotifications}
            trackColor={switchTrackColor}
            thumbColor={switchThumbColor}
          />
        </View>

        {/* Change Background Color Button */}
        <TouchableOpacity 
          style={[globalStyles.secondaryButton, { marginTop: 15 }]}
          onPress={changeBgColor}
        >
          <Text style={[globalStyles.secondaryButtonText, { color: textColor }]}>
            🎨 Change Background Color
          </Text>
        </TouchableOpacity>
      </View>

      <View style={[globalStyles.card, { backgroundColor: cardBg }]}>
        <Text style={[globalStyles.subtitle, { color: textColor }]}>Current Settings</Text>
        <Text style={[globalStyles.text, { color: textColor }]}>• Mode: {darkMode ? 'Dark 🌙' : 'Light ☀️'}</Text>
        <Text style={[globalStyles.text, { color: textColor }]}>• Scale: {gradeScale ? '5.0' : '4.0'} System</Text>
        <Text style={[globalStyles.text, { color: textColor }]}>• Notifications: {notifications ? 'ON' : 'OFF'}</Text>
        <Text style={[globalStyles.text, { color: textColor }]}>• Background Color: {bgColor}</Text>
      </View>
      
      {/* Back to Home Button */}
      <TouchableOpacity 
        style={globalStyles.secondaryButton}
        onPress={goToHome}
      >
        <Text style={[globalStyles.secondaryButtonText, { color: textColor }]}>
          ← Back to Home
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}