import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "@/components/ScreenWrapper";

export default function Home() {
  const router = useRouter();

  // Example stats (replace with real data from cloud if needed)
  const [stats, setStats] = useState({
    pomodoros: 0,
    habits: 0,
    exams: 0,
    notes: 0,
  });

  useEffect(() => {
    // TODO: Fetch real stats from Firestore or local storage
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
      route: "/pomodorotimer",
      color: "#a18cd1",
      stat: `${stats.pomodoros} today`,
    },
    {
      label: "Habits",
      icon: <FontAwesome5 name="tasks" size={28} color="#fff" />,
      route: "/habittracker",
      color: "#fbc2eb",
      stat: `${stats.habits} done`,
    },
    {
      label: "Exams",
      icon: <Ionicons name="calendar-outline" size={32} color="#fff" />,
      route: "/examscheduler",
      color: "#fad0c4",
      stat: `${stats.exams} upcoming`,
    },
    {
      label: "Planner",
      icon: <Ionicons name="book-outline" size={32} color="#fff" />,
      route: "/studyplanner",
      color: "#b4ead7",
      stat: "",
    },
    {
      label: "AI Chat",
      icon: <MaterialCommunityIcons name="robot-outline" size={32} color="#fff" />,
      route: "/aichat",
      color: "#b4c6e7",
      stat: "",
    },
    {
      label: "Notes",
      icon: <Ionicons name="document-text-outline" size={32} color="#fff" />,
      route: "/notes",
      color: "#ffe082",
      stat: `${stats.notes} notes`,
    },
  ];

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>Stay productive and in sync!</Text>
        <View style={styles.widgetGrid}>
          {widgets.map((w) => (
            <TouchableOpacity
              key={w.label}
              style={[styles.widget, { backgroundColor: w.color }]}
              onPress={() => router.push(w.route)}
              activeOpacity={0.85}
            >
              {w.icon}
              <Text style={styles.widgetLabel}>{w.label}</Text>
              {w.stat ? <Text style={styles.widgetStat}>{w.stat}</Text> : null}
            </TouchableOpacity>
          ))}
        </View>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", padding: 24, justifyContent: "flex-start" },
  title: { fontSize: 32, fontWeight: "bold", color: "#22223b", marginTop: 32, marginBottom: 8 },
  subtitle: { fontSize: 18, color: "#4a4e69", textAlign: "center", marginBottom: 24 },
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
    color: "#22223b",
    fontWeight: "bold",
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
  },
  widgetStat: {
    color: "#4a4e69",
    fontSize: 13,
    marginTop: 2,
    fontWeight: "600",
  },
});