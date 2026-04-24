import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export default function StatCard({ label, value, icon, gradientColors, delay = 0 }) {
  const { colors } = useTheme();
  const animVal = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.spring(animVal, {
      toValue: 1,
      delay,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, []);

  const scale = animVal.interpolate({ inputRange: [0, 1], outputRange: [0.8, 1] });
  const opacity = animVal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] });

  return (
    <Animated.View style={[styles.wrapper, { opacity, transform: [{ scale }] }]}>
      <LinearGradient
        colors={gradientColors || [colors.primary, colors.primaryLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <Text style={styles.icon}>{icon}</Text>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.label}>{label}</Text>
      </LinearGradient>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  card: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    minHeight: 100,
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    marginBottom: 6,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  label: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    textAlign: 'center',
  },
});
