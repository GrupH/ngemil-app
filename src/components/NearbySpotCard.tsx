import Tag from "@/components/Tag";
import { colours } from "@/constants/style";
import { MapPin, Star } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type NearbySpotProps = {
  imageUrl: string;
  title: string;
  rating: number;
  distance: string;
  tags: string[];
  description: string;
  onPress?: () => void;
};

export default function NearbySpotCard({
  imageUrl,
  title,
  rating,
  distance,
  tags,
  description,
  onPress,
}: NearbySpotProps) {
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

        {/* Tags Row */}
        <View style={styles.tagRow}>
          {tags.slice(0, 3).map((tag) => (
            <Tag key={tag} text={tag} small />
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
    borderRadius: 20,
    borderColor: "#EDF0FE",
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.02,
    shadowRadius: 6,
    elevation: 2,
  },
  pressedCard: {
    opacity: 0.95,
  },
  imageContainer: {
    height: 120,
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
    flexWrap: "wrap",
  },
  description: {
    fontSize: 12,
    color: colours.text_secondary,
    lineHeight: 16,
  },
});
