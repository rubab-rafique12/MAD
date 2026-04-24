import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/useTheme';

export default function GradientHeader({ title, subtitle, rightComponent, leftComponent }) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top;

  return (
    <LinearGradient
      colors={colors.primaryGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={[styles.header, { paddingTop: topPadding + 12 }]}
    >
      <View style={styles.headerContent}>
        <View style={styles.headerLeft}>
          {leftComponent}
          <View>
            {title ? <Text style={styles.title}>{title}</Text> : null}
            {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          </View>
        </View>
        {rightComponent ? <View style={styles.headerRight}>{rightComponent}</View> : null}
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
});
