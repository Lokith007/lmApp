import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';

const FormFields = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  secureTextEntry,
  keyboardType,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = title.toLowerCase().includes('password');

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base font-semibold text-primary">{title}</Text>

      <View className="w-full h-16 px-4 border-2 border-primary bg-white rounded-2xl flex-row items-center">
        <TextInput
          className="flex-1 text-primary"
          value={value}
          placeholder={placeholder || `Enter ${title}`}
          placeholderTextColor="#a78bfa"
          onChangeText={handleChangeText}
          secureTextEntry={isPasswordField && !showPassword}
          keyboardType={keyboardType || 'default'}
          autoCapitalize="none"
          {...props}
        />
        {isPasswordField && (
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            className="ml-2"
          >
            <Icon
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#9333ea"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormFields;
