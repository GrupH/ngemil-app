import { useTheme } from "@/context/ThemeContext";
import { Search } from "lucide-react-native";
import { StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  onSubmit?: () => void;
};

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onSubmit,
}: SearchBarProps) {
  const { colours } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colours.input_bg,
          borderColor: colours.border_1,
        },
      ]}
    >
      <Search color={colours.accent_1} size={20} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onSubmitEditing={onSubmit}
        placeholderTextColor={colours.text_placeholder}
        style={[styles.input, { color: colours.text_primary }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderRadius: 12,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
});
