import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormFields from '../../components/FormFields';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH } from '../../FirebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Toast from 'react-native-toast-message';

const SignIn = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = FIREBASE_AUTH;

  const Submit = async () => {
    setIsSubmitting(true);
    try {
      const response = await signInWithEmailAndPassword(auth, form.email, form.password);
      Toast.show({ type: 'success', text1: 'Signed In Successfully!' });
      router.replace('/home');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Sign In Failed', text2: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Text className="text-2xl font-bold text-center text-primary mb-4">Login to Grabit</Text>
          <FormFields
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboard-type="email-address"
          />
          <FormFields
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
            secureTextEntry
          />
          <CustomButton title="Sign In" isLoading={isSubmitting} handlePress={Submit} containerStyle="mt-7" />
          <View className="flex-row justify-center mt-5">
            <Text>Don't have an account?</Text>
            <Link href="/sign-up" className="text-primary font-semibold ml-1">Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
