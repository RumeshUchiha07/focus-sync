import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";
import { auth } from "./firebaseConfig";

export default function ResetScreen() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleReset = async () => {
    if (!email) return Alert.alert("Please enter your email");
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      Alert.alert("Success", "Password reset email sent!");
      router.replace("/signin");
    } catch (e: any) {
      if (e.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email.");
      } else if (e.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address.");
      } else {
        Alert.alert("Reset Error", e.message);
      }
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper hideNav>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>Enter your email to reset your password</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TouchableOpacity style={styles.button} onPress={handleReset} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Sending..." : "Send Reset Email"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.replace("/signin")}>
          <Text style={styles.link}>Back to Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "#f7f8fa", // Remove or comment this line to show gradient
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
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e1dd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#22223b",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
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