import React, { useContext } from 'react'
import { ActivityIndicator, View } from 'react-native'
import { ThemeContext } from '../context/themeContext';

export const FullScreenLoader = () => {
    const { colors } = useContext(ThemeContext)
    return (
        <View style={{ backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <ActivityIndicator />
        </View>
    )
}
