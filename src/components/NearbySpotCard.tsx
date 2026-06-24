import Tag from "@/components/Tag";
import { colours } from "@/constants/style";
import { SpotProps } from "@/types/types";
import { MapPin, Star } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function NearbySpotCard({
  imageUrl,
  title,
  rating,
  distance,
  tags,
  description,
  onPress,
}: SpotProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressedCard]}
    >
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: imageUrl }} style={styles.image} />

        {/* Floating Stats Pill */}
        <View style={styles.statsPill}>
          <Star color="#949FF1" fill="#949FF1" size={11} />
          <Text style={styles.statsText}>{rating.toFixed(1)}</Text>

          <Text style={styles.bullet}>•</Text>

          <View style={styles.iconContainer}>
            <MapPin color="#949FF1" fill="#949FF1" size={11} />
            <View style={styles.iconHole} />
          </View>
          <Text style={styles.statsText}>{distance}</Text>
        </View>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>

        {/* Tags Row - Slice to 2 tags to prevent wrap height misalignment */}
        <View style={styles.tagRow}>
          {tags.slice(0, 2).map((tag, index) => (
            <Tag key={index} text={tag.name} small />
          ))}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {description}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderColor: "#EDF0FE",
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#0A0B1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 3,
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
    backgroundColor: "#FFFFFF",
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
    color: "#5A5869",
  },
  bullet: {
    fontSize: 10,
    color: "#8B889E",
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
    backgroundColor: "#FFFFFF",
    top: 3.2,
    left: 4.125,
  },
  content: {
    padding: 12,
    gap: 6,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: colours.text_primary,
  },
  tagRow: {
    flexDirection: "row",
    gap: 4,
  },
  description: {
    fontSize: 12,
    color: colours.text_secondary,
    lineHeight: 16,
  },
});
