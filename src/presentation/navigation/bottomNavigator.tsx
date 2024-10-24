import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../screen/home/home-screen";
import { ProfileScreen } from "../screen/profile/profile-screen";
import { useNavigation } from "@react-navigation/native";
import { SearchScreen } from "../search/search-screen";
import { authStore } from '../store/auth/auth-store';
import Icon from "react-native-vector-icons/Ionicons";
import { useContext, useEffect } from "react";
import { ThemeContext } from "../context/themeContext";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParams } from "./stackNavigator";
import { ModalPostEdit } from "../components/modals/post/modalPostEdit";
import { uiStore } from "../store/ui/ui-store";

export const BottomNavigator = () => {
    const { colors } = useContext(ThemeContext);

    const { navigate, reset } = useNavigation<StackNavigationProp<RootStackParams>>();
    const status = authStore(state => state.status);
    useEffect(() => {
        if (status !== 'Logged') {
            reset({
                index: 0,
                routes: [{ name: 'Login' }]
            });
        }
    }, [status, reset]);

    const Tab = createBottomTabNavigator();

    return (


        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: colors.background
                },
                headerStyle: {
                    backgroundColor: colors.cardBackground,
                },
                headerTintColor: colors.text,
            }}

        >

            <Tab.Screen name="Home"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color }) => (<Icon name='home-outline' size={18} color={color} />)
                }}
                component={HomeScreen}
                unmountOnBlur={true}
            />
            <Tab.Screen name="Search" options={{ title: 'Buscar', tabBarIcon: ({ color }) => (<Icon name='search-outline' size={18} color={color} />) }} component={SearchScreen} />
            <Tab.Screen name="PersonalProfile" options={{ title: 'Perfil', tabBarIcon: ({ color }) => (<Icon name='person-circle-outline' size={18} color={color} />) }} component={ProfileScreen} unmountOnBlur={true} />

        </Tab.Navigator>
    )
}