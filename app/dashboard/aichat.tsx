import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

// Fetch AI response from OpenRouter API
async function fetchAIResponse(messages: { role: string; content: string }[]) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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",
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo", // or another model supported by OpenRouter
        messages,
      }),
    });
    const data = await response.json();
    return data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("OpenRouter API error:", error);
    return "Error: Unable to generate a response.";
  }
}

export default function AIChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ text: string; from: "user" | "ai" }[]>([]);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);
  const { colors } = useTheme();
  const { width, height } = useWindowDimensions();

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { text: input, from: "user" as const };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

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
      console.error("Error sending message:", e);
      setMessages((prev) => [
        ...prev,
        { text: "AI: Sorry, there was an error.", from: "ai" },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={[styles.container, { minHeight: height * 0.9 }]}>
        <Text style={[styles.title, { color: colors.text }]}>AI Chat</Text>
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.msg,
                item.from === "user"
                  ? { backgroundColor: colors.accent, alignSelf: "flex-end" }
                  : { backgroundColor: colors.card, alignSelf: "flex-start" },
                { maxWidth: width > 600 ? 400 : "80%" },
              ]}
            >
              <Text
                style={[
                  styles.msgText,
                  {
                    color:
                      item.from === "user"
                        ? colors.buttonText
                        : colors.text,
                  },
                ]}
              >
                {item.text}
              </Text>
            </View>
          )}
          style={{ width: "100%", marginBottom: 16 }}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
        {loading && (
          <View style={[styles.msg, { backgroundColor: colors.card, alignSelf: "flex-start" }]}>
            <ActivityIndicator color={colors.accent} size="small" />
          </View>
        )}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={80}
        >
          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.inputBg,
                  color: colors.inputText,
                  borderColor: colors.inputBorder,
                },
                width > 600 && { fontSize: 18, minHeight: 48 },
              ]}
              placeholder="Type your message..."
              value={input}
              onChangeText={setInput}
              placeholderTextColor={colors.subtext}
              editable={!loading}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendButton,
                { backgroundColor: colors.button },
                loading && { opacity: 0.7 },
              ]}
              onPress={sendMessage}
              disabled={loading}
            >
              <Text style={[styles.sendButtonText, { color: colors.buttonText }]}>
                {loading ? "..." : "Send"}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  inputRow: { flexDirection: "row", alignItems: "center", width: "100%", marginBottom: 16 },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  sendButton: {
    marginLeft: 8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 2,
  },
  sendButtonText: { fontWeight: "bold", fontSize: 16 },
  msg: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 4,
    maxWidth: "80%",
  },
  msgText: {
    fontSize: 16,
  },
});
