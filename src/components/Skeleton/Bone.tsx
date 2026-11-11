import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const SHIMMER_BASE = "#d8dae9";
export const SHIMMER_HIGHLIGHT = "#ececee";

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
      ]),
    ).start();
  }, []);

  const backgroundColor = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [SHIMMER_BASE, SHIMMER_HIGHLIGHT],
  });

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor }, style]}
    />
  );
}
