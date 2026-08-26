import ProfileScreen from "@/screens/ProfileScreen";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Profile(){

  return(
    <SafeAreaView style={{ flex: 1 }}>
      <ProfileScreen/>
    </SafeAreaView>
  )

}