import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";

export default function ExamScheduler() {
  const [exam, setExam] = useState("");
  const [date, setDate] = useState("");
  const [exams, setExams] = useState<{ exam: string; date: string }[]>([]);

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Exam Scheduler</Text>
        <TextInput
          style={styles.input}
          placeholder="Exam Name"
          value={exam}
          onChangeText={setExam}
        />
        <TextInput
          style={styles.input}
          placeholder="Date (e.g. 2025-06-01)"
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (exam && date) {
              setExams((prev) => [...prev, { exam, date }]);
              setExam("");
              setDate("");
            }
          }}
        >
          <Text style={styles.buttonText}>Add Exam</Text>
        </TouchableOpacity>
        <FlatList
          data={exams}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={styles.examItem}>
              <Text style={styles.examText}>{item.exam}</Text>
              <Text style={styles.examDate}>{item.date}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 16 },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e1dd",
  },
  button: {
    backgroundColor: "#22223b",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginBottom: 18,
    elevation: 2,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  examItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e1dd",
  },
  examText: { fontSize: 16, color: "#22223b" },
  examDate: { fontSize: 16, color: "#4a4e69" },
});