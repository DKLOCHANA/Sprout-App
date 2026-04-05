/**
 * Main App Tab Layout
 */

import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/core/theme';
import { useDataSync } from '@shared/hooks';

export default function AppLayout() {
  // Initialize data sync when app layout mounts
  useDataSync({ syncOnMount: true, syncOnForeground: true });

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.secondary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'HOME',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'home' : 'home-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="growth"
        options={{
          title: 'GROWTH',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'stats-chart' : 'stats-chart-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="milestones"
        options={{
          title: 'MILESTONES',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'shield-checkmark' : 'shield-checkmark-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="memories"
        options={{
          title: 'MEMORIES',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'book' : 'book-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
      <Tabs.Screen
        name="activities"
        options={{
          href: null, // Hide from tab bar
        }}
      />
      <Tabs.Screen
        name="family-management"
        options={{
          href: null, // Hide from tab bar - accessed from Profile
        }}
      />
      <Tabs.Screen
        name="add-baby"
        options={{
          href: null, // Hide from tab bar - accessed from Family Management
        }}
      />
      <Tabs.Screen
        name="edit-baby"
        options={{
          href: null, // Hide from tab bar - accessed from Family Management
        }}
      />
      <Tabs.Screen
        name="babies"
        options={{
          title: 'PROFILE',
          tabBarIcon: ({ color, focused }) => (
            <Ionicons 
              name={focused ? 'person' : 'person-outline'} 
              size={24} 
              color={color} 
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.surface,
    borderTopWidth: 0,
    elevation: 0,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    height: 85,
    paddingTop: 8,
    paddingBottom: 8,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 4,
  },
});
