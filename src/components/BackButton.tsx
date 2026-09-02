import { useTheme } from "@/context/ThemeContext";
import { ArrowLeft, X } from "lucide-react-native";
import { Pressable, StyleProp, StyleSheet, ViewStyle } from "react-native";

type BackButtonProps = {
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  type: "Close" | "Back";
};

export default function BackButton({ onPress, style, type }: BackButtonProps) {
  const { colours } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: colours.border_1,
          borderColor: colours.accent_1,
        },
        pressed && styles.pressed,
        style,
      ]}
    >
      {type === "Back" && (
        <ArrowLeft color={colours.accent_1} size={22} strokeWidth={2.5} />
      )}
      {type === "Close" && (
        <X color={colours.accent_1} size={22} strokeWidth={2.5} />
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  pressed: {
    opacity: 0.8,
  },
});
