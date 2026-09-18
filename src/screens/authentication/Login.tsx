import { loginUser } from "@/services/authentication.service";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

const BRAND = "#E8291C";
const BRAND_DARK = "#B22A2D";
const INK = "#1A1A1E";
const MUTED = "#8A8A93";
const BORDER = "#E7E7EA";
const BORDER_FOCUS = BRAND;
const BG = "#FAFAFB";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [focusedField, setFocusedField] = useState<"email" | "password" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Track first back press
  const backPressedOnce = useRef(false);

  // Store timeout
  const backPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Double back press to exit
  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce.current) {
        Toast.hide();
        BackHandler.exitApp();
        return true;
      }

      backPressedOnce.current = true;

      Toast.show({
        type: "info",
        text1: "Tap back again to exit",
        text2: "Press back or swipe again to close the app",
        visibilityTime: 2000,
        autoHide: true,
      });

      backPressTimeout.current = setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);

      return true;
    };

    const subscription = BackHandler.addEventListener("hardwareBackPress", backAction);

    return () => {
      subscription.remove();
      if (backPressTimeout.current) {
        clearTimeout(backPressTimeout.current);
      }
    };
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({
        type: "error",
        text1: "Empty fields",
        text2: "Please enter both email and password.",
        visibilityTime: 1500,
        autoHide: true,
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await loginUser(email, password);

      if (res.data.token) {
        Toast.show({
          type: "success",
          text1: "SignIn successful",
          text2: "Welcome back!",
          autoHide: true,
          visibilityTime: 1500,
        });

        router.replace("/(tabs)/dashboard");
      }
    
    } catch (error: any) {
      
      const message = error?.response?.data?.message || "Something went wrong. Please try again later.";

      Toast.show({
        type: "error",
        text1: "Login failed",
        text2: message,
        position: "top",
        visibilityTime: 1500,
        autoHide: true,
      });

    } finally {
      setIsSubmitting(false);
    }
    
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

    
        {/* Header */}
        <View style={styles.header}>
          <Image source={require('../../../assets/app-images/app-logo.png')} style={styles.logoBadge}/>
          <Text style={styles.subtitle}>Train smarter every day.</Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeading}>Welcome back</Text>
          <Text style={styles.cardSubheading}>
            Sign in to continue your progress
          </Text>

          {/* Email */}
          <Text style={styles.label}>Email</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "email" && styles.inputWrapperFocused,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={19}
              color={focusedField === "email" ? BRAND : MUTED}
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="you@example.com"
              placeholderTextColor="#B4B4BC"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isSubmitting}
            />
          </View>

          {/* Password */}
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputWrapper,
              focusedField === "password" && styles.inputWrapperFocused,
            ]}>

            <MaterialCommunityIcons
              name="lock-outline"
              size={20}
              color={focusedField === "password" ? BRAND : MUTED}
              style={styles.inputIcon}
              />
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#B4B4BC"
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              secureTextEntry={!showPassword}
              editable={!isSubmitting}
              />
            <TouchableOpacity
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={20}
                color={MUTED}
              />
            </TouchableOpacity>
          </View>

          {/* Forgot Password */}
          <Pressable
            style={styles.forgetBtn}
            onPress={() => router.push("/email-verify")}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
            <Text style={styles.forgetBtnText}>Forgot password?</Text>
          </Pressable>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginBtn, isSubmitting && styles.loginBtnDisabled]}
            onPress={handleLogin}
            disabled={isSubmitting}
            activeOpacity={0.85}
            >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginBtnText}>Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Sign up link */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <Pressable onPress={() => router.push("/")} hitSlop={8}>
            <Text style={styles.footerLink}>Sign up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1
  },

  scrollContent: {
    justifyContent: "center",
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  
  header: {
    alignItems: "center",
    marginBottom: 32,
  },

  logoBadge: {
    width: 120,
    height: 120,
    borderRadius: 80,
    backgroundColor: BRAND_DARK,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: BRAND,
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },

  subtitle: {
    fontSize: 14,
    color: '#000000b5',
    marginTop: 4,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },

  cardHeading: {
    fontSize: 20,
    fontWeight: "700",
    color: INK,
  },

  cardSubheading: {
    fontSize: 13,
    color: MUTED,
    marginTop: 4,
    marginBottom: 22,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: INK,
    marginBottom: 6,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    marginBottom: 18,
    backgroundColor: "#FCFCFD",
  },

  inputWrapperFocused: {
    borderColor: BORDER_FOCUS,
    backgroundColor: "#FFFFFF",
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: INK,
  },

  forgetBtn: {
    alignSelf: "flex-end",
    marginBottom: 20,
    marginTop: -6,
  },

  forgetBtnText: {
    fontSize: 13,
    fontWeight: "600",
    color: BRAND,
  },

  loginBtn: {
    height: 52,
    borderRadius: 12,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 4,
  },

  loginBtnDisabled: {
    backgroundColor: "#000000c8",
    opacity: 0.8,
  },

  loginBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.3,
  },

  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },

  footerText: {
    fontSize: 13,
    color: MUTED,
  },

  footerLink: {
    fontSize: 13,
    fontWeight: "700",
    color: BRAND,
  },
});