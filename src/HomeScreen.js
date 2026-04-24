import React from 'react';
import { ScrollView, View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import ModalFormik from './ModalFormik';

// ===== ASSIGNMENT: FORMS IMPLEMENTATION =====
// Task: Implement 3 different form patterns
// 1. Form using Props
// 2. Form using Destructuring
// 3. Form using Formik in Modal

// REQUIREMENT 1: Form via Props Pattern
const FormViaProps = (props) => {
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    age: ''
  });
  
  const handleSubmit = () => {
    if (!formData.name || !formData.email || !formData.age) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    
    // Using props to pass data back to parent
    if (props.onSubmit) {
      props.onSubmit(formData);
    } else {
      Alert.alert('Form Submitted (Props)', `Name: ${formData.name}\nEmail: ${formData.email}\nAge: ${formData.age}`);
    }
    
    // Reset form
    setFormData({ name: '', email: '', age: '' });
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <View style={styles.formContainer}>
      <Text style={styles.formTitle}>{props.title || 'Form via Props'}</Text>
      <Text style={styles.formDescription}>This form receives all data through props object</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={formData.name}
        onChangeText={(value) => handleInputChange('name', value)}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={formData.email}
        onChangeText={(value) => handleInputChange('email', value)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Age"
        value={formData.age}
        onChangeText={(value) => handleInputChange('age', value)}
        keyboardType="numeric"
      />
      
      <Button 
        title="Submit (Props Pattern)" 
        onPress={handleSubmit}
        color={props.buttonColor || '#007AFF'}
      />
    </View>
  );
};

// REQUIREMENT 2: Form via Destructuring Pattern
const FormViaDestructuring = ({ title, themeColor, onSubmit, fields }) => {
  const [formData, setFormData] = React.useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  
  const handleSubmit = () => {
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      Alert.alert('Validation Error', 'Please fill all fields');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Validation Error', 'Passwords do not match');
      return;
    }
    
    // Using destructured props
    if (onSubmit) {
      onSubmit(formData);
    } else {
      Alert.alert('Form Submitted (Destructuring)', `Username: ${formData.username}\nPassword: ${'*'.repeat(formData.password.length)}`);
    }
    
    // Reset form
    setFormData({ username: '', password: '', confirmPassword: '' });
  };
  
  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  return (
    <View style={[styles.formContainer, { borderLeftColor: themeColor || '#FF6B35' }]}>
      <Text style={[styles.formTitle, { color: themeColor || '#FF6B35' }]}>
        {title || 'Form via Destructuring'}
      </Text>
      <Text style={styles.formDescription}>This form uses destructured props: {`{title, themeColor, onSubmit, fields}`}</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={formData.username}
        onChangeText={(value) => handleInputChange('username', value)}
        autoCapitalize="none"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={formData.password}
        onChangeText={(value) => handleInputChange('password', value)}
        secureTextEntry={true}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => handleInputChange('confirmPassword', value)}
        secureTextEntry={true}
      />
      
      <Button 
        title="Submit (Destructuring Pattern)" 
        onPress={handleSubmit}
        color={themeColor || '#FF6B35'}
      />
    </View>
  );
};

export default function HomeScreen({ navigation }) {
  const handlePropsFormSubmit = (data) => {
    Alert.alert('Props Form Data', JSON.stringify(data, null, 2));
  };
  
  const handleDestructuringFormSubmit = (data) => {
    Alert.alert('Destructuring Form Data', JSON.stringify(data, null, 2));
  };
  
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: () => navigation.navigate('Login'),
          style: 'destructive',
        },
      ]
    );
  };
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.header}>
        <Text style={styles.mainTitle}>📝 Forms Assignment</Text>
        <Text style={styles.subtitle}>Three Different Form Implementation Patterns</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>🚪 Logout</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView style={styles.scrollContainer}>
        {/* FORM 1: Props Pattern */}
        <FormViaProps 
          title="1️⃣ Form via Props Pattern"
          buttonColor="#007AFF"
          onSubmit={handlePropsFormSubmit}
        />
        
        {/* FORM 2: Destructuring Pattern */}
        <FormViaDestructuring 
          title="2️⃣ Form via Destructuring Pattern"
          themeColor="#FF6B35"
          onSubmit={handleDestructuringFormSubmit}
          fields={['username', 'password', 'confirmPassword']}
        />

        {/* FORM 3: Formik in Modal Pattern */}
        <ModalFormik />
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>Assignment Complete ✅</Text>
          <Text style={styles.footerSubtext}>All three form patterns implemented</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#667eea',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  mainTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#e0e7ff',
    fontStyle: 'italic',
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 25,
    padding: 12,
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
  },
  formContainer: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderLeftWidth: 5,
    borderLeftColor: '#007AFF',
  },
  formTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  formDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f8f9fa',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  footerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#27ae60',
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
  },
});