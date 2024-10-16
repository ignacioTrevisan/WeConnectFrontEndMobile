import { createStackNavigator } from '@react-navigation/stack';
import { Text, View } from 'react-native';
import { BottomNavigator } from './bottomNavigator';
import { LoginScreen } from '../screen/auth/login-screen';
import { useNavigation } from '@react-navigation/native';
import { DrawerNavigator } from './drawerNavigator';
import { RegisterScreen } from '../screen/auth/register-screen';
import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';
import { PostScreen } from '../components/postScreen';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileScreen } from '../screen/profile/profile-screen';




const Stack = createStackNavigator();

export type RootStackParams = {
    Login: undefined,
    PostScreen: { id: string }
    Register: undefined,
    Drawer: undefined,
    Profile: { uid: string }
}
export const StackNavigator = () => {


    const { colors } = useContext(ThemeContext);


    return (

        <View style={{ flex: 1, backgroundColor: colors.background }}>

            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    headerStyle: {
                        backgroundColor: 'white',
                    },
                    headerTintColor: 'red',
                }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="PostScreen" component={PostScreen} />
                <Stack.Screen name="Profile" component={ProfileScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
                <Stack.Screen name="Drawer" component={DrawerNavigator} />
            </Stack.Navigator>
        </View>

    )
}

