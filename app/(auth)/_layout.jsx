import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from './sign-in';
import SignUp from './sign-up';

const Stack = createNativeStackNavigator();

export default function AuthStack({ onLogin }) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn">
        {props => <SignIn {...props} onLogin={onLogin} />}
      </Stack.Screen>
      <Stack.Screen name="SignUp">
        {props => <SignUp {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
