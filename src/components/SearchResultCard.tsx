import ImagePlaceholder from "@/components/ImagePlaceholder";
import LocationPin from "@/components/LocationPin";
import Tag from "@/components/Tag";
import { colours } from "@/constants/style";
import { PlaceData } from "@/types/types";
import { Star } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type SearchResultCardProps = {
  place: PlaceData;
  onPress: () => void;
};

export default function SearchResultCard({ place, onPress }: SearchResultCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      {/* Image Thumbnail */}
      <View style={styles.imageWrapper}>
        {place.imageUrl ? (
          <Image source={{ uri: place.imageUrl }} style={styles.image} />
        ) : (
          <ImagePlaceholder style={styles.image} />
        )}
      </View>

      {/* Content Details */}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {place.title}
        </Text>

        {/* Rating & Distance */}
        <View style={styles.statsRow}>
          {place.rating > -1 && (
            <View style={styles.statItem}>
              <Star color="#949FF1" fill="#949FF1" size={13} />
              <Text style={styles.statTextBold}>{place.rating.toFixed(1)}</Text>
            </View>
          )}

          {place.rating > -1 && place.distance && place.distance !== "N/A" && (
            <Text style={styles.bullet}>•</Text>
          )}

          {place.distance && place.distance !== "N/A" && (
            <View style={styles.statItem}>
              <LocationPin size={12} color="#949FF1" holeColor="#FFFFFF" />
              <Text style={styles.statTextMuted}>{place.distance}</Text>
            </View>
          )}
        </View>

        {/* Tags */}
        {place.tags && place.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {place.tags.slice(0, 3).map((tag, idx) => (
              <Tag key={idx} text={tag.name} small />
            ))}
          </View>
        )}

        {/* Address or Description */}
        <Text style={styles.snippet} numberOfLines={1}>
          {place.address || place.description || "Snacks & hangout spot"}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colours.secondary_bg,
    borderRadius: 14,
    borderColor: colours.border_1,
    borderWidth: 1.5,
    padding: 12,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    shadowColor: "#0A0B1A",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardPressed: {
    opacity: 0.92,
    backgroundColor: "#F7F8FE",
  },
  imageWrapper: {
    width: 84,
    height: 84,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: colours.primary_bg,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: "800",
    color: colours.text_primary,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  statTextBold: {
    fontSize: 12,
    fontWeight: "700",
    color: colours.text_primary,
  },
  statTextMuted: {
    fontSize: 12,
    fontWeight: "500",
    color: colours.text_secondary,
  },
  bullet: {
    fontSize: 12,
    color: colours.heading,
    marginHorizontal: 2,
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 4,
  },
  snippet: {
    fontSize: 11,
    color: colours.text_secondary,
    lineHeight: 15,
  },
});

