import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useApp } from '../context/AppContext';

const { width, height } = Dimensions.get('window');
//section 2
function FloatingOrb({ style, delay, size }) {//1
  const floatY = useRef(new Animated.Value(0)).current;//2
  const floatX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {//3
    const loopY = Animated.loop(
      Animated.sequence([
        Animated.timing(floatY, { toValue: -20, duration: 3000, delay, useNativeDriver: true }),
        Animated.timing(floatY, { toValue: 10, duration: 3000, useNativeDriver: true }),
      ])
    );
    const loopX = Animated.loop(
      Animated.sequence([
        Animated.timing(floatX, { toValue: 12, duration: 4000, delay: delay + 500, useNativeDriver: true }),
        Animated.timing(floatX, { toValue: -8, duration: 4000, useNativeDriver: true }),
      ])
    );
    const loopOpacity = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 0.6, duration: 2500, delay, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.2, duration: 2500, useNativeDriver: true }),
      ])
    );
    loopY.start();//4
    loopX.start();
    loopOpacity.start();
    return () => { loopY.stop(); loopX.stop(); loopOpacity.stop(); };
  }, []);

  return (
    <Animated.View//5
      style={[style, { opacity, transform: [{ translateY: floatY }, { translateX: floatX }] }]}
      pointerEvents="none"
    >
      <View style={{
        width: size, height: size, borderRadius: size / 2,
        backgroundColor: 'rgba(155, 140, 255, 0.25)',
        borderWidth: 1, borderColor: 'rgba(155, 140, 255, 0.4)',
      }} />
    </Animated.View>
  );
}
//section 3
export default function AuthScreen() {
  const { login, signup } = useApp();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoAnim = useRef(new Animated.Value(0)).current;
  const formAnim = useRef(new Animated.Value(0)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;
  const toggleAnim = useRef(new Animated.Value(0)).current;

//section 4


  useEffect(() => {
    Animated.sequence([
      Animated.timing(logoAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.parallel([
        Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
        Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true }),
      ]),
      Animated.timing(formAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(logoPulse, { toValue: 1.06, duration: 1800, useNativeDriver: true }),
        Animated.timing(logoPulse, { toValue: 1, duration: 1800, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const switchMode = () => {
    Animated.timing(toggleAnim, {
      toValue: isLogin ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setIsLogin(!isLogin);
    setError('');
    setEmail('');
    setPassword('');
    setName('');
  };

//Section 5

  const handleSubmit = async () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    setError('Please enter a valid email address');
    return;
  }
    if (!isLogin && !name.trim()) {
      setError('Please enter your name');
      return;
    }
    setLoading(true);
    setError('');
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      let result;
      if (isLogin) {
        result = await login(email.trim(), password.trim());
      } else {
        result = await signup(email.trim(), password.trim(), name.trim());
      }
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        router.replace('/(tabs)/');
      } else {
        setError(result.error || 'Something went wrong');
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (e) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

//section 6

  const logoScale = logoAnim.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0.3, 1.1, 1] });
  const logoOpacity = logoAnim.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.5, 1] });
//section  7

  return (
    <LinearGradient
      colors={['#08092E', '#1A1060', '#3D1FA0', '#635BFF']}
      style={StyleSheet.absoluteFill}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
    >
      <FloatingOrb style={{ position: 'absolute', top: height * 0.08, left: -40 }} delay={0} size={160} />
      <FloatingOrb style={{ position: 'absolute', top: height * 0.35, right: -50 }} delay={800} size={200} />
      <FloatingOrb style={{ position: 'absolute', bottom: height * 0.15, left: 20 }} delay={1600} size={120} />
      
    
      
      <KeyboardAvoidingView //section 8
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView
          contentContainerStyle={[styles.scroll, { paddingTop: Platform.OS === 'web' ? 67 : insets.top + 20, paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 20 }]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >

    

          <Animated.View style={[styles.logoSection, { opacity: logoOpacity, transform: [{ scale: logoScale }] }]}>
            <View style={styles.logoCircle}>  
              <Animated.View style={{ transform: [{ scale: logoPulse }] }}>
                <LinearGradient
                  colors={['#9B8CFF', '#635BFF', '#4A44CC']}
                  style={styles.logoBg}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                > 
                  <Ionicons name="school" size={44} color="#FFFFFF" />
                </LinearGradient>
              </Animated.View>
            </View>
            <Text style={styles.appName}>UniPortal</Text>
            <Text style={styles.tagline}>Your Academic Companion</Text>
          </Animated.View>
                  
          <Animated.View style={[styles.card, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
            <View style={styles.tabRow}> 
              <TouchableOpacity //section 10 ( animation.view)
                onPress={() => !isLogin && switchMode()}
                style={[styles.tab, isLogin && styles.tabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, isLogin && styles.tabTextActive]}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
           
                onPress={() => isLogin && switchMode()}
                style={[styles.tab, !isLogin && styles.tabActive]}
                activeOpacity={0.8}
              >
                <Text style={[styles.tabText, !isLogin && styles.tabTextActive]}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            

            <Animated.View style={{ opacity: formAnim }}> 
              {!isLogin && ( //section 11
                <View style={styles.inputContainer}>
                  <View style={styles.inputIcon}>
                    <Feather name="user" size={18} color="#635BFF" />
                  </View>
                  <TextInput
                    style={styles.input}
                    placeholder="Full Name"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              )}

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="mail" size={18} color="#635BFF" />
                </View>
                <TextInput
                  style={styles.input}
                  placeholder="Email Address"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputContainer}>
                <View style={styles.inputIcon}>
                  <Feather name="lock" size={18} color="#635BFF" />
                </View>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Password"
                  placeholderTextColor="#9CA3AF"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeBtn}>
                  <Feather name={showPassword ? 'eye-off' : 'eye'} size={18} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              {error ? ( //section 12
                <View style={styles.errorBox}>
                  <Feather name="alert-circle" size={14} color="#EF4444" />
                  <Text style={styles.errorText}>{error}</Text>
                </View>
              ) : null}

              <TouchableOpacity //section 13
                style={styles.submitBtn}
                onPress={handleSubmit}
                activeOpacity={0.8}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4A44CC', '#635BFF', '#9B8CFF']}
                  style={styles.submitGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <Text style={styles.submitText}>Please wait...</Text>
                  ) : (
                    <>
                      <Text style={styles.submitText}>{isLogin ? 'Login' : 'Create Account'}</Text>
                      <Feather name="arrow-right" size={18} color="#FFFFFF" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.switchRow}>
                <Text style={styles.switchText}>
                  {isLogin ? "Don't have an account? " : 'Already have an account? '}
                </Text>
                <TouchableOpacity onPress={switchMode}>
                  <Text style={styles.switchLink}>{isLogin ? 'Sign Up' : 'Login'}</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    minHeight: height,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 36,
  },
  logoCircle: {
    shadowColor: '#6C63FF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 12,
    marginBottom: 16,
  },
  logoBg: {
    width: 90,
    height: 90,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 34,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.65)',
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 16,
  },
  tabRow: {
    flexDirection: 'row',
    backgroundColor: '#F0F4FF',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#635BFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9CA3AF',
    fontFamily: 'Inter_500Medium',
  },
  tabTextActive: {
    color: '#635BFF',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 14,
    paddingHorizontal: 14,
    height: 52,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#1A1D3A',
    fontFamily: 'Inter_400Regular',
  },
  eyeBtn: {
    padding: 4,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    gap: 6,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    fontFamily: 'Inter_400Regular',
    flex: 1,
  },
  submitBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginTop: 8,
    marginBottom: 16,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    gap: 8,
  },
  submitText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: 'Inter_700Bold',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  switchText: {
    fontSize: 13,
    color: '#6B7280',
    fontFamily: 'Inter_400Regular',
  },
  switchLink: {
    fontSize: 13,
    color: '#4F5BD5',
    fontWeight: '700',
    fontFamily: 'Inter_700Bold',
  },
});



