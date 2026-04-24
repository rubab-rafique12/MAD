import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useState } from 'react';
import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

//section 2
function confirmAction(title, message, onConfirm) {
  if (Platform.OS === 'web') {
    if (window.confirm(`${title}\n\n${message}`)) {
      onConfirm();
    }
  } else {
    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Confirm', style: 'destructive', onPress: onConfirm },
    ]);
  }
}


//section 3
export default function SettingsScreen() {
  const { setThemeMode, logout, resetData } = useApp();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [notifs, setNotifs] = useState(true);


  //section 4
  const handleLogout = () => {
    confirmAction(
      'Sign Out',
      'Are you sure you want to sign out?',
      async () => {
        await logout();
        router.replace('/auth');
      }
    );
  };

  const handleReset = () => {
    confirmAction(
      'Reset All Data',
      '⚠️ This will delete ALL your data. This cannot be undone!',
      async () => {
        await resetData();
        router.replace('/auth');
      }
    );
  };


  // section 5
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : insets.bottom + 100 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* HEADER INSIDE SCROLL */}
        <LinearGradient
          colors={isDark ? ['#080B1A', '#1A1050'] : ['#3D1FA0', '#635BFF', '#9B8CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 + 12 : insets.top + 12 }]}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={24} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Settings</Text>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>


{/* section 6 */}
        <View style={styles.content}>
          {/* APPEARANCE SECTION */}
          <Text style={[styles.sectionTitle, { color: colors.primary }]}>APPEARANCE</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.settingItem}>
              <View style={[styles.iconBg, { backgroundColor: colors.primary + '20' }]}>
                <Ionicons name="moon-outline" size={22} color={colors.primary} />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  {isDark ? 'Dark theme active' : 'Light theme active'}
                </Text>
              </View>
              <Switch
                value={isDark}
                onValueChange={(val) => setThemeMode(val ? 'dark' : 'light')}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/*section 7  NOTIFICATIONS SECTION */}
          <Text style={[styles.sectionTitle, { color: '#FF6B6B', marginTop: 24 }]}>NOTIFICATIONS</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <View style={styles.settingItem}>
              <View style={[styles.iconBg, { backgroundColor: '#FF6B6B20' }]}>
                <Ionicons name="notifications-outline" size={22} color="#FF6B6B" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Push Notifications</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  Get updates about classes
                </Text>
              </View>
              <Switch
                value={notifs}
                onValueChange={setNotifs}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>

          {/* section 8 ACCOUNT SECTION */}
          <Text style={[styles.sectionTitle, { color: '#4ECDC4', marginTop: 24 }]}>ACCOUNT</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={() => router.push('/(tabs)/edit')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, { backgroundColor: '#4ECDC420' }]}>
                <Ionicons name="person-outline" size={22} color="#4ECDC4" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>Edit Profile</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  Update your information
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: colors.border }]}
              onPress={() => router.push('/(tabs)/courses')}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, { backgroundColor: '#4ECDC420' }]}>
                <Ionicons name="book-outline" size={22} color="#4ECDC4" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>My Courses</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  View enrolled courses
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color={colors.textMuted} />
            </TouchableOpacity>

            <View style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: colors.border }]}>
              <View style={[styles.iconBg, { backgroundColor: '#4ECDC420' }]}>
                <Ionicons name="information-circle-outline" size={22} color="#4ECDC4" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>App Version</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>v1.0.0</Text>
              </View>
            </View>
          </View>

          {/*  section 9 DANGER ZONE SECTION */}
          <Text style={[styles.sectionTitle, { color: '#EF4444', marginTop: 24 }]}>DANGER ZONE</Text>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: '#FECACA' }]}>
            <TouchableOpacity
              style={styles.settingItem}
              onPress={handleReset}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="trash-outline" size={22} color="#EF4444" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Reset All Data</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  Clear all saved data
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#EF4444" />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.settingItem, { borderTopWidth: 1, borderTopColor: '#FECACA' }]}
              onPress={handleLogout}
              activeOpacity={0.7}
            >
              <View style={[styles.iconBg, { backgroundColor: '#FEE2E2' }]}>
                <Ionicons name="log-out-outline" size={22} color="#EF4444" />
              </View>
              <View style={styles.settingContent}>
                <Text style={[styles.settingLabel, { color: '#EF4444' }]}>Sign Out</Text>
                <Text style={[styles.settingSubtitle, { color: colors.textMuted }]}>
                  Sign out of your account
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  content: { padding: 20 },
  sectionTitle: {
    fontSize: 12, fontWeight: '700', fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 12, marginLeft: 4,
  },
  card: { borderRadius: 16, borderWidth: 1, overflow: 'hidden', marginBottom: 16 },
  settingItem: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 14 },
  iconBg: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  settingContent: { flex: 1 },
  settingLabel: { fontSize: 16, fontWeight: '600', fontFamily: 'Inter_600SemiBold', marginBottom: 2 },
  settingSubtitle: { fontSize: 12, fontFamily: 'Inter_400Regular' },
});