import ScreenWrapper from "@/components/ScreenWrapper";
import { useTheme } from "@/theme";
import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  const [stats, setStats] = useState({
    pomodoros: 0,
    habits: 0,
    exams: 0,
    notes: 0,
  });

  useEffect(() => {
    setStats({
      pomodoros: Math.floor(Math.random() * 8),
      habits: Math.floor(Math.random() * 5),
      exams: Math.floor(Math.random() * 2),
      notes: Math.floor(Math.random() * 10),
    });
  }, []);

  const widgets = [
    {
      label: "Pomodoro",
      icon: <Ionicons name="timer-outline" size={32} color="#fff" />,
      route: "./pomodorotimer",
      color: "#a18cd1",
      stat: `${stats.pomodoros} today`,
    },
    {
      label: "Habits",
      icon: <FontAwesome5 name="tasks" size={28} color="#fff" />,
      route: "./habittracker",
      color: "#fbc2eb",
      stat: `${stats.habits} done`,
    },
    {
      label: "Exams",
      icon: <Ionicons name="calendar-outline" size={32} color="#fff" />,
      route: "./examscheduler",
      color: "#fad0c4",
      stat: `${stats.exams} upcoming`,
    },
    {
      label: "Planner",
      icon: <Ionicons name="book-outline" size={32} color="#fff" />,
      route: "./studyplanner",
      color: "#b4ead7",
      stat: "",
    },
    {
      label: "AI Chat",
      icon: <MaterialCommunityIcons name="robot-outline" size={32} color="#fff" />,
      route: "./aichat",
      color: "#b4c6e7",
      stat: "",
    },
    {
      label: "Notes",
      icon: <Ionicons name="document-text-outline" size={32} color="#fff" />,
      route: "./notes",
      color: "#ffe082",
      stat: `${stats.notes} notes`,
    },
  ];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={[styles.title, { color: colors.text }]}>Dashboard</Text>
        <Text style={[styles.subtitle, { color: colors.subtext }]}>Stay productive and in sync!</Text>
        <View style={styles.widgetGrid}>
          {widgets.map((w) => (
            <TouchableOpacity
              key={w.label}
              style={[styles.widget, { backgroundColor: w.color }]}
              onPress={() => router.push(w.route)}
              activeOpacity={0.85}
            >
              {w.icon}
              <Text style={[styles.widgetLabel, { color: colors.text }]}>{w.label}</Text>
              {w.stat ? <Text style={[styles.widgetStat, { color: colors.subtext }]}>{w.stat}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: colors.button }]}>
          <Text style={[styles.buttonText, { color: colors.buttonText }]}>Button</Text>
        </TouchableOpacity>
        <TextInput
          style={[
            styles.input,
            { backgroundColor: colors.inputBg, color: colors.inputText, borderColor: colors.inputBorder },
          ]}
          placeholder="Type here..."
          placeholderTextColor={colors.subtext}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 32, fontWeight: "bold", marginTop: 32, marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: "center", marginBottom: 24 },
  widgetGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 18,
    marginTop: 12,
  },
  widget: {
    width: 120,
    height: 120,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  widgetLabel: {
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  widgetStat: {
    fontSize: 13,
    marginTop: 2,
    fontWeight: "600",
  },
  button: {
    width: 120,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 16,
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 1,
  },
});