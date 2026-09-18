import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
import { editUserProfile, getUserProfile } from "../../services/profile.service";

export default function EditProfileScreen() {
  const [username, setUsername] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");

  const queryClient = useQueryClient();

  // Get current profile
  const {data, isPending, error} = useQuery({
    queryKey: ["profile"],
    queryFn: getUserProfile,
  });

  // Put existing profile data into input fields
  useEffect(() => {
    if (data?.data) {
      setUsername(data.data.username ?? "");
      setPhonenumber(data.data.phonenumber ?? "");
      setAddress(data.data.address ?? "");
    }
  }, [data]);

  // Update profile mutation
  const mutation = useMutation({
    mutationFn: () =>
      editUserProfile(
        username.trim(),
        phonenumber.trim(),
        address.trim()
      ),

    onSuccess: async (response) => {
      console.log("Profile updated successfully:", response);

      // Refresh profile data
      await queryClient.invalidateQueries({
        queryKey: ["profile"],
      });

      router.replace("/(tabs)/profile");
    },

    onError: (error: any) => {
      console.log(
        "Error updating profile:",
        error?.response?.data ||
          error?.message ||
          error
      );
    },
  });

  const handleSave = () => {
    // Optional validation
    if (!username.trim()) {
      console.log("Name is required");
      return;
    }

    if (!phonenumber.trim()) {
      console.log("Phone number is required");
      return;
    }

    if (!address.trim()) {
      console.log("Address is required");
      return;
    }

    mutation.mutate();
  };

  // Loading profile
  if (isPending) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#5B2A6F"
        />
      </View>
    );
  }

  // Profile loading error
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>
          Error loading profile.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() =>
            queryClient.invalidateQueries({
              queryKey: ["profile"],
            })
          }
        >
          <Text style={styles.retryText}>
            Try Again
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() =>
            router.back()
          }
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#1C1C1E"
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Edit Profile
        </Text>

        {/* Empty space to keep title positioning */}
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Name */}
        <Text style={styles.label}>
          Name
        </Text>

        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Enter your name"
          placeholderTextColor="#8A8A8E"
          autoCapitalize="words"
          editable={!mutation.isPending}
        />

        {/* Address */}
        <Text style={styles.label}>
          Address
        </Text>

        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
          placeholderTextColor="#8A8A8E"
          autoCapitalize="words"
          editable={!mutation.isPending}
        />

        {/* Phone Number */}
        <Text style={styles.label}>
          Phone Number
        </Text>

        <TextInput
          style={styles.input}
          value={phonenumber}
          onChangeText={setPhonenumber}
          placeholder="Enter your phone number"
          placeholderTextColor="#8A8A8E"
          keyboardType="phone-pad"
          editable={!mutation.isPending}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            mutation.isPending &&
              styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={mutation.isPending}
          activeOpacity={0.8}
        >
          {mutation.isPending ? (
            <View style={styles.savingContainer}>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                Saving...
              </Text>
            </View>
          ) : (
            <Text style={styles.saveButtonText}>
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
    backgroundColor: "#F2F1F5",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F2F1F5",
    alignItems: "center",
    justifyContent: "center",
  },

  errorText: {
    fontSize: 16,
    color: "#B80202",
    marginBottom: 15,
  },

  retryButton: {
    backgroundColor: "#5B2A6F",
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 22,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },

  header: {
    height: 60,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#F2F1F5",
  },

  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },

  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    color: "#1C1C1E",
    marginLeft: 8,
  },

  headerRight: {
    width: 40,
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 40,
  },

  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8A8A8E",
    marginTop: 20,
    marginBottom: 8,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#EAEAED",
  },

  saveButton: {
    backgroundColor: "#5B2A6F",
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  savingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});