import { getToken } from "@/helper/tokenStorage";
import {
  Manrope_400Regular,
  Manrope_700Bold,
  useFonts,
} from "@expo-google-fonts/manrope";
import {
  router,
  Tabs
} from "expo-router";
import { useEffect } from "react";
import { Text, TextInput, useColorScheme } from "react-native";

// Global default font
(Text as any).defaultProps = (Text as any).defaultProps || {};
(Text as any).defaultProps.style = {
  fontFamily: "Manrope_400Regular",
};

// Global default font for TextInput
(TextInput as any).defaultProps = (TextInput as any).defaultProps || {};
(TextInput as any).defaultProps.style = {
  fontFamily: "Manrope_400Regular",
};

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    Manrope_400Regular,
    Manrope_700Bold,
  });

  // const [isButtonclicked,setIsButtonClicked] = useState(false);


  // function handleButtonClick(){
  //   setIsButtonClicked(true);
  // }


  const isTokenExist = async()=>{
    const token = await getToken();
    if(token){
      return token;
    }
    return false;
  }
  
useEffect(()=>{

  const token = isTokenExist();
  if(!token){
    router.replace("/login");
  }

},[])

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Dashboard",
        }}
      />

      <Tabs.Screen
        name="payment"
        options={{
          title: "Payment",
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
        }}
      />
    </Tabs>
  );
}