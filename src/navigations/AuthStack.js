import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from '../screens/Authentication/Login';
import Signup from '../screens/Authentication/Signup';

const Stack = createNativeStackNavigator();

const AuthStack = () => {
  const headerShown = { headerShown: false };
  return (
    <Stack.Navigator initialRouteName={'Login'}>
      <Stack.Screen name="Login" component={Login} options={headerShown} />
      <Stack.Screen name="Signup" component={Signup} options={headerShown} />
    </Stack.Navigator>
  );
};

export default AuthStack;
