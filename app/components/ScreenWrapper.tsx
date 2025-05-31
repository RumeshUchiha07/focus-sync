import { LinearGradient } from "expo-linear-gradient";
import { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import BottomNav from "./BottomNav";

export default function ScreenWrapper({
  children,
  hideNav = false,
}: {
  children: ReactNode;
  hideNav?: boolean;
}) {
  return (
    <LinearGradient
      colors={["#a18cd1", "#fbc2eb", "#fad0c4"]}
      style={styles.gradient}
    >
      <View style={styles.content}>{children}</View>
      {!hideNav && <BottomNav />}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    justifyContent: "flex-end",
  },
  content: {
    flex: 1,
    paddingBottom: 60, // space for nav
  },
});