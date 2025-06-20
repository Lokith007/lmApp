import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

export default function RestaurantCard({ restaurant, index }) {
  const { id, name, admin, isOpen, logo } = restaurant;

  return (
    <Link href={`/restaurants/${id}`} asChild>
      <TouchableOpacity className="w-44 mr-4">
        <Image
          source={{ uri: logo }}
          className="w-44 h-28 rounded-xl"
          resizeMode="cover"
        />

        <View className="mt-2">
          <Text className="text-base font-semibold" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-xs text-gray-500">{admin}</Text>
          <Text className="text-xs">
            {isOpen ? 'Open now' : 'Closed'}
          </Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
}
