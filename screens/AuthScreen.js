// import React, { useState, useRef, useEffect } from 'react';
// import {
//   View, Text, TextInput, TouchableOpacity, StyleSheet,
//   Alert, ActivityIndicator, StatusBar, Animated,
//   ScrollView, useWindowDimensions
// } from 'react-native';
import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  Alert, ActivityIndicator, StatusBar, Animated,
  ScrollView, useWindowDimensions,
  KeyboardAvoidingView, Platform
} from 'react-native';
import { auth } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';

export default function AuthScreen({ navigation }) {
  // Login state ( store)
  const { height } = useWindowDimensions();
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginEmailError, setLoginEmailError] = useState('');
  const [loginPasswordError, setLoginPasswordError] = useState('');
  
  // Signup state(store)
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [signupEmailError, setSignupEmailError] = useState('');
  const [signupPasswordError, setSignupPasswordError] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [activeMode, setActiveMode] = useState('login');
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
// run animation 
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Email validation function
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateLoginEmail = (email) => {
    setLoginEmail(email);
    if (email.length > 0 && !isValidEmail(email)) {
      setLoginEmailError('❌ Invalid email format. Use: name@example.com');
    } else {
      setLoginEmailError('');
    }
  };

  const validateLoginPassword = (password) => {
    setLoginPassword(password);
    if (password.length > 0 && password.length < 6) {
      setLoginPasswordError('❌ Password must be at least 6 characters');
    } else {
      setLoginPasswordError('');
    }
  };

  const validateSignupEmail = (email) => {
    setSignupEmail(email);
    if (email.length > 0 && !isValidEmail(email)) {
      setSignupEmailError('❌ Invalid email format. Use: name@example.com');
    } else {
      setSignupEmailError('');
    }
  };

  const validateSignupPassword = (password) => {
    setSignupPassword(password);
    if (password.length > 0 && password.length < 6) {
      setSignupPasswordError('❌ Password must be at least 6 characters');
    } else {
      setSignupPasswordError('');
    }
  };

  const handleLogin = async () => {
    console.log("🔵 LOGIN ATTEMPT - Email:", loginEmail);
    
    // Email validation
    if (!loginEmail || !loginPassword) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    
    if (!isValidEmail(loginEmail)) {
      Alert.alert('❌ Invalid Email', 'Please enter a valid email address.\nExample: name@example.com');
      setLoginEmailError('❌ Invalid email format. Use: name@example.com');
      return;
    }
    
    if (loginPassword.length < 6) {
      Alert.alert('❌ Invalid Password', 'Password must be at least 6 characters long.');
      setLoginPasswordError('❌ Password must be at least 6 characters');
      return;
    }
// Firebase function to login existing user
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
      console.log("✅ LOGIN SUCCESS:", userCredential.user.email);
      // Navigation happens automatically via App.js's onAuthStateChanged
    } catch (error) {
      console.log("❌ LOGIN ERROR:", error.code);
     if (
        error.code === 'auth/user-not-found' ||
        error.code === 'auth/invalid-credential' ||
        error.code === 'auth/invalid-credentials'
      ) {
         Alert.alert('⚠️ Account Not Found', 'No account found with this email. Please sign up first.');
        switchToSignup();
        setSignupEmail(loginEmail);
      } else if (error.code === 'auth/wrong-password') {
       Alert.alert('❌ Wrong Password', 'Incorrect password. Please try again.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('❌ Invalid Email', 'Please enter a valid email address.');
        setLoginEmailError('❌ Invalid email format. Use: name@example.com');
      } else {
        Alert.alert('❌ Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async () => {
    console.log("🟢 SIGNUP ATTEMPT - Email:", signupEmail);
    
    // Email validation
    if (!signupEmail || !signupPassword) {
      Alert.alert('❌ Error', 'Please fill all fields');
      return;
    }
    
    if (!isValidEmail(signupEmail)) {
      Alert.alert('❌ Invalid Email', 'Please enter a valid email address.\nExample: name@example.com');
      setSignupEmailError('❌ Invalid email format. Use: name@example.com');
      return;
    }
    
    if (signupPassword.length < 6) {
      Alert.alert('❌ Invalid Password', 'Password must be at least 6 characters long.');
      setSignupPasswordError('❌ Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      console.log("✅ SIGNUP SUCCESS:", userCredential.user.email);
      
      // Show success message with Go to Login button
      Alert.alert(
        '✅ Signup Successful!',
          `Account created for ${signupEmail}!\n\nYou can now login with your credentials.`,
           [{
          text: 'Login Now',
          onPress: () => {
            setActiveMode('login');
            setLoginEmail(signupEmail);
            setLoginPassword('');
            setLoginEmailError('');
            setLoginPasswordError('');
            setSignupEmail('');
            setSignupPassword('');
            setSignupEmailError('');
            setSignupPasswordError('');
          }
        }]
      );
      
    } catch (error) {
      console.log("❌ SIGNUP ERROR:", error.code);
      if (error.code === 'auth/email-already-in-use') {
        Alert.alert('⚠️ Error', 'Email already registered.\nPlease login instead.');
      } else if (error.code === 'auth/invalid-email') {
        Alert.alert('❌ Invalid Email', 'Please enter a valid email address.');
        setSignupEmailError('❌ Invalid email format. Use: name@example.com');
      } else if (error.code === 'auth/weak-password') {
        Alert.alert('❌ Invalid Password', 'Password is too weak. Use at least 6 characters.');
        setSignupPasswordError('❌ Password must be at least 6 characters');
      } else {
        Alert.alert('❌ Error', error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const switchToLogin = () => {
    setActiveMode('login');
    setLoginEmail(''); setLoginPassword('');
    setLoginEmailError(''); setLoginPasswordError('');
  };

  const switchToSignup = () => {
    setActiveMode('signup');
    setSignupEmail(''); setSignupPassword('');
    setSignupEmailError(''); setSignupPasswordError('');
  };

  return (
    // <View style={styles.container}>
    //   <StatusBar barStyle="light-content" />
      
    //   <AnimatedGradientBackground />
      
    //   <ScrollView
    //     style={{ height }}
    //     contentContainerStyle={styles.scrollContent}
    //     keyboardShouldPersistTaps="handled"
    //     bounces={false}
    //     showsVerticalScrollIndicator={false}
    //   >

    <View style={styles.container}>
  <StatusBar barStyle="light-content" />
  
  <AnimatedGradientBackground />
  
  <KeyboardAvoidingView
    style={{ flex: 1 }}
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={0}
  >
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      keyboardShouldPersistTaps="handled"
      bounces={false}
      showsVerticalScrollIndicator={false}
    >
        <Animated.View 
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [
                { translateY: slideAnim },
                { scale: scaleAnim }
              ]
            }
          ]}
        >
          {/* Logo - R */}
          <View style={styles.logoContainer}>
            <Animated.View style={[styles.logoCircle, { transform: [{ scale: scaleAnim }] }]}>
              <Text style={styles.logoText}>R</Text>
            </Animated.View>
            <Text style={styles.logoSubtext}>MAD ASSIGNMENT 2</Text>
          </View>

          {/* Mode Selection Buttons */}
          <View style={styles.modeButtonRow}>
            <TouchableOpacity 
              style={[
                styles.modeButton,
                activeMode === 'login' && styles.modeButtonActive
              ]}
              onPress={switchToLogin}
            >
              <Text style={[
                styles.modeButtonText,
                activeMode === 'login' && styles.modeButtonTextActive
              ]}>LOGIN</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.modeButton,
                activeMode === 'signup' && styles.modeButtonActive
              ]}
              onPress={switchToSignup}
            >
              <Text style={[
                styles.modeButtonText,
                activeMode === 'signup' && styles.modeButtonTextActive
              ]}>SIGNUP</Text>
            </TouchableOpacity>
          </View>

          {activeMode === 'login' ? (
            <>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email ID</Text>
                <TextInput
                  style={[styles.input, loginEmailError ? styles.inputError : null]}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={loginEmail}
                  onChangeText={validateLoginEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {loginEmailError ? <Text style={styles.errorText}>{loginEmailError}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.passwordContainer, loginPasswordError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password (min 6 characters)"
                    placeholderTextColor="#999"
                    value={loginPassword}
                    onChangeText={validateLoginPassword}
                    secureTextEntry={!showLoginPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowLoginPassword(!showLoginPassword)}
                    style={styles.eyeIcon}
                  >
                    <Text style={styles.eyeIconText}>
                      {showLoginPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {loginPasswordError ? <Text style={styles.errorText}>{loginPasswordError}</Text> : null}
              </View>

              {/* Remember Me */}
              <View style={styles.rowContainer}>
                <TouchableOpacity 
                  style={styles.checkboxContainer} 
                  onPress={() => setRememberMe(!rememberMe)}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                    {rememberMe && <Text style={styles.checkmark}>✓</Text>}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#7B2D8E" style={styles.loader} />
              ) : (
                <TouchableOpacity style={styles.actionButton} onPress={handleLogin}>
                  <Text style={styles.actionButtonText}>LOGIN</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <>
              {/* Email Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Email ID</Text>
                <TextInput
                  style={[styles.input, signupEmailError ? styles.inputError : null]}
                  placeholder="Enter your email"
                  placeholderTextColor="#999"
                  value={signupEmail}
                  onChangeText={validateSignupEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
                {signupEmailError ? <Text style={styles.errorText}>{signupEmailError}</Text> : null}
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>Password</Text>
                <View style={[styles.passwordContainer, signupPasswordError ? styles.inputError : null]}>
                  <TextInput
                    style={styles.passwordInput}
                    placeholder="Enter your password (min 6 characters)"
                    placeholderTextColor="#999"
                    value={signupPassword}
                    onChangeText={validateSignupPassword}
                    secureTextEntry={!showSignupPassword}
                  />
                  <TouchableOpacity 
                    onPress={() => setShowSignupPassword(!showSignupPassword)}
                    style={styles.eyeIcon}
                  >
                    <Text style={styles.eyeIconText}>
                      {showSignupPassword ? '👁️' : '👁️‍🗨️'}
                    </Text>
                  </TouchableOpacity>
                </View>
                {signupPasswordError ? <Text style={styles.errorText}>{signupPasswordError}</Text> : null}
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#7B2D8E" style={styles.loader} />
              ) : (
                <TouchableOpacity style={styles.actionButton} onPress={handleSignup}>
                  <Text style={styles.actionButtonText}>SIGNUP</Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </Animated.View>
      </ScrollView>
       </KeyboardAvoidingView>
    </View>
  );
}

// Animated Gradient Background Component
const AnimatedGradientBackground = () => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 4000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 4000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, []);

  const backgroundColor = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#6B2D8E', '#8B3DAE', '#5B1D7E'],
  });

  const backgroundColor2 = animatedValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: ['#8B3DAE', '#9B4DBE', '#7B2D8E'],
  });

  return (
    <Animated.View style={[styles.gradientBackground, { backgroundColor }]}>
      <Animated.View style={[styles.circle1, { backgroundColor: backgroundColor2 }]} />
      <Animated.View style={[styles.circle2, { backgroundColor: backgroundColor2 }]} />
      <Animated.View style={[styles.circle3, { backgroundColor: backgroundColor2 }]} />
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  circle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    top: -80,
    right: -80,
    opacity: 0.4,
  },
  circle2: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    bottom: 50,
    left: -100,
    opacity: 0.35,
  },
  circle3: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    bottom: -50,
    right: 20,
    opacity: 0.3,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingVertical: 40,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 24,
    marginHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 25,
    elevation: 15,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#7B2D8E',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#7B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  logoText: {
    fontSize: 44,
    fontWeight: 'bold',
    color: 'white',
  },
  logoSubtext: {
    fontSize: 12,
    color: '#7B2D8E',
    marginTop: 8,
    fontWeight: '600',
    letterSpacing: 1,
  },
  modeButtonRow: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 30,
    padding: 4,
    marginBottom: 25,
  },
  modeButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: '#7B2D8E',
    shadowColor: '#7B2D8E',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#888',
  },
  modeButtonTextActive: {
    color: 'white',
  },
  inputWrapper: {
    marginBottom: 18,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginLeft: 4,
  },
  input: {
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#eee',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 5,
    marginLeft: 4,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  passwordInput: {
    flex: 1,
    padding: 14,
    fontSize: 15,
  },
  eyeIcon: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  eyeIconText: {
    fontSize: 20,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 8,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#7B2D8E',
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxChecked: {
    backgroundColor: '#7B2D8E',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  rememberText: {
    fontSize: 13,
    color: '#666',
  },
  actionButton: {
    backgroundColor: '#7B2D8E',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    shadowColor: '#7B2D8E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loader: {
    marginVertical: 20,
  },
});