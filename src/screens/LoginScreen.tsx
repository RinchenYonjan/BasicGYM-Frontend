import { loginUser } from '@/api/auth.api';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const RED = '#E53935';

type LoginScreenProps = {
  navigation?: {
    goBack: () => void;
  };
};

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const handleLogin = async ()=>{
    
    const res=await loginUser(email,password)
    console.log("this is res",res.data.token)
    
    if(res.data.token){
      router.replace("/(auth)/dashboard")
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View>
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack?.()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        {/* Title */}
        <View style={styles.header}>
          <Text style={styles.title}>GYM</Text>
          <Text style={styles.subtitle}>Fitness App</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          {/* Email */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail"
              size={20}
              color={RED}
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
              onPress={() => setShowPassword((prev) => !prev)}
            >
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={20}
                color="#555"
              />
            </TouchableOpacity>
            {/* <Text>Helo</Text> */}

            
          </View>
          {/* <Pressable style={{
            backgroundColor:"red"
          }}>
        <Text style={{
          color:"black",
          backgroundColor:"red"
        }}>Login</Text>
      </Pressable> */}
        </View>
      </View>
      {/* <Pressable style={{
            backgroundColor:"red",
            borderColor:"red",
          }}>
        <Text style={{
          color:"black",
          backgroundColor:"red"
        }}>Login</Text> */}
      {/* </Pressable> */}
      {/* <ButtonComp/>
       */}
        <View>
               <TouchableOpacity style={styles.loginButton} activeOpacity={0.85 } onPress={()=>handleLogin()}>
                 <Text style={styles.loginButtonText}>Log In</Text>
               </TouchableOpacity>
               </View>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
  },
  backButton: {
    marginTop: 16,
    width: 32,
  },
  header: {
    alignItems: 'center',
    marginTop: 48,
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: RED,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    color: RED,
    marginTop: 4,
    fontStyle: 'italic',
  },
  form: {
    marginTop: 8,
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 32,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: RED,
    marginRight: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rememberText: {
    fontSize: 13,
    color: '#000',
  },
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
});

