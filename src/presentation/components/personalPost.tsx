import React, { useContext, useState } from 'react'
import { Image, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Button, Text } from 'react-native-paper';
import { authStore } from '../store/auth/auth-store';
import { ThemeContext } from '../context/themeContext';
import { AlterPostStore } from '../store/alter/alterPost';


interface Props {
    DisplayName: string
    GetAllPost: () => void;
    initialText?: string;
    Method: (bodyPost: string, idPost?: string) => void;
    buttonText: string,
}

export const PersonalPostCard = ({ DisplayName, GetAllPost, initialText = '', Method, buttonText }: Props) => {

    const user = authStore(state => state.user)
    const post = AlterPostStore(state => state.post)
    const [text, setText] = useState(initialText)
    const clearPost = AlterPostStore(state => state.clearPost)

    const pressed = () => {
        if (!post) {
            Method(text)
            setText('')
            GetAllPost()
        } else {
            console.log('noi 0borra')

            Method(text, post.id)
            GetAllPost()
        }
        clearPost()

    }
    const { colors } = useContext(ThemeContext);

    return (


        <View style={[styles.bodyCard, { flexDirection: 'column', padding: 10, backgroundColor: colors.cardBackground }]}>

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
                <Pressable onPress={() => pressed()}>

                    <Button mode='contained' style={{ width: '30%', marginTop: 5, borderColor: 'blue', backgroundColor: 'blue' }}><Text style={{ color: 'white', }}>{buttonText}</Text></Button>
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
