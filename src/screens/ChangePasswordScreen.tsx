import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { changeUserPassword } from "../services/ProfileService";


type PasswordInputProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  secureTextEntry: boolean;
  showPassword: boolean;
  onToggle: () => void;
};

function PasswordInput({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  showPassword,
  onToggle,
}: PasswordInputProps) {
  return (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#777777"
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TouchableOpacity
        style={styles.eyeButton}
        onPress={onToggle}
        activeOpacity={0.7}
      >
        <Ionicons
          name={
            showPassword
              ? "eye-outline"
              : "eye-off-outline"
          }
          size={23}
          color="#666666"
        />
      </TouchableOpacity>
    </View>
  );
}

export default function ChangePasswordScreen() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [saving, setSaving] = useState(false);

  const handleConfirm = async () => {
    if(!currentPassword || !newPassword || !confirmPassword) {
      console.log("Please fill in all fields");

      Toast.show({
        type:"error",
        text1:"Please fill in all fields",
        position:"top",
        visibilityTime:3000,
        autoHide:true,      
      })

      return;
    }

    if(newPassword.length < 8 || newPassword.length > 25) {
      console.log("Password must be between 8 and 25 characters");

      Toast.show({
        type:"error",
        text1:"Password must be between 8 and 25 characters",
        position:"top",
        visibilityTime:3000,
        autoHide:true,      
      })

      return;
    }

    if(newPassword !== confirmPassword) {
      console.log("New passwords do not match");

       Toast.show({
        type:"error",
        text1:"New passwords do not match",
        position:"top",
        visibilityTime:3000,
        autoHide:true,      
      })
      return;
    }

    try{
      setSaving(true);
      const response = await changeUserPassword(currentPassword, newPassword);

      console.log("Password change response:",response);
      console.log("Password changed successfully");
      router.back();

    }catch(error:any){

      console.log("Change password error:",error?.response?.data || error?.message || error);
    
    }finally{

      setSaving(false);
    
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={30}
              color="#111111"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Change Password
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Password Rules */}
        <View style={styles.rulesBox}>
          <Text style={styles.rulesTitle}>
            Choose a strong password by following these rules:
          </Text>

          <Text style={styles.ruleText}>
            1. Password must be 8-25 characters only
          </Text>

          <Text style={styles.ruleText}>
            2. Password must contain alpha-numeric value with at least 1 character, 1 number and special character.
          </Text>
        </View>

        {/* Current Password */}
        <PasswordInput
          placeholder="Current Password"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry={!showCurrent}
          showPassword={showCurrent}
          onToggle={() =>
            setShowCurrent(!showCurrent)
          }
        />

        {/* New Password */}
        <PasswordInput
          placeholder="New Password"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry={!showNew}
          showPassword={showNew}
          onToggle={() =>
            setShowNew(!showNew)
          }
        />

        {/* Confirm Password */}
        <PasswordInput
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirm}
          showPassword={showConfirm}
          onToggle={() =>
            setShowConfirm(!showConfirm)
          }
        />

        {/* Confirm Button */}
        <TouchableOpacity
          style={[
            styles.confirmButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleConfirm}
          disabled={saving}
          activeOpacity={0.85}
        >
          {saving ? (
            <ActivityIndicator
              color="#FFFFFF"
              size="small"
            />
          ) : (
            <Text style={styles.confirmText}>
              Save
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingHorizontal: 25,
    paddingBottom: 40,
  },

  header: {
    height: 105,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 45,
    height: 45,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 21,
    fontWeight: "800",
    color: "#111111",
  },

  headerSpacer: {
    width: 45,
  },

  rulesBox: {
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 12,
    paddingHorizontal: 27,
    paddingVertical: 14,
    marginTop: 29,
    marginBottom: 49,
    minHeight: 125,
  },

  rulesTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111111",
    marginBottom: 14,
  },

  ruleText: {
    fontSize: 12,
    lineHeight: 19,
    color: "#222222",
    marginBottom: 5,
  },

  inputWrapper: {
    position: "relative",
    marginBottom: 31,
  },

  input: {
    height: 57,
    borderWidth: 1,
    borderColor: "#111111",
    borderRadius: 4,
    paddingLeft: 15,
    paddingRight: 50,
    fontSize: 14,
    color: "#111111",
  },

  eyeButton: {
    position: "absolute",
    right: 12,
    top: 0,
    height: 57,
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },

  confirmButton: {
    height: 57,
    borderRadius: 30,
    backgroundColor: "#111111",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 27,
  },

  confirmText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },

  disabledButton: {
    opacity: 0.6,
  },
});