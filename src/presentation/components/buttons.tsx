import { Pressable, StyleProp, Text, View, ViewStyle } from 'react-native'
import React, { PureComponent, useContext } from 'react'
import { colors } from '../../config/theme/theme';


interface Props {
    text: string,
    styles?: StyleProp<ViewStyle>

    onPress: () => void;

}
export const Buttons = ({ text, styles, onPress }: Props) => {

    return (
        <Pressable
            onPress={() => onPress()}
            style={({ pressed }) => ([styles, { opacity: pressed ? 0.8 : 1 }])}
        >
            <Text
                style={{ color: 'white' }}
            >{text}</Text>
        </Pressable>
    )

}

