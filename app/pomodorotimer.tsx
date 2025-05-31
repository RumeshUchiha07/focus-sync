import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";
import { auth } from "./firebaseConfig";

const db = getFirestore();

export default function PomodoroTimer() {
  // Customizable durations (in minutes)
  const [workDuration, setWorkDuration] = useState("25");
  const [shortBreakDuration, setShortBreakDuration] = useState("5");
  const [longBreakDuration, setLongBreakDuration] = useState("15");
  const [cyclesBeforeLongBreak, setCyclesBeforeLongBreak] = useState("4");

  // Timer state
  const [seconds, setSeconds] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState<"Work" | "Short Break" | "Long Break">("Work");
  const [cycleCount, setCycleCount] = useState(0);
  const [cycles, setCycles] = useState<{ type: string; timestamp: number }[]>([]);
  const interval = useRef<NodeJS.Timeout | null>(null);

  // Load cycles from Firestore on mount
  useEffect(() => {
    const fetchCycles = async () => {
      if (!auth.currentUser) return;
      const ref = doc(db, "pomodoroCycles", auth.currentUser.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) setCycles(snap.data().cycles || []);
    };
    fetchCycles();
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      interval.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(interval.current!);
            setIsRunning(false);
            handleCycleEnd();
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval.current!);
    // eslint-disable-next-line
  }, [isRunning, mode]);

  // Handle end of each cycle
  const handleCycleEnd = () => {
    const newCycle = { type: mode, timestamp: Date.now() };
    setCycles((prev) => {
      const updated = [...prev, newCycle];
      saveCycle(updated);
      return updated;
    });

    if (mode === "Work") {
      const nextCycleCount = cycleCount + 1;
      setCycleCount(nextCycleCount);
      if (nextCycleCount % parseInt(cyclesBeforeLongBreak) === 0) {
        setMode("Long Break");
        setSeconds(parseInt(longBreakDuration) * 60);
      } else {
        setMode("Short Break");
        setSeconds(parseInt(shortBreakDuration) * 60);
      }
    } else {
      setMode("Work");
      setSeconds(parseInt(workDuration) * 60);
    }
  };

  // Save cycles to Firestore
  const saveCycle = async (updatedCycles: any[]) => {
    if (!auth.currentUser) return;
    const ref = doc(db, "pomodoroCycles", auth.currentUser.uid);
    await setDoc(ref, { cycles: updatedCycles }, { merge: true });
  };

  // Format time
  const format = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // Handle custom time set
  const handleSetCustomTimes = () => {
    if (
      !workDuration ||
      !shortBreakDuration ||
      !longBreakDuration ||
      !cyclesBeforeLongBreak
    ) {
      Alert.alert("Please fill all fields");
      return;
    }
    setMode("Work");
    setSeconds(parseInt(workDuration) * 60);
    setCycleCount(0);
    setIsRunning(false);
  };

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{mode}</Text>
        <Text style={styles.timer}>{format(seconds)}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => setIsRunning((r) => !r)}
          >
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#aaa" }]}
            onPress={() => {
              setIsRunning(false);
              setMode("Work");
              setSeconds(parseInt(workDuration) * 60);
              setCycleCount(0);
            }}
          >
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.customRow}>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={workDuration}
            onChangeText={setWorkDuration}
            placeholder="Work (min)"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={shortBreakDuration}
            onChangeText={setShortBreakDuration}
            placeholder="Short (min)"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={longBreakDuration}
            onChangeText={setLongBreakDuration}
            placeholder="Long (min)"
            maxLength={2}
          />
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cyclesBeforeLongBreak}
            onChangeText={setCyclesBeforeLongBreak}
            placeholder="Cycles"
            maxLength={1}
          />
          <TouchableOpacity style={styles.setButton} onPress={handleSetCustomTimes}>
            <Text style={styles.setButtonText}>Set</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.cycleTitle}>Today's Cycles</Text>
        <FlatList
          data={cycles.filter(
            c =>
              new Date(c.timestamp).toDateString() === new Date().toDateString()
          ).reverse()}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Text style={styles.cycleItem}>
              {item.type} - {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          )}
          style={{ width: "100%" }}
        />
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 28, fontWeight: "bold", color: "#22223b", marginBottom: 8 },
  timer: { fontSize: 64, fontWeight: "bold", color: "#22223b", marginBottom: 24 },
  row: { flexDirection: "row", gap: 16, marginBottom: 16 },
  customRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  input: {
    width: 48,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
    marginHorizontal: 4,
    borderWidth: 1,
    borderColor: "#e0e1dd",
    textAlign: "center",
  },
  setButton: {
    backgroundColor: "#22223b",
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginLeft: 8,
  },
  setButtonText: { color: "#fff", fontWeight: "bold" },
  button: {
    backgroundColor: "#22223b",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 0,
    elevation: 2,
    marginHorizontal: 4,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  cycleTitle: { fontSize: 18, color: "#4a4e69", marginTop: 32, marginBottom: 8, fontWeight: "bold" },
  cycleItem: { fontSize: 16, color: "#22223b", marginBottom: 2 },
});