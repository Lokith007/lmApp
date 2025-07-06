// tabs/_layout.tsx
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/Feather'
import { Pressable, Animated } from 'react-native'
import React, { useRef } from 'react'
import { Ionicons } from '@expo/vector-icons';


export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#7c3aed', // Purple
        tabBarInactiveTintColor: '#9ca3af', // Gray
        tabBarStyle: {
          backgroundColor: '#ffffff', // White
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 70,
          paddingTop: 7
        },
        tabBarShowLabel: false,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Ionicons name="home" color={color} size={30}/>,
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: 'Cart',
          tabBarIcon: ({ color }) => <Ionicons name="cart" color={color} size={30}/>,
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          title: 'Reorder',
          tabBarIcon: ({ color }) => <Ionicons name="repeat" color={color} size={30}/>,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <Ionicons name="person" color={color} size={30}/>,
        }}
      />
    </Tabs>
  )
}
