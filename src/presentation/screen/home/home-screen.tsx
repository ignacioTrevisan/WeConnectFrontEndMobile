import { StyleSheet, View, Animated, FlatList, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import { Snackbar, Text } from 'react-native-paper';
import { useAnimations } from '../../../hooks/useAnimation';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { GlobalStyles } from '../../styles/globalStyles';
import { useWindowDimensions } from 'react-native';
import { colors } from '../../../config/theme/theme';
import { PostCard } from '../../components/PostCard';
import { Post } from '../../../core/entities/post-entities';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PersonalPostCard } from '../../components/personalPost';
import { authStore } from '../../store/auth/auth-store';
import { GetAllPost } from '../../../core/use-cases/post/get-all-post';
import { WeConnectFetcher } from '../../../config/adapters/weConnectFetcher';
import { OrderPostByDate } from '../../../helpers/orderPostByDate';
import { uiStore } from '../../store/ui/ui-store';
import { useFocusEffect } from '@react-navigation/native';
import { User } from '../../../core/entities/user-entities';
import { ThemeContext } from '../../context/themeContext';
import { HamburgerMenu } from '../../components/hamburgerMenu';


export const HomeScreen = () => {
    const { colors } = useContext(ThemeContext);

    const getUser = authStore(state => state.getUser);
    const [user, setUser] = useState<User | undefined>(undefined);

    useFocusEffect(
        useCallback(() => {
            const resp = getUser();
            setUser(resp);
        }, [])
    );

    const { fadeIn, animatedOpacity } = useAnimations();
    const [posts, setPosts] = useState<Post[]>([])
    const isLoading = uiStore(state => state.isLoading)
    const setIsLoading = uiStore(state => state.setIsLoading)



    useEffect(() => {
        fadeIn({ duration: 500, toValue: 1 })
        GetAllPostScreen()
    }, [])
    const { height, width } = useWindowDimensions();
    const GetAllPostScreen = async () => {
        setIsLoading(true);
        let resp = await GetAllPost(WeConnectFetcher)
        resp = OrderPostByDate(resp);
        const postClear = resp.filter((p) => p.isComment === false)
        setPosts(postClear);
        setIsLoading(false);
    }





    const { top } = useSafeAreaInsets();
    const [estado, setEstado] = useState(false)

    const actualizar = async () => {
        setEstado(true);
        let resp = await GetAllPost(WeConnectFetcher)
        resp = OrderPostByDate(resp);
        const postClear = resp.filter((p) => p.isComment === false)
        setPosts(postClear);
        setEstado(false);
    }
    const snackBarMode = uiStore(state => state.snackBarMode)
    const invisibleSnackBar = uiStore(state => state.invisibleSnackBar)


    return (



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
                                <PersonalPostCard DisplayName={user.DisplayName} GetAllPostScreen={GetAllPostScreen} />
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
                                keyExtractor={(item, index) => `${item.id}-${index}`}
                                renderItem={({ item }) => <PostCard post={item} principal />}
                            />
                        </View>
                    </>
                }
            </Animated.View>
        </View>

    );
}

const styles = StyleSheet.create({

});
