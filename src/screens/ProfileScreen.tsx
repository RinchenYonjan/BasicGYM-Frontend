import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ActivityIndicator, Image, ScrollView, StatusBar, StyleSheet, Switch, Text, TouchableOpacity, View, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserProfile } from "../services/ProfileService";

function SectionLabel({text}:{text: string;}) {
  return (
    <Text style={styles.sectionLabel}>
      {text}
    </Text>
  );
}

function InfoRow({label,value,isLast}:{
  label: string;
  value: string;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        !isLast && styles.rowBorder,
      ]}>

      <Text style={styles.infoLabel}>
        {label}
      </Text>

      <Text
        style={styles.infoValue}
        numberOfLines={1}>

        {value || "-"}
      </Text>
    </View>
  );
}

function NavRow({label,onPress,isLast,chevron = true}:{
  label: string;
  onPress?:() => void;
  isLast?: boolean;
  chevron?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[
        styles.row,
        !isLast && styles.rowBorder,
      ]}
      activeOpacity={0.6}
      onPress={onPress}>
        
      <Text style={styles.rowLabel}>
        {label}
      </Text>

      {chevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color="#8A8A8E"
        />
      )}
    </TouchableOpacity>
  );
}

function ToggleRow({label,value,onValueChange,isLast}:{
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View
      style={[
        styles.row,
        !isLast && styles.rowBorder,
      ]}>

      <Text style={styles.rowLabel}>
        {label}
      </Text>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#E0E0E5",
          true: "#5B2A6F",
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E0E0E5"/>
        
    </View>
  );
}

export default function ProfileScreen() {
  const [appNotifications, setAppNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    address: "",
    email: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(true);

  useFocusEffect(
  useCallback(() => {
    fetchProfile();
  }, [])
);

  const fetchProfile = async () => {
    try{
      setLoading(true);

      const response = await getUserProfile();
      console.log("Profile screen response:",response);
      const data = response?.data;

      if (!data) {
        console.log("Profile data not found");
        return;
      }

      setProfile({
        name: data.username ?? "",
        address: data.address ?? "",
        email: data.email ?? "",
        phoneNumber: data.phonenumber ?? "",
      });

    }catch(error:any){

      console.log("Profile screen error:",error?.response?.data || error?.message || error);
      
      if(error?.response?.status === 401){
        router.replace("/login");
      }

    }finally{
      setLoading(false);
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#F2F1F5"/>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  profile.name || "User"
                )}&background=DDDDDD&color=555555&size=256`,
              }}
              style={styles.avatar}/>

            <TouchableOpacity
              style={styles.cameraBadge}
              activeOpacity={0.7}>

              <Ionicons
                name="camera"
                size={14}
                color="#FFFFFF"/>
                 
            </TouchableOpacity>
          </View>

          {/* Name */}
          <Text style={styles.name}>
            {profile.name || "No name"}
          </Text>

          {/* Email address */}
          <Text style={styles.handle}>
            {profile.email ||
              "No Email Address"}
          </Text>
        </View>

        {/* Profile */}
        <View style={styles.sectionHeader}>
          <SectionLabel text="PROFILE" />

          <TouchableOpacity
            activeOpacity={0.6}
           onPress={() => router.push("/edit-profile")}>

            <Text style={styles.editText}>
              Edit
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.card}>
          <InfoRow
            label="Name"
            value={profile.name}/>

          <InfoRow
            label="Address"
            value={profile.address}/>

          <InfoRow
            label="Phone Number"
            value={profile.phoneNumber}
            isLast/>
        </View>

        {/* Settings */}
        <SectionLabel text="SETTINGS" />

        <View style={styles.card}>
          <NavRow label="Privacy & Data" />

          <NavRow
            label="Change password"
            onPress={() => router.push("/change-password")}
            isLast
            chevron={false}
            />
        </View>

        {/* Notifications */}
        <SectionLabel text="NOTIFICATIONS" />

        <View style={styles.card}>
          <ToggleRow
            label="App notifications"
            value={appNotifications}
            onValueChange={setAppNotifications}/>

          <ToggleRow
            label="Messages notifications"
            value={messageNotifications}
            onValueChange={setMessageNotifications}
            isLast/>
        </View>

        {/* Logout */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={() => {
            router.replace("/login");
          }}>

          <Text style={styles.logoutText}>
            Log out
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F2F1F5",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F2F1F5",
    alignItems: "center",
    justifyContent: "center",
  },

  scrollContent: {
    paddingHorizontal: 18,
    paddingBottom: 24,
  },

  avatarSection: {
    alignItems: "center",
    marginTop: 24,
    marginBottom: 22,
  },

  avatarWrapper: {
    position: "relative",
  },

  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: "#DDDDDD",
  },

  cameraBadge: {
    position: "absolute",
    bottom: 0,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#5B2A6F",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#F2F1F5",
  },

  name: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
    color: "#1C1C1E",
  },

  handle: {
    marginTop: 2,
    fontSize: 13,
    color: "#8A8A8E",
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  editText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#5B2A6F",
    marginTop: 18,
    marginBottom: 8,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8A8A8E",
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 18,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    overflow: "hidden",
  },

  infoRow: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  infoLabel: {
    fontSize: 14,
    color: "#8A8A8E",
    fontWeight: "500",
  },

  infoValue: {
    fontSize: 15,
    color: "#1C1C1E",
    fontWeight: "500",
    maxWidth: "60%",
    textAlign: "right",
  },

  row: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowBorder: {
    borderBottomWidth:
      StyleSheet.hairlineWidth,
    borderBottomColor: "#EAEAED",
  },

  rowLabel: {
    fontSize: 15,
    color: "#1C1C1E",
    fontWeight: "500",
  },

  logoutButton: {
    backgroundColor: "#B80202",
    borderRadius: 26,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 26,
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "600",
  },
});