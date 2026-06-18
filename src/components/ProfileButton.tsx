import { colours } from "@/constants/style";
import { User } from "lucide-react-native";
import { Pressable, StyleSheet } from "react-native";

type ProfileButtonProps = {
  onPress?: () => void;
};

export default function ProfileButton({ onPress }: ProfileButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
      ]}
    >
      <User color={colours.accent_1} size={22} strokeWidth={2.5} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colours.border_1,
    borderWidth: 2,
    borderColor: colours.accent_1,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
