import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { DarkTheme, DefaultTheme, Tabs, ThemeProvider } from 'expo-router';
import { Text, TextInput, useColorScheme } from 'react-native';

// Global default font for all Text components
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = { fontFamily: 'Manrope_400Regular' };

// Global default font for all TextInput components
(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = { fontFamily: 'Manrope_400Regular' };

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  if (!fontsLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Tabs>
        <Tabs.Screen name='(auth)/login' options={{
          headerShown:false,
          title:""

        }}>
          
        </Tabs.Screen>
        <Tabs.Screen name="(auth)/dashboard" options={{
          headerShown:false,
          title:"Home"
        }}>
        </Tabs.Screen>
        <Tabs.Screen name='(auth)/payment' options={{
          headerShown:false,
          title:"Payment"
        }}>
        </Tabs.Screen>
      </Tabs>
    </ThemeProvider>
  );
}