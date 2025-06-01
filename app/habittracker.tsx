import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";

export default function HabitTracker() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<{ name: string; done: boolean }[]>([]);

  const addHabit = () => {
    if (!habit.trim()) return;
    setHabits((prev) => [...prev, { name: habit.trim(), done: false }]);
    setHabit("");
  };

  const toggleHabit = (index: number) => {
    setHabits((prev) =>
      prev.map((h, i) => (i === index ? { ...h, done: !h.done } : h))
    );
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Habit Tracker</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Add a habit"
            value={habit}
            onChangeText={setHabit}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity style={styles.addButton} onPress={addHabit}>
            <Ionicons name="add-circle" size={32} color="#4a4e69" />
          </TouchableOpacity>
        </View>
        <Text style={styles.streak}>
          {habits.filter(h => h.done).length}/{habits.length} completed today
        </Text>
        <FlatList
          data={habits}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[styles.habitItem, item.done && styles.habitDone]}
              onPress={() => toggleHabit(index)}
            >
              <Ionicons
                name={item.done ? "checkbox" : "square-outline"}
                size={24}
                color={item.done ? "#4a4e69" : "#bbb"}
                style={{ marginRight: 12 }}
              />
              <Text style={[styles.habitText, item.done && styles.habitTextDone]}>
                {item.name}
              </Text>
            </TouchableOpacity>
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
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    elevation: 2,
  },
  habitItem: {
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
  },
  habitDone: {
    backgroundColor: "#e0e1dd",
  },
  habitText: {
    fontSize: 18,
    color: "#22223b",
  },
  habitTextDone: {
    textDecorationLine: "line-through",
    color: "#bbb",
  },
  streak: {
    fontSize: 15,
    color: "#4a4e69",
    fontWeight: "600",
    marginBottom: 8,
  },
});