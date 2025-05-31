import { SafeAreaView, StyleSheet, Text } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";

export default function Home() {
  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Home</Text>
        <Text style={styles.subtitle}>You are now signed in. Stay productive!</Text>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "#22223b", marginBottom: 8 },
  subtitle: { fontSize: 18, color: "#4a4e69", textAlign: "center" },
});