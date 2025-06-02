import { useRouter } from "expo-router";
import { signOut } from "firebase/auth";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";
import { auth } from "./firebaseConfig";

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/signin");
    } catch (e: any) {
      Alert.alert("Logout Error", e.message);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Settings</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/account")}
        >
          <Text style={styles.buttonText}>Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: "#e63946" }]}
          onPress={handleLogout}
        >
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 32 },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#22223b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});