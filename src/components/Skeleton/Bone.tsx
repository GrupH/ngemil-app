import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const LIGHT_SHIMMER_BASE = "#d8dae9";
export const LIGHT_SHIMMER_HIGHLIGHT = "#ececee";

export const DARK_SHIMMER_BASE = "#282834";
export const DARK_SHIMMER_HIGHLIGHT = "#3A3A4A";

export default function Bone({
  width,
  height,
  borderRadius = 8,
  style,
}: {
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: object;
}) {
  const { isDarkMode } = useTheme();
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: false,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmer]);

  const baseColor = isDarkMode ? DARK_SHIMMER_BASE : LIGHT_SHIMMER_BASE;
  const highlightColor = isDarkMode ? DARK_SHIMMER_HIGHLIGHT : LIGHT_SHIMMER_HIGHLIGHT;

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [baseColor, highlightColor],
  });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor }, style]}
    />
  );
}
