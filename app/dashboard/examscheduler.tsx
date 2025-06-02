import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ExamScheduler() {
  const [exam, setExam] = useState("");
  const [date, setDate] = useState("");
  const [exams, setExams] = useState<{ exam: string; date: string }[]>([]);
  const { colors } = useTheme();

  return (
    <ScreenWrapper>
      <SafeAreaView style={[styles.container]}>
        <Text style={[styles.title, { color: colors.text }]}>Exam Scheduler</Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.inputText,
              borderColor: colors.inputBorder,
            },
          ]}
          placeholder="Exam Name"
          placeholderTextColor={colors.subtext}
          value={exam}
          onChangeText={setExam}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: colors.inputBg,
              color: colors.inputText,
              borderColor: colors.inputBorder,
            },
          ]}
          placeholder="Date (e.g. 2025-06-01)"
          placeholderTextColor={colors.subtext}
          value={date}
          onChangeText={setDate}
        />
        <TouchableOpacity
          style={[styles.button, { backgroundColor: colors.button }]}
          onPress={() => {
            if (exam && date) {
              setExams((prev) => [...prev, { exam, date }]);
              setExam("");
              setDate("");
            }
          }}
        >
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Add Exam</Text>
        </TouchableOpacity>
        {exams.length > 0 && (
          <View style={[styles.nextExam, { backgroundColor: colors.accent }]}>
            <Text style={[styles.nextExamTitle, { color: colors.buttonText }]}>Next Exam:</Text>
            <Text style={[styles.nextExamText, { color: colors.buttonText }]}>
              {exams[0].exam} on {exams[0].date}
            </Text>
          </View>
        )}
        <FlatList
          data={exams}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View
              style={[
                styles.examItem,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.inputBorder,
                },
              ]}
            >
              <Text style={[styles.examText, { color: colors.text }]}>{item.exam}</Text>
              <Text style={[styles.examDate, { color: colors.subtext }]}>{item.date}</Text>
            </View>
          )}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  input: {
    width: "100%",
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 12,
    borderWidth: 1,
    elevation: 1,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginBottom: 18,
    elevation: 2,
  },
  buttonText: { fontSize: 18, fontWeight: "bold" },
  examItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    elevation: 1,
  },
  examText: { fontSize: 16 },
  examDate: { fontSize: 16 },
  nextExam: {
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
  },
  nextExamTitle: {
    fontWeight: "bold",
    fontSize: 15,
  },
  nextExamText: {
    fontSize: 15,
  },
});