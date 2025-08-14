import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import { useMutation, gql } from '@apollo/client';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SIGN_UP = gql`
  mutation SignUp($email: String!, $password: String!) {
    signUp(email: $email, password: $password) {
      token
      userId
    }
  }
`;

export default function SignUp({ navigation, onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [signUp, { loading, error }] = useMutation(SIGN_UP, {
    onCompleted: async (data) => {
      await AsyncStorage.setItem('token', data.signUp.token);
      onLogin();
    },
  });

  return (
    <View style={{ padding: 20 }}>
      <Text>Sign Up</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={{ borderWidth: 1, marginBottom: 10 }} />
      <TextInput placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} style={{ borderWidth: 1, marginBottom: 10 }} />
      {error && <Text style={{ color: 'red' }}>{error.message}</Text>}
      <Button title={loading ? 'Loading...' : 'Sign Up'} onPress={() => signUp({ variables: { email, password } })} />
      <Button title="Go to Sign In" onPress={() => navigation.navigate('SignIn')} />
    </View>
  );
}
