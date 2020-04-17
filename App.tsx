import React, { useState, useRef, useEffect } from 'react'
import { Platform, StatusBar, StyleSheet, View } from 'react-native'
import { SplashScreen } from 'expo'
import * as Font from 'expo-font'
import { Ionicons } from '@expo/vector-icons'
import { NavigationContainer } from '@react-navigation/native'
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

  const customTheme = {
    ...DarkTheme,
    dark: false,
    roundness: 4,
    colors: {
      primary: '#034748',
      accent: '#11B5E4',
      background: '#F1F7ED',
      surface: '#F1F7ED',
      text: '#001021',
      error: '#B71F0E',
      disabled: '#BEC6C6',
      placeholder: '#1481BA',
      backdrop: '#001021',
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
                <PaperProvider theme={customTheme}>
                  <NavigationContainer ref={containerRef} initialState={initialNavigationState}>
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
