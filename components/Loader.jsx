// components/Loader.js
import React from 'react';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Loader({ text = 'Loading...', color = '#7c3aed', size = 'large' }) {
    return (
        <View className="flex-1 items-center justify-center bg-white">
            <ActivityIndicator size={size} color={color} />
            <Text className="mt-4 text-gray-600">{text}</Text>
        </View>
    );
}
