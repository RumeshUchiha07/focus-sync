import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebaseConfig";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import React, { useState } from "react";
import {
  Alert,
  SafeAreaView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Settings() {
  const router = useRouter();
  const { dark, colors, toggleTheme } = useTheme();
  const [notifications, setNotifications] = useState(true);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/auth/signin");
    } catch (e: any) {
      Alert.alert("Logout Error", e.message);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={[styles.container]}>
        <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

        <Text style={[styles.sectionHeader, { color: colors.text }]}>Account Settings</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }]}
          onPress={() => router.push("./account")}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }]}
          onPress={handleLogout}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={[styles.sectionHeader, { color: colors.text }]}>App Settings</Text>
        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Dark Mode</Text>
          <Switch value={dark} onValueChange={toggleTheme} />
        </View>
        <View style={[styles.settingRow, { backgroundColor: colors.card }]}>
          <Text style={[styles.settingLabel, { color: colors.text }]}>Notifications</Text>
          <Switch value={notifications} onValueChange={setNotifications} />
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 32 },
  sectionHeader: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 12,
    marginTop: 24,
    letterSpacing: 0.5,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginHorizontal: 8,
    elevation: 2,
  },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 10,
    marginBottom: 12,
    elevation: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
});