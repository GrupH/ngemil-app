import LocationPin from "@/components/LocationPin";
import { Pressable, StyleSheet, Text } from "react-native";

type LocationPillProps = {
  onPress?: () => void;
  title: string;
};

export default function LocationPill({ onPress, title }: LocationPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.pill, pressed && styles.pressedPill]}
    >
      <LocationPin size={18} color="#C6B6FC" holeColor="#726E83" />
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
    backgroundColor: "#726E83",
    borderRadius: 9999,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignSelf: "flex-start",
  },
  pressedPill: {
    opacity: 0.8,
  },
  title: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    paddingHorizontal: 12,
  },
});
