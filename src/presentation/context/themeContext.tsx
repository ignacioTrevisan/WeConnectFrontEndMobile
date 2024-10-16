import { createContext, PropsWithChildren, useEffect, useState } from "react";
import { darkColors, LigthColors, ThemeColors } from "../../config/theme/theme";
import { useColorScheme } from "react-native";


type ThemeColor = 'Ligth' | 'Dark';

interface ThemeContextProps {
    CurrentTheme: 'Ligth' | 'Dark',
    colors: ThemeColors,
    setTheme: (theme: ThemeColor) => void;
}


export const ThemeContext = createContext({} as ThemeContextProps);
export const ThemeProvider = ({ children }: PropsWithChildren) => {

    const systemTheme = useColorScheme(); // Obtener el esquema de colores del sistema


    const [currentTheme, setCurrentTheme] = useState<ThemeColor>(
        systemTheme === 'dark' ? 'Dark' : 'Ligth' // Inicializar tema basado en el sistema
    );
    const setTheme = (theme: ThemeColor) => {
        setCurrentTheme(theme);
        console.log(theme);
    }
    useEffect(() => {
        console.log('cambio a ', currentTheme);
    }, [currentTheme])

    useEffect(() => {
        if (systemTheme) {
            setCurrentTheme(systemTheme === 'dark' ? 'Dark' : 'Ligth');
        }
        console.log('Cambio detectado en sistema, tema actual:', currentTheme);
    }, [systemTheme]);

    return (
        <ThemeContext.Provider
            value={{
                CurrentTheme: currentTheme,
                colors: currentTheme === 'Dark' ? darkColors : LigthColors,
                setTheme
            }}
        >
            {children}
        </ThemeContext.Provider>
    )
}