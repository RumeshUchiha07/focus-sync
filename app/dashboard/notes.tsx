import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";

function simpleMarkdown(text: string) {
  // Very basic: *bold*, _italic_
  return text
    .replace(/\*([^\*]+)\*/g, (_, m) => `<b>${m}</b>`)
    .replace(/_([^_]+)_/g, (_, m) => `<i>${m}</i>`);
}

export default function Notes() {
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState<string[]>([]);

  const addNote = () => {
    if (!note.trim()) return;
    setNotes((prev) => [note.trim(), ...prev]);
    setNote("");
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Notes</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Quick note... (supports *bold* and _italic_)"
            value={note}
            onChangeText={setNote}
            placeholderTextColor="#bbb"
            multiline
          />
          <TouchableOpacity style={styles.addButton} onPress={addNote}>
            <Ionicons name="add-circle" size={32} color="#4a4e69" />
          </TouchableOpacity>
        </View>
        <FlatList
          data={notes}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.noteItem}>
              <Text style={styles.noteText}>{item}</Text>
            </View>
          )}
          style={{ width: "100%", marginTop: 24 }}
        />
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
    minHeight: 48,
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
  addButton: {
    marginLeft: 8,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  noteItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e0e1dd",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  noteText: {
    fontSize: 16,
    color: "#22223b",
  },
});