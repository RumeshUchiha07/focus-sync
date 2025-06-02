import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Simple markdown: *bold*, _italic_
function renderMarkdown(text: string, colors: any) {
  const bold = /\*([^\*]+)\*/g;
  const italic = /_([^_]+)_/g;
  let parts: (string | { type: "bold" | "italic"; content: string })[] = [];
  let lastIdx = 0;
  let match: RegExpExecArray | null;

  // Find bold
  while ((match = bold.exec(text))) {
    if (match.index > lastIdx) parts.push(text.slice(lastIdx, match.index));
    parts.push({ type: "bold", content: match[1] });
    lastIdx = match.index + match[0].length;
  }
  let temp = parts.length ? "" : text;
  if (lastIdx < text.length) temp += text.slice(lastIdx);

  // Find italic in the remaining
  let final: (string | { type: "bold" | "italic"; content: string })[] = [];
  lastIdx = 0;
  if (temp) {
    while ((match = italic.exec(temp))) {
      if (match.index > lastIdx) final.push(temp.slice(lastIdx, match.index));
      final.push({ type: "italic", content: match[1] });
      lastIdx = match.index + match[0].length;
    }
    if (lastIdx < temp.length) final.push(temp.slice(lastIdx));
  }
  if (!parts.length) parts = final;
  else parts = [...parts, ...final];

  return parts.map((part, i) =>
    typeof part === "string" ? (
      <Text key={i} style={{ color: colors.text }}>
        {part}
      </Text>
    ) : part.type === "bold" ? (
      <Text key={i} style={{ fontWeight: "bold", color: colors.text }}>
        {part.content}
      </Text>
    ) : (
      <Text key={i} style={{ fontStyle: "italic", color: colors.text }}>
        {part.content}
      </Text>
    )
  );
}

export default function Notes() {
  const { colors } = useTheme();
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes((prev) => [note.trim(), ...prev]);
    setNote("");
  };

  return (
    <ScreenWrapper>
      <SafeAreaView
        style={[styles.container]}
      >
        <Text style={[styles.title, { color: colors.text }]}>Notes</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderColor: colors.inputBorder,
              },
            ]}
            placeholder="Quick note... (supports *bold* and _italic_)"
            value={note}
            onChangeText={setNote}
            placeholderTextColor={colors.subtext}
            multiline
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.button }]}
            onPress={addNote}
          >
            <Ionicons name="add-circle" size={28} color={colors.buttonText} />
          </TouchableOpacity>
        </View>
        <FlatList
          data={notes}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.noteItem,
                { backgroundColor: colors.card, borderColor: colors.inputBorder },
              ]}
            >
              <Text
                style={{
                  color: colors.subtext,
                  marginBottom: 4,
                  fontSize: 12,
                }}
              >
                Note
              </Text>
              <Text style={[styles.noteText, { color: colors.text }]}>
                {renderMarkdown(item, colors)}
              </Text>
            </View>
          )}
          style={{ width: "100%", marginTop: 24 }}
          ListEmptyComponent={
            <Text
              style={{
                color: colors.subtext,
                textAlign: "center",
                marginTop: 32,
              }}
            >
              No notes yet.
            </Text>
          }
        />
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
    minHeight: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    elevation: 1,
  },
  addButton: {
    marginLeft: 8,
    borderRadius: 12,
    padding: 4,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  noteItem: {
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    elevation: 1,
  },
  noteText: {
    fontSize: 16,
    flexWrap: "wrap",
  },
});