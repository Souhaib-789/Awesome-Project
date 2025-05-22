import { FlatList, ScrollView, Image, StyleSheet, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import BATTERY from '../../assets/user.png'
import TextComponent from '../../components/TextComponent';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../utilities/colors';
import Button from '../../components/Button';
import Icon, { IconTypes } from '../../components/Icon';
import firestore from '@react-native-firebase/firestore';
import auth, { getAuth, signOut } from '@react-native-firebase/auth';
import Storage from '../../utilities/AsyncStorage';
import { useDispatch, useSelector } from 'react-redux';
import { Logout } from '../../redux/Actions/AuthAction';
import Toast from 'react-native-toast-message';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import { openSettings } from 'react-native-permissions';

const Home = () => {

  const navigation = useNavigation()
  const dispatch = useDispatch()
  const channelId = 'testApp';
  const channelName = 'Test APp';
  const [users, setUsers] = useState([])
  const [userLoading, setUserLoading] = useState(false)

  const USER = useSelector(state => state.AuthReducer.user)


  useEffect(() => {
    getAllUsers()
    setNotificationsHandler();

  }, [])

  const getAllUsers = async () => {
    try {
      setUserLoading(true)
      const currentUserId = auth().currentUser.uid;

      const snapshot = await firestore()
        .collection('users')
        .where('uid', '!=', currentUserId)
        .get();

      const users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setUsers(users);
    }
    catch (error) {
      console.error('Error fetching users: ', error);
    }
    finally {
      setUserLoading(false)
    }
  };

  const onPressMessage = (item) => {
    navigation.navigate('Chat', { data: { id: item?.id, name: item?.name } });
  };

  const renderUserItem = ({ item, index }) => {
    return (
      <View style={{
        shadowColor: colors.BLACK,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.17,
        shadowRadius: 2.54,
        marginVertical: 10,
        width: '99%', gap: 5, flexDirection: 'row', backgroundColor: colors?.WHITE, elevation: 2, margin: 2, padding: 12, gap: 10, borderRadius: 10,
      }}>
        <Image source={BATTERY} style={{ width: 50, height: 50, borderRadius: 100 }} />
        <View >
          <TextComponent text={item?.name} numberOfLines={1} style={{ color: colors?.BLACK, width: '95%', marginBottom: 3, fontSize: 14 }} />
          <Button title={'Message'} textStyle={{ fontSize: 10, color: colors.PRIMARY, }} style={{ borderWidth: 1, width: '70%', marginTop: 5, borderColor: colors.PRIMARY, borderRadius: 6, backgroundColor: colors.WHITE, paddingVertical: 5 }}
            onPress={() => onPressMessage(item)} />
        </View>
      </View>
    )
  }

  const onPressLogout = () => {
    signOut(getAuth())
      .then(() => {
        Storage.clearStorage();
        dispatch(Logout())
      })
      .catch((error) => {
        console.error('Error signing out: ', error);
      });
  }

  const checkNotiPermission = async () => {
    return new Promise(async (resolve, reject) => {
      return messaging()
        .hasPermission()
        .then(enabled => {
          let granted =
            enabled === messaging.AuthorizationStatus.AUTHORIZED ||
            enabled === messaging.AuthorizationStatus.PROVISIONAL;

          return resolve(granted);
        })
        .catch(error => reject(error));
    });
  };

  const setNotificationsHandler = async () => {
    let granted = await checkNotiPermission();
    if (granted) {
      try {
        await messaging().registerDeviceForRemoteMessages();
        // const token = await messaging().getToken()

      } catch (error) {
        console.log('Error ', error);
      }

      notifee.isChannelCreated(channelId).then(isCreated => {
        if (!isCreated) {
          notifee.createChannel({
            id: channelId,
            name: channelName,
            sound: 'default',
          });
        }
      });

      notifee.onForegroundEvent(({ type, detail }) => {
        const { notification } = detail
        if (type === EventType.PRESS) {
          navigation.navigate('Notifications')
        }
      })

      messaging().onMessage(showForegroundNotification);
    } else {
      console.log('Notification permission denied');
      Alert.alert(
        'Notification permission denied',
        'Please enable notifications in the app settings.',
        [
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: 'Settings',
            onPress: () => {
              openSettings('application').catch(() => console.warn('Cannot open app settings'))
            },
          },
        ],
        { cancelable: false }
      );
    }
  }

  const showForegroundNotification = async (message) => {
    if (!message || !message?.notification) {
      return;
    }
    const { title, body } = message.notification;

    Toast.show({
      type: 'success',
      text1: title,
      text2: body,
      position: 'top',
      visibilityTime: 3000,
    });


    notifee.displayNotification({
      title,
      body,

      android: {
        channelId: channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },

      },
    });
  };


  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.wide_row}>
          <TextComponent text={'Home'} style={styles.header_title} />
          <TouchableOpacity onPress={onPressLogout}>
            <Icon name={'logout'} type={IconTypes.AntDesign} size={20} color={'red'} />
          </TouchableOpacity>
        </View>

        <View style={styles.upper_sub_view}>
          <Image source={require('../../assets/user.png')} style={styles.upper_view_image} resizeMode='cover' />
          <View>
            <TextComponent text={'Welcome Back,'} style={styles.upper_view_span} />
            <TextComponent text={'Mr. ' + USER?.name || 'User'} style={styles.upper_view_text} />
          </View>
        </View>

        <View style={[styles.wide_row, { marginVertical: 15 }]}>
          <TextComponent text={'Reels'} style={styles.heading} />
        </View>

        <Button
          onPress={() => navigation.navigate('Reels')}
          LeftIcon={<Icon name={'video'} type={IconTypes.Entypo} size={20} color={colors.PRIMARY} />}
          title={'Watch Reels'} textStyle={{ fontSize: 10, color: colors.PRIMARY, }} style={{ borderWidth: 1, width: '90%', alignSelf: 'center', marginTop: 5, borderColor: colors.PRIMARY, borderRadius: 8, backgroundColor: colors.WHITE, paddingVertical: 8 }}
        />

        <Button
          onPress={() => {
            showForegroundNotification({
              notification: {
                title: 'Local Notification',
                body: 'This is a local notification only showing FCM Integration in the app',
              },
            });
          }}
          LeftIcon={<Icon name={'bell'} type={IconTypes.Entypo} size={20} color={colors.PRIMARY} />}
          title={'Show Local Notification'} textStyle={{ fontSize: 10, color: colors.PRIMARY, }} style={{ marginTop: 20, borderWidth: 1, width: '90%', alignSelf: 'center', borderColor: colors.PRIMARY, borderRadius: 8, backgroundColor: colors.WHITE, paddingVertical: 8 }}
        />



        <View style={[styles.wide_row, { marginVertical: 15 }]}>
          <TextComponent text={'Explore Friends'} style={styles.heading} />
        </View>

        <View>
          {
            userLoading ? <ActivityIndicator size={'large'} color={colors.PRIMARY} style={{ marginTop: 20 }} />
              :
              <FlatList
                data={users}
                renderItem={renderUserItem}
                keyExtractor={(item, index) => index.toString()}
                showsHorizontalScrollIndicator={false}
                ListEmptyComponent={
                  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <TextComponent text={'No Friends Found'} style={{ color: colors.BLACK, fontSize: 16 }} />
                  </View>
                }
              />
          }
        </View>
      </ScrollView>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  filter_icon: {
    width: 15,
    height: 15,
  },
  upper_view_text: {
    color: colors.BLACK,
    fontSize: 16,
  },
  upper_view_span: {
    color: colors.GREY,
    fontSize: 11,
  },
  upper_view_image: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
  upper_sub_view: {
    marginTop: 30,
    marginBottom: 20,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  bell: {
    width: 20,
    height: 20,
  },
  header_title: {
    fontSize: 14,
    color: colors.BLACK,
  },
  menu: {
    width: 15,
    height: 15,
  },
  heading: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  link: {
    color: colors.PRIMARY,
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  wide_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: 5,
    alignItems: 'center'
  },
  upper_view: {
    backgroundColor: colors.PRIMARY,
    // borderBottomLeftRadius: 20,
    // borderBottomRightRadius: 20,
    padding: 15,
  },
  container: {
    flex: 1,
    backgroundColor: colors.WHITE,
    padding: 15,

  },

})  
