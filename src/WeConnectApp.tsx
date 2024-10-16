import React, { PropsWithChildren } from 'react'
import { Text, View } from 'react-native'
import { StackNavigator } from './presentation/navigation/stackNavigator'
import { NavigationContainer } from '@react-navigation/native'
import { PaperProvider } from 'react-native-paper'
import { colors } from './config/theme/theme';
import { ThemeProvider } from './presentation/context/themeContext'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

export const WeConnectApp = () => {

  const queryClient = new QueryClient()

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <QueryClientProvider client={queryClient}>

        <PaperProvider>


          <NavigationContainer>


            <ThemeProvider>
              <StackNavigator />
            </ThemeProvider>

          </NavigationContainer>


        </PaperProvider>
      </QueryClientProvider>
    </View>
  )
}

