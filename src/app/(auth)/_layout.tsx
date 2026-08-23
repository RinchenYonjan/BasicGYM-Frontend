import { Manrope_400Regular, Manrope_700Bold, useFonts } from '@expo-google-fonts/manrope';
import { Image } from 'expo-image';
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
      {/* <Stack/> */}
      <Tabs>
       
        // Home Screen Nav
        <Tabs.Screen name="dashboard" options={{
          headerShown:false,
          title: "Dashboard",
          tabBarIcon:({})=>(
           <Image source={{
            uri:"../assets/images/icon.png"
           }}></Image>
          )
        }}>
        </Tabs.Screen>

        // Payment Screen Nav
        <Tabs.Screen name='payment' options={{
          headerShown:false,
          title:"Payment",
        }}>
        </Tabs.Screen>
        
        // Profile Screen Nav
        <Tabs.Screen name='profile' options={{
          headerShown:false,
          title:"Profile",
        }}>
        </Tabs.Screen>

      </Tabs>
    </ThemeProvider>
  );
}