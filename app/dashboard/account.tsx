import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebaseConfig";
import { useTheme } from "@/theme";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";


const db = getFirestore();

export default function Account() {
  const user = auth.currentUser;
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const { colors } = useTheme();

  // Fetch user data from Firestore
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        setDisplayName(snap.data().displayName || "");
      }
    };
    fetchData();
  }, [user]);

  // Save user data to Firestore
  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await setDoc(doc(db, "users", user.uid), { displayName }, { merge: true });
      Alert.alert("Saved", "Profile updated!");
    } catch (e: any) {
      Alert.alert("Error", e.message);
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Account</Text>
        <Text style={styles.subtitle}>Manage your account settings.</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user?.email}</Text>
        <Text style={styles.label}>Display Name</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder },
          ]}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Enter display name"
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleSave} disabled={loading}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>{loading ? "Saving..." : "Save"}</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#4a4e69", marginBottom: 24 },
  label: { fontSize: 14, color: "#4a4e69", marginTop: 12, marginBottom: 2, alignSelf: "flex-start" },
  value: { fontSize: 16, color: "#22223b", marginBottom: 8, alignSelf: "flex-start" },
  input: {
    width: "100%",
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e1dd",
    marginBottom: 16,
    color: "#22223b",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#22223b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});