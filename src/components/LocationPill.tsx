import LocationPin from "@/components/LocationPin";
import { useTheme } from "@/context/ThemeContext";
import { Pressable, StyleSheet, Text } from "react-native";

type LocationPillProps = {
  onPress?: () => void;
  title: string;
};

export default function LocationPill({ onPress, title }: LocationPillProps) {
  const { colours } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        { backgroundColor: colours.border_2 },
        pressed && styles.pressedPill,
      ]}
    >
      <LocationPin size={18} color="#C6B6FC" holeColor="#726E83" />
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
        {title ?? "Choose location"}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    maxWidth: 180,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#726E83",
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignSelf: "flex-start",
    gap: 10,
  },
  pressedPill: {
    opacity: 0.8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
});
