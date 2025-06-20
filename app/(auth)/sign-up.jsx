import { View, Text, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import FormFields from '../../components/FormFields';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { FIREBASE_AUTH, db } from '../../FirebaseConfig';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { doc, setDoc } from 'firebase/firestore';

const SignUp = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    regNumber: '',
    phoneNumber: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const auth = FIREBASE_AUTH;

  const Submit = async () => {
    const { name, email, password, regNumber, phoneNumber } = form;

    if (!name || !email || !password || !regNumber || !phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill in all the fields.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      const user = response.user;

      // Update displayName in Auth
      await updateProfile(user, { displayName: name });

      // Store user data in Firestore with UID
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid, // ✅ Added UID
        name,
        email,
        regNumber,
        phoneNumber,
        createdAt: new Date(),
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
    <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 16, paddingVertical: 24 }}
          keyboardShouldPersistTaps="handled"
        >
          <View>
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
                title="Registration Number"
                value={form.regNumber}
                handleChangeText={(e) => setForm({ ...form, regNumber: e })}
                otherStyles="mt-7"
                placeholder="Enter your reg number"
              />

              <FormFields
                title="Phone Number"
                value={form.phoneNumber}
                handleChangeText={(e) => setForm({ ...form, phoneNumber: e })}
                otherStyles="mt-7"
                placeholder="Enter your phone number"
                keyboard-type="phone-pad"
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
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
  );
};

export default SignUp;
