import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { colors } from '../utilities/colors'

const TextComponent = (props) => {

    return (
        <Text
            numberOfLines={props?.numberOfLines}
            style={[{...styles.text ,  color:colors.BLACK,}, props?.style]}
            allowFontScaling={false}>
            {props?.text}
            {props.children}
        </Text>
    )
}

export default TextComponent

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        top: 1,
        color: colors.BLACK,
    },
})