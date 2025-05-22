import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { colors } from '../utilities/colors';
import Icon, { IconTypes } from '../components/Icon';
import Home from '../screens/Home/Home';

const Tab = createBottomTabNavigator();

const BottomTab = ({ navigation }) => {
  const headerShown = { headerShown: false };

  return (
    <Tab.Navigator
      labeled={true}
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, size }) => {
          let image;
          let color = focused ? colors.PRIMARY : colors.GREY;
          if (route?.name == 'Home') {
            image = (
              <Icon type={IconTypes.AntDesign} name='home' color={color} size={25} />
            );
          }
          return image;
        },
        tabBarActiveTintColor: colors.PRIMARY,
        tabBarInactiveTintColor: colors.BLACK,
        tabBarStyle: {
          height: 60,
        },
        tabBarLabel: ({ focused, color }) => (
          <Text
            style={{
              bottom: 3,
              fontSize: 10,
              color: focused ? colors.PRIMARY : colors.GREY,
              textAlign: 'center',
              marginTop: 8,
            }}>
            {route?.name}
          </Text>
        ),
      })}
      >


      <Tab.Screen
        name="Home"
        component={Home}
        options={headerShown}
      />

    </Tab.Navigator>
  );
};

export default BottomTab;
