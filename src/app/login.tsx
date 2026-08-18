import LoginScreen from "@/screens/LoginScreen";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function login(){

    return(

        <SafeAreaView style={styles.safeArea}>
        <LoginScreen/>
        </SafeAreaView>
   
    )

}

const styles = StyleSheet.create({
    safeArea: {
    flex:1, 
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#fff'
  },
})