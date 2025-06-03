import ScreenWrapper from "@/components/ScreenWrapper";
import { auth } from "@/firebaseConfig";
import { useTheme } from "@/theme";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Circle } from "react-native-svg";

const db = getFirestore();
const LOFI_TRACKS = [
  require("../../assets/lofi/A Cruel Angel's Thesis (Evangelion).mp3"),
  require("../../assets/lofi/Again (Fullmetal Alchemist Brotherhood).mp3"),
  require("../../assets/lofi/Again Lofi (Fullmetal Alchemist Brotherhood).mp3"),
  require("../../assets/lofi/Agni Kai.mp3"),
  require("../../assets/lofi/Alone.mp3"),
  require("../../assets/lofi/Apple Seed.mp3"),
  require("../../assets/lofi/Arrietty's Song.mp3"),
  require("../../assets/lofi/Attack on Titan.mp3"),
  require("../../assets/lofi/Avatar_ the Last Airbender.mp3"),
  require("../../assets/lofi/Azalea Town - Lofi.mp3"),
  require("../../assets/lofi/Barricades.mp3"),
  require("../../assets/lofi/Blue Bird.mp3"),
  require("../../assets/lofi/Boku No Sensou (My War).mp3"),
  require("../../assets/lofi/brain-implant-cyberpunk-sci-fi-trailer-action-intro-330416.mp3"),
  require("../../assets/lofi/Call of Silence.mp3"),
  require("../../assets/lofi/Call Your Name.mp3"),
  require("../../assets/lofi/Castle In the Sky (Carrying You).mp3"),
  require("../../assets/lofi/Colors (Code Geass).mp3"),
  require("../../assets/lofi/Crossing Field (Sword Art Online).mp3"),
  require("../../assets/lofi/Crossing Fields (Sword Art Online).mp3"),
  require("../../assets/lofi/Dark World.mp3"),
  require("../../assets/lofi/Departure (Hunter X Hunter).mp3"),
  require("../../assets/lofi/Departure Lofi (Hunter X Hunter).mp3"),
  require("../../assets/lofi/Difficult.mp3"),
  require("../../assets/lofi/Fairy Fountain.mp3"),
  require("../../assets/lofi/Fairy Tail Theme.mp3"),
  // Add more require statements here for any additional files in assets/lofi
];

const getTrackSrc = (index: number) => {
  if (Platform.OS === "web") {
    return LOFI_TRACKS[index];
  }
  return "";
};

export default function PomodoroTimer() {
  const { colors } = useTheme();

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

  // Helper for circular progress
  const CIRCLE_SIZE = 225;
  const STROKE_WIDTH = 14;
  const RADIUS = (CIRCLE_SIZE - STROKE_WIDTH) / 2;
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

  // Calculate progress based on mode
  const getTotalSeconds = () => {
    if (mode === "Work") return parseInt(workDuration) * 60;
    if (mode === "Short Break") return parseInt(shortBreakDuration) * 60;
    if (mode === "Long Break") return parseInt(longBreakDuration) * 60;
    return 1;
  };
  const progress = 1 - seconds / getTotalSeconds();

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      interval.current = setInterval(() => {
        setSeconds((s) => {
          if (s <= 1) {
            clearInterval(interval.current!);
            setIsRunning(false);
            setTimeout(() => handleCycleEnd(), 500); // Delay to allow state update
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
      } else {
        setMode("Short Break");
        setSeconds(parseInt(shortBreakDuration) * 60);
      }
      setTimeout(() => setIsRunning(true), 300); // Restart timer after mode/seconds update
    } else {
      setMode("Work");
      setSeconds(parseInt(workDuration) * 60);
      setTimeout(() => setIsRunning(true), 300); // Restart timer after mode/seconds update
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
        style={[
          styles.musicButton,
          musicPlaying && { backgroundColor: colors.accent },
          { backgroundColor: colors.button },
        ]}
        onPress={() => setMusicPlaying((p) => !p)}
      >
        <Text style={[styles.musicButtonText, { color: colors.buttonText }]}>
          {musicPlaying ? "Pause Lofi" : "Play Lofi"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.musicButton, { backgroundColor: colors.button }]}
        onPress={() => setTrackIndex((i) => (i + 1) % LOFI_TRACKS.length)}
      >
        <Text style={[styles.musicButtonText, { color: colors.buttonText }]}>Next Track</Text>
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
        <Text style={{ color: colors.subtext, marginLeft: 8 }}>
          Lofi playback is only available on web.
        </Text>
      )}
    </View>
  );

  return (
    <ScreenWrapper>
      <SafeAreaView style={[styles.container]}>
        <View style={{ alignItems: "center", justifyContent: "center", marginBottom: 24 }}>
          <Svg width={CIRCLE_SIZE} height={CIRCLE_SIZE}>
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke={colors.inputBorder}
              strokeWidth={STROKE_WIDTH}
              fill="none"
            />
            <Circle
              cx={CIRCLE_SIZE / 2}
              cy={CIRCLE_SIZE / 2}
              r={RADIUS}
              stroke={mode === "Work" ? colors.accent : colors.primary}
              strokeWidth={STROKE_WIDTH}
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${CIRCLE_SIZE / 2},${CIRCLE_SIZE / 2}`}
            />
          </Svg>
          <View style={styles.timerOverlay}>
            <Text style={[styles.title, { color: colors.text }]}>{mode}</Text>
            <Text style={[styles.timer, { color: colors.text }]}>{format(seconds)}</Text>
          </View>
        </View>
        <View style={styles.row}>
          <TouchableOpacity
            style={[
              styles.button,
              isRunning && { backgroundColor: colors.accent },
              { backgroundColor: colors.button },
            ]}
            onPress={() => setIsRunning((r) => !r)}
          >
            <Text style={[styles.buttonText, { color: colors.buttonText }]}>
              {isRunning ? "Pause" : "Start"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.resetButton, { backgroundColor: colors.card, borderColor: colors.border }]}
            onPress={() => {
              setIsRunning(false);
              setMode("Work");
              setSeconds(parseInt(workDuration) * 60);
              setCycleCount(0);
            }}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>Reset</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.customRow}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderColor: colors.inputBorder,
              },
            ]}
            keyboardType="numeric"
            value={workDuration}
            onChangeText={setWorkDuration}
            placeholder="Work"
            maxLength={2}
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.inputLabel, { color: colors.subtext }]}>/</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderColor: colors.inputBorder,
              },
            ]}
            keyboardType="numeric"
            value={shortBreakDuration}
            onChangeText={setShortBreakDuration}
            placeholder="Short"
            maxLength={2}
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.inputLabel, { color: colors.subtext }]}>/</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderColor: colors.inputBorder,
              },
            ]}
            keyboardType="numeric"
            value={longBreakDuration}
            onChangeText={setLongBreakDuration}
            placeholder="Long"
            maxLength={2}
            placeholderTextColor={colors.subtext}
          />
          <Text style={[styles.inputLabel, { color: colors.subtext }]}>/</Text>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: colors.inputBg,
                color: colors.inputText,
                borderColor: colors.inputBorder,
              },
            ]}
            keyboardType="numeric"
            value={cyclesBeforeLongBreak}
            onChangeText={setCyclesBeforeLongBreak}
            placeholder="Cycles"
            maxLength={1}
            placeholderTextColor={colors.subtext}
          />
          <TouchableOpacity style={[styles.setButton, { backgroundColor: colors.accent }]} onPress={handleSetCustomTimes}>
            <Text style={[styles.setButtonText, { color: colors.buttonText }]}>Set</Text>
          </TouchableOpacity>
        </View>
        {lofiPlayer}
        <Text style={[styles.cycleTitle, { color: colors.accent }]}>Today's Cycles</Text>
        <FlatList
          data={cycles.filter(
            c =>
              new Date(c.timestamp).toDateString() === new Date().toDateString()
          ).reverse()}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <Text style={[styles.cycleItem, { color: colors.text }]}>
              {item.type} - {new Date(item.timestamp).toLocaleTimeString()}
            </Text>
          )}
          style={{ width: "100%" }}
        />
        <View style={[styles.progressBarContainer, { backgroundColor: colors.inputBorder }]}>
          <View
            style={[
              styles.progressBar,
              {
                width: `${((parseInt(workDuration) * 60 - seconds) / (parseInt(workDuration) * 60)) * 100}%`,
                backgroundColor: mode === "Work" ? colors.accent : colors.primary,
              },
            ]}
          />
        </View>
        <Text style={[styles.cycleStats, { color: colors.subtext }]}>
          {
            cycles.filter(
              c =>
                c.type === "Work" &&
                new Date(c.timestamp).toDateString() === new Date().toDateString()
            ).length
          }{" "}
          Pomodoros today
        </Text>
      </SafeAreaView>
    </ScreenWrapper>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 8, letterSpacing: 1 },
  timer: { fontSize: 72, fontWeight: "bold", marginBottom: 24, letterSpacing: 2 },
  row: { flexDirection: "row", gap: 16, marginBottom: 16 },
  customRow: { flexDirection: "row", alignItems: "center", marginBottom: 16, marginTop: 8 },
  input: {
    width: 48,
    height: 44,
    borderRadius: 12,
    paddingHorizontal: 8,
    fontSize: 18,
    marginHorizontal: 2,
    borderWidth: 1,
    textAlign: "center",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  inputLabel: {
    fontSize: 18,
    marginHorizontal: 2,
  },
  setButton: {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
    marginLeft: 8,
    elevation: 2,
  },
  setButtonText: { fontWeight: "bold", fontSize: 16 },
  button: {
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
  resetButton: {
    borderWidth: 1,
  },
  buttonText: { fontSize: 20, fontWeight: "bold" },
  cycleTitle: { fontSize: 20, marginTop: 32, marginBottom: 8, fontWeight: "bold" },
  cycleItem: { fontSize: 16, marginBottom: 2 },
  musicPlayer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    gap: 8,
  },
  musicButton: {
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 18,
    marginHorizontal: 2,
    elevation: 1,
  },
  musicButtonText: {
    fontWeight: "bold",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
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
    marginBottom: 8,
    fontWeight: "600",
  },
  timerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
});