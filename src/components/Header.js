import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {DrawerActions, useNavigation} from '@react-navigation/native';
import Icon, { IconTypes } from './Icon';
import { colors } from '../utilities/colors';
import { useSelector } from 'react-redux';
import TextComponent from './TextComponent';

const Header = ({
  back,
  backPress,
  bell,
  chat,
  image,
  rightIcon,
  style,
  title,
  titleStyle,
  middleIcon,
  transparent,
  backColor,
  tintColor,
  edit,
}) => {
  const navigation = useNavigation();
  const USER = useSelector(state => state.AuthReducer?.user);
  const notiLength = 0;

  return (
    <View
      style={[
        styles.container,
        {
          ...style,
          justifyContent: 'space-between',
        },
      ]}>
      <View style={{ width: chat ? '12%' : '20%' }}>
        {back ? (
          <TouchableOpacity
            style={styles.backIcon}
            onPress={backPress ? backPress : () => navigation.goBack()}>
            <Icon
              name="arrow-back-sharp"
              size={20}
              color={backColor ? backColor : colors.BLACK}
              type={IconTypes.Ionicons}
            />
          </TouchableOpacity>
        ) 

          : null}
      
      </View>

      {chat ? (
        <>
        
        </>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            flex: 1,
            justifyContent: 'center',
          }}>
          {/* {middleIcon && props.middleIcon} */}
          <TextComponent
            text={title}
            numberOfLines={2}
            style={[
              styles.heading,
              {
                ...titleStyle,
              },
            ]}
          />
        </View>
      )}

      <View style={styles.view_b}>
        {bell && (
          <TouchableOpacity
            onPress={() => navigation.navigate('Notifications')}
          >
            <Icon
            type={ IconTypes.MaterialCommunityIcons}
            name={notiLength > 0? "bell-badge-outline": "bell-outline"}
            color={colors.BLACK}
            size={20}
            />
          </TouchableOpacity>
        )}
         
        {rightIcon && rightIcon}
      </View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: 60,
    alignSelf:"center",
    paddingHorizontal: 10,
    // zIndex: 199,
    backgroundColor: colors?.WHITE,
    // paddingHorizontal: 15,
  },
  logo: {
    width: 140,
    height: 20,
  },
  view_b: {
    width: '20%',
    alignItems: 'flex-end',
  },
  contactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
  },
  backIcon: {
    // borderWidth: 1,
    // borderColor: colors?.BORDER,
    // borderRadius: 10,
    // width: 30,
    // height: 30,
    // paddingLeft: 5,
  },
  callImg: {
    height: 20,
    width: 20,
  },
  videoImg: {
    height: 20,
    width: 20,
  },
  heading: {
    fontSize: 15,
    color: colors?.BLACK
  },
  icon_image: {
    width: 20,
    height: 20,
    color: colors.PRIMARY,
  },
  profile_image: {
    width: 40,
    height: 40,
    borderRadius: 50,
    marginRight: 10,
  },
});
