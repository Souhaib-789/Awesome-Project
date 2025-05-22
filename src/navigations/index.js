import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import AppStack from './AppStack';
import AuthStack from './AuthStack';
import { useDispatch, useSelector } from 'react-redux';
import { Text, View, Modal as RNModal, ActivityIndicator, } from 'react-native';
// import { Snackbar } from 'react-native-paper';
import Storage from '../utilities/AsyncStorage';
import { userData, login } from '../redux/Actions/AuthAction';
import { colors } from '../utilities/colors';

const AppNavigation = () => {


  const islogin = useSelector(state => state.AuthReducer.isLogin);
  const dispatch = useDispatch();
  const loading = useSelector(state => state.GeneralReducer.loading);
  // const showAlert = useSelector(state => state.GeneralReducer.showAlert);
  // const alert = useSelector(state => state.GeneralReducer.alertOptions);

  useEffect(() => {
    checkUserExistence();
  }, []);


  const checkUserExistence = async () => {
    let user_data = await Storage.get('@user');
    if (user_data != null) {
      const userdata = JSON.parse(user_data);
      dispatch(userData(userdata));
      dispatch(login(true));
    } else {
      dispatch(login(false));
    }
  };


  return (
    <NavigationContainer>
      {islogin ? <AppStack /> : <AuthStack />}

      <RNModal visible={loading} transparent>
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ActivityIndicator size={'large'} color={colors.WHITE} />
          <Text style={{ color: '#fff', margin: 10 }}>Loading ... </Text>
        </View>
      </RNModal>


      {/* <Snackbar
          onDismiss={() => dispatch(hideAlert())}
          duration={4000}
          style={{ backgroundColor: colors.PRIMARY }}
          visible={showAlert}>
          {alert?.message}
        </Snackbar> */}
    </NavigationContainer>
  );
};

export default AppNavigation;
