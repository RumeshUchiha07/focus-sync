import React, { useRef, useState } from "react";
import { ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";

const GEMINI_API_KEY = "AIzaSyBUpqQY1uG0PuR36RDlhoD_ER506mbKmsA"; // Replace with your Gemini API key

async function fetchAIResponse(messages: { role: string; content: string }[]) {
  // Gemini expects a single prompt string, so concatenate user/assistant messages
  const prompt = messages
    .map((m) => (m.role === "user" ? `User: ${m.content}` : `AI: ${m.content}`))
    .join("\n");

  const res = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" + GEMINI_API_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  const data = await res.json();
  // Gemini's response structure
  return (
    data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    "Sorry, I couldn't generate a response."
  );
}

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; from: "user" | "ai" }[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { text: input, from: "user" as const };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    // Prepare messages for OpenAI API
    const chatHistory = [
      { role: "system", content: "You are a helpful productivity assistant." },
      ...messages.map((m) => ({
        role: m.from === "user" ? "user" : "assistant",
        content: m.text,
      })),
      { role: "user", content: input },
    ];

    try {
      const aiText = await fetchAIResponse(chatHistory);
      setMessages((prev) => [...prev, { text: aiText, from: "ai" }]);
    } catch (e) {
      setMessages((prev) => [...prev, { text: "AI: Sorry, there was an error.", from: "ai" }]);
    }
    setLoading(false);
    setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>AI Chat</Text>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={[styles.msg, item.from === "user" ? styles.userMsg : styles.aiMsg]}>
              <Text style={styles.msgText}>{item.text}</Text>
            </View>
          )}
          style={{ width: "100%", marginBottom: 16 }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        {loading && (
          <View style={[styles.msg, styles.aiMsg]}>
            <ActivityIndicator color="#4a4e69" size="small" />
          </View>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              placeholderTextColor="#bbb"
              editable={!loading}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage} disabled={loading}>
              <Text style={styles.sendButtonText}>{loading ? "..." : "Send"}</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 16 },
  input: {
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e1dd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    color: "#22223b",
  },
  sendButton: {
    marginLeft: 8,
    backgroundColor: "#4a4e69",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 2,
  },
  sendButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  msg: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  userMsg: {
    backgroundColor: "#a18cd1",
    alignSelf: "flex-end",
  },
  aiMsg: {
    backgroundColor: "#fbc2eb",
    alignSelf: "flex-start",
  },
  msgText: {
    color: "#22223b",
    fontSize: 16,
  },
});