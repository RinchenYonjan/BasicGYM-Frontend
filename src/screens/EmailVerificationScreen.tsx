import StepProgressBar from "@/components/Login Component/StepProgressBar";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import AppConfig from "../config/app_config";

const TOTAL_STEPS = 3;
const CURRENT_STEP = 1;

export default function EmailVerificationScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      Toast.show({
        type: "error",
        text1: "Email Required",
        text2: "Please enter your email address.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      Toast.show({
        type: "error",
        text1: "Invalid Email",
        text2: "Please enter a valid email address.",
        visibilityTime:1500,
        autoHide:true,
      });
      return;
    }

    try {
      setLoading(true);

      const url = `${AppConfig.baseURL}/api/auth/send-otp`;

      console.log("Sending OTP to:", normalizedEmail);
      console.log("API URL:", url);

      const response = await axios.post(url, {
        email: normalizedEmail,
      });

      console.log("OTP Response:", response.data);
      console.log("Status:", response.status);

      Toast.show({
        type: "success",
        text1: "OTP Sent",
        text2: "Please check your email for the verification code.",
        visibilityTime:1500,
        autoHide:true,
      });

      // Give Toast time to appear
      setTimeout(() => {
        Toast.hide();

        router.push({
          pathname: "/otp-verify",
          params: {
            email: normalizedEmail,
            step: "2",
            totalSteps: String(TOTAL_STEPS),
          },
        });
      }, 1500);

    } catch (error: any) {

      console.log("Message:", error?.message);
      console.log("Status:", error?.response?.status);
      console.log("Data:", error?.response?.data);

      let errorMessage = "Something went wrong. Please try again.";

      if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.message === "Network Error") {
        errorMessage = "Unable to connect to the server. Please check your connection.";
      }

      Toast.show({
        type: "error",
        text1: "Unable to Send OTP",
        text2: errorMessage,
        visibilityTime:1500,
        autoHide:true,
      });

    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.replace("/login");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled">


        {/* Header */}
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.iconButton}
            onPress={() => router.back()}>

            <Ionicons
              name="arrow-back"
              size={24}
              color="#1F1F1F"
              />
          </TouchableOpacity>

          <StepProgressBar
            currentStep={CURRENT_STEP}
            totalSteps={TOTAL_STEPS}
            color="#5B2A6F"
            />

          <TouchableOpacity
            style={styles.iconButton}
            onPress={handleClose}>

            <Ionicons
              name="close"
              size={24}
              color="#1F1F1F"
              />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>

          {/* Icon */}
          <View style={styles.iconContainer}>
            <Ionicons
              name="mail-outline"
              size={42}
              color="#5B2A6F"
              />
          </View>

          {/* Title */}
          <Text style={styles.title}>
            Verify your email
          </Text>

          {/* Description */}
          <Text style={styles.description}>
            Enter your email address and we'll send you
            a verification code.
          </Text>

          {/* Label */}
          <Text style={styles.label}>
            Email Address
          </Text>

          {/* Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#888"
              />

            <TextInput
              style={styles.input}
              placeholder="Enter your email"
              placeholderTextColor="#A0A0A0"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!loading}
              />
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              loading && styles.disabledButton,
            ]}
            onPress={handleSendOtp}
            disabled={loading}
            >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <>
                <Text style={styles.buttonText}>
                  Send OTP
                </Text>

                <Ionicons
                  name="arrow-forward"
                  size={20}
                  color="#FFFFFF"
                  />
              </>
            )}
          </TouchableOpacity>

          {/* Info */}
          <Text style={styles.infoText}>
            We'll send a 6-digit verification code to
            your email address.
          </Text>

        </View>
      </ScrollView>   
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContainer: {
    flexGrow: 1,
  },

  headerRow: {
    marginTop: 30,
    marginHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#F5F3F6",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },

  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#F3EDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 28,
  },

  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1F1F1F",
    marginBottom: 12,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: "#777777",
    marginBottom: 40,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 10,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 58,
    borderWidth: 1,
    borderColor: "#E2E2E2",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 24,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222222",
    marginLeft: 12,
  },

  button: {
    height: 56,
    backgroundColor: "#5B2A6F",
    borderRadius: 14,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },

  disabledButton: {
    opacity: 0.7,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  infoText: {
    textAlign: "center",
    color: "#999999",
    fontSize: 13,
    lineHeight: 20,
    marginTop: 20,
    paddingHorizontal: 20,
  },
});