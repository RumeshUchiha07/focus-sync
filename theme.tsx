import React, { createContext, useContext, useState, ReactNode } from "react";

const lightColors = {
  background: "#f7f8fa",
  card: "#fff",
  text: "#22223b",
  subtext: "#4a4e69",
  border: "#e0e1dd",
  primary: "#22223b",
  accent: "#4a4e69",
  button: "#22223b",
  buttonText: "#fff",
  inputBg: "#fff",
  inputText: "#22223b",
  inputBorder: "#e0e1dd",
};

const darkColors = {
  background: "#181926",
  card: "#23243a",
  text: "#f7f8fa",
  subtext: "#bfc0c0",
  border: "#23243a",
  primary: "#a18cd1",
  accent: "#fad0c4",
  button: "#23243a",
  buttonText: "#fff",
  inputBg: "#23243a",
  inputText: "#f7f8fa",
  inputBorder: "#4a4e69",
};

const ThemeContext = createContext({
  dark: false,
  colors: lightColors,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState(false);
  const toggleTheme = () => setDark((d) => !d);
  const colors = dark ? darkColors : lightColors;
  return (
    <ThemeContext.Provider value={{ dark, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);