import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigation/stackNavigator';
import { GetPostByid } from '../../core/use-cases/post/get-post-by-id';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { Post } from '../../core/entities/post-entities';
import { ThemeContext } from '../context/themeContext';
import { GlobalStyles } from '../styles/globalStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PostCard } from './PostCard';
import { Buttons } from './buttons';
import { authStore } from '../store/auth/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SubmitPost } from '../../core/use-cases/post/submit-post';
import { AddComent } from '../../core/use-cases/post/add-comment';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

interface Props extends StackScreenProps<RootStackParams, 'PostScreen'> { };

export const PostScreen = ({ route }: Props) => {
    const { colors } = useContext(ThemeContext);
    const { id } = route.params;

    const [Post, setPost] = useState<Post>();
    const [comment, setComment] = useState<Post[]>();
    const { top } = useSafeAreaInsets();
    const [text, setText] = useState('');
    const user = authStore(state => state.user);

    useFocusEffect(
        useCallback(() => {
            loadPost();
        }, [useIsFocused])
    );

    useEffect(() => {
        if (Post?.comments && Post.comments.length > 0) {
            asignComents(Post.comments);
        }
    }, [Post]);

    const asignComents = async (arrayDeId: Array<string>) => {
        const postPromises: Promise<Post>[] = [];
        arrayDeId.forEach(id => {
            postPromises.push(GetPostByid(WeConnectFetcher, id));
        });
        const res = await Promise.all(postPromises)
        setComment(prevComments => [...(prevComments || []), ...res]);
    };

    const loadPost = async () => {
        const resp = await GetPostByid(WeConnectFetcher, id);
        setPost(resp);
    };

    const startComent = async () => {
        const token = await AsyncStorage.getItem('@token');
        if (user && user.UserPhoto && token) {
            const coment = {
                bodyPost: text,
                UserPhoto: user.UserPhoto,
                DisplayName: user.DisplayName,
                creationDate: new Date(),
                comments: [],
                likes: [],
                itLikeForMe: false,
                Uid: user.uid,
                isComment: true,
            };
            const resp = await SubmitPost(WeConnectFetcher, coment, token);
            if (resp.ok && resp.data) {
                const respComment = await AddComent(WeConnectFetcher, id, resp.data.toString());
                if (respComment.ok) {
                    setComment(prevComments => [...(prevComments || []), coment]);
                    setText('');
                }
            }
        }
    };

    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>


            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: colors.cardBackground }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={[GlobalStyles.globalMargin, { flex: 1 }]}>
                    <View style={[styles.PostContainer, { backgroundColor: colors.SecondaryButtonsBackGround }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 50, height: 50 }}>
                                {Post && (
                                    <Image
                                        source={{
                                            uri: Post.UserPhoto ? Post.UserPhoto : 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg',
                                        }}
                                        style={{ width: '100%', height: '100%', borderRadius: 50 }}
                                    />
                                )}
                            </View>
                            <Text style={{ color: colors.text, fontSize: 24, marginLeft: 5 }}>@{Post?.DisplayName}</Text>
                        </View>
                        <View style={{ flexDirection: 'column', justifyContent: 'space-between', marginTop: 10, paddingBottom: 10, paddingLeft: 5 }}>
                            <Text style={{ color: colors.text }}>{Post?.bodyPost}</Text>
                            <Text style={{ color: colors.text, marginTop: 20 }}>
                                Le ha gustado a {Post?.likes.length} personas
                            </Text>
                        </View>
                    </View>

                    <FlatList
                        data={comment}
                        numColumns={1}
                        keyExtractor={(item, index) => `${item.id}-${index}`}
                        renderItem={({ item }) => <PostCard post={item} />}
                        ListEmptyComponent={() => <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay comentarios aún...</Text>}
                        contentContainerStyle={{ flexGrow: 1 }}
                        style={{ flex: 1, marginTop: 10 }}
                    />

                    <View style={{ padding: 10, backgroundColor: colors.SecondaryButtonsBackGround, borderRadius: 5 }}>
                        <TextInput
                            style={{ backgroundColor: colors.background, borderRadius: 5, marginHorizontal: 5, marginTop: 15, color: colors.text }}
                            multiline
                            placeholder='Agrega un comentario'
                            value={text}
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            placeholderTextColor={colors.SecondaryButtonsBackGround}
                            onChangeText={value => setText(value)}
                        />
                        <Buttons
                            text="Comentar"
                            styles={{ backgroundColor: colors.PrimaryButtonsBackGround, alignSelf: 'flex-end', padding: 5, borderRadius: 10, marginTop: 10 }}
                            onPress={startComent}
                        />
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    );
};

const styles = StyleSheet.create({
    PostContainer: {
        width: '100%',
        borderRadius: 15,
        flexDirection: 'column',
        padding: 5,
    },
});
