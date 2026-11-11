import Tag from "@/components/Tag";
import { useTheme } from "@/context/ThemeContext";
import { SpotProps } from "@/types/types";
import { MapPin, Star } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import ImagePlaceholder from "./ImagePlaceholder";

export default function NearbySpotCard({
  imageUrl,
  title,
  rating,
  distance,
  tags,
  description,
  onPress,
}: SpotProps) {
  const { colours } = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colours.card_bg,
          borderColor: colours.border_1,
        },
        pressed && styles.pressedCard,
      ]}
    >
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        {imageUrl === "" ? (
          <ImagePlaceholder style={styles.image} />
        ) : (
          <Image source={{ uri: imageUrl }} style={styles.image} />
        )}

        {/* Floating Stats Pill */}
        <View style={[styles.statsPill, { backgroundColor: colours.card_bg }]}>
          {rating > -1 && (
            <>
              <Star color={colours.accent_1} fill={colours.accent_1} size={11} />
              <Text style={[styles.statsText, { color: colours.text_primary }]}>
                {rating.toFixed(1)}
              </Text>

              <Text style={[styles.bullet, { color: colours.text_secondary }]}>•</Text>
            </>
          )}

          <View style={styles.iconContainer}>
            <MapPin color={colours.accent_1} fill={colours.accent_1} size={11} />
            <View style={[styles.iconHole, { backgroundColor: colours.card_bg }]} />
          </View>
          <Text style={[styles.statsText, { color: colours.text_primary }]}>
            {distance}
          </Text>
        </View>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.content}>
        <Text style={[styles.title, { color: colours.text_primary }]} numberOfLines={1}>
          {title}
        </Text>

        {/* Tags Row */}
        <View style={styles.tagRow}>
          {tags.slice(0, 2).map((tag, index) => (
            <Tag key={index} text={tag.name} small />
          ))}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#0A0B1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
    flex: 1,
  },
  pressedCard: {
    opacity: 0.95,
  },
  imageContainer: {
    height: 130,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statsPill: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 9999,
    gap: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statsText: {
    fontSize: 10,
    fontWeight: "700",
  },
  bullet: {
    fontSize: 10,
    marginHorizontal: 1,
  },
  iconContainer: {
    width: 11,
    height: 11,
    position: "relative",
  },
  iconHole: {
    position: "absolute",
    width: 2.75,
    height: 2.75,
    borderRadius: 1.375,
    top: 3.2,
    left: 4.125,
  },
  content: {
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
  },
  tagRow: {
    flexDirection: "row",
    gap: 4,
  },
});
