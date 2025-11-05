import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


// Previne que a tela inicial desapareça antes que as fontes carreguem
SplashScreen.preventAutoHideAsync();

function RootLayout() {
  // Confirme que você tem os arquivos Nexa em 'assets/fonts/'
  let [fontsLoaded, fontError] = useFonts({
    'Nexa-Light': require('../assets/fonts/Nexa-ExtraLight.ttf'), 
    'Nexa-Bold': require('../assets/fonts/Nexa-Heavy.ttf'), 
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Stack gerencia a navegação. A primeira rota será o index.tsx
  return <Stack screenOptions={{ headerShown: false }} />; 
}
export default RootLayout;