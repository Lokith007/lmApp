import { View, ScrollView, StatusBar } from 'react-native';
import { Link, Redirect  , router} from 'expo-router';
import "./globals.css"
import { SafeAreaView } from 'react-native-safe-area-context';
import CustomButton from '../components/CustomButton';
export default function App() {
    return (
        <SafeAreaView className='bg-white h-full '>
            <ScrollView contentContainerStyle={{ height: '100%' }}>
                <View className='w-full justify-center items-center min-h-[85vh] px-4 '>
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

