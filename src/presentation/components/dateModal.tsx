import React, { useContext, useState } from 'react'
import { Modal, View, Text, TextInput, useWindowDimensions, Alert, Platform } from 'react-native'
import { uiStore } from '../store/ui/ui-store';
import { Buttons } from './buttons';
import { ChangePassword } from '../../core/use-cases/users/change-password';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { authStore } from '../store/auth/auth-store';
import { ThemeContext } from '../context/themeContext';
import DateTimePicker from '@react-native-community/datetimepicker';

export const DateModal = () => {


    const dateModalIsOpen = uiStore(state => state.dateModalIsOpen)
    const ToogleDateModal = uiStore(state => state.ToogleDateModal)


    const { colors } = useContext(ThemeContext);
    const { width, height } = useWindowDimensions()
    return (
        <Modal visible={dateModalIsOpen}
            animationType='fade'

        >
            <View>




            </View>
            <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: colors.background, gap: 20, marginBottom: 20 }}>

                <Buttons
                    text='Cancelar'
                    onPress={() => ToogleDateModal()}
                    styles={{
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        width: width * 0.4,
                        backgroundColor: colors.PrimaryButtonsBackGround
                    }}
                />
                <Buttons
                    text='Confirmar'
                    onPress={() => ToogleDateModal()}
                    styles={{
                        height: 50,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 20,
                        width: width * 0.4,
                        backgroundColor: colors.primary
                    }}
                />
            </View>


        </Modal>
    )
}
