import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
import StatCard from '../components/StatCard';


//section 2
const QuickActionButton = ({ icon, label, onPress, color }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const press = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.93, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 100, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };
  return (
    <Animated.View style={{ transform: [{ scale }], flex: 1 }}>
      <TouchableOpacity onPress={press} activeOpacity={0.9} style={[styles.qaBtn, { backgroundColor: color + '20' }]}>
        <View style={[styles.qaIcon, { backgroundColor: color + '30' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={[styles.qaLabel, { color }]}>{label}</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

//section 3
export default function HomeScreen() {
  const { student, theme, toggleTheme } = useApp();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollY = useRef(new Animated.Value(0)).current;
  const headerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(headerAnim, { toValue: 1, useNativeDriver: true, tension: 40, friction: 7 }).start();
  }, []);

  const headerTranslate = scrollY.interpolate({ inputRange: [0, 100], outputRange: [0, -10], extrapolate: 'clamp' });
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const firstName = student?.name?.split(' ')[0] || 'Student';


  // section 4
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        scrollEventThrottle={16}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : insets.bottom + 140 }}
      >
        <LinearGradient
          colors={isDark ? ['#080B1A', '#1A1050'] : ['#3D1FA0', '#635BFF', '#9B8CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 + 12 : insets.top + 12 }]}
        >
          <Animated.View style={[styles.headerRow, { opacity: headerAnim, transform: [{ translateY: headerAnim.interpolate({ inputRange: [0, 1], outputRange: [-20, 0] }) }] }]}>
            <View style={styles.headerLeft}>
              <Text style={styles.greeting}>{greeting()},</Text>
              <Text style={styles.studentName}>{firstName} 👋</Text>
            </View>
            <View style={styles.headerRight}>
              <Switch
                value={isDark}
                onValueChange={toggleTheme}
                trackColor={{ false: 'rgba(255,255,255,0.3)', true: '#6C63FF' }}
                thumbColor="#FFFFFF"
              />
              <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={styles.avatarBtn}>
                {student?.profilePicture ? (
                  <Image source={{ uri: student.profilePicture }} style={styles.avatar} />
                ) : (
                  <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarText}>{firstName[0]}</Text>
                  </LinearGradient>
                )}
              </TouchableOpacity>
            </View>
          </Animated.View>


{/* section 5 */}
          <View style={styles.profileCard}>
            <View style={styles.profileInfo}>
              <Text style={styles.sapLabel}>SAP ID</Text>
              <Text style={styles.sapValue}>{student?.sapId || 'SAPID55565'}</Text>
              <Text style={styles.semesterText}>{student?.semester || '6th Semester'}</Text>
            </View>
            <View style={styles.profileBadge}>
              <Ionicons name="school-outline" size={28} color="rgba(255,255,255,0.9)" />
            </View>
          </View>
        </LinearGradient>


{/* section 6 */}
        <View style={styles.statsSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Academic Performance</Text>
          <View style={styles.statsRow}>
            <StatCard label="Semester GPA" value={student?.gpa || '0.00'} icon="📊" gradientColors={['#4F5BD5', '#7B87E8']} delay={100} />
            <View style={{ width: 12 }} />
            <StatCard label="Cumulative GPA" value={student?.cgpa || '0.00'} icon="🏆" gradientColors={['#FF6B6B', '#FF8E53']} delay={200} />
          </View>
          <View style={[styles.statsRow, { marginTop: 12 }]}>
            <StatCard label="Courses" value={String(student?.courses?.length || 7)} icon="📚" gradientColors={['#4ECDC4', '#44A08D']} delay={300} />
            <View style={{ width: 12 }} />
            <StatCard label="Semester" value={student?.semester?.replace(' Semester', '') || '6th'} icon="🎓" gradientColors={['#F59E0B', '#FCD34D']} delay={400} />
          </View>
        </View>


{/* section 7 */}
        <View style={styles.quickActions}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Quick Actions</Text>
          <View style={styles.qaRow}>
            <QuickActionButton icon="book-outline" label="Courses" color="#4F5BD5" onPress={() => router.push('/(tabs)/courses')} />
            <QuickActionButton icon="person-outline" label="Profile" color="#10B981" onPress={() => router.push('/(tabs)/profile')} />
            <QuickActionButton icon="create-outline" label="Edit" color="#F59E0B" onPress={() => router.push('/(tabs)/edit')} />
            <QuickActionButton icon="settings-outline" label="Settings" color="#EC4899" onPress={() => router.push('/(tabs)/settings')} />
          </View>
        </View>


{/* section 8 */}
        <View style={styles.recentCourses}>
          <View style={styles.rowHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Recent Courses</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/courses')}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See All</Text>
            </TouchableOpacity>
          </View>
          {(student?.courses || []).slice(0, 3).map((course, idx) => {
            const colors2 = [['#4F5BD5', '#7B87E8'], ['#FF6B6B', '#FF8E8E'], ['#4ECDC4', '#6EE7E0']];
            const g = colors2[idx % colors2.length];
            return (
              <TouchableOpacity
                key={course.id}
                onPress={() => router.push({ pathname: '/(tabs)/courses', params: { selected: course.id } })}
                activeOpacity={0.85}
              >
                <Animated.View style={[styles.miniCourse, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
                  <LinearGradient colors={g} style={styles.miniCourseAccent} />
                  <View style={styles.miniCourseInfo}>
                    <Text style={[styles.miniCourseName, { color: colors.text }]} numberOfLines={1}>{course.name}</Text>
                    <Text style={[styles.miniCourseTime, { color: colors.textSecondary }]}>{course.timings}</Text>
                  </View>
                  <Feather name="chevron-right" size={16} color={colors.textMuted} />
                </Animated.View>
              </TouchableOpacity>
            );
          })}
        </View>
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  greeting: { fontSize: 14, color: 'rgba(255,255,255,0.75)', fontFamily: 'Inter_400Regular' },
  studentName: { fontSize: 24, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  avatarBtn: { width: 42, height: 42, borderRadius: 21, overflow: 'hidden', borderWidth: 2, borderColor: 'rgba(255,255,255,0.5)' },
  avatar: { width: 42, height: 42 },
  avatarPlaceholder: { width: 42, height: 42, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
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
  profileInfo: {},
  sapLabel: { fontSize: 11, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular', textTransform: 'uppercase', letterSpacing: 1 },
  sapValue: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  semesterText: { fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter_400Regular', marginTop: 2 },
  profileBadge: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsSection: { paddingHorizontal: 20, paddingTop: 24 },
  statsRow: { flexDirection: 'row' },
  sectionTitle: { fontSize: 18, fontWeight: '700', fontFamily: 'Inter_700Bold', marginBottom: 14 },
  quickActions: { paddingHorizontal: 20, paddingTop: 24 },
  qaRow: { flexDirection: 'row', gap: 10 },
  qaBtn: { borderRadius: 16, padding: 14, alignItems: 'center', gap: 8 },
  qaIcon: { width: 42, height: 42, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  qaLabel: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textAlign: 'center' },
  recentCourses: { paddingHorizontal: 20, paddingTop: 24 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  seeAll: { fontSize: 13, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  miniCourse: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    marginBottom: 10,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  miniCourseAccent: { width: 5, height: '100%', minHeight: 60 },
  miniCourseInfo: { flex: 1, paddingHorizontal: 14, paddingVertical: 12 },
  miniCourseName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold' },
  miniCourseTime: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
});