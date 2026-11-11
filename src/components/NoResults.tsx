import { useTheme } from "@/context/ThemeContext";
import { LucideIcon, SearchX } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon?: LucideIcon;
  title: string;
  subtitle?: string;
};

export default function NoResults({ icon: Icon = SearchX, title, subtitle }: Props) {
  const { colours } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colours.primary_bg }]}>
      <Icon size={36} color={colours.accent_1} />
      <Text style={[styles.title, { color: colours.heading }]}>{title}</Text>
      {subtitle && (
        <Text style={[styles.subtitle, { color: colours.text_secondary }]}>
          {subtitle}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  title: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});