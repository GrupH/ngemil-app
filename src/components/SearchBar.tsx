import { colours } from "@/constants/style";
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
  return (
    <View style={styles.container}>
      <Search color="#949FF1" size={20} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        onSubmitEditing={onSubmit}
        placeholderTextColor="#CBC6C6"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
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
});
