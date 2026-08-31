import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PURPLE = "#5B2A6F";
const GREEN = "#22C55E";
const GREEN_BG = "#DCFCE7";

type Requirement = {
  label: string;
  test: (value: string) => boolean;
};

const REQUIREMENTS: Requirement[] = [
  { label: "12 characters", test: (v) => v.length >= 12 },
  { label: "1 number", test: (v) => /[0-9]/.test(v) },
  { label: "1 special character", test: (v) => /[^A-Za-z0-9]/.test(v) },
  { label: "1 letter", test: (v) => /[A-Za-z]/.test(v) },
];

function generatePassword(length = 14) {
  const chars =
    "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@#$%^&*";
  let out = "";
  for (let i = 0; i < length; i++) {
    out += chars[Math.floor(Math.random() * chars.length)];
  }
  return out;
}

export default function CreatePasswordScreen() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const allMet = REQUIREMENTS.every((r) => r.test(password));

  const handleContinue = () => {
    if (!allMet) return;
    // proceed with `password`
    router.push("/(tabs)/dashboard");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={26} color="#111111" />
        </TouchableOpacity>

        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: "60%" }]} />
        </View>

        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.replace("/login")}
          activeOpacity={0.7}>

          <Ionicons name="close" size={26} color="#111111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        <Text style={styles.title}>Password</Text>
        <Text style={styles.subtitle}>Create a unique password</Text>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <TouchableOpacity
            style={styles.eyeButton}
            onPress={() => setShowPassword((s) => !s)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={showPassword ? "eye-outline" : "eye-off-outline"}
              size={22}
              color="#666666"
            />
          </TouchableOpacity>
        </View>

        {/* Generate password */}
        <TouchableOpacity
          onPress={() => setPassword(generatePassword())}
          activeOpacity={0.7}
        >
          <Text style={styles.generateText}>Generate a password</Text>
        </TouchableOpacity>

        {/* Requirements */}
        <Text style={styles.requirementsTitle}>Minimum requirements:</Text>

        {REQUIREMENTS.map((req) => {
          const met = req.test(password);
          return (
            <View key={req.label} style={styles.requirementRow}>
              <View
                style={[
                  styles.checkCircle,
                  met && styles.checkCircleMet,
                ]}
              >
                {met && (
                  <Ionicons name="checkmark" size={13} color={GREEN} />
                )}
              </View>
              <Text style={styles.requirementText}>{req.label}</Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Continue Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !allMet && styles.disabledButton,
          ]}
          onPress={handleContinue}
          disabled={!allMet}
          activeOpacity={0.85}
        >
          <Text style={styles.continueText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 32,
  },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  iconButton: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: '#F5F3F6',
    alignItems: "center",
    justifyContent: "center",
  },

  progressTrack: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: PURPLE,
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 15,
    paddingBottom: 40,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: "#666666",
    marginBottom: 24,
  },

  inputWrapper: {
    position: "relative",
    marginBottom: 20,
  },

  input: {
    height: 54,
    borderWidth: 1,
    borderColor: "#D0D0D0",
    borderRadius: 10,
    paddingLeft: 15,
    paddingRight: 50,
    fontSize: 15,
    color: "#111111",
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    height: 54,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },

  generateText: {
    fontSize: 15,
    fontWeight: "600",
    color: PURPLE,
    marginBottom: 24,
  },

  requirementsTitle: {
    fontSize: 15,
    color: "#444444",
    marginBottom: 14,
  },

  requirementRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },

  checkCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#D0D0D0",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  checkCircleMet: {
    borderColor: GREEN,
    backgroundColor: GREEN_BG,
  },

  requirementText: {
    fontSize: 14,
    color: "#333333",
  },

  footer: {
    paddingHorizontal: 25,
    paddingBottom: 25,
  },

  continueButton: {
    height: 56,
    borderRadius: 30,
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    opacity: 0.4,
  },

  continueText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});