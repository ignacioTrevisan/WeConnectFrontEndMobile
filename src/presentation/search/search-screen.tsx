import React, { useContext, useEffect, useMemo, useState } from 'react'
import { useWindowDimensions, View, TextInput, StyleSheet, ActivityIndicator, FlatList, StyleProp } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GlobalStyles } from '../styles/globalStyles';
import { useQuery } from '@tanstack/react-query';
import { FindAllDisplayNamesByUsers } from '../../core/use-cases/users/get-all-displayName-by-user';
import { WeConnectFetcher } from '../../config/adapters/weConnectFetcher';
import { FullScreenLoader } from '../components/fullScreenLoader';
import { FindUsersByDisplayName } from '../../core/use-cases/users/get-users-by-displayNames';
import { UseDebouncer } from '../hooks/useDebouncer';
import { UserCard } from '../components/userCard';
import { transformDateUTC } from '../../helpers/transformDate';
import { ThemeContext } from '../context/themeContext';

export const SearchScreen = () => {
    const { colors } = useContext(ThemeContext);

    const { width } = useWindowDimensions();
    const { top } = useSafeAreaInsets();
    const [text, setText] = useState('');
    const debouncerValue = UseDebouncer(text)

    const { isLoading, data } = useQuery({
        queryKey: ['All', 'DisplayNames'],
        queryFn: () => FindAllDisplayNamesByUsers(WeConnectFetcher),
        staleTime: 1000 * 60 * 60
    })

    const startSearchUser = useMemo(() => {
        if (!data) return []

        if (!isNaN(Number(debouncerValue))) return [];

        if (debouncerValue.length < 4) return [];

        return data.filter((u) => u.toLowerCase().includes(debouncerValue.toLowerCase()));
    }, [debouncerValue])

    useEffect(() => {
        console.log('startSearchUser', startSearchUser)
    }, [debouncerValue])

    const { isLoading: isLoadingUser, data: userData } = useQuery({
        queryKey: ['Get', 'AllByDisplayName', debouncerValue],
        queryFn: () => FindUsersByDisplayName(WeConnectFetcher, startSearchUser),
        staleTime: 1000 * 60 * 60
    })

    if (isLoading) {
        return (
            <FullScreenLoader />
        )
    }
    return (
        <View style={{ flex: 1, backgroundColor: colors.background }}>

            <View style={[GlobalStyles.globalMargin, { flex: 1, alignItems: 'center', backgroundColor: colors.background }]}>
                <TextInput
                    placeholder='ingrese usuario a buscar'
                    style={[styles.textInput, { width: width * 0.8, marginTop: top + 20, backgroundColor: colors.SecondaryButtonsBackGround }]}
                    onChangeText={value => setText(value)}
                    value={text}
                />
                <View style={{ height: 20 }} />
                {
                    isLoadingUser ? <ActivityIndicator /> :

                        userData?.data &&
                        <FlatList
                            data={userData.data}
                            numColumns={1}
                            scrollEnabled
                            style={{ paddingTop: top + 20 }}
                            keyExtractor={(item, index) => `${item.uid}-${index}`}
                            renderItem={({ item }) => <UserCard
                                userPhoto={item.UserPhoto ? item.UserPhoto : ''}
                                displayName={item.DisplayName}
                                uid={item.uid}
                                creationDate={item.creationDate ? transformDateUTC(new Date(item.creationDate), true) : 'Sin fecha'}
                                key={item.uid}
                            />}
                        />

                }
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    textInput: {
        height: 60,
        paddingLeft: 15,
        backgroundColor: 'white',
        borderRadius: 20
    }
})