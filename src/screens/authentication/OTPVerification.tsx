// src/app/otp-verification.tsx
import { sendOtp, verifyOtp } from '@/api/auth.api';
import StepProgressBar from '@/components/login/ProgressBar';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

const OTP_LENGTH = 4;
const PURPLE = '#5B2A6F';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{step?:string; totalSteps?:string; email:string, username?: string}>();
  const username = params.username || "";
  const firstName = username.trim().split(" ")[0];
  const email = params.email || "";

  console.log("this is value in params",params.email);

  // Falls back to step 2 of 3 if navigated to directly without params
  const currentStep = Number(params.step) || 2;
  const totalSteps = Number(params.totalSteps) || 3;

  const [otp, setOtp] = useState<string[]>(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef<Array<TextInput | null>>([]);

  const handleChange = (text: string, index: number) => {
    // only allow single digit
    const digit = text.replace(/[^0-9]/g, '').slice(-1);

    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);

    if (digit && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const maskEmail = (email:string)=>{

    const [username, domain] = email.split("@");

    const visibleCharacters = 3;

    if(email.length <= visibleCharacters){
      return `${username}@${domain}`;
    }

    return(`${username.slice(0, visibleCharacters)}${"*".repeat(username.length - visibleCharacters)}@${domain}`
    )
  }

  const handleSubmit = async () => {
    const code = otp.join('');

    if(code.length < OTP_LENGTH){
      Toast.show({
        type: "error",
        text1: "Incomplete OTP",
        text2: "Please enter the complete 4-digit OTP.",
        visibilityTime:1500,
        autoHide:true
      })
      return;
    };

    try{

      const response_from_otp_api = await verifyOtp(params.email,code);
      Toast.show({
        type:"success",
        text1:response_from_otp_api,
        visibilityTime:1500,
        autoHide:true
      })
        router.push({
      pathname: '/create-password',
      params: { step: '3', totalSteps: String(totalSteps) },
    });

    }catch(err:any){

      Toast.show({
        type:"error",
        text1:err?.response?.data?.message,
        visibilityTime:1500,
        autoHide:true
      })

      console.error("This is error.",err?.response?.data?.message);
    }
  };

  const handleResend = async() => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();

    const email = params?.email;
    
    if(!email){
      router.replace('/email-verify');
      return;
    }

    try{
      await sendOtp(email);
      console.log("OTP send successfully to", email);
      Toast.show({
        type:"success",
        text1:"OTP sent successfully.",
        text2: "Please check your email.",
        autoHide:true,
        visibilityTime:1500
      })

    }catch(err:any){
      console.error("this is error",err?.response);
      Toast.show({
        type:"error",
        text1:"Something went wrong. Please try later.",
        autoHide:true,
        visibilityTime:1500

      })
    }
  };

  const handleClose = () => {
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >

      <View style={styles.headerRow}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <StepProgressBar
          currentStep={currentStep}
          totalSteps={totalSteps}
          color={PURPLE}
        />

        <TouchableOpacity style={styles.iconButton} onPress={handleClose}>
          <Ionicons name="close" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      <View style={styles.illustrationWrap}>
        <Image
          source={require('../../../assets/otp-illustration.png')}
          resizeMode="contain"
          style={styles.illustration}
        />
      </View>

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.greeting}>Hello {firstName || 'User'},</Text>
      <Text style={styles.subtitle}>
      Please type the OTP as shared on email address{'\n'}{maskEmail(email) || "your email address"}.
      </Text>

      {/* OTP boxes */}
      <View style={styles.otpRow}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => {
              if (ref) inputsRef.current[index] = ref;
            }}
            style={styles.otpBox}
            value={digit}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        ))}
      </View>

      <TouchableOpacity onPress={handleResend} style={styles.resendWrap}>
        <Text style={styles.resendText}>
          OTP not received?{' '}
          <Text style={styles.resendLink}>RESEND</Text>
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 1 }} />

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Submit</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 32,
  },
  
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 24,
  },
  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F3F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 24,
  },
  illustration: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 12,
  },
  greeting: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A1A',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: '#8A8A8A',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 32,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 14,
    marginBottom: 20,
  },
  otpBox: {
    width: 56,
    height: 56,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: 10,
    fontSize: 20,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  resendWrap: {
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    color: '#8A8A8A',
  },
  resendLink: {
    color: PURPLE,
    fontWeight: '700',
  },
  submitButton: {
    backgroundColor: PURPLE,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
});