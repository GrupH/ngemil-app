import Tag from "@/components/Tag";
import { useTheme } from "@/context/ThemeContext";
import { Plus } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

type TagsSectionProps = {
  tags: { name: string; count: number }[];
  isAdd?: boolean;
  openModal?: () => void;
};

export default function TagsSection({
  tags,
  isAdd = false,
  openModal,
}: TagsSectionProps) {
  const { colours } = useTheme();

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionHeading, { color: colours.heading }]}>TAGS</Text>
      <View style={styles.tagRow}>
        {tags.map((tag) => (
          <Tag key={tag.name} text={tag.name} count={tag.count} />
        ))}

        {!isAdd && (
          <Pressable
            style={({ pressed }) => [
              styles.addTagButton,
              { borderColor: colours.heading },
              pressed && styles.addTagButtonPressed,
            ]}
            onPress={openModal}
            hitSlop={6}
          >
            <Plus color={colours.heading} size={12} />
            <Text style={[styles.addTagText, { color: colours.heading }]}>Add</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    rowGap: 12,
    columnGap: 8,
  },
  addTagButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  addTagButtonPressed: {
    opacity: 0.6,
  },
  addTagText: {
    fontSize: 12,
    fontWeight: "700",
  },
});