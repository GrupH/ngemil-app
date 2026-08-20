import { colours } from "@/constants/style";
import { ArrowLeft, X } from "lucide-react-native";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type BackButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>
  type: "Close" | "Back"
};

export default function BackButton({ onPress, style, type }: BackButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed, style]}
    >
      {type === "Back" && <ArrowLeft color={colours.accent_1} size={20} strokeWidth={2.5} />}
      {type === "Close" && <X color={colours.accent_1} size={20} strokeWidth={2.5} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
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
