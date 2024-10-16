import { useNavigation, DrawerActions } from '@react-navigation/native';
import React, { useEffect, useState } from 'react'
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export const HamburgerMenu = () => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                <Icon name='grid-outline' size={18} color={'blue'} />

                <Text style={{ fontSize: 20, marginLeft: 5 }}>Menú</Text>
            </View>
        </Pressable>
    );
}

