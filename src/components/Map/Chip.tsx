import { colours } from "@/constants/style";
import { Image, StyleSheet, Text, View } from "react-native";
import ImagePlaceholder from "../ImagePlaceholder";

export default function Chip({
  name,
  dist,
  img,
  type,
}: {
  name: string;
  dist: string;
  img: string;
  type: "compact" | "detailed";
}) {
  return (
    <View style={[styles.chipWrap]} collapsable={false}>
      {type === "detailed" && (
        <View
          style={[
            styles.chip,
            {
              backgroundColor: colours.primary_bg,
              borderColor: colours.accent_1,
            },
          ]}
        >
          <Text
            style={[styles.name, { color: colours.text_primary }]}
            numberOfLines={1}
          >
            {name}
          </Text>
          <Text style={[styles.meta, { color: colours.text_secondary }]}>
            {dist}
          </Text>
        </View>
      )}

      {type === "compact" && (
        <View
          style={[
            styles.chipCompact,
            {
              backgroundColor: colours.primary_bg,
              borderColor: colours.accent_1,
            },
          ]}
        >
          {!img ? (
            <ImagePlaceholder style={styles.chipImg} size={20} />
          ) : (
            <Image
              source={{ uri: img }}
              style={styles.chipImg}
              resizeMode="cover"
              onError={(e) =>
                console.warn("chip image failed", name, e.nativeEvent.error)
              }
            />
          )}
        </View>
      )}

      <View style={[styles.tail, { borderTopColor: colours.accent_1 }]} />
      <View
        style={[
          styles.tail,
          styles.tailInner,
          { borderTopColor: colours.accent_1 },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  chipWrap: {
    alignItems: "center",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 999,
    borderWidth: 2,
    elevation: 4,
  },
  chipCompact: {
    flexDirection: "row",
    alignItems: "center",
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 2,
    elevation: 4,
  },
  name: { fontSize: 10, fontWeight: "600" },
  meta: { fontSize: 8 },
  tail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 7,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
  },
  tailInner: {
    position: "absolute",
    bottom: 1,
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 6,
  },
  chipImg: {
    height: "100%",
    width: "100%",
    borderRadius: 999,
  },
});
