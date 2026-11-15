import { Stack } from 'expo-router';
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { FavoritesProvider } from '../context/FavoritesContext';

export default function RootLayout() {
  const appState = useRef(AppState.currentState);

  // Assignment Requirement: AppState Event Listener (Background -> Foreground)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (
        appState.current?.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the FOREGROUND! Refreshing event feeds...');
      }

      appState.current = nextAppState;
      console.log('Current AppState:', appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <FavoritesProvider>
      <Stack screenOptions={{ headerShown: false }}>
        {/* Tabs navigation  */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        
        {/* Event Details Screen */}
        <Stack.Screen 
          name="details/[id]" 
          options={{ 
            headerShown: true, 
            title: 'Event Details',
            headerBackTitle: 'Back',
            headerStyle: { backgroundColor: '#1e293b' },
            headerTintColor: '#ffffff',
          }} 
        />
      </Stack>
    </FavoritesProvider>
  );
}