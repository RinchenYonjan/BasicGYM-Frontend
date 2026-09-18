import { getToken } from "@/helper/tokenStorage";
import { Manrope_400Regular, Manrope_700Bold, useFonts } from "@expo-google-fonts/manrope";
import { Ionicons } from "@expo/vector-icons";
import { router, Tabs } from "expo-router";
import { useEffect } from "react";
import { Text, TextInput, View } from "react-native";

// Global default font
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = {fontFamily: "Manrope_400Regular"};

// Global default font for TextInput
(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = { fontFamily: "Manrope_400Regular"};


export default function TabLayout() {

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();

        console.log("Token exists:", !!token);

        if (!token) {
          router.replace("/login");
        }

      }catch(error){

        console.error("Error checking token:", error);
        router.replace("/login");
      
      }
    };

    checkToken();

  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={{flex: 1}}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#5B2A6F",
          tabBarInactiveTintColor: "#8A8A8E",
        }}
      >

        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="product"
          options={{
            title: "Product",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "cube" : "cube-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ color, size, focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={size}
                color={color}
              />
            ),
          }}
        />

      </Tabs>
    </View>
  );
}
