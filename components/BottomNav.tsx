import { FontAwesome5, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const navItems = [
  { label: "Home", icon: (color: string) => <Ionicons name="home-outline" size={24} color={color} />, route: "/dashboard/home" },
  { label: "Pomodoro", icon: (color: string) => <Ionicons name="timer-outline" size={24} color={color} />, route: "/dashboard/pomodorotimer" },
  { label: "AI Chat", icon: (color: string) => <MaterialCommunityIcons name="robot-outline" size={24} color={color} />, route: "/dashboard/aichat" },
  { label: "Exams", icon: (color: string) => <Ionicons name="calendar-outline" size={24} color={color} />, route: "/dashboard/examscheduler" },
  { label: "Habits", icon: (color: string) => <FontAwesome5 name="tasks" size={22} color={color} />, route: "/dashboard/habittracker" },
  { label: "Planner", icon: (color: string) => <Ionicons name="book-outline" size={24} color={color} />, route: "/dashboard/studyplanner" },
  { label: "Note", icon: (color: string) => <Ionicons name="documents-outline" size={24} color={color} />, route: "/dashboard/notes" },
  { label: "Settings", icon: (color: string) => <Ionicons name="settings-outline" size={24} color={color} />, route: "/dashboard/settings" },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.navBar}>
      {navItems.map((item) => {
        const isActive = pathname === item.route;
        return (
          <TouchableOpacity
            key={item.route}
            style={styles.navItem}
            onPress={() => router.replace(item.route)}
          >
            {item.icon(isActive ? "#fff" : "#bfc0c0")}
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "rgba(34,34,59,0.95)",
    paddingVertical: 8,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    elevation: 10,
  },
  navItem: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 10,
    color: "#bfc0c0",
    marginTop: 2,
  },
  activeLabel: {
    color: "#fff",
    fontWeight: "bold",
  },
});