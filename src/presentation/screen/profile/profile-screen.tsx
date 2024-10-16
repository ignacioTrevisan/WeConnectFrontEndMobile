import { StackScreenProps } from '@react-navigation/stack'
import React, { useCallback, useContext, useEffect } from 'react'
import { ActivityIndicator, FlatList, Image, ScrollView, Text, useWindowDimensions, View } from 'react-native'
import { RootStackParams } from '../../navigation/stackNavigator'
import { ThemeContext } from '../../context/themeContext'
import { useFocusEffect, useIsFocused, useNavigation } from '@react-navigation/native'
import { UseUser } from '../../../hooks/useUser'
import { authStore } from '../../store/auth/auth-store'
import { transformDateUTC } from '../../../helpers/transformDate';
import { UsePost } from '../../../hooks/usePost'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { PostCard } from '../../components/PostCard'

interface Props extends StackScreenProps<RootStackParams, 'Profile'> { };

export const ProfileScreen = ({ route }: Props) => {
    const { colors } = useContext(ThemeContext);
    const user = authStore(state => state.user);
    const { navigate } = useNavigation()


    let id = route.params?.uid || user?.uid;

    useEffect(() => {
        if (!id || !user) {
            navigate('Login' as never);
        }
    }, [id, navigate]);

    if (!id) {
        return <Text>No user data available</Text>;
    }
    const { loadUser, isLoading, userLoaded } = UseUser();
    useFocusEffect(
        useCallback(() => {
            if (!id) {
                navigate('Login' as never);
                return;
            }
            loadUser(id);
            getByUser(id);
        }, [id])
    );

    const { getByUser, postByUser } = UsePost();


    const { width, height } = useWindowDimensions();
    const { top } = useSafeAreaInsets()
    return (
        <View style={{ flex: 1, backgroundColor: colors.background, padding: 20 }}>
            {isLoading ? (
                <ActivityIndicator style={{ position: 'absolute', left: width / 2, top: height / 2 }} />
            ) : (
                <>
                    <View style={{ backgroundColor: 'white', padding: 10, width: '100%', marginTop: 15 }}>
                        <View style={{ flexDirection: 'row', height: 100, alignItems: 'center' }}>
                            {userLoaded && (
                                <Image
                                    source={{
                                        uri: userLoaded.UserPhoto && userLoaded.UserPhoto.length > 0
                                            ? userLoaded.UserPhoto
                                            : 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg',
                                    }}
                                    style={{
                                        width: 100,
                                        height: 100,
                                        borderRadius: 100,
                                    }}
                                />
                            )}
                            <Text style={{ fontSize: 32, paddingLeft: 15 }}>{userLoaded?.DisplayName}</Text>
                        </View>

                        <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'space-between', height: 200 }}>

                            <View style={{ flexDirection: 'column', flexWrap: 'wrap', columnGap: 25, height: 200 }}>
                                <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>Datos personales</Text>
                                <View style={{ width: 120, height: 1, marginBottom: 10, borderWidth: 1, borderColor: colors.separadores }} />

                                <View style={{ rowGap: 10 }}>

                                    <View style={{ flexDirection: 'row' }}>

                                        <Text style={{ fontWeight: 'bold' }}>Nombre: </Text>
                                        <Text>{userLoaded?.Name}</Text>
                                    </View>

                                    {userLoaded?.LastName &&
                                        <View style={{ flexDirection: 'row' }}>

                                            <Text style={{ fontWeight: 'bold' }}>Apellido: </Text>
                                            <Text>{userLoaded?.LastName}</Text>
                                        </View>
                                    }

                                    {userLoaded?.genero &&
                                        <View style={{ flexDirection: 'row' }}>

                                            <Text style={{ fontWeight: 'bold' }}>Genero: </Text>
                                            <Text>{userLoaded?.genero}</Text>
                                        </View>
                                    }

                                    {userLoaded?.fechaNacimiento &&
                                        <View style={{ flexDirection: 'column' }}>

                                            <Text style={{ fontWeight: 'bold' }}>fechaNacimiento: </Text>
                                            <Text>
                                                {transformDateUTC(new Date(userLoaded?.fechaNacimiento), true)}
                                            </Text>
                                        </View>
                                    }


                                </View>
                            </View>
                            <View style={{ flexDirection: 'column', flexWrap: 'wrap', height: 100, columnGap: 25 }}>
                                <Text style={{ paddingLeft: 5, fontWeight: 'bold' }}>Contacto</Text>
                                <View style={{ width: 120, height: 1, marginBottom: 10, borderWidth: 1, borderColor: colors.separadores }} />

                                <View style={{ rowGap: 10 }}>

                                    {userLoaded?.Email &&
                                        <View style={{ flexDirection: 'column' }}>

                                            <Text style={{ fontWeight: 'bold' }}>Email: </Text>
                                            <Text>
                                                {userLoaded?.Email}
                                            </Text>
                                        </View>
                                    }
                                    {userLoaded?.numeroDeTelefono &&
                                        <View style={{ flexDirection: 'column' }}>

                                            <Text style={{ fontWeight: 'bold' }}>numeroDeTelefono: </Text>
                                            <Text>
                                                {userLoaded?.numeroDeTelefono}
                                            </Text>
                                        </View>
                                    }

                                </View>
                            </View>

                            <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
                                {userLoaded?.creationDate && <Text>Se unio el: {transformDateUTC(new Date(userLoaded.creationDate), true)}</Text>}
                            </View>
                        </View>
                    </View>
                    <Text style={{ textAlign: 'center', fontSize: 24, marginBottom: 20, marginTop: 10 }}>
                        Últimos post de {userLoaded?.DisplayName}
                    </Text>

                    {postByUser && postByUser.length > 0 ? (
                        <FlatList
                            data={postByUser}
                            numColumns={1}
                            keyExtractor={(item, index) => `${item.id}-${index}`}
                            renderItem={({ item }) => <PostCard post={item} principal />}
                            scrollEnabled={true}
                        />
                    ) : (
                        <Text style={{ textAlign: 'center', marginTop: 20 }}>No hay posts disponibles.</Text>
                    )}
                </>
            )}
        </View>
    )
}
