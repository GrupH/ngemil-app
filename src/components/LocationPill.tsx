import { MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type LocationPillProps = {
  onPress?: () => void;
  title: string;
};

export default function LocationPill({ onPress, title }: LocationPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        pressed && styles.pressedPill,
      ]}
    >
      <View style={styles.iconContainer}>
        <MapPin color="#C6B6FC" fill="#C6B6FC" size={18} />
        <View style={styles.iconHole} />
      </View>
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#726E83",
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 22,
    alignSelf: "flex-start",
    gap: 8,
  },
  pressedPill: {
    opacity: 0.8,
  },
  iconContainer: {
    width: 18,
    height: 18,
    position: "relative",
  },
  iconHole: {
    position: "absolute",
    width: 4.5,
    height: 4.5,
    borderRadius: 2.25,
    backgroundColor: "#726E83",
    top: 5.25,
    left: 6.75,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
