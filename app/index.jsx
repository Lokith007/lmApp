import { View, ScrollView } from 'react-native';
import { Link, Redirect, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';
import { FIREBASE_AUTH } from '../FirebaseConfig';
import CustomButton from '../components/CustomButton';

export default function App() {
  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
      setUser(user);
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  if (initializing) return null;

  if (user) return <Redirect href="/home" />;

  return (
    <SafeAreaView className='bg-white h-full'>
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className='w-full justify-center items-center min-h-[85vh] px-4'>
          <Link href="/home">Home</Link>
          <CustomButton
            title="Continue with email"
            handlePress={() => router.push('/sign-in')}
            containerStyle="w-full mt-7"
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
