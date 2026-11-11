import { colours } from "@/constants/style";
import { Search, X } from "lucide-react-native";
import { Pressable, StyleSheet, TextInput, View } from "react-native";

type SearchBarProps = {
  placeholder: string;
  value: string;
  onChangeText?: (text: string) => void;
  onSubmit?: () => void;
  onPress?: () => void;
  editable?: boolean;
  autoFocus?: boolean;
  onClear?: () => void;
};

export default function SearchBar({
  placeholder,
  value,
  onChangeText,
  onSubmit,
  onPress,
  editable = true,
  autoFocus = false,
  onClear,
}: SearchBarProps) {
  const content = (
    <View style={styles.container}>
      <Search color="#949FF1" size={20} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onSubmitEditing={onSubmit}
        placeholderTextColor="#CBC6C6"
        style={styles.input}
        editable={editable}
        autoFocus={autoFocus}
        returnKeyType="search"
      />
      {value.length > 0 && onClear && (
        <Pressable onPress={onClear} hitSlop={10} style={styles.clearButton}>
          <X color="#8B889E" size={18} />
        </Pressable>
      )}
    </View>
  );

  if (onPress && !editable) {
    return (
      <Pressable onPress={onPress} style={styles.pressableWrapper}>
        {content}
      </Pressable>
    );
  }

  return content;
}

const styles = StyleSheet.create({
  pressableWrapper: {
    width: "100%",
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colours.secondary_bg,
    width: "100%",
    borderRadius: 12,
    borderColor: colours.border_1,
    borderWidth: 1,
    paddingHorizontal: 14,
    gap: 10,
    elevation: 2,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colours.text_primary,
    paddingVertical: 12,
  },
  clearButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
});

