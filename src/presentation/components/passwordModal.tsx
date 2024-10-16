import React, { useContext, useState } from 'react'
import { Modal, View, Text, TextInput, useWindowDimensions, Alert } from 'react-native'
import { uiStore } from '../store/ui/ui-store';
import { Buttons } from './buttons';
import { ChangePassword } from '../../core/use-cases/users/change-password';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { authStore } from '../store/auth/auth-store';
import { ThemeContext } from '../context/themeContext';

export const PasswordModal = () => {
    const PasswordModalIsOpen = uiStore(state => state.PasswordModalIsOpen);
    const TooglePasswordModal = uiStore(state => state.TooglePasswordModal)
    const { colors } = useContext(ThemeContext);

    const user = authStore(state => state.user)

    const [form, setForm] = useState({
        oldPassword: '',
        newPassword: '',
        repeatPassword: ''
    })
    const { height, width } = useWindowDimensions();

    const ShowAlert = (ok: boolean, msg: string) =>
        Alert.alert(ok === true ? '¡Listo!' : 'Ups...', msg, [

            { text: 'OK', onPress: ok === true ? () => TooglePasswordModal() : () => { } },
        ]);

    const setNewPassword = async () => {
        if (user && user.uid) {
            // #TODO: Falta verificar que contraseña nueva y repetir contraseña coincidan
            //TODO: EN ESTE SCREEN FALTA PODER QUITAR EL MODAL DE LA CONTRASEÑA, FALTA EL BOTON "CANCELAR"

            const resp = await ChangePassword(WeConnectFetcher, user?.uid, form.oldPassword, form.newPassword)
            if (resp.ok) {
                ShowAlert(true, 'Contraseña actualizada correctamente.')
            } else {
                if (resp.msg) {
                    ShowAlert(false, 'Ocurrio un error actualizando la contraseña, por favor asegurese de haberla ingresado correctamente')
                }

            }
        }
    }
    return (
        <Modal visible={PasswordModalIsOpen}
            animationType='fade'

        >
            <View style={{ flexDirection: 'column', flex: 1, backgroundColor: colors.background, paddingLeft: 10, paddingRight: 10 }}>

                <Text style={{ fontSize: 24, textAlign: 'center', marginTop: 25, marginBottom: 25, height: 50 }}>Actualizar contraseña</Text>

                <Text style={{ fontSize: 16, }}>Al cambiar la contraseña se cerrara la sesión en todos los demas disposivos.</Text>
                <View style={{ height: height * 0.7, width: width * 0.95, alignSelf: 'center', marginTop: 25, justifyContent: 'center' }}>

                    <TextInput
                        style={[{ color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 5, fontSize: 30, height: 80 }]}
                        placeholder='Ingrese su contraseña'
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={value => setForm({ ...form, oldPassword: value })}

                    />
                    <TextInput
                        style={[{ color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 5, fontSize: 30, height: 80, marginTop: 15, marginBottom: 15 }]}
                        placeholder='Ingrese una nueva contraseña'
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={value => setForm({ ...form, newPassword: value })}

                    />
                    <TextInput
                        style={[{ color: colors.text, borderColor: colors.text, borderWidth: 1, borderRadius: 5, fontSize: 30, height: 80 }]}
                        placeholder='Repita la nueva contraseña'
                        secureTextEntry
                        autoCorrect={false}
                        onChangeText={value => setForm({ ...form, oldPassword: value })}

                    />
                </View>
            </View>
            <View style={{ justifyContent: 'center', flexDirection: 'row', backgroundColor: colors.background, gap: 20, marginBottom: 20 }}>

                <Buttons
                    text='Cancelar'
                    onPress={() => TooglePasswordModal()}
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
                    onPress={() => setNewPassword()}
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
