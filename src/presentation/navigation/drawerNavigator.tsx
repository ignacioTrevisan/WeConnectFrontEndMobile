import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { BottomNavigator } from './bottomNavigator';
import { LoginScreen } from '../screen/auth/login-screen';
import { AccountConfiguration } from '../screen/configuration/Account-configuration-screen';
import { Image, useWindowDimensions, View } from 'react-native';
import { authStore } from '../store/auth/auth-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/themeContext';
import { RootStackParams } from './stackNavigator';
import { StackNavigationProp } from '@react-navigation/stack';

const Drawer = createDrawerNavigator();

export const DrawerNavigator = () => {
    const { colors } = useContext(ThemeContext);
    const status = authStore(state => state.status);

    return (
        <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={{
                drawerType: 'slide',
                drawerActiveBackgroundColor: colors.SecondaryButtonsBackGround,
                drawerActiveTintColor: 'white',
                drawerInactiveTintColor: colors.text,
                drawerStyle: {
                    backgroundColor: colors.background

                },
                headerStyle: {
                    backgroundColor: colors.background,

                },
                headerTintColor: colors.text,
                headerShown: false


            }}
        >
            {status === 'Logged' ? (
                <Drawer.Screen name="Inicio" component={BottomNavigator} />
            ) : (
                <Drawer.Screen name="Login" component={LoginScreen} />
            )}
            <Drawer.Screen name="Configuración de cuenta" component={AccountConfiguration} />
        </Drawer.Navigator>
    );
}

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
    const user = authStore(state => state.user);
    const { height } = useWindowDimensions();
    const unlogue = authStore(state => state.unlogue)

    const { navigate, reset } = useNavigation<StackNavigationProp<RootStackParams>>();
    const handleLogout = async () => {
        await AsyncStorage.removeItem('@token');
        await AsyncStorage.removeItem('@uid');
        unlogue()
        reset({
            index: 0,
            routes: [{ name: 'Login' }]
        });
    };
    const { colors } = useContext(ThemeContext);

    return (
        <DrawerContentScrollView {...props}>
            <Image
                source={{ uri: user ? user?.UserPhoto : 'https://res.cloudinary.com/nachotrevisan/image/upload/v1728332295/weConnect/mlereb0beazyrjqkqzvb.jpg' }}
                style={{
                    height: 200,
                    margin: 30,
                    width: 200,
                    borderRadius: 100,

                }}
            />
            <View style={{ height: height - 270 }}>
                <DrawerItemList {...props} />
            </View>
            <DrawerItem
                label="Cerrar sesión"
                activeTintColor='white'
                inactiveTintColor={colors.text}
                onPress={handleLogout}
                style={{

                    position: 'absolute',
                    bottom: 20,  // Esto lo coloca al final del drawer
                    width: '90%',

                }}
            />
        </DrawerContentScrollView>
    )
}
