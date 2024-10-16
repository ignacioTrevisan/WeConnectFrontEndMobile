import React, { useCallback, useContext, useEffect, useState } from 'react'
import { useWindowDimensions, View, TextInput, Text, Animated, Pressable, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalStyles } from '../../styles/globalStyles';
import { useAnimations } from '../../../hooks/useAnimation';
import { authStore } from '../../store/auth/auth-store';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { VerifyDisplayName } from '../../../core/use-cases/auth/verify-displayname';
import { WeConnectFetcher } from '../../../config/adapters/weConnectFetcher';
import { LoginUser } from '../../../core/use-cases/auth/login';
import { User } from '../../../core/entities/user-entities';
import { VerifyToken } from '../../../core/use-cases/token/verificar-token';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../../context/themeContext';
import { useUser } from '../../hooks/useLoginScreen';

export const LoginScreen = () => {
    const status = authStore(state => state.status);
    const { navigate } = useNavigation();
    const [form, setForm] = useState({
        DisplayName: '',
        Password: ''
    })

    const { setAllLogged, setIsLoading, isLogin, setIsStep, isLoading, step } = useUser();

    useFocusEffect(
        useCallback(() => {
            avisado()
            setIsStep(1);
            setForm({
                DisplayName: '',
                Password: ''
            })
        }, [])
    );

    const avisado = async () => {
        const aviso = await AsyncStorage.getItem('@avisado');
        if (!aviso) {
            Alert.alert('Aviso', ' Por favor, recuerde que al ser un proyecto para porfolio unicamente, se esta utilizando un servidor gratuito, por lo que puede experimentar cierto retraso por parte del backend, pero solo al inicio. ', [
                { text: 'Continuar', onPress: async () => await AsyncStorage.setItem('@avisado', 'si') },
            ]);
        }
    }
    useEffect(() => {
        if (status === 'Logged') {
            navigate('Drawer' as never)
        }
        if (form.DisplayName.length >= 4) {
            AnimarBoton({})
        }

    }, [status, form])


    const { height, width } = useWindowDimensions()
    const { bottom } = useSafeAreaInsets();
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




    useEffect(() => {
        nextAnimation();
    }, [])
    const verifyToken = async () => {
        setIsLoading(true);
        try {
            const resp = await VerifyToken();
            if (resp.ok && resp.data) {
                setAllLogged(resp.data)

                navigate('Drawer' as never)
            } else {
                setIsLoading(false);
            }


        } catch (e) {
            setIsLoading(false);
        }
    }
    const nextAnimation = async () => {
        if (step === 0) {

            //Inicialmente verificamos si el token permite autenticarse
            await verifyToken()
        }
        if (step === 1) {
            //step suma 1 valor al llamar esta funcion (al final), siendo 1 verificaria el displayName
            setIsLoading(true)
            const resp = await VerifyDisplayName(WeConnectFetcher, form.DisplayName);
            if (!resp.ok) {
                setIsLoading(false);
                setSnackBar({ visible: true, msg: resp.msg ? resp.msg.toString() : 'Error indefinido' })
                return;
            }
        }
        if (step === 2) {
            //step suma 1 valor al llamar esta funcion (al final), siendo 2 verificaria el la contraseña

            setIsLoading(true)
            await startLogin();
            setIsLoading(false)

            return;
        }
        //esto simplemente activaria la animacion
        fadeOut({ duration: 0, toValue: 0 })
        setTimeout(() => {
            fadeIn({ duration: 300, toValue: 1 })
            moveRigth({ duration: 300, toValue: 0, initialValue: -101 })
            setIsLoading(false)
        }, 600);

        //si ninguna condicion hizo que la funcion termine antes, sube un step, de tal manera que pedira otro dato.
        setIsStep(step + 1);
    }

    const startLogin = async () => {
        const resp = await isLogin(form);
        if (resp === 'Logeado') {
            navigate('Drawer' as never)
        }
        else {
            setSnackBar({ visible: true, msg: resp ? resp : 'Error indefinido' })
        }
    }
    const hideSnackbar = () => setSnackBar({ msg: '', visible: false });
    const [snackBar, setSnackBar] = useState({
        visible: false,
        msg: ''
    })


    const { colors } = useContext(ThemeContext);
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>


            <View style={[GlobalStyles.globalMargin, { alignItems: 'center', height: height * 0.95 }]}>

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

                        <Animated.View
                            style={{
                                opacity: animatedOpacity,
                                marginTop: 100,
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
                                value={step === 2 ? form.Password : form.DisplayName}
                                placeholder={step === 2 ? 'Contraseña' : 'Nombre de usuario'}
                                autoCapitalize='none'
                                secureTextEntry={step === 2}
                                autoCorrect={false}
                                onChangeText={step === 2 ? value => setForm({ ...form, Password: value }) : value => setForm({ ...form, DisplayName: value })}
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

                                onPress={() => { nextAnimation() }}
                            >
                                <Text style={{ color: 'white', fontSize: 18 }}>
                                    {step === 2 ? 'Iniciar' : 'Confirmar'}
                                </Text>
                                <Icon name="chevron-forward-outline" color={'white'} size={18} style={{}} />
                            </Pressable>
                        </Animated.View>
                    </>
                }

                <View style={{ position: 'absolute', bottom: bottom + 20 }}>
                    <Snackbar
                        visible={snackBar.visible}
                        onDismiss={hideSnackbar}
                        duration={5000} // Duración en milisegundos
                        action={{
                            label: 'Cerrar',
                            onPress: hideSnackbar,
                        }}
                    >
                        {snackBar.msg}
                    </Snackbar>
                    <Pressable onPress={() => navigate('Register' as never)}>
                        <Text>¿Aún no tienes cuénta? Presione acá</Text>
                    </Pressable>
                </View>
            </View>
        </View>
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