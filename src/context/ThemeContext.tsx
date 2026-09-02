import { darkColours, lightColours, ThemeColours } from "@/constants/style";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  themeMode: ThemeMode;
  isDarkMode: boolean;
  colours: ThemeColours;
  toggleTheme: (val?: boolean | any) => void;
  setThemeMode: (mode: ThemeMode) => void;
}

const THEME_STORAGE_KEY = "@ngemil_app_theme_mode";

const ThemeContext = createContext<ThemeContextType>({
  themeMode: "light",
  isDarkMode: false,
  colours: lightColours,
  toggleTheme: () => {},
  setThemeMode: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY)
      .then((savedTheme) => {
        if (savedTheme === "dark" || savedTheme === "light" || savedTheme === "system") {
          setThemeModeState(savedTheme as ThemeMode);
        }
      })
      .catch(() => {});
  }, []);

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    AsyncStorage.setItem(THEME_STORAGE_KEY, mode).catch(() => {});
  };

  const isDarkMode =
    themeMode === "system"
      ? systemColorScheme === "dark"
      : themeMode === "dark";

  const toggleTheme = (val?: boolean | any) => {
    if (typeof val === "boolean") {
      setThemeMode(val ? "dark" : "light");
    } else {
      setThemeMode(isDarkMode ? "light" : "dark");
    }
  };

  const colours = isDarkMode ? darkColours : lightColours;

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        isDarkMode,
        colours,
        toggleTheme,
        setThemeMode,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
