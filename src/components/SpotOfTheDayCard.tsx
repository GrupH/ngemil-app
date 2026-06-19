import Tag from "@/components/Tag";
import { colours } from "@/constants/style";
import { MapPin, Star } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type SpotProps = {
  imageUrl: string;
  title: string;
  rating: number;
  distance: string;
  tags: string[];
  description: string;
  onPress?: () => void;
};

export default function SpotOfTheDayCard({
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
          <Star color="#949FF1" fill="#949FF1" size={14} />
          <Text style={styles.statsText}>{rating.toFixed(1)}</Text>

          <Text style={styles.bullet}>•</Text>

          <View style={styles.iconContainer}>
            <MapPin color="#949FF1" fill="#949FF1" size={14} />
            <View style={styles.iconHole} />
          </View>
          <Text style={styles.statsText}>{distance}</Text>
        </View>
      </View>

      {/* Bottom Content Section */}
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>

        {/* Tags Row */}
        <View style={styles.tagRow}>
          {tags.map((tag) => (
            <Tag key={tag} text={tag} />
          ))}
        </View>

        <Text style={styles.description}>{description}</Text>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  pressedCard: {
    opacity: 0.95,
  },
  imageContainer: {
    height: 180,
    width: "100%",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  statsPill: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 9999,
    gap: 4,
  },
  statsText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#5A5869",
  },
  bullet: {
    fontSize: 12,
    color: "#8B889E",
    marginHorizontal: 2,
  },
  iconContainer: {
    width: 14,
    height: 14,
    position: "relative",
  },
  iconHole: {
    position: "absolute",
    width: 3.5,
    height: 3.5,
    borderRadius: 1.75,
    backgroundColor: "#FFFFFF",
    top: 4.1,
    left: 5.25,
  },
  content: {
    padding: 16,
    gap: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: colours.text_primary,
  },
  tagRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  description: {
    fontSize: 14,
    color: colours.text_secondary,
    lineHeight: 20,
  },
});
