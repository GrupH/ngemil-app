import { StyleSheet, Text, View } from "react-native";

type TagType = "Bakery" | "Halal" | "Cafe" | string;

type TagProps = {
  text: TagType;
  small?: boolean;
  count?: number;
};

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Bakery: { bg: "#FAF3E0", text: "#C59B27" },
  Japanese: { bg: "#FAF3E0", text: "#C59B27" },
  Halal: { bg: "#E8F8EC", text: "#52B752" },
  Cafe: { bg: "#F0EBFE", text: "#9875F6" },
  default: { bg: "#EDF0FE", text: "#726E83" },
};

export default function Tag({ text, small = false, count }: TagProps) {
  const colors = TAG_COLORS[text] || TAG_COLORS.default;

  return (
    <View
      style={[
        styles.container,
        small ? styles.containerSmall : styles.containerNormal,
        { backgroundColor: colors.bg },
      ]}
    >
      <Text
        style={[
          styles.text,
          small ? styles.textSmall : styles.textNormal,
          { color: colors.text },
        ]}
      >
        {text}
        {count !== undefined && <Text style={styles.tagCount}> {count}</Text>}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-start",
  },
  containerNormal: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  containerSmall: {
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 8,
  },
  text: {
    fontWeight: "700",
  },
  textNormal: {
    fontSize: 12,
  },
  textSmall: {
    fontSize: 10,
  },
  tagCount: {
    fontWeight: "500",
    opacity: 0.8,
  },
});
