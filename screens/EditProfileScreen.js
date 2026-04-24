import { Feather, Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useApp } from '../context/AppContext';
import { useTheme } from '../hooks/useTheme';
 //section 2

const InputField = ({ label, value, onChangeText, placeholder, keyboardType, colors }) => (
  <View style={styles.fieldWrapper}>
    <Text style={[styles.fieldLabel, { color: colors.textSecondary }]}>{label}</Text>
    <View style={[styles.inputContainer, { backgroundColor: colors.inputBg, borderColor: colors.border }]}>
      <TextInput
        style={[styles.input, { color: colors.text }]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType={keyboardType || 'default'}
      />
    </View>
  </View>
);
// section 3
export default function EditProfileScreen() {
  const { student, updateStudent } = useApp();
  const { colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [name, setName] = useState(student?.name || '');
  const [semester, setSemester] = useState(student?.semester || '');
  const [gpa, setGpa] = useState(student?.gpa || '');
  const [cgpa, setCgpa] = useState(student?.cgpa || '');
  const [email, setEmail] = useState(student?.email || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fadeAnim = new Animated.Value(0);
  useEffect(() => {
    Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }).start();
  }, []);
 // section 4 
  const handleSave = async () => {
    setSaving(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(r => setTimeout(r, 600));
    await updateStudent({ name, semester, gpa, cgpa, email });
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setSaving(false);
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      router.back();
    }, 1200);
  };

  //section 5
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 120 : insets.bottom + 110 }}
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
              <Feather name="arrow-left" size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <View style={{ width: 40 }} />
          </View>
        </LinearGradient>


                  {/* section 6 */}
        <View style={styles.content}>
          <View style={[styles.avatarSection, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <LinearGradient colors={['#FF6B6B', '#FF8E53']} style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{(name || 'S')[0].toUpperCase()}</Text>
            </LinearGradient> 
            <View style={styles.avatarInfo}>
              <Text style={[styles.avatarName, { color: colors.text }]}>{name || 'Student'}</Text>
              <Text style={[styles.avatarEmail, { color: colors.textSecondary }]}>{email}</Text>
            </View> 
            <View style={styles.editBadge}> 
              <Feather name="edit-2" size={14} color="#4F5BD5" />
            </View>
          </View>


              {/* section 7 */}
          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>PERSONAL INFORMATION</Text>
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <InputField label="Full Name" value={name} onChangeText={setName} placeholder="Enter your name" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InputField label="Email Address" value={email} onChangeText={setEmail} placeholder="Enter email" keyboardType="email-address" colors={colors} />
          </View>

          <Text style={[styles.sectionLabel, { color: colors.textMuted }]}>ACADEMIC INFORMATION</Text>
          <View style={[styles.formCard, { backgroundColor: colors.card, borderColor: colors.cardBorder }]}>
            <InputField label="Current Semester" value={semester} onChangeText={setSemester} placeholder="e.g. 6th Semester" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InputField label="Semester GPA" value={gpa} onChangeText={setGpa} placeholder="e.g. 3.85" keyboardType="decimal-pad" colors={colors} />
            <View style={[styles.divider, { backgroundColor: colors.border }]} />
            <InputField label="Cumulative GPA (CGPA)" value={cgpa} onChangeText={setCgpa} placeholder="e.g. 3.72" keyboardType="decimal-pad" colors={colors} />
          </View>


{/* section 8 */}
          <TouchableOpacity onPress={handleSave} disabled={saving} activeOpacity={0.85} style={styles.saveBtn}>
            <LinearGradient
              colors={saved ? ['#10B981', '#34D399'] : ['#4F5BD5', '#6C63FF']}
              style={styles.saveGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              
            >
              {saved ? (
                <>
                  <Ionicons name="checkmark-circle" size={20} color="#FFFFFF" />
                  <Text style={styles.saveText}>Saved!</Text>
                </>
              ) : saving ? (
                <Text style={styles.saveText}>Saving...</Text>
              ) : (
                <>
                  <Feather name="save" size={18} color="#FFFFFF" />
                  <Text style={styles.saveText}>Save Changes</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}



//section 9
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  content: { padding: 20 },
  avatarSection: {
    flexDirection: 'row', alignItems: 'center',
    borderRadius: 16, padding: 16, marginBottom: 24, borderWidth: 1, gap: 14,
  },
  avatarCircle: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  avatarText: { fontSize: 22, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
  avatarInfo: { flex: 1 },
  avatarName: { fontSize: 16, fontWeight: '700', fontFamily: 'Inter_700Bold' },
  avatarEmail: { fontSize: 12, fontFamily: 'Inter_400Regular', marginTop: 2 },
  editBadge: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#EEF0FF', alignItems: 'center', justifyContent: 'center',
  },
  sectionLabel: {
    fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold',
    textTransform: 'uppercase', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4,
  },
  formCard: {
    borderRadius: 16, borderWidth: 1, marginBottom: 20, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2,
  },
  divider: { height: 1, marginHorizontal: 16 },
  fieldWrapper: { padding: 16 },
  fieldLabel: { fontSize: 11, fontWeight: '600', fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  inputContainer: { borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, height: 44, justifyContent: 'center' },
  input: { fontSize: 15, fontFamily: 'Inter_400Regular' },
  saveBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 4 },
  saveGradient: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 16, gap: 8 },
  saveText: { fontSize: 16, fontWeight: '700', color: '#FFFFFF', fontFamily: 'Inter_700Bold' },
});