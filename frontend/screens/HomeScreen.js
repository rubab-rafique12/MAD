import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, Dimensions, ScrollView } from 'react-native';
import { globalStyles } from '../globalStyles';
import { FontAwesome } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function HomeScreen({ goToProfile, goToSettings, goToContact }) {
  const [gpa, setGpa] = useState(3.8);
  const [courses, setCourses] = useState(5);

  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500' }}
      style={[globalStyles.container, { padding: 0 }]}
      imageStyle={{ opacity: 0.15 }}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'space-between' }}>
        {/* App Title */}
        <Text style={[globalStyles.title, { fontSize: 32, textAlign: 'center', marginBottom: 20 }]}>
          📚 GradeTracker
        </Text>

        {/* GPA Card */}
        <View style={{
          backgroundColor: '#3498DB',
          borderRadius: 20,
          padding: 25,
          alignItems: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 10,
          marginBottom: 20
        }}>
          <Text style={[globalStyles.gpaText, { fontSize: 42, fontWeight: 'bold', color: '#fff' }]}>{gpa}</Text>
          <Text style={[globalStyles.gpaLabel, { color: '#fff', fontSize: 18, marginTop: 5 }]}>Current GPA</Text>
          <Text style={{ color: '#fff', marginTop: 8, fontSize: 16 }}>{courses} Courses Enrolled</Text>
        </View>

        {/* Quick Stats */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 }}>
          <View style={{
            flex: 1,
            backgroundColor: '#fff',
            marginRight: 5,
            borderRadius: 15,
            paddingVertical: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5
          }}>
            <FontAwesome name="book" size={28} color="#3498DB" />
            <Text style={[globalStyles.text, { marginTop: 8 }]}>Credits: 15</Text>
          </View>
 
          <View style={{
            flex: 1,
            backgroundColor: '#fff',
            marginLeft: 5,
            borderRadius: 15,
            paddingVertical: 20,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 5 },
            shadowOpacity: 0.1,
            shadowRadius: 10,
            elevation: 5
          }}>
            <FontAwesome name="clock-o" size={28} color="#3498DB" />
            <Text style={[globalStyles.text, { marginTop: 8 }]}>Week 12</Text>
          </View>
        </View>

        {/* Navigation Buttons */}
        <Text style={[globalStyles.subtitle, { marginBottom: 10, fontSize: 20, fontWeight: '600' }]}>Quick Access</Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginRight: 5,
              borderRadius: 20,
              paddingVertical: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5
            }}
            onPress={goToProfile}
          >
            <FontAwesome name="user-graduate" size={30} color="#3498DB" />
            <Text style={[globalStyles.text, { marginTop: 8 }]}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginHorizontal: 5,
              borderRadius: 20,
              paddingVertical: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5
            }}
            onPress={goToSettings}
          >
            <FontAwesome name="gear" size={30} color="#3498DB" />
            <Text style={[globalStyles.text, { marginTop: 8 }]}>Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: '#fff',
              marginLeft: 5,
              borderRadius: 20,
              paddingVertical: 20,
              alignItems: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.1,
              shadowRadius: 10,
              elevation: 5
            }}
            onPress={goToContact}
          >
            <FontAwesome name="envelope" size={30} color="#3498DB" />
            <Text style={[globalStyles.text, { marginTop: 8 }]}>Contact</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </ImageBackground>
  );
}