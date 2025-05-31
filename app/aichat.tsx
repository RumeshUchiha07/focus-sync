import { SafeAreaView, StyleSheet, Text } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";

export default function AIChat() {
  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>AI Chat</Text>
        <Text style={styles.subtitle}>Chat with your AI assistant.</Text>
      </SafeAreaView>
    </ScreenWrapper>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 8 },
  subtitle: { fontSize: 16, color: "#4a4e69" },
});