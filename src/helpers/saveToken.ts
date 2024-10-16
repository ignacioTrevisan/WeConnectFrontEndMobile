import AsyncStorage from "@react-native-async-storage/async-storage";


interface Props {
    token: string
    uid: string
}
export const storeToken = async ({ token, uid }: Props) => {
    try {
        await AsyncStorage.setItem('@token', token);
        await AsyncStorage.setItem('@uid', uid);

    } catch (e) {
        console.error('Error al guardar el token', e);
    }
};