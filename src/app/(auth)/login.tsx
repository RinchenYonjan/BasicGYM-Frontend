import LoginScreen from "@/screens/LoginScreen";
import { StyleSheet, View } from "react-native";

export default function login(){
    return(
        <View style={styles.safeArea}>
        <LoginScreen/>
        </View>
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