import React, { useState, useRef, useEffect } from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { SplashScreen } from 'expo'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer, DarkTheme as Dark } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import BottomTabNavigator from './navigation/BottomTabNavigator'
import useLinking from './navigation/useLinking'
import { DarkTheme, Provider as PaperProvider } from 'react-native-paper'

import { StoreProvider, Store } from './Store'

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
type Props = {
  skipLoadingScreen: boolean
}
const Stack = createStackNavigator()

export default function App({ skipLoadingScreen }: Props) {
  const [isLoadingComplete, setLoadingComplete] = useState(false)
  const [initialNavigationState, setInitialNavigationState] = useState()
  const containerRef = useRef()
  const { getInitialState } = useLinking(containerRef)

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function loadResourcesAndDataAsync() {
      try {
        SplashScreen.preventAutoHide()

        // Load our initial navigation state
        setInitialNavigationState(await getInitialState())

        // Load fonts
        await Font.loadAsync({
          ...Ionicons.font,
          'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        })
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.warn(e)
      } finally {
        setLoadingComplete(true)
        SplashScreen.hide()
      }
    }

    loadResourcesAndDataAsync()
  }, [])

  const theme = {
    roundness: 4,
    dark: true,
    colors: {
      ...DarkTheme.colors,
    },
    fonts: {
      ...DarkTheme.fonts,
    },
    animation: {
      scale: 1.0,
    },
  }

  const darkNavigationTheme = {
    ...Dark,
    colors: {
      ...Dark.colors,
    },
  }

  if (!isLoadingComplete && !skipLoadingScreen) {
    return null
  } else {
    return (
      <View style={styles.container}>
        {Platform.OS === 'ios' && <StatusBar barStyle='default' />}
        <StoreProvider>
          <Store.Consumer>
            {() => {
              return (
                <PaperProvider theme={theme}>
                  <NavigationContainer
                    theme={darkNavigationTheme}
                    ref={containerRef}
                    initialState={initialNavigationState}
                  >
                    <Stack.Navigator>
                      <Stack.Screen name='Root' component={BottomTabNavigator} />
                    </Stack.Navigator>
                  </NavigationContainer>
                </PaperProvider>
              )
            }}
          </Store.Consumer>
        </StoreProvider>
      </View>
    )
  }
}
