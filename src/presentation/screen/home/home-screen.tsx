import { StyleSheet, View, Animated, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import { Snackbar } from 'react-native-paper';
import { useAnimations } from '../../../hooks/useAnimation';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GlobalStyles } from '../../styles/globalStyles';
import { useWindowDimensions } from 'react-native';
import { PostCard } from '../../components/PostCard';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonalPostCard } from '../../components/personalPost';
import { authStore } from '../../store/auth/auth-store';
import { uiStore } from '../../store/ui/ui-store';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../../../core/entities/user-entities';
import { ThemeContext } from '../../context/themeContext';
import { HamburgerMenu } from '../../components/hamburgerMenu';
import { UsePost } from '../../../hooks/usePost';
import { ModalPostEdit } from '../../components/modals/post/modalPostEdit';


export const HomeScreen = () => {
    const { posts, RefreshAllPost } = UsePost();
    const { colors } = useContext(ThemeContext);
    const { NewPost } = UsePost()
    const getUser = authStore(state => state.getUser);
    const [user, setUser] = useState<User | undefined>(undefined);
    const visibleSnackBar = uiStore(state => state.visibleSnackBar)

    useFocusEffect(
        useCallback(() => {
            const resp = getUser();
            console.log('se ejecuto esto1')
            setUser(resp);
        }, [])
    );

    const { fadeIn, animatedOpacity } = useAnimations();
    const isLoading = uiStore(state => state.isLoading)
    const setIsLoading = uiStore(state => state.setIsLoading)



    useEffect(() => {
        fadeIn({ duration: 500, toValue: 1 })
        console.log('se ejecuto esto2')
        GetAllPostScreen()
    }, [])
    const { height, width } = useWindowDimensions();
    const GetAllPostScreen = async () => {
        setIsLoading(true);
        await RefreshAllPost()
        setIsLoading(false);
    }


    useEffect(() => {
        console.log('post cambio')
    }, [posts])



    const { top } = useSafeAreaInsets();
    const [estado, setEstado] = useState(false)

    const actualizar = async () => {
        setEstado(true);
        await RefreshAllPost()
        setEstado(false);
    }
    const snackBarMode = uiStore(state => state.snackBarMode)
    const invisibleSnackBar = uiStore(state => state.invisibleSnackBar)
    const postModalEditIsOpen = uiStore(state => state.postModalEditIsOpen)

    const submit = async (bodyPost: string) => {
        if (user) {
            const resp = await NewPost(user, bodyPost)
            if (resp!.ok && resp?.msg) {
                actualizar()
                visibleSnackBar(
                    'Post subido correctamente. '
                )
            } else {
                visibleSnackBar(
                    resp?.msg ? resp.msg : 'Ocurrio un error al subir el post, por favor vuelve a intentarlo más tarde'
                )
            }
        }
    }
    return (


        postModalEditIsOpen ? <ModalPostEdit GetAllPostScreen={GetAllPostScreen} /> : <>
            <View style={{ flex: 1, backgroundColor: colors.background }}>
                <Animated.View style={[
                    { opacity: animatedOpacity },
                    GlobalStyles.globalMargin,
                    { flex: 1 }
                ]}>
                    <HamburgerMenu />
                    {isLoading ?

                        <ActivityIndicator style={{ position: 'absolute', left: width / 2, top: height / 2 }} />
                        :
                        <>
                            <Snackbar
                                visible={snackBarMode.visible}
                                onDismiss={invisibleSnackBar}
                                duration={5000} // Duración en milisegundos
                                action={{
                                    label: 'Cerrar',
                                    onPress: invisibleSnackBar,
                                }}
                                style={{ zIndex: 2 }}
                            >{snackBarMode.msg}</Snackbar>
                            <View style={{ height: height * 0.2, marginBottom: 15, marginTop: 20 }}>
                                {user &&
                                    <PersonalPostCard DisplayName={user.DisplayName} GetAllPost={GetAllPostScreen} Method={submit} buttonText='Publicar' />
                                }
                            </View>

                            <View style={{ flex: 1 }}>
                                <FlatList
                                    refreshControl={
                                        <RefreshControl
                                            refreshing={estado}
                                            onRefresh={actualizar}
                                            progressViewOffset={top}
                                        />
                                    }
                                    data={posts}
                                    numColumns={1}
                                    scrollEnabled
                                    style={{ paddingTop: top + 20 }}
                                    keyExtractor={(item, index) => `${item.id}`}
                                    renderItem={({ item }) => <PostCard post={item} principal />}
                                />
                            </View>
                        </>
                    }
                </Animated.View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({

});
