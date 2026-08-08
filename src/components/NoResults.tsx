import { colours } from "@/constants/style";
import { LucideIcon, SearchX } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type Props = {
  icon?: LucideIcon
  title: string;
  subtitle?: string;
};

export default function NoResults({icon: Icon = SearchX, title, subtitle }: Props){

  return(
    <View style={styles.container}>
      <Icon size={36} color={colours.accent_1} />
      <Text style={styles.title}>{title}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: 32,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colours.primary_bg,
  },
  title: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "700",
    color: colours.heading,
  },
  subtitle: {
    fontSize: 14,
    color: colours.border_2,
    textAlign: "center",
    paddingHorizontal: 24,
  },
});