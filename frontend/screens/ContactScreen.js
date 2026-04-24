import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { globalStyles } from '../globalStyles';
import { FontAwesome } from '@expo/vector-icons';

export default function ContactScreen({ goToHome }) {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const advisors = [
    { name: 'Dr. Sarah Ahmed', dept: 'CS Advisor' },
    { name: 'Prof. John Smith', dept: 'Academic Counselor' },
  ];

  const [selectedAdvisor, setSelectedAdvisor] = useState(0);

  const handleSubmit = () => {
    if (!email || !subject || !message) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    Alert.alert(
      'Message Sent ✅',
      `Your message has been sent to ${advisors[selectedAdvisor].name}.`,
      [{ text: 'OK' }]
    );
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <ScrollView 
      style={globalStyles.container} 
      contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 15 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={globalStyles.title}>Contact Advisor</Text>

      {/* Advisor Selection */}
      <View style={globalStyles.card}>
        <Text style={globalStyles.subtitle}>Select Advisor</Text>
        <View style={[globalStyles.row, { marginVertical: 10 }]}>
          {advisors.map((advisor, index) => (
            <TouchableOpacity
              key={index}
              style={[
                globalStyles.button,
                { 
                  flex: 1, 
                  marginHorizontal: 5,
                  backgroundColor: selectedAdvisor === index ? '#3498DB' : '#BDC3C7'
                }
              ]}
              onPress={() => setSelectedAdvisor(index)}
            >
              <Text style={[globalStyles.buttonText, { fontSize: 14 }]}>
                {advisor.name.split(' ')[1]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={[globalStyles.text, { marginTop: 5, fontStyle: 'italic', color: '#555' }]}>
          {advisors[selectedAdvisor].dept}
        </Text>
      </View>

      {/* Message Inputs */}
      <View style={globalStyles.card}>
        <View style={[globalStyles.iconRow, { marginBottom: 10 }]}>
          <FontAwesome name="envelope" size={20} color="#3498DB" />
          <TextInput
            style={[globalStyles.input, { flex: 1, marginLeft: 10 }]}
            placeholder="Your email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />
        </View>

        <View style={[globalStyles.iconRow, { marginBottom: 10 }]}>
          <FontAwesome name="tag" size={20} color="#3498DB" />
          <TextInput
            style={[globalStyles.input, { flex: 1, marginLeft: 10 }]}
            placeholder="Subject"
            placeholderTextColor="#666"
            value={subject}
            onChangeText={setSubject}
          />
        </View>

        <View style={[globalStyles.iconRow, { marginBottom: 10 }]}>
          <FontAwesome name="comment" size={20} color="#3498DB" />
          <TextInput
            style={[globalStyles.input, { flex: 1, marginLeft: 10, height: 120, textAlignVertical: 'top' }]}
            placeholder="Your message..."
            placeholderTextColor="#666"
            value={message}
            onChangeText={setMessage}
            multiline
          />
        </View>
      </View>

      {/* Submit Button (modern look) */}
      <TouchableOpacity 
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#27AE60',
          paddingVertical: 15,
          borderRadius: 25,
          marginVertical: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5
        }}
        onPress={handleSubmit}
      >
        <FontAwesome name="send" size={22} color="#FFF" />
        <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '600', marginLeft: 10 }}>
          Send Message
        </Text>
      </TouchableOpacity>

      {/* Back Button */}
      <TouchableOpacity 
        style={globalStyles.secondaryButton}
        onPress={goToHome}
      >
        <Text style={globalStyles.secondaryButtonText}>← Back to Home</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}