import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ButtonComp(){
    return(
        <View>
        <TouchableOpacity style={styles.loginButton} activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
     loginButton: {
    backgroundColor: '#000',
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
})