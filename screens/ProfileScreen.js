import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';

//section 2
const InfoRow = ({ icon, label, value, colors, accent }) => (
  <View style={[styles.infoRow, { borderBottomColor: colors.border }]}>
    <View style={[styles.infoIcon, { backgroundColor: (accent || colors.primary) + '15' }]}>
      <Ionicons name={icon} size={17} color={accent || colors.primary} />
    </View>
    <View style={styles.infoContent}>
      <Text style={[styles.infoLabel, { color: colors.textMuted }]}>{label}</Text>
      <Text style={[styles.infoValue, { color: colors.text }]}>{value || 'N/A'}</Text>
    </View>
  </View>
);
 

//section 3
export default function ProfileScreen() {
  const { student } = useApp();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.spring(slideAnim, { toValue: 0, tension: 50, friction: 8, useNativeDriver: true }),
    ]).start();
  }, []);

  const firstName = student?.name?.split(' ')[0] || 'Student';


  // section 4
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : insets.bottom + 120 }}
      >
        {/* HEADER INSIDE SCROLL — scrolls with content */}
        <LinearGradient
          colors={isDark ? ['#080B1A', '#1A1050'] : ['#3D1FA0', '#635BFF', '#9B8CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 + 12 : insets.top + 12 }]}
        >
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                router.push('/(tabs)/edit');
              }}
              style={styles.editBtn}
            >
              <Feather name="edit-2" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>



{/* section 5 */}
          <Animated.View
            style={[styles.profileCard, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
          >
            <View style={styles.profileCardLeft}>
              <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.avatarSmall}>
                <Text style={styles.avatarSmallText}>{firstName[0]}</Text>
              </LinearGradient>
              <View style={styles.profileCardInfo}>
                <Text style={styles.heroName}>{student?.name || 'Student'}</Text>
                <Text style={styles.heroEmail} numberOfLines={1}>{student?.email || ''}</Text>
                <View style={styles.heroBadge}>
                  <Ionicons name="school-outline" size={11} color="rgba(255,255,255,0.9)" />
                  <Text style={styles.heroBadgeText}>{student?.semester || '6th Semester'}</Text>
                </View>
              </View>
            </View>
            <View style={styles.profileBadge}>
              <Ionicons name="person-outline" size={24} color="rgba(255,255,255,0.9)" />
            </View>
          </Animated.View>
        </LinearGradient>

        {/* section 6(SCROLLABLE CONTENT )*/}
        <View style={styles.content}>
          <View style={styles.statsRow}>
            {[
              { label: 'Semester GPA', value: student?.gpa || '0.00', color: '#4F5BD5', icon: '📈' },
              { label: 'CGPA', value: student?.cgpa || '0.00', color: '#FF6B6B', icon: '🏆' },
              { label: 'Courses', value: String(student?.courses?.length || 7), color: '#10B981', icon: '📚' },
            ].map((item, i) => (
              <Animated.View
                key={i}
                style={[styles.statCard, { backgroundColor: item.color + '12', borderColor: item.color + '30', opacity: fadeAnim }]}
              >
                <Text style={styles.statIcon}>{item.icon}</Text>
                <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
                <Text style={[styles.statLabel, { color: colors.textMuted }]}>{item.label}</Text>
              </Animated.View>
            ))}
          </View>



    {/* section 7 (student information section) */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>STUDENT INFORMATION</Text>
          <Animated.View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.cardBorder, opacity: fadeAnim }]}>
            <InfoRow icon="person-outline" label="Full Name" value={student?.name} colors={colors} accent="#4F5BD5" />
            <InfoRow icon="card-outline" label="SAP ID" value={student?.sapId} colors={colors} accent="#FF6B6B" />
            <InfoRow icon="mail-outline" label="Email Address" value={student?.email} colors={colors} accent="#4ECDC4" />
            <InfoRow icon="school-outline" label="Current Semester" value={student?.semester} colors={colors} accent="#F59E0B" />
            <InfoRow icon="trending-up-outline" label="Semester GPA" value={student?.gpa} colors={colors} accent="#10B981" />
            <InfoRow icon="ribbon-outline" label="Cumulative GPA" value={student?.cgpa} colors={colors} accent="#8B5CF6" />
          </Animated.View>


{/* section 8  */}
          <TouchableOpacity
            onPress={() => router.push('/(tabs)/edit')}
            style={styles.editProfileBtn}
            activeOpacity={0.85}
          >
            <LinearGradient colors={['#4F5BD5', '#6C63FF']} style={styles.editProfileGrad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}>
              <Feather name="edit-2" size={16} color="#FFFFFF" />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerTop: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', marginBottom: 20,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  editBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  profileCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  profileCardLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  avatarSmall: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  avatarSmallText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  profileCardInfo: { flex: 1 },
  heroName: { fontSize: 15, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold', marginBottom: 1 },
  heroEmail: { fontSize: 11, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular', marginBottom: 5 },
  heroBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20,
    paddingVertical: 3, paddingHorizontal: 8, alignSelf: 'flex-start',
  },
  heroBadgeText: { fontSize: 10, color: 'rgba(255,255,255,0.9)', fontFamily: 'Inter_500Medium' },
  profileBadge: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center', justifyContent: 'center',
  },
  content: { padding: 20 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  statCard: {
    flex: 1, borderRadius: 14, padding: 12, alignItems: 'center', borderWidth: 1,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2,
  },
  statIcon: { fontSize: 18, marginBottom: 5 },
  statValue: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  statLabel: { fontSize: 10, fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 2 },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 10, marginLeft: 2,
  },
  infoCard: {
    borderRadius: 16, borderWidth: 1, marginBottom: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  infoRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  infoIcon: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  infoContent: { flex: 1 },
  infoLabel: { fontSize: 10, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 2 },
  infoValue: { fontSize: 14, fontFamily: 'Inter_500Medium', fontWeight: '500' },
  editProfileBtn: { borderRadius: 14, overflow: 'hidden' },
  editProfileGrad: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 15, gap: 8 },
  editProfileText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
});