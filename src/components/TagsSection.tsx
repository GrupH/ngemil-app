import Tag from "@/components/Tag";
import { colours } from "@/constants/style";
import { Plus } from "lucide-react-native";
import { StyleSheet, Text, View } from "react-native";

type TagsSectionProps = {
  tags: string[];
};

export default function TagsSection({ tags }: TagsSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>TAGS</Text>
      <View style={styles.tagRow}>
        {tags.map((tag, index) => {
          const count = 10 + index * 5 + (tag.length % 7);
          return <Tag key={tag} text={tag} count={count} />;
        })}
        <View style={styles.addTagButton}>
          <Plus color="#8B889E" size={12} />
          <Text style={styles.addTagText}>Add</Text>
        </View>
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
    color: colours.heading,
    letterSpacing: 1,
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 8,
  },
  addTagButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#EDF0FE",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  addTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B889E",
  },
});
