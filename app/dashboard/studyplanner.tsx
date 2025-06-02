import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function StudyPlanner() {
  const [session, setSession] = useState("");
  const [sessions, setSessions] = useState<string[]>([]);
  const { colors } = useTheme();

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
      <SafeAreaView style={[styles.container]}>
        <Text style={[styles.title, { color: colors.text }]}>Study Planner</Text>
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
            placeholder="Add study session"
            value={session}
            onChangeText={setSession}
            placeholderTextColor={colors.subtext}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.button }]}
            onPress={addSession}
          >
            <Text style={[styles.addButtonText, { color: colors.buttonText }]}>Add</Text>
          </TouchableOpacity>
        </View>
        <FlatList
          data={sessions}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <View
              style={[
                styles.sessionItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.inputBorder,
                },
              ]}
            >
              <Text style={[styles.sessionText, { color: colors.text }]}>{item}</Text>
              <TouchableOpacity onPress={() => removeSession(index)}>
                <Text style={[styles.removeText, { color: "#e63946" }]}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          style={{ width: "100%", marginTop: 24 }}
          ListEmptyComponent={
            <Text style={{ color: colors.subtext, textAlign: "center", marginTop: 32 }}>
              No study sessions yet.
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
  addButton: {
    marginLeft: 8,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 18,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: { fontWeight: "bold", fontSize: 16 },
  sessionItem: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
    justifyContent: "space-between",
  },
  sessionText: {
    fontSize: 18,
  },
  removeText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
});