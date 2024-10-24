import React, { useCallback, useContext, useEffect, useState } from 'react'
import { Alert, Image, Pressable, StyleSheet, TextInput, View } from 'react-native'
import { Text } from 'react-native-paper'
import { Post } from '../../core/entities/post-entities';
import Icon from 'react-native-vector-icons/Ionicons';
import { transformDateUTC } from '../../helpers/transformDate';
import { PutLikesPosts } from '../../core/use-cases/post/put-likes-post';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { authStore } from '../store/auth/auth-store';
import { ThemeContext } from '../context/themeContext';
import { GetPostByid } from '../../core/use-cases/post/get-post-by-id';
import { NavigationProp, useFocusEffect, useNavigation } from '@react-navigation/native';
import { PostScreen } from './postScreen';
import { RootStackParams } from '../navigation/stackNavigator';
import { uiStore } from '../store/ui/ui-store';
import Dialog from 'react-native-dialog';
import { UsePost } from '../../hooks/usePost';
import { ModalPostEdit } from './modals/post/modalPostEdit';
import { AlterPostStore } from '../store/alter/alterPost';


interface Props {
    post: Post,
    principal?: boolean
}
export const PostCard = ({ post, principal }: Props) => {
    const { colors } = useContext(ThemeContext);
    if (!post) {
        return <Text>No se encontró la publicación.</Text>;
    }
    const user = authStore(state => state.user);
    useEffect(() => {
        if (user) {
            const newState = post.likes.includes(user.uid);
            setLikes({ account: post.likes.length, forMe: newState });
        }
    }, [post, user]);

    const [likes, setLikes] = useState({
        forMe: false,
        account: post.likes.length
    })
    const putLike = async () => {
        if (user?.uid && post.id) {
            const resp = await PutLikesPosts(WeConnectFetcher, user?.uid, post.id)

            if (likes.forMe) {
                setLikes({ account: likes.account - 1, forMe: !likes.forMe });
            } else {
                setLikes({ account: likes.account + 1, forMe: !likes.forMe });
            }

            if (!resp.ok) {
                console.log('Ocurrio un error, por favor vuelva a intentarlo más tarde')
            }
        }
    }

    const { navigate } = useNavigation<NavigationProp<RootStackParams>>()
    const postPressed = async () => {
        if (post.id) {
            navigate('PostScreen', { id: post.id })
        }

    }
    const tooglePostModalEditIsOpen = uiStore(state => state.tooglePostModalEditIsOpen)
    const setPost = AlterPostStore(state => state.setPost)

    const LongPress = () => {
        setPost(post)
        tooglePostModalEditIsOpen()
    }

    return (

        <View style={[styles.bodyCard, { flexDirection: 'column', marginBottom: 25, backgroundColor: colors.cardBackground, paddingHorizontal: principal ? 10 : 20, paddingBottom: 10, }]}>
            <Pressable onPress={() => navigate('Profile', { uid: post.Uid ? post.Uid : '123' })}
                onLongPress={() => LongPress()}

            >

                <View style={{ justifyContent: 'space-between', flexDirection: 'row' }}>
                    <View style={{ marginLeft: 5, flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
                        <View style={{ width: principal ? 50 : 30, height: principal ? 50 : 30 }} >
                            <Image
                                source={{
                                    uri: post.UserPhoto && post.UserPhoto.length > 0 ? post.UserPhoto : 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg',
                                }}
                                style={{
                                    width: principal ? 50 : 30,
                                    height: principal ? 50 : 30,
                                    borderRadius: 25,
                                    overflow: 'hidden',
                                    resizeMode: 'cover',
                                }}
                            />
                        </View>
                        <Text style={{ marginLeft: 15, fontSize: 15, color: colors.text, fontFamily: 'Roboto-Medium', fontWeight: 'bold' }}>{post.DisplayName ? post.DisplayName : 'Sin nombre'}</Text>

                    </View>
                    <Text>{post.creationDate ? transformDateUTC(new Date(post.creationDate)) : 'Sin fecha'}</Text>
                </View>
            </Pressable>
            <Pressable onPress={() => postPressed()}
                onLongPress={() => LongPress()}>
                <Text style={{ marginTop: 10 }}>{post.bodyPost ? post.bodyPost : 'Sin post'}</Text>
            </Pressable>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                height: 20,
                width: '30%',
                marginTop: 15,
                marginBottom: 5,
                justifyContent: 'space-between',

            }}>
                <Pressable onPress={putLike}
                    onLongPress={() => LongPress()}>

                    <View style={{
                        left: 0,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <Icon name={likes.forMe ? 'heart' : 'heart-outline'} size={principal ? 22 : 18} color={likes.forMe ? 'red' : 'grey'} />
                        <Text style={{ fontSize: principal ? 16 : 14 }}>

                            {likes.account}
                        </Text>
                    </View>
                </Pressable>

                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                }}>
                    <Pressable onPress={() => postPressed()}
                        onLongPress={() => LongPress()}>


                        <Icon name='chatbubbles-outline' size={principal ? 22 : 18} color={'blue'} />
                        <Text style={{ fontSize: principal ? 16 : 14 }}>

                            {post.comments.length}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </View >

    )
}
const styles = StyleSheet.create({
    bodyCard: {

        borderRadius: 5,
        marginBottom: 15
    }
})


