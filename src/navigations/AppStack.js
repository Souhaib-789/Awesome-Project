import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import BottomTab from './BottomTab';
import Chat from '../screens/Chat/Chat';
import Home from '../screens/Home/Home';
import Reels from '../screens/Reels/Reels';
import Notifications from '../screens/Notifications/Notifications';

const Stack = createNativeStackNavigator();

const AppStack = () => {
  const headerShown = { headerShown: false };

  
  return (
    <Stack.Navigator initialRouteName="BottomTab">
      <Stack.Screen
        name="BottomTab"
        component={BottomTab}
        options={headerShown}
      />
      <Stack.Screen
        name="Chat"
        component={Chat}
        options={headerShown}
      />

      <Stack.Screen
        name="Home"
        component={Home}
        options={headerShown}
      />

          <Stack.Screen
        name="Reels"
        component={Reels}
        options={headerShown}
      />

       <Stack.Screen
        name="Notifications"
        component={Notifications}
        options={headerShown}
      />
    </Stack.Navigator>
  );
};

export default AppStack;
