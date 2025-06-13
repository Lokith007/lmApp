import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormFields from '../../components/FormFields';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Toast from 'react-native-toast-message';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = FIREBASE_AUTH;

  const Submit = async () => {
    if (!form.name || !form.email || !form.password) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all the fields.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, form.email, form.password);

      await updateProfile(auth.currentUser, {
        displayName: form.name,
      });

      Toast.show({ type: 'success', text1: 'Account Created Successfully!' });
      router.replace('/home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Sign Up Failed',
        text2: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl font-bold text-center text-purple-600 mb-4">
            Create Account on Grabit
          </Text>

          <FormFields
            title="Name"
            value={form.name}
            handleChangeText={(e) => setForm({ ...form, name: e })}
            otherStyles="mt-4"
            placeholder="Enter your name"
          />

          <FormFields
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            placeholder="Enter your email"
            keyboard-type="email-address"
          />

          <FormFields
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            placeholder="Enter your password"
            secureTextEntry
          />

          <CustomButton
            title="Sign Up"
            isLoading={isSubmitting}
            handlePress={Submit}
            containerStyle="mt-7"
          />

          <View className="flex-row justify-center mt-5">
            <Text>Already have an account?</Text>
            <Link href="/sign-in" className="text-purple-500 font-semibold ml-1">
              Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;
