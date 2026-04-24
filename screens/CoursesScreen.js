//Section 1
import { Feather, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
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
const COURSE_ICONS = ['code-slash', 'server', 'hardware-chip', 'git-network', 'construct', 'bulb', 'globe'];
//section 3
function CourseCard({ course, index, onPress, colors, gradients }) {
  const scale = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: 1, delay: index * 80, useNativeDriver: true, tension: 50, friction: 7 }),
      Animated.timing(opacity, { toValue: 1, delay: index * 80, duration: 300, useNativeDriver: true }),
    ]).start();
  }, []);

  const gradient = gradients[index % gradients.length];
  const icon = COURSE_ICONS[index % COURSE_ICONS.length];

  const handlePressIn = () => {
    setPressed(true);
    Animated.spring(scale, { toValue: 0.97, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    setPressed(false);
    Animated.spring(scale, { toValue: 1, useNativeDriver: true }).start();
  };

  return (
    <Animated.View style={{ opacity, transform: [{ scale }] }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
          <LinearGradient colors={gradient} style={styles.cardGradientBar} />
          <View style={styles.cardBody}>
            <View style={styles.cardTop}>
              <LinearGradient colors={gradient} style={styles.courseIconCircle}>
                <Ionicons name={icon} size={20} color="#FFFFFF" />
              </LinearGradient>
              <View style={styles.cardTitleBlock}>
                <Text style={[styles.courseCode, { color: gradient[0] }]}>{course.code}</Text>
                <Text style={[styles.courseName, { color: colors.text }]} numberOfLines={2}>{course.name}</Text>
              </View>
            </View>
            <View style={[styles.cardDivider, { backgroundColor: colors.border }]} />
            <View style={styles.cardMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>{course.timings}</Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="person-outline" size={13} color={colors.textMuted} />
                <Text style={[styles.metaText, { color: colors.textSecondary }]} numberOfLines={1}>{course.instructor}</Text>
              </View>
            </View>
          </View>
          <View style={styles.cardArrow}>
            <Feather name="chevron-right" size={16} color={gradient[0]} />
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

//section 4

function CourseDetailModal({ course, visible, onClose, colors, isDark, gradient }) {
  const slideAnim = useRef(new Animated.Value(600)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }).start();
    } else {
      Animated.timing(slideAnim, { toValue: 600, duration: 250, useNativeDriver: true }).start();
    }
  }, [visible]);

  if (!course) return null;

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onClose}>
      <TouchableOpacity style={styles.modalOverlay} onPress={onClose} activeOpacity={1} />
      <Animated.View style={[styles.modalSheet, { backgroundColor: colors.surface, transform: [{ translateY: slideAnim }] }]}>
        <LinearGradient colors={gradient || ['#4F5BD5', '#6C63FF']} style={styles.modalHeader}>
          <View style={styles.modalDrag} />
          <View style={styles.modalHeaderContent}>
            <Text style={styles.modalCode}>{course.code}</Text>
            <Text style={styles.modalTitle}>{course.name}</Text>
          </View>
          <TouchableOpacity onPress={onClose} style={styles.modalClose}>
            <Feather name="x" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </LinearGradient>

        <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
          {[
            { icon: 'time-outline', label: 'Schedule', value: course.timings },
            { icon: 'person-outline', label: 'Instructor', value: course.instructor },
            { icon: 'location-outline', label: 'Room', value: course.room },
            { icon: 'ribbon-outline', label: 'Credit Hours', value: `${course.credits} Credits` },
          ].map((item, i) => (
            <View key={i} style={                                                                                                                   [styles.detailRow, { borderBottomColor: colors.border }]}>
              <View style={[styles.detailIcon, { backgroundColor: (gradient?.[0] || '#4F5BD5') + '20' }]}>
                <Ionicons name={item.icon} size={18} color={gradient?.[0] || '#4F5BD5'} />
              </View>
              <View style={styles.detailContent}>
                <Text style={[styles.detailLabel, { color: colors.textMuted }]}>{item.label}</Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>{item.value}</Text>
              </View>
            </View>
          ))}
        </ScrollView>
      </Animated.View>
    </Modal>
  );
}

//section 5
export default function CoursesScreen() {
  const { student } = useApp();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
//2
  const gradients = isDark
    ? [['#C0392B', '#E74C3C'], ['#2C3E8C', '#4F5BD5'], ['#1A7A75', '#4ECDC4'], ['#D48806', '#F59E0B'], ['#0A7A55', '#10B981'], ['#6D28D9', '#8B5CF6'], ['#BE185D', '#EC4899']]
    : [['#FF6B6B', '#FF8E8E'], ['#4F5BD5', '#7B87E8'], ['#4ECDC4', '#6EE7E0'], ['#F59E0B', '#FCD34D'], ['#10B981', '#34D399'], ['#8B5CF6', '#A78BFA'], ['#EC4899', '#F472B6']];
//3
  const openCourse = (course, idx) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCourse({ ...course, _idx: idx });
    setModalVisible(true);
  };

  const courses = student?.courses || [];//4

  return ( //5
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView //6
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : insets.bottom + 120 }}
      >
        {/* HEADER INSIDE SCROLL */}
        <LinearGradient //6
          colors={isDark ? ['#080B1A', '#1A1050'] : ['#3D1FA0', '#635BFF', '#9B8CFF']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: Platform.OS === 'web' ? 67 + 12 : insets.top + 12 }]}
        > 
          <View style={styles.headerRow}> 
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity> 
            <View>
              <Text style={styles.headerTitle}>Enrolled Courses</Text>
              <Text style={styles.headerSub}>{courses.length} courses this semester</Text>
            </View>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>

        <View style={styles.courseList}>
          {courses.map((course, idx) => (
            <CourseCard
              key={course.id}
              course={course}
              index={idx}
              onPress={() => openCourse(course, idx)}
              colors={colors}
              gradients={gradients}
            />
          ))}
        </View>
      </ScrollView>

      <CourseDetailModal
        course={selectedCourse}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        colors={colors}
        isDark={isDark}
        gradient={selectedCourse ? gradients[selectedCourse._idx % gradients.length] : null}
      />
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
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold', textAlign: 'center' },
  headerSub: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_400Regular', textAlign: 'center', marginTop: 2 },
  courseList: { padding: 16 },
  card: {
    borderRadius: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center',
    borderWidth: 1, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardGradientBar: { width: 5, alignSelf: 'stretch' },
  cardBody: { flex: 1, padding: 14 },
  cardTop: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  courseIconCircle: { width: 44, height: 44, borderRadius: 12, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitleBlock: { flex: 1 },
  courseCode: { fontSize: 11, fontWeight: '700', fontFamily: 'Inter_700Bold', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 },
  courseName: { fontSize: 14, fontWeight: '600', fontFamily: 'Inter_600SemiBold', lineHeight: 20 },
  cardDivider: { height: StyleSheet.hairlineWidth, marginVertical: 10 },
  cardMeta: { gap: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 12, fontFamily: 'Inter_400Regular', flex: 1 },
  cardArrow: { paddingRight: 14 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalSheet: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    borderTopLeftRadius: 24, borderTopRightRadius: 24,
    maxHeight: '70%', overflow: 'hidden',
  },
  modalDrag: {
    width: 36, height: 4, borderRadius: 2,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignSelf: 'center', marginTop: 10, marginBottom: 16,
  },
  modalHeader: { paddingHorizontal: 20, paddingBottom: 20 },
  modalHeaderContent: { flex: 1 },
  modalCode: { fontSize: 12, color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold', lineHeight: 26 },
  modalClose: {
    position: 'absolute', top: 16, right: 16,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  modalBody: { padding: 16 },
  detailRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    paddingVertical: 14, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  detailIcon: { width: 38, height: 38, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  detailValue: { fontSize: 14, fontFamily: 'Inter_500Medium', fontWeight: '500' },
});