import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { editUserProfile, getUserProfile } from "../services/ProfileService";

type EditProfileScreenProps = {
  onBack: () => void;
};

export default function EditProfileScreen({onBack}: EditProfileScreenProps) {
  
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getUserProfile();

      console.log("Profile data:",response);

      const data = response?.data;

      if (!data) {
        console.log("No profile data found");
        return;
      }

      setUsername(data.username ?? "");
      setEmail(data.email ?? "");
      setPhonenumber(data.phonenumber ?? "");
      setAddress(data.address ?? "");

    }catch(error:any){

      console.log("Edit profile fetch error:",error?.response?.data || error?.message || error);

    }finally{

      setLoading(false);
    }
  };

  const handleSave = async () => {
    try{
      setSaving(true);

      const response = await editUserProfile(
        username,
        email,
        phonenumber,
        address
      );

      console.log("Profile updated:",response);

      // Go back to ProfileScreen
      onBack();
    }catch(error:any){
     
      console.log("Save profile error:",error?.response?.data || error?.message || error );
    
    }finally{

      setSaving(false);
    
    }
  };

  if (loading) {

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#5B2A6F"/>
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
      }>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          activeOpacity={0.7}>

          <Ionicons
            name="arrow-back"
            size={24}
            color="#1C1C1E"/>

        </TouchableOpacity>

        <Text style={styles.headerTitle}>
          Edit Profile
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={
          styles.scrollContent
        }
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

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
        />

        {/* Email */}
        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          placeholderTextColor="#8A8A8E"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
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
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          <Text style={styles.saveButtonText}>
            {saving
              ? "Saving..."
              : "Save Changes"}
          </Text>
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

  saveText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#5B2A6F",
  },

  disabledSave: {
    opacity: 0.5,
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
    marginTop: 30,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
  },
});