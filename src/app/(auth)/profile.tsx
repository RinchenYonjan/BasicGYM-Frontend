import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PURPLE = "#5B2A6F";
const BG = "#F2F1F5";
const CARD = "#FFFFFF";
const LABEL_GREY = "#8A8A8E";
const BORDER = "#EAEAED";
const TEXT_DARK = "#1C1C1E";

export default function Profile() {
  const [appNotifications, setAppNotifications] = useState(true);
  const [messageNotifications, setMessageNotifications] = useState(false);

  const [username, setUsername] = useState("MynameisJack");
  const [firstName, setFirstName] = useState("Jack");
  const [lastName, setLastName] = useState("Finnigan");
  const [email, setEmail] = useState("Jack202@gmail.com");

  // const handleGetToken = async()=>{
  //   const token =await getToken();
  //   console.log("token is",token);

  // }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={BG} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <Image
              source={{
                uri: "https://ui-avatars.com/api/?name=Jack+Finnigan&background=DDDDDD&color=555555&size=256",
              }}
              style={styles.avatar}
            />

            <TouchableOpacity style={styles.cameraBadge}>
              <Ionicons name="camera" size={14} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <Text style={styles.name}>Jack Finnigan</Text>
          <Text style={styles.handle}>@MynameisJack</Text>
        </View>

        {/* Profile */}
        <SectionLabel text="PROFILE" />

        <View style={styles.card}>
          <FieldRow
            value={username}
            onChangeText={setUsername}
          />

          <FieldRow
            value={firstName}
            onChangeText={setFirstName}
          />

          <FieldRow
            value={lastName}
            onChangeText={setLastName}
          />

          <FieldRow
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            isLast
          />
        </View>

        {/* Settings */}
        <SectionLabel text="SETTINGS" />

        <View style={styles.card}>
          <NavRow label="Privacy & Data" />
          <NavRow
            label="Change password"
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
            onValueChange={setAppNotifications}
          />

          <ToggleRow
            label="Messages notifications"
            value={messageNotifications}
            onValueChange={setMessageNotifications}
            isLast
          />
        </View>

        {/* Log out */}
        <TouchableOpacity
          style={styles.logoutButton}
          activeOpacity={0.85}
          onPress={() => {
            router.replace("/login");
          }}
        >
          <Text style={styles.logoutText}>Log out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function SectionLabel({ text }: { text: string }) {
  return <Text style={styles.sectionLabel}>{text}</Text>;
}

function FieldRow({
  value,
  onChangeText,
  isLast,
  keyboardType,
}: {
  value: string;
  onChangeText: (text: string) => void;
  isLast?: boolean;
  keyboardType?: "default" | "email-address";
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        style={styles.fieldInput}
        keyboardType={keyboardType}
        autoCapitalize="none"
        placeholderTextColor={LABEL_GREY}
      />
    </View>
  );
}

function NavRow({
  label,
  isLast,
  chevron = true,
}: {
  label: string;
  isLast?: boolean;
  chevron?: boolean;
}) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowBorder]}
      activeOpacity={0.6}
    >
      <Text style={styles.rowLabel}>{label}</Text>

      {chevron && (
        <Ionicons
          name="chevron-forward"
          size={18}
          color={LABEL_GREY}
        />
      )}
    </TouchableOpacity>
  );
}

function ToggleRow({
  label,
  value,
  onValueChange,
  isLast,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isLast?: boolean;
}) {
  return (
    <View style={[styles.row, !isLast && styles.rowBorder]}>
      <Text style={styles.rowLabel}>{label}</Text>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#E0E0E5",
          true: PURPLE,
        }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E0E0E5"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: BG,
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
    backgroundColor: PURPLE,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: BG,
  },

  name: {
    marginTop: 10,
    fontSize: 17,
    fontWeight: "700",
    color: TEXT_DARK,
  },

  handle: {
    marginTop: 2,
    fontSize: 13,
    color: LABEL_GREY,
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: LABEL_GREY,
    letterSpacing: 0.5,
    marginBottom: 8,
    marginTop: 18,
  },

  card: {
    backgroundColor: CARD,
    borderRadius: 14,
    overflow: "hidden",
  },

  row: {
    minHeight: 50,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  rowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: BORDER,
  },

  fieldInput: {
    flex: 1,
    fontSize: 15,
    color: TEXT_DARK,
    paddingVertical: 14,
  },

  rowLabel: {
    fontSize: 15,
    color: TEXT_DARK,
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