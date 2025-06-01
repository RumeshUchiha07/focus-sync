import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Alert, FlatList, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import ScreenWrapper from "./components/ScreenWrapper";
import { auth } from "./firebaseConfig";

const db = getFirestore();
const LOFI_TRACKS = [
  require("../assets/lofi/lofi.mp3"),
  require("../assets/lofi/lofi-lofi-music-345370.mp3"),
  require("../assets/lofi/lofi-lofi-song-345371.mp3"),
  require("../assets/lofi/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3"),
  require("../assets/lofi/future-design-344320.mp3"),
  require("../assets/lofi/gorila-315977.mp3"),
  require("../assets/lofi/jungle-waves-drumampbass-electronic-inspiring-promo-345013.mp3"),
];

const getTrackSrc = (index: number) => {
  // For web, require returns a string; for native, it's a number (resource id)
  if (Platform.OS === "web") {
    return LOFI_TRACKS[index];
  }
  // For mobile, you can't play local files in WebView <audio>
  // You could upload your mp3s to a cloud storage and use URLs here for mobile support
  return "";
};

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

  // Music player state
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [trackIndex, setTrackIndex] = useState(0);

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
        setIsRunning(true); // Start long break automatically
      } else {
        setMode("Short Break");
        setSeconds(parseInt(shortBreakDuration) * 60);
        setIsRunning(true); // Start short break automatically
      }
    } else {
      setMode("Work");
      setSeconds(parseInt(workDuration) * 60);
      setIsRunning(true); // Start work session automatically
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

  // Lofi music player using WebView (for both iOS/Android)
  const lofiPlayer = (
    <View style={styles.musicPlayer}>
      <TouchableOpacity
        style={[styles.musicButton, musicPlaying && styles.musicButtonActive]}
        onPress={() => setMusicPlaying((p) => !p)}
      >
        <Text style={styles.musicButtonText}>{musicPlaying ? "Pause Lofi" : "Play Lofi"}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.musicButton}
        onPress={() => setTrackIndex((i) => (i + 1) % LOFI_TRACKS.length)}
      >
        <Text style={styles.musicButtonText}>Next Track</Text>
      </TouchableOpacity>
      {musicPlaying && Platform.OS === "web" && (
        <audio
          src={getTrackSrc(trackIndex)}
          autoPlay
          loop
          controls={false}
          style={{ display: "none" }}
          id="lofi-audio"
        />
      )}
      {musicPlaying && Platform.OS !== "web" && (
        <Text style={{ color: "#4a4e69", marginLeft: 8 }}>
          Lofi playback is only available on web.
        </Text>
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>{mode}</Text>
        <Text style={styles.timer}>{format(seconds)}</Text>
        <View style={styles.row}>
          <TouchableOpacity
            style={[styles.button, isRunning && styles.buttonActive]}
            onPress={() => setIsRunning((r) => !r)}
          >
            <Text style={styles.buttonText}>{isRunning ? "Pause" : "Start"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
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
            placeholder="Work"
            maxLength={2}
            placeholderTextColor="#bbb"
          />
          <Text style={styles.inputLabel}>/</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={shortBreakDuration}
            onChangeText={setShortBreakDuration}
            placeholder="Short"
            maxLength={2}
            placeholderTextColor="#bbb"
          />
          <Text style={styles.inputLabel}>/</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={longBreakDuration}
            onChangeText={setLongBreakDuration}
            placeholder="Long"
            maxLength={2}
            placeholderTextColor="#bbb"
          />
          <Text style={styles.inputLabel}>/</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={cyclesBeforeLongBreak}
            onChangeText={setCyclesBeforeLongBreak}
            placeholder="Cycles"
            maxLength={1}
            placeholderTextColor="#bbb"
          />
          <TouchableOpacity style={styles.setButton} onPress={handleSetCustomTimes}>
            <Text style={styles.setButtonText}>Set</Text>
          </TouchableOpacity>
        </View>
        {lofiPlayer}
        <Text style={styles.cycleTitle}>Today`s Cycles</Text>
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
        <View style={styles.progressBarContainer}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((parseInt(workDuration) * 60 - seconds) / (parseInt(workDuration) * 60)) * 100}%`,
                backgroundColor: mode === "Work" ? "#a18cd1" : "#fad0c4",
              },
            ]}
          />
        </View>
        <Text style={styles.cycleStats}>
          {cycles.filter(c => c.type === "Work" && new Date(c.timestamp).toDateString() === new Date().toDateString()).length} Pomodoros today
        </Text>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", color: "#22223b", marginBottom: 8, letterSpacing: 1 },
  timer: { fontSize: 72, fontWeight: "bold", color: "#22223b", marginBottom: 24, letterSpacing: 2 },
  row: { flexDirection: "row", gap: 16, marginBottom: 16 },
  customRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, marginTop: 8 },
  input: {
    width: 48,
    height: 44,
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    fontSize: 18,
    marginHorizontal: 2,
    borderWidth: 1,
    borderColor: "#e0e1dd",
    textAlign: "center",
    color: "#22223b",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 18,
    color: "#bfc0c0",
    marginHorizontal: 2,
  },
  setButton: {
    backgroundColor: "#4a4e69",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
    elevation: 2,
  },
  setButtonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  button: {
    backgroundColor: "#22223b",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 36,
    marginBottom: 0,
    elevation: 2,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  buttonActive: {
    backgroundColor: "#4a4e69",
  },
  resetButton: {
    backgroundColor: "#bbb",
  },
  buttonText: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  cycleTitle: { fontSize: 20, color: "#4a4e69", marginTop: 32, marginBottom: 8, fontWeight: "bold" },
  cycleItem: { fontSize: 16, color: "#22223b", marginBottom: 2 },
  musicPlayer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 8,
  },
  musicButton: {
    backgroundColor: "#22223b",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 2,
    elevation: 1,
  },
  musicButtonActive: {
    backgroundColor: "#4a4e69",
  },
  musicButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e0e1dd",
    borderRadius: 6,
    marginBottom: 16,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    borderRadius: 6,
  },
  cycleStats: {
    fontSize: 14,
    color: "#4a4e69",
    marginBottom: 8,
    fontWeight: "600",
  },
});