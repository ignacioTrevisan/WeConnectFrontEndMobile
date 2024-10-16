import React, { useContext, useEffect, useState } from 'react'
import { useWindowDimensions, View, TextInput, Text, Animated, Pressable, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../styles/globalStyles';
import { colors } from '../../../config/theme/theme';
import { useAnimations } from '../../../hooks/useAnimation';
import { authStore } from '../../store/auth/auth-store';
import { WeConnectFetcher } from '../../../config/adapters/weConnectFetcher';
import { LoginUser } from '../../../core/use-cases/auth/login';
import { User } from '../../../core/entities/user-entities';
import { AlterStore } from '../../store/alter/alterUser';
import { RegisterUser } from '../../../core/use-cases/auth/register';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../../context/themeContext';

export const RegisterScreen = () => {

    const [form, setForm] = useState({
        DisplayName: '',
        Email: '',
        Password: '',
        RepeatPassword: '',

    })

    const { navigate } = useNavigation();

    const [notificacion, setNotificacion] = useState({
        state: false,
        msg: ''
    })
    useEffect(() => {
        const validarFormulario = () => {
            setNotificacion({ state: false, msg: '' });

            if (form.DisplayName.length < 1) {
                return
            }
            if (form.DisplayName.length < 5) {
                setNotificacion({
                    state: true,
                    msg: 'El displayName debe tener un mínimo de 6 caracteres'
                });
                return;
            }
            if (form.Email.length < 1) {
                return
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(form.Email) && form.Email.length > 0) {
                setNotificacion({
                    state: true,
                    msg: 'El email ingresado no es válido.'
                });
                return;
            }

            if (form.Password.length < 1) {
                return
            }
            if (form.Password.length < 7) {
                setNotificacion({
                    state: true,
                    msg: 'Las contraseñas deben tener un mínimo de 8 caracteres'
                });
                return;
            }

            if (form.Password !== form.RepeatPassword) {
                setNotificacion({
                    state: true,
                    msg: 'Las contraseñas deben coincidir'
                });
                return;
            }

            AnimarBoton({});
        };

        const timeoutId = setTimeout(validarFormulario, 2000);

        return () => clearTimeout(timeoutId);

    }, [form.DisplayName, form.Email, form.Password, form.RepeatPassword]);


    const { height, width } = useWindowDimensions()
    const {
        fadeIn,
        fadeOut,
        animatedOpacity,
        animatedTop,

        animatedRigth,
        moveRigth,
        animatedBottonOpacidad,
        animatedBottonUbicacion,
        AnimarBoton
    } = useAnimations();

    const [isLoading, setIsLoading] = useState(false)
    useEffect(() => {
        fadeOut({ duration: 0, toValue: 0 })
        setTimeout(() => {

            fadeIn({ duration: 300, toValue: 1 })
            moveRigth({ duration: 300, toValue: 0, initialValue: -101 })
            setIsLoading(false)
        }, 600);
    }, [])
    const setUserAlterated = AlterStore(state => state.setUserAlterated)

    const setLogged = authStore(state => state.setLogged);

    const startRegister = async () => {
        setIsLoading(true);
        const resp = await RegisterUser(WeConnectFetcher, form.DisplayName, form.Password, form.Email)
        if (resp.ok) {
            if (resp.data) {
                const userType: User = {
                    DisplayName: form.DisplayName,
                    Email: resp.data?.Email,
                    uid: resp.data?.uid,
                    UserPhoto: 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg',
                    creationDate: resp.data?.creationDate,
                    Name: resp.data?.Name,
                    LastName: resp.data?.LastName,
                    genero: resp.data?.genero,
                    fechaNacimiento: resp.data.fechaNacimiento,
                    numeroDeTelefono: resp.data?.numeroDeTelefono
                }
                setLogged(userType);
                setUserAlterated(userType);
                navigate('Drawer' as never)
            }

        } else {
            setIsLoading(false)
        }
    }
    const { bottom, top } = useSafeAreaInsets();
    const { colors } = useContext(ThemeContext);


    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: 'colors.background' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={top + 60} // Ajusta según la altura del header
        >
            <ScrollView style={{ flex: 1, backgroundColor: colors.background }}
            >
                <View style={[GlobalStyles.globalMargin, { alignItems: 'center', backgroundColor: colors.background, height: height * 0.95 }]}>

                    <Animated.View style={{
                        marginTop: height * 0.2,
                        opacity: animatedOpacity,
                        transform: [{
                            translateY: animatedTop
                        }]
                    }}>


                        <Text style={{ fontFamily: 'Roboto-Medium', fontSize: 46 }}>WeConnect</Text>
                    </Animated.View>

                    {isLoading ?
                        <ActivityIndicator style={{ top: height / 2, position: 'absolute' }} />
                        :
                        <>
                            {notificacion.state &&

                                <View
                                    style={{
                                        maxWidth: width * 0.6
                                    }}>
                                    <Text>{notificacion.msg}</Text>
                                </View>
                            }
                            <Animated.View
                                style={{
                                    opacity: animatedOpacity,
                                    marginTop: 5,
                                    transform: [{
                                        translateX: animatedRigth
                                    }]
                                }}
                            >
                                <TextInput
                                    style={[styles.input, {
                                        color: 'white',
                                        borderColor: colors.text,
                                        fontSize: 24,
                                        width: width * 0.7,
                                        borderRadius: 30,
                                        height: 80,
                                        marginTop: 20,
                                        backgroundColor: colors.SecondaryButtonsBackGround
                                    }]}
                                    value={form.DisplayName}
                                    placeholder={'Nombre de usuario'}
                                    autoCapitalize='none'
                                    secureTextEntry={false}
                                    autoCorrect={false}
                                    onChangeText={value => setForm({ ...form, DisplayName: value })}
                                />
                                <TextInput
                                    style={[styles.input, {
                                        color: 'white',
                                        borderColor: colors.text,
                                        fontSize: 24,
                                        width: width * 0.7,
                                        borderRadius: 30,
                                        height: 80,
                                        marginTop: 20,
                                        backgroundColor: colors.SecondaryButtonsBackGround
                                    }]}
                                    value={form.Email}
                                    placeholder={'Email'}
                                    autoCapitalize='none'
                                    secureTextEntry={false}
                                    autoCorrect={false}
                                    onChangeText={value => setForm({ ...form, Email: value })}
                                />
                                <TextInput
                                    style={[styles.input, {
                                        color: 'white',
                                        borderColor: colors.text,
                                        fontSize: 24,
                                        width: width * 0.7,
                                        borderRadius: 30,
                                        height: 80,
                                        marginTop: 20,
                                        backgroundColor: colors.SecondaryButtonsBackGround
                                    }]}
                                    value={form.Password}
                                    placeholder={'Contraseña'}
                                    autoCapitalize='none'

                                    secureTextEntry={true}
                                    autoCorrect={false}
                                    onChangeText={value => setForm({ ...form, Password: value })}
                                />
                                <TextInput
                                    style={[styles.input, {
                                        color: 'white',
                                        borderColor: colors.text,
                                        fontSize: 24,
                                        width: width * 0.7,
                                        borderRadius: 30,
                                        height: 80,
                                        marginTop: 20,
                                        backgroundColor: colors.SecondaryButtonsBackGround
                                    }]}
                                    value={form.RepeatPassword}
                                    placeholder={'Repita la contraseña'}
                                    autoCapitalize='none'
                                    secureTextEntry={true}
                                    autoCorrect={false}
                                    onChangeText={value => setForm({ ...form, RepeatPassword: value })}
                                />
                            </Animated.View>

                            <Animated.View
                                style={{
                                    opacity: animatedBottonOpacidad,
                                    transform: [{
                                        translateY: animatedBottonUbicacion
                                    }]
                                }}
                            >

                                <Pressable
                                    style={({ pressed }) => ([

                                        {
                                            backgroundColor: pressed ? colors.SecondaryButtonsBackGround : colors.PrimaryButtonsBackGround,
                                            marginTop: 15,
                                            width: 220,
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            justifyContent: 'space-between',
                                            paddingHorizontal: 10,
                                            borderRadius: 25,
                                            height: 40
                                        }
                                    ])}

                                    onPress={() => { startRegister() }}
                                >
                                    <Text style={{ color: 'white', fontSize: 18 }}>
                                        {'Crear cuenta'}
                                    </Text>
                                    <Icon name="chevron-forward-outline" color={'white'} size={18} style={{}} />
                                </Pressable>
                            </Animated.View>
                        </>
                    }
                    <View style={{ position: 'absolute', bottom }}>
                        <Pressable onPress={() => navigate('Login' as never)}>
                            <Text>¿Ya tienes cuenta? Presione acá</Text>
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}
const styles = StyleSheet.create({
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        borderColor: 'rgba(0,0,0,0.3)',
        borderRadius: 10,
        // color: colors.text,
    },
})