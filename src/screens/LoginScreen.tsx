import { loginUser } from "@/api/auth.api";
import ButtonComp from "@/components/Login Component/ButtonComp";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function LoginScreen() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Track first back press
  const backPressedOnce = useRef(false);

  // Store timeout
  const backPressTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Double back press to exit
  useEffect(() => {
    const backAction = () => {
      if (backPressedOnce.current) {
        Toast.hide();
        BackHandler.exitApp();
        return true;
      }

      // First back press
      backPressedOnce.current = true;

      Toast.show({
        type: "info",
        text1: "Tap back again to exit",
        text2: "Press back or swipe again to close the app",
        visibilityTime: 2000,
        autoHide: true,
      });

      // Reset after 2 seconds
      backPressTimeout.current = setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);

      return true;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => {
      subscription.remove();

      if (backPressTimeout.current) {
        clearTimeout(backPressTimeout.current);
      }
    };
  }, []);

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);

      console.log("this is response only", res.data);
      console.log("this is res", res.data.token);

      if (res.data.token) {
        Toast.show({
          type: "success",
          text1: "Logged in successfully",
          autoHide: true,
          visibilityTime: 1500,
        });

        router.replace("/(tabs)/dashboard");
      }
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        "Something went wrong. Please try again.";

      console.log("this is error Message", message);

      Toast.show({
        type: "error",
        text1: message,
        position: "top",
        visibilityTime: 1500,
        autoHide: true,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
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
            color="#E53935"
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
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <Pressable
          style={styles.forgetBtn}
          onPress={() => {
            router.push("/email-verify");
          }}
        >
          <Text style={styles.forgetBtnText}>
            Forget?
          </Text>
        </Pressable>

        {/* Login Button */}
        <ButtonComp onPress={handleLogin} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  header: {
    position: "absolute",
    top: 150,
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 10,
  },

  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E53935",
    letterSpacing: 1,
  },

  subtitle: {
    fontSize: 14,
    color: "#E53935",
    marginTop: 4,
    fontStyle: "italic",
  },

  formContainer: {
    flex: 1,
    justifyContent: "center",
    width: "100%",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E0E0E0",
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
    color: "#000",
  },

  forgetBtn: {
    marginBottom: 12,
  },

  forgetBtnText: {
    textAlign: "right",
  },
});