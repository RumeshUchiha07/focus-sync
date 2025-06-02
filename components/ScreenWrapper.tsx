import { useTheme } from "@/theme";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import { ReactNode } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import BottomNav from "./BottomNav";

const lightGradient = ["#f7f8fa", "#e0e1dd", "#fbc2eb"];
const darkGradient = ["#181926", "#23243a", "#4a4e69"];

export default function ScreenWrapper({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { colors, dark } = useTheme();

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={dark ? darkGradient : lightGradient}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <View style={styles.content}>{children}</View>
      {!hideNav && <BottomNav />}
      {/* Floating AI Chat Button */}
      {pathname !== "/dashboard/aichat" && (
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 20,
            bottom: 80,
            backgroundColor: colors.accent,
            borderRadius: 28,
            padding: 14,
            elevation: 6,
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
          }}
          onPress={() => router.push("/dashboard/aichat")}
        >
          <MaterialCommunityIcons name="robot-outline" size={28} color="#fff" />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 60, // space for nav
  },
});