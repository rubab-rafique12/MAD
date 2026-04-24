import React, { useState } from 'react';
import { View, Modal, TextInput, Button, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Formik } from 'formik';

// ===== REQUIREMENT 3: Formik in Modal =====
// This demonstrates advanced form handling with Formik library in a modal

// Simple validation function instead of Yup
const validateForm = (values) => {
  const errors = {};
  
  if (!values.fullName) {
    errors.fullName = 'Full name is required';
  } else if (values.fullName.length < 2) {
    errors.fullName = 'Name too short (min 2 characters)';
  }
  
  if (!values.email) {
    errors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = 'Invalid email format';
  }
  
  if (!values.phone) {
    errors.phone = 'Phone is required';
  } else if (!/^[0-9]{11}$/.test(values.phone)) {
    errors.phone = 'Phone must be 11 digits';
  }
  
  if (!values.address) {
    errors.address = 'Address is required';
  } else if (values.address.length < 5) {
    errors.address = 'Address too short (min 5 characters)';
  }
  
  if (!values.agreeTerms) {
    errors.agreeTerms = 'You must agree to terms';
  }
  
  return errors;
};

export default function ModalFormik() {
  const [visible, setVisible] = useState(false);
  const [submittedData, setSubmittedData] = useState(null);

  const handleFormikSubmit = (values, { resetForm }) => {
    // Show submitted data
    Alert.alert(
      'Formik Form Submitted! 🎉',
      `Name: ${values.fullName}\nEmail: ${values.email}\nPhone: ${values.phone}\nAddress: ${values.address}`,
      [
        {
          text: 'OK',
          onPress: () => {
            setSubmittedData(values);
            resetForm();
            setVisible(false);
          }
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.triggerButtonContainer}>
        <Text style={styles.modalTitle}>3️⃣ Formik in Modal Pattern</Text>
        <Text style={styles.modalDescription}>Advanced form with validation using Formik library</Text>
        <Button 
          title="🚀 Open Formik Modal" 
          color="#27ae60" 
          onPress={() => setVisible(true)} 
        />
      </View>

      <Modal 
        visible={visible} 
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalHeaderTitle}>📝 Registration Form (Formik)</Text>
            <Text style={styles.modalHeaderSubtitle}>Complete the form below</Text>
          </View>
          
          <ScrollView style={styles.formContainer}>
            <Formik
              initialValues={{
                fullName: '',
                email: '',
                phone: '',
                address: '',
                agreeTerms: false
              }}
              validate={validateForm}
              onSubmit={handleFormikSubmit}
            >
              {({ 
                handleChange, 
                handleBlur, 
                handleSubmit, 
                values, 
                errors, 
                touched, 
                setFieldValue 
              }) => (
                <View>
                  {/* Full Name Field */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Full Name *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.fullName && errors.fullName && styles.inputError
                      ]}
                      placeholder="Enter your full name"
                      onChangeText={handleChange('fullName')}
                      onBlur={handleBlur('fullName')}
                      value={values.fullName}
                    />
                    {touched.fullName && errors.fullName && (
                      <Text style={styles.errorText}>{errors.fullName}</Text>
                    )}
                  </View>

                  {/* Email Field */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Email Address *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.email && errors.email && styles.inputError
                      ]}
                      placeholder="Enter your email"
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      value={values.email}
                      keyboardType="email-address"
                      autoCapitalize="none"
                    />
                    {touched.email && errors.email && (
                      <Text style={styles.errorText}>{errors.email}</Text>
                    )}
                  </View>

                  {/* Phone Field */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Phone Number *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        touched.phone && errors.phone && styles.inputError
                      ]}
                      placeholder="03xxxxxxxxx (11 digits)"
                      onChangeText={handleChange('phone')}
                      onBlur={handleBlur('phone')}
                      value={values.phone}
                      keyboardType="numeric"
                      maxLength={11}
                    />
                    {touched.phone && errors.phone && (
                      <Text style={styles.errorText}>{errors.phone}</Text>
                    )}
                  </View>

                  {/* Address Field */}
                  <View style={styles.fieldContainer}>
                    <Text style={styles.fieldLabel}>Address *</Text>
                    <TextInput
                      style={[
                        styles.input,
                        styles.textArea,
                        touched.address && errors.address && styles.inputError
                      ]}
                      placeholder="Enter your complete address"
                      onChangeText={handleChange('address')}
                      onBlur={handleBlur('address')}
                      value={values.address}
                      multiline
                      numberOfLines={3}
                    />
                    {touched.address && errors.address && (
                      <Text style={styles.errorText}>{errors.address}</Text>
                    )}
                  </View>

                  {/* Terms Checkbox */}
                  <View style={styles.checkboxContainer}>
                    <Button
                      title={values.agreeTerms ? "✅ Agree to Terms" : "☐ Agree to Terms"}
                      onPress={() => setFieldValue('agreeTerms', !values.agreeTerms)}
                      color={values.agreeTerms ? '#27ae60' : '#95a5a6'}
                    />
                    {touched.agreeTerms && errors.agreeTerms && (
                      <Text style={styles.errorText}>{errors.agreeTerms}</Text>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.buttonContainer}>
                    <Button 
                      title="🎯 Submit Form" 
                      onPress={handleSubmit}
                      color="#27ae60"
                    />
                    <Button 
                      title="❌ Cancel" 
                      onPress={() => setVisible(false)}
                      color="#e74c3c"
                    />
                  </View>
                </View>
              )}
            </Formik>
          </ScrollView>
        </View>
      </Modal>

      {/* Show submitted data if available */}
      {submittedData && (
        <View style={styles.submittedDataContainer}>
          <Text style={styles.submittedDataTitle}>✅ Last Submitted Data:</Text>
          <Text style={styles.submittedDataText}>
            {JSON.stringify(submittedData, null, 2)}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  triggerButtonContainer: {
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
    borderLeftColor: '#27ae60',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  modalDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  modalHeader: {
    backgroundColor: '#27ae60',
    padding: 20,
    paddingTop: 50,
  },
  modalHeaderTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 5,
  },
  modalHeaderSubtitle: {
    fontSize: 16,
    color: '#ecf0f1',
  },
  formContainer: {
    flex: 1,
    padding: 20,
  },
  fieldContainer: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#2c3e50',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e1e8ed',
    borderRadius: 8,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: '#e74c3c',
    borderWidth: 2,
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 12,
    marginTop: 5,
  },
  checkboxContainer: {
    marginBottom: 30,
  },
  buttonContainer: {
    gap: 15,
    marginTop: 20,
  },
  submittedDataContainer: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  submittedDataTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#155724',
    marginBottom: 10,
  },
  submittedDataText: {
    fontSize: 12,
    color: '#155724',
    fontFamily: 'monospace',
  },
});