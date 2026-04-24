import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { globalStyles } from '../globalStyles';
import { FontAwesome } from '@expo/vector-icons';

export default function ProfileScreen({ goToHome }) {
  const [name, setName] = useState('Rubab');
  const [major, setMajor] = useState('CS');
  const [gpa, setGpa] = useState('3.8');
  const [courses, setCourses] = useState([]);

  const courseOptions = [
    { name: 'DSA', grade: 'A+' },
    { name: 'HCL', grade: 'B+' },
    { name: 'TOA', grade: 'A' },
    { name: 'ML', grade: 'A-' },
  ];

  const addCourse = () => {
    if (courses.length < courseOptions.length) {
      setCourses([...courses, courseOptions[courses.length]]);
    } else {
      Alert.alert('All courses added', 'You have already added all predefined courses.');
    }
  };

  const handleSave = () => {
    Alert.alert("Profile Updated", "Your profile has been saved successfully!");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView 
        style={globalStyles.container}
        contentContainerStyle={{ paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.title}>Student Profile</Text>

        {/* Profile Info */}
        <View style={[globalStyles.card, { alignItems: 'center' }]}>
          <Image 
  source={{ uri: 'https://wallpapers.com/images/hd/cute-girly-girl-bzfsgbj67yc5tzdz.jpg' }}
  style={{ width: 120, height: 120, borderRadius: 60, marginVertical: 10 }}
/>

          <View style={{ width: '100%' }}>
            <View style={globalStyles.iconRow}>
              <FontAwesome name="user" size={18} color="#3498DB" style={{ marginRight: 10 }} />
              <TextInput
                style={[globalStyles.input, { flex: 1, color: '#000' }]}
                placeholder="Full Name"
                placeholderTextColor="#aaa"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={globalStyles.iconRow}>
              <FontAwesome name="graduation-cap" size={18} color="#3498DB" style={{ marginRight: 10 }} />
              <TextInput
                style={[globalStyles.input, { flex: 1, color: '#000' }]}
                placeholder="Major"
                placeholderTextColor="#aaa"
                value={major}
                onChangeText={setMajor}
              />
            </View>

            <View style={globalStyles.iconRow}>
              <FontAwesome name="star" size={18} color="#3498DB" style={{ marginRight: 10 }} />
              <TextInput
                style={[globalStyles.input, { flex: 1 }]}
                placeholder="Target GPA"
                placeholderTextColor="#aaa"
                value={gpa}
                onChangeText={setGpa}
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        {/* Courses */}
        <View style={globalStyles.card}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={globalStyles.subtitle}>Courses</Text>
            <TouchableOpacity onPress={addCourse}>
              <FontAwesome name="plus-circle" size={28} color="#3498DB" />
            </TouchableOpacity>
          </View>

          {courses.length === 0 ? (
            <Text style={globalStyles.text}>No courses added yet</Text>
          ) : (
            courses.map((course, index) => (
              <View key={index} style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
                <Text style={[globalStyles.text, { fontWeight: '600', fontSize: 16 }]}>{course.name}</Text>
                <Text style={[globalStyles.text, { fontWeight: '600', color: '#E67E22', fontSize: 16 }]}>{course.grade}</Text>
              </View>
            ))
          )}
        </View>

        {/* Academic Summary */}
        <View style={globalStyles.card}>
          <Text style={globalStyles.subtitle}>Academic Summary</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text style={globalStyles.text}>👤 Name:</Text>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>{name}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text style={globalStyles.text}>🎓 Major:</Text>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>{major}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text style={globalStyles.text}>📊 GPA:</Text>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>{gpa}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
            <Text style={globalStyles.text}>📚 Courses:</Text>
            <Text style={[globalStyles.text, { fontWeight: 'bold' }]}>{courses.length}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Buttons Row (fixed at bottom) */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 }}>
        <TouchableOpacity 
          style={globalStyles.secondaryButton}
          onPress={goToHome}
        >
          <Text style={globalStyles.secondaryButtonText}>← Back to Home</Text>
        </TouchableOpacity>

        
      </View>
    </View>
  );
}