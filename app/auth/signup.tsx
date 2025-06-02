import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebaseConfig";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";


export default function SignUpScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!email || !password) return Alert.alert("Please fill all fields");
    if (password !== confirm) return Alert.alert("Passwords do not match");
    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard/home");
    } catch (e: any) {
      Alert.alert("Sign Up Error", e.message);
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper hideNav>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Sign up to get started</Text>
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder }]}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder }]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TextInput
          style={[styles.input, { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder }]}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={confirm}
          onChangeText={setConfirm}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleSignUp} disabled={loading}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>{loading ? "Signing Up..." : "Sign Up"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./signin")}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#22223b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#4a4e69",
    marginBottom: 32,
  },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  link: {
    color: "#4a4e69",
    fontSize: 16,
    marginTop: 8,
    textDecorationLine: "underline",
  },
});