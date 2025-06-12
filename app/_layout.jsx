import { Stack } from "expo-router";
import "./globals.css"
import Toast from 'react-native-toast-message';
export default function Layout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown : false }}/>
        <Stack.Screen name="(auth)" options={{ headerShown : false }}/>
        <Stack.Screen name="(tabs)" options={{ headerShown : false }}/>
        <Toast />

    </Stack>
);
}
