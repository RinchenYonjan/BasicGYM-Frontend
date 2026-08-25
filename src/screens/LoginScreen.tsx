import { loginUser } from '@/api/auth.api';
import ButtonComp from '@/components/Login Component/ButtonComp';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from "react-native-toast-message";


export default function LoginScreen() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      console.log("this is response only",res.data);

      console.log('this is res', res.data.token);

      if (res.data.token) {
        Toast.show({
          type:"success",
          text1:"Logged in successfully",
          autoHide:true,
          visibilityTime:3000
        })
        router.replace('/(auth)/dashboard');
      }
      
    }catch(error:any) {

      console.log('Login error:', error.response.data);
      const message = error?.response?.data;
      const errorMesage = message.message;
      console.log("this is error Message",errorMesage);

      Toast.show({
        type:"error",
        text1:errorMesage,
        position:"top",
        visibilityTime:3000,
        autoHide:true,
        
      })
    
    }
  };

  return (

    <View style={styles.container}>

      <Toast/>
    
      {/* ================= BACK BUTTON ================= */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10,
        }}
      >
        <Ionicons
          name="arrow-back"
          size={24}
          color="#000"
        />
      </TouchableOpacity>


      {/* ================= HEADER ================= */}
      <View style={styles.header}>
        <Text style={styles.title}>GYM</Text>

        <Text style={styles.subtitle}>
          Fitness App
        </Text>
      </View>


      {/* CENTER FORM */}
      <View style={styles.formContainer}>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <Ionicons
            name="mail"
            size={20}
            color='#E53935'
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.input}
            placeholder="useremail@gmail.com"
            placeholderTextColor="#9A9A9A"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>


        {/* Password */}
        <View style={styles.inputWrapper}>
          <MaterialCommunityIcons
            name="lock"
            size={20}
            color="#000"
            style={styles.inputIcon}
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9A9A9A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />

          <TouchableOpacity
            onPress={() =>
              setShowPassword((prev) => !prev)
            }
            hitSlop={{
              top: 10,
              bottom: 10,
              left: 10,
              right: 10,
            }}
          >
            <Ionicons
              name={showPassword ? 'eye' : 'eye-off'}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Login Button */}
        <ButtonComp onPress={handleLogin} />

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    width: '100%',
  },

  // ================= BACK BUTTON =================
  backButton: {
    position: 'absolute',
    top: 24,
    left: 0,
    zIndex: 10,
  },

  // ================= HEADER =================
  header: {
    position: 'absolute',
    top: 150,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#E53935',
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: '#E53935',
    marginTop: 4,
    fontStyle: 'italic',
  },

  // ================= FORM =================
  formContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },

  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 16,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },

});