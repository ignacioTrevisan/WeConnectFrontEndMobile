import React, { useContext, useState } from 'react'
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Button, Snackbar, Text } from 'react-native-paper';
import { colors } from '../../config/theme/theme';
import { authStore } from '../store/auth/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubmitPost } from '../../core/use-cases/post/submit-post';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { uiStore } from '../store/ui/ui-store';
import { ThemeContext } from '../context/themeContext';


interface Props {
    DisplayName: string
    GetAllPostScreen: () => void;
}

export const PersonalPostCard = ({ DisplayName, GetAllPostScreen }: Props) => {
    const { colors } = useContext(ThemeContext);

    const user = authStore(state => state.user)
    const setIsLoading = uiStore(state => state.setIsLoading);
    const visibleSnackBar = uiStore(state => state.visibleSnackBar)

    const [text, setText] = useState('')
    const submit = async () => {
        const token = await AsyncStorage.getItem('@token');

        if (user && user.UserPhoto && token) {

            const post = {
                bodyPost: text,
                UserPhoto: user.UserPhoto,
                DisplayName: user.DisplayName,
                creationDate: new Date(),
                comments: [],
                likes: [],
                itLikeForMe: false,
                Uid: user.uid,
                isComment: false
            }
            setIsLoading(true);
            const resp = await SubmitPost(WeConnectFetcher, post, token)
            if (resp.ok) {
                GetAllPostScreen()
                visibleSnackBar(
                    'Post subido correctamente. '
                )
            } else {
                setIsLoading(false);
                //TODO: Mostrar mensaje de error.
            }
        }
    }

    return (


        <View style={[styles.bodyCard, { flexDirection: 'column', padding: 10, backgroundColor: colors.background }]}>

            <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ width: 50, height: 50, }} >
                        <Image
                            source={{
                                uri: user ? user.UserPhoto : 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg'
                            }}
                            style={{
                                width: 50,
                                height: 50,
                                borderRadius: 25,
                                overflow: 'hidden',
                                resizeMode: 'cover',
                            }}
                        />
                    </View>
                    <Text style={{ marginLeft: 15, fontSize: 15, fontFamily: 'Roboto-Medium' }}>@{DisplayName}</Text>

                </View>
            </View>
            <TextInput
                style={[styles.input, {
                    color: 'white',
                    borderColor: colors.text,
                    fontSize: 14,
                    width: '100%',
                    borderRadius: 10,
                    height: 60,
                    marginTop: 10,

                    backgroundColor: colors.SecondaryButtonsBackGround
                }]}
                multiline
                value={text}
                placeholder={'¿Qué estás pénsando?'}
                autoCapitalize='sentences'
                autoCorrect={false}
                placeholderTextColor='gray'

                onChangeText={value => setText(value)}
            />

            <View style={{ width: '100%', alignItems: 'flex-end', flexDirection: 'column' }}>
                <Pressable onPress={submit}>

                    <Button mode='contained' style={{ width: '30%', marginTop: 5, borderColor: 'blue', backgroundColor: 'blue' }}><Text style={{ color: 'white', }}>Publicar</Text></Button>
                </Pressable>
            </View>
        </View >
    )

}
const styles = StyleSheet.create({
    bodyCard: {
        borderRadius: 5,
        marginBottom: 15
    },
    input: {

    }
})
