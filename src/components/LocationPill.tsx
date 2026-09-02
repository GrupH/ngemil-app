import { useTheme } from "@/context/ThemeContext";
import { MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
      <View style={styles.iconContainer}>
        <MapPin color={colours.accent_2} fill={colours.accent_2} size={18} />
        <View style={[styles.iconHole, { backgroundColor: colours.border_2 }]} />
      </View>
      <Text style={styles.title} ellipsizeMode="tail" numberOfLines={1}>
        {title}
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
    gap: 10
  },
  pressedPill: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 16,
    height: 16,
    position: "relative",
  },
  iconHole: {
    position: "absolute",
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    top: 5.25,
    left: 6.75,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    flexShrink: 1,
  },
});
