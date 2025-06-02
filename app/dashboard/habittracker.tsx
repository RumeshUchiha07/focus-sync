import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HabitTracker() {
  const [habit, setHabit] = useState("");
  const [habits, setHabits] = useState<{ name: string; done: boolean }[]>([]);
  const { colors } = useTheme();

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
      <SafeAreaView style={[styles.container]}>
        <Text style={[styles.title, { color: colors.text }]}>Habit Tracker</Text>
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
            placeholder="Add a habit"
            value={habit}
            onChangeText={setHabit}
            placeholderTextColor={colors.subtext}
          />
          <TouchableOpacity
            style={[styles.addButton, { backgroundColor: colors.button }]}
            onPress={addHabit}
          >
            <Ionicons name="add-circle" size={28} color={colors.buttonText} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.streak, { color: colors.subtext }]}>
          {habits.filter((h) => h.done).length}/{habits.length} completed today
        </Text>
        <FlatList
          data={habits}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={[
                styles.habitItem,
                {
                  backgroundColor: item.done ? colors.inputBorder : colors.card,
                  borderColor: colors.inputBorder,
                },
              ]}
              onPress={() => toggleHabit(index)}
            >
              <Ionicons
                name={item.done ? "checkbox" : "square-outline"}
                size={24}
                color={item.done ? colors.accent : colors.subtext}
                style={{ marginRight: 12 }}
              />
              <Text
                style={[
                  styles.habitText,
                  { color: item.done ? colors.subtext : colors.text },
                  item.done && styles.habitTextDone,
                ]}
              >
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
          style={{ width: "100%", marginTop: 24 }}
          ListEmptyComponent={
            <Text style={{ color: colors.subtext, textAlign: "center", marginTop: 32 }}>
              No habits yet.
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
    padding: 4,
    elevation: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  habitItem: {
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
  },
  habitText: {
    fontSize: 18,
  },
  habitTextDone: {
    textDecorationLine: "line-through",
  },
  streak: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 8,
  },
});