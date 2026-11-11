import { colours } from "@/constants/style";
import { MapPin } from "lucide-react-native";
import { StyleSheet, View } from "react-native";

type LocationPinProps = {
  size?: number;
  color?: string;
  holeColor?: string;
};

export default function LocationPin({
  size = 14,
  color = colours.accent_1,
  holeColor = "#FFFFFF",
}: LocationPinProps) {
  const holeSize = size * 0.25;
  const holeRadius = holeSize / 2;
  const holeTop = size * 0.29;
  const holeLeft = size * 0.375;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <MapPin color={color} fill={color} size={size} />
      <View
        style={[
          styles.hole,
          {
            width: holeSize,
            height: holeSize,
            borderRadius: holeRadius,
            backgroundColor: holeColor,
            top: holeTop,
            left: holeLeft,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  hole: {
    position: "absolute",
  },
});

