import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../../components/CustomButton';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';

const Profile = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut(FIREBASE_AUTH);
      console.log("User signed out");
      router.replace('/'); // 👈 navigate to root layout (like tabs)

      // You can navigate back to login screen if needed
    } catch (error) {
      console.log("Sign-out error:", error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white px-4 pt-6">
      {/* Sign Out Button Top Right */}
      <View className="items-end">
        <CustomButton
          title="Sign Out"
          handlePress={handleSignOut}
          containerStyle="w-32 bg-purple-600"
          textStyles="text-sm"
        />
      </View>

      {/* Profile Info */}
      <View className="mt-10 items-center">
        <Text className="text-xl font-semibold text-purple-700">Welcome to your Profile</Text>
        {/* Add more user info here if needed */}
      </View>
    </SafeAreaView>
  );
};

export default Profile;
