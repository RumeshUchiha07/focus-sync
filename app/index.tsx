import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import { useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function Index() {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <ScreenWrapper hideNav>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>FocusSync</Text>
        <Text style={styles.subtitle}>Welcome! Stay focused and in sync.</Text>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }]}
          onPress={() => router.push("/auth/signup")}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>
            Get Started
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => router.push("/auth/signin")}>
          <Text style={styles.link}>Already have an account? Sign In</Text>
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
    boxShadow: "0px 2px 4px rgba(0,0,0,0.05)", // Added for web compatibility
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
