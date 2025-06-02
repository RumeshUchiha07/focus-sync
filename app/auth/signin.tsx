import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebaseConfig";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from "react-native";


export default function SignInScreen() {
  const router = useRouter();
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignIn = async () => {
    if (!email || !password) return Alert.alert("Please fill all fields");
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/dashboard/home");
    } catch (e: any) {
      if (e.code === "auth/wrong-password") {
        Alert.alert("Error", "Incorrect password.");
      } else if (e.code === "auth/user-not-found") {
        Alert.alert("Error", "No user found with this email.");
      } else if (e.code === "auth/invalid-email") {
        Alert.alert("Error", "Invalid email address.");
      } else {
        Alert.alert("Sign In Error", e.message);
      }
    }
    setLoading(false);
  };

  return (
    <ScreenWrapper hideNav>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder },
          ]}
          placeholder="Email"
          placeholderTextColor="#aaa"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder },
          ]}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]} onPress={handleSignIn} disabled={loading}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>{loading ? "Signing In..." : "Sign In"}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./signup")}>
          <Text style={styles.link}>Don`t have an account? Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("./reset")}>
          <Text style={styles.link}>Forgot Password?</Text>
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