import { View, Text } from 'react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = FIREBASE_AUTH.currentUser;
    if (user) {
      setUserName(user.displayName || user.email); // Fallback to email if displayName is not set
    }
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      router.replace('/');
    } catch (error) {
      console.log("Sign-out error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      <View className="items-end">
        <CustomButton
          title="Sign Out"
          handlePress={handleSignOut}
          containerStyle="w-32 bg-primary"
          textStyles="text-sm"
        />
      </View>

      <View className="mt-10 items-center">
        <Text className="text-xl font-semibold text-primary">Welcome,</Text>
        <Text className="text-2xl font-bold text-primary mt-2">
          {userName || 'Guest'}
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;
