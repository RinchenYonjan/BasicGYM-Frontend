import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { editUserProfile, getUserProfile } from "../services/ProfileService";


export default function EditProfileScreen(){
  
  const [username, setUsername] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();
  const {data,isPending,error} = useQuery({
    queryKey:["profile"],
    queryFn:getUserProfile,
  })

  useEffect(()=>{
    if(data){
      setUsername(data?.data?.username ?? "");
      setPhonenumber(data?.data?.phonenumber ?? "");
      setAddress(data?.data?.address ?? "");
    }

  },[data])

  const handleSave = async () => {
    try{
      setSaving(true);

      const response = await editUserProfile(
        username,
        phonenumber,
        address
      );

      console.log("Profile updated:",response);
      await queryClient.invalidateQueries({
        queryKey:["profile"]
      })

      // Go back to ProfileScreen
      router.back();

    }catch(error:any){
     
      console.log("Save profile error:",error?.response?.data || error?.message || error );
    
    }finally{

      setSaving(false);
    
    }
  };

  const mutation = useMutation({
    mutationFn:handleSave,
    onSuccess:async (data)=>{
      console.log("Profile updated successfully");
      await queryClient.invalidateQueries({
        queryKey:["profile"]
      })
    },
    onError:(error:any)=>{
      console.log("Error updating profile:",error?.response?.data || error?.message || error);
    }
  })

  if (isPending) {

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#5B2A6F"/>
      </View>
    );
  
  }

  if(error){
    // Toas
  }

  return (
    <KeyboardAvoidingView behavior={
      Platform.OS === "ios"
      ? "padding"
          : undefined
        }>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
         onPress={() => router.back()}
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
          onPress={() => mutation.mutate()}
          disabled={saving}
          activeOpacity={0.8}
          >
          <Text style={styles.saveButtonText}>
            {saving
              ? "Saving..."
              : "Save"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
)}

const styles = StyleSheet.create({ 
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
    fontSize: 16,
    fontWeight: "700",
  },
});