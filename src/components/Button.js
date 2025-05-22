import React from 'react';
import {TouchableOpacity, Text, StyleSheet, View} from 'react-native';
import {colors} from '../utilities/colors';

const Button = props => {

  return (
    <TouchableOpacity
      onPress={props?.onPress}
      style={[styles.button , {...props?.style}]}
      disabled={props?.disabled}>
      <View>{props?.LeftIcon ? props?.LeftIcon : null}</View>
  

      <Text
        style={[
          styles.button_text,
          {
            color: props?.textColor ? props?.textColor : colors?.WHITE,
            ...props?.textStyle,
           
          },
        ]}>
        {props?.title}
      </Text>
      <View>{props?.icon ? props?.icon : null}</View>
    </TouchableOpacity>
  );
};
export default Button;
const styles = StyleSheet.create({
  button: {
    borderRadius: 5,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 5,
    backgroundColor:colors.PRIMARY
  },
  button_text: {
    fontSize: 14,
    color:colors.WHITE
    // fontFamily: fonts?.BOLD,
  },
});
