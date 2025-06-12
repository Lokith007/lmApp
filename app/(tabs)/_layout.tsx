// tabs/_layout.tsx
import { Tabs } from 'expo-router'
import Icon from 'react-native-vector-icons/Feather'
import { Pressable, Animated } from 'react-native'
import React, { useRef } from 'react'

const AnimatedIcon = ({ name, color }: { name: string; color: string }) => {
  const scale = useRef(new Animated.Value(1)).current

  const handlePressIn = () => {
    Animated.spring(scale, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start()
  }

  const handlePressOut = () => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start()
  }

  return (
    <Pressable onPressIn={handlePressIn} onPressOut={handlePressOut}>
      <Animated.View style={{ transform: [{ scale }] }}>
        <Icon name={name} color={color} size={24} />
      </Animated.View>
    </Pressable>
  )
}

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
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 12,
        },
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <AnimatedIcon name="home" color={color} />,
        }}
      />
      <Tabs.Screen
        name="food"
        options={{
          title: 'Food',
          tabBarIcon: ({ color }) => <AnimatedIcon name="shopping-bag" color={color} />,
        }}
      />
      <Tabs.Screen
        name="reorder"
        options={{
          title: 'Reorder',
          tabBarIcon: ({ color }) => <AnimatedIcon name="repeat" color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <AnimatedIcon name="user" color={color} />,
        }}
      />
    </Tabs>
  )
}
