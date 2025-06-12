import { TouchableOpacity, Text } from 'react-native'
import React from 'react'
import { ActivityIndicator } from 'react-native'
const CustomButton = ({ title, handlePress, containerStyle, textStyles, isLoading }) => {
    return (
        <TouchableOpacity
            onPress={handlePress}
            activeOpacity={0.7}

            className={`bg-purple-500 rounded-xl min-h-[62px] justify-center items-center ${containerStyle}  ${isLoading ? 'opacity-50' : ''}`}>
            {isLoading ? (
                <ActivityIndicator color="#fff" />
            ) : (
                <Text className={`text-white font-semibold text-lg ${textStyles}`}>{title}</Text>
            )}
        </TouchableOpacity>
    )
}

export default CustomButton