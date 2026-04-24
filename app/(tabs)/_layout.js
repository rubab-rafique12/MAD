import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import { Animated, Platform, StyleSheet, View } from 'react-native';
import { useTheme } from '../../hooks/useTheme';

function AnimatedTabIcon({ name, activeIcon, color, focused, size }) {
  const scale = useRef(new Animated.Value(focused ? 1 : 0.85)).current;
  const translateY = useRef(new Animated.Value(focused ? -2 : 0)).current;
  const glow = useRef(new Animated.Value(focused ? 1 : 0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, {
        toValue: focused ? 1.15 : 0.85,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.spring(translateY, {
        toValue: focused ? -4 : 0,
        useNativeDriver: true,
        tension: 200,
        friction: 10,
      }),
      Animated.timing(glow, {
        toValue: focused ? 1 : 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View style={{ transform: [{ scale }, { translateY }], alignItems: 'center' }}>
      <Ionicons
        name={focused ? activeIcon : name}
        size={size || 23}
        color={color}
      />
    </Animated.View>
  );
}

function TabDot({ focused, color }) {
  const opacity = useRef(new Animated.Value(0)).current;
  const scaleX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: focused ? 1 : 0, duration: 200, useNativeDriver: true }),
      Animated.spring(scaleX, { toValue: focused ? 1 : 0, tension: 200, friction: 10, useNativeDriver: true }),
    ]).start();
  }, [focused]);

  return (
    <Animated.View
      style={{
        width: 20,
        height: 3,
        borderRadius: 2,
        backgroundColor: color,
        marginTop: 4,
        opacity,
        transform: [{ scaleX }],
      }}
    />
  );
}

export default function TabLayout() {
  const { colors, isDark } = useTheme();
  const isIOS = Platform.OS === 'ios';
  const isWeb = Platform.OS === 'web';

  const tabs = [
    { name: 'index', title: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { name: 'courses', title: 'Courses', icon: 'book-outline', activeIcon: 'book' },
    { name: 'profile', title: 'Profile', icon: 'person-outline', activeIcon: 'person' },
    { name: 'edit', title: 'Edit', icon: 'create-outline', activeIcon: 'create' },
    { name: 'settings', title: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          position: 'absolute',
          backgroundColor: isIOS ? 'transparent' : colors.tabBar,
          borderTopWidth: 0,
          elevation: 0,
          height: isWeb ? 90 : 76,
          paddingBottom: isWeb ? 20 : 12,
          paddingTop: 8,
          shadowColor: colors.tabBarShadow,
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isIOS ? 0 : 1,
          shadowRadius: 16,
        },
        tabBarBackground: () =>
          isIOS ? (
            <BlurView
              intensity={85}
              tint={isDark ? 'dark' : 'extraLight'}
              style={[StyleSheet.absoluteFill, {
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.tabBarBorder,
              }]}
            />
          ) : (
            <View
              style={[StyleSheet.absoluteFill, {
                backgroundColor: colors.tabBar,
                borderTopWidth: StyleSheet.hairlineWidth,
                borderTopColor: colors.tabBarBorder,
                shadowColor: colors.primary,
                shadowOffset: { width: 0, height: -6 },
                shadowOpacity: 0.08,
                shadowRadius: 20,
              }]}
            />
          ),
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: 'Inter_600SemiBold',
          fontWeight: '600',
          marginTop: 0,
        },
        tabBarItemStyle: {
          paddingTop: 2,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: 'center' }}>
                <AnimatedTabIcon
                  name={tab.icon}
                  activeIcon={tab.activeIcon}
                  color={color}
                  focused={focused}
                />
                <TabDot focused={focused} color={color} />
              </View>
            ),
            tabBarLabel: () => null,
          }}
        />
      ))}
    </Tabs>
  );
}
