// src/app/otp-verification.tsx
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

import StepProgressBar from '@/components/Login Component/StepProgressBar';

const OTP_LENGTH = 4;
const PURPLE = '#5B2A6F';

export default function OtpVerificationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ step?: string; totalSteps?: string }>();

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

  const handleSubmit = () => {
    const code = otp.join('');
    if (code.length < OTP_LENGTH) return;

    // TODO: verify code with your backend
    router.push({
      pathname: '/create-password',
      params: { step: '3', totalSteps: String(totalSteps) },
    });
  };

  const handleResend = () => {
    setOtp(Array(OTP_LENGTH).fill(''));
    inputsRef.current[0]?.focus();
    // TODO: trigger resend OTP API call
  };

  const handleClose = () => {
    router.replace('/login');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      {/* Header row: Back button + Progress bar + Close button */}
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

      {/* Illustration — swap for your own asset */}
      <View style={styles.illustrationWrap}>
        <Image
          source={require('../../assets/otp-illustration.png')}
          resizeMode="contain"
          style={styles.illustration}
        />
      </View>

      <Text style={styles.title}>OTP Verification</Text>
      <Text style={styles.greeting}>Hello Tsstudio,</Text>
      <Text style={styles.subtitle}>
        Thank you for registering with you. Please type the OTP as shared on
        your mobile{'\n'}XXXXXXX123
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