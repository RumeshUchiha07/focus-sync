import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function StudyPlanner() {
  const [session, setSession] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);

  const addSession = () => {
    if (!session.trim()) return;
    setSessions((prev) => [session.trim(), ...prev]);
    setSession("");
  };

  const removeSession = (index: number) => {
    setSessions((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Study Planner</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add study session"
            value={session}
            onChangeText={setSession}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity style={styles.addButton} onPress={addSession}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={sessions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View style={styles.sessionItem}>
              <Text style={styles.sessionText}>{item}</Text>
              <TouchableOpacity onPress={() => removeSession(index)}>
                <Text style={styles.removeText}>✕</Text>
              </TouchableOpacity>
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
  addButton: {
    marginLeft: 8,
    backgroundColor: "#4a4e69",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 2,
  },
  addButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
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
    justifyContent: "space-between",
  },
  sessionText: {
    fontSize: 18,
    color: "#22223b",
  },
  removeText: {
    color: "#e63946",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
});