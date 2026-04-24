import { Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useApp } from '../context/AppContext';

export default function IndexScreen() {
  const { isLoggedIn, isLoading } = useApp();

  if (isLoading) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1A1D3A' }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (isLoggedIn) {
    return <Redirect href="/(tabs)/" />;
  }

  return <Redirect href="/auth" />;
}
