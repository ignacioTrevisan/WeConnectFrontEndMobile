import { useContext } from "react";
import { Image, Pressable, useWindowDimensions, View } from "react-native"
import { Text } from "react-native"
import { ThemeContext } from "../context/themeContext";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { RootStackParams } from "../navigation/stackNavigator";
interface Props {
    displayName: string,
    userPhoto: string,
    creationDate: string,
    uid: string
}
export const UserCard = ({ displayName, userPhoto, creationDate, uid }: Props) => {
    const { navigate } = useNavigation<NavigationProp<RootStackParams>>()
    const { colors } = useContext(ThemeContext);
    const { width, height } = useWindowDimensions()
    return (
        <Pressable onPress={() => navigate('Profile', { uid })}>

            <View style={{ backgroundColor: colors.background, height: 90, width: width, borderRadius: 10 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 15, paddingHorizontal: 10 }}>
                    <Image
                        source={{ uri: userPhoto }}
                        style={{ height: 40, width: 40, borderRadius: 40 }}
                    />
                    <Text style={{ fontSize: 28, marginLeft: 5 }}>@{displayName}</Text>
                </View>
                <Text style={{ position: 'absolute', bottom: 5, right: 50 }}>Creado el: {creationDate}</Text>
            </View>
        </Pressable>
    )
}