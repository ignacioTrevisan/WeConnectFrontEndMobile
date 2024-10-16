import React, { useContext, useEffect, useState } from 'react'
import { Pressable, ScrollView, useWindowDimensions, View, Text } from 'react-native'
import { } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons';
import { Buttons } from './buttons';
import { PromptAdapter } from '../../config/adapters/prompt/promptAdapter';
import { AlterStore } from '../store/alter/alterUser';
import { User } from '../../core/entities/user-entities';
import { TransformVariable } from '../../helpers/transformVariable';
import { uiStore } from '../store/ui/ui-store';
import { ThemeContext } from '../context/themeContext';


interface Props {
    text: string;
    metodo?: () => void;
    isLast: boolean;
    icon?: string;
    data?: string;
}
export const ButtonConfiguration = ({ text, metodo, isLast = false, icon, data }: Props) => {
    const { colors } = useContext(ThemeContext);
    const user = AlterStore(state => state.user);
    const configDialogMode = uiStore(state => state.configDialogMode)
    const IsAlterTrue = AlterStore(state => state.IsAlterTrue);
    const setUserAlterated = AlterStore(state => state.setUserAlterated);

    const [userState, setUserState] = useState<User>();

    useEffect(() => {
        if (userState && userState !== user) {
            setUserAlterated(userState);
        }
    }, [userState]);

    useEffect(() => {
        if (user && user !== userState) {
            setUserState(user);
        }
    }, [user]);



    const getIconoGenero = (): string => {
        if (data === 'Masculino') return 'male-outline';
        if (data === 'Femenino') return 'female-outline';
        return 'remove-outline';
    };

    const AbrirPrompt = () => {
        // PromptAdapter({
        //     title: text,
        //     message: `Ingrese su ${text}`,
        //     buttons: [
        //         { text: 'Cancelar', onPress: (value: string) => { } },
        //         { text: 'Confirmar', onPress: (value: string) => EnviarCambio(text, value) }
        //     ]
        // });
        configDialogMode(true, `ingrese su ${text}`)
    };


    const { width } = useWindowDimensions();
    return (
        <>

            <Pressable
                onPress={metodo ? metodo : AbrirPrompt}
                style={{
                    width: '100%', marginBottom: 10, borderRadius: 10, height: 35,
                    flexDirection: 'row',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',

                }}
            >
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    width: width * 0.76,
                    overflow: 'hidden',
                }}>
                    {icon && <Icon name={text === 'Genero: ' ? getIconoGenero() : icon} color={colors.text} size={18} style={{}} />
                    }
                    <Text style={{ fontSize: 18, paddingLeft: 10, color: colors.text }}>{text}</Text>
                    <View

                    >
                        {
                            text !== 'Foto de perfil' && text !== 'Contraseña' &&
                            <Text style={{ fontSize: 18, color: colors.text, paddingLeft: 10 }} numberOfLines={1} >{data ? data : 'N/A'}</Text>
                        }
                    </View>

                </View>
                <View style={{ justifyContent: 'flex-end' }}>

                    <Icon name="create-outline" color={colors.text} size={18} style={{ paddingRight: 60, zIndex: 2 }} />
                </View>
            </Pressable>
            <View style={{ width: isLast ? width : width * 0.95, alignSelf: 'flex-end', backgroundColor: '#333', height: 1 }} />

        </>

    )
}

