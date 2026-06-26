import { colours } from "@/constants/style";
import type { Review } from "@/types/types";
import { Star } from "lucide-react-native";
import { Image, StyleSheet, Text, View } from "react-native";

type ReviewsSectionProps = {
  reviews: Review[];
};

export default function ReviewsSection({ reviews }: ReviewsSectionProps) {
  if (!reviews || reviews.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>REVIEWS</Text>
      <View style={styles.reviewsList}>
        {reviews.map((review) => (
          <View key={review.id} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.avatarContainer}>
                <Image source={{ uri: review.avatar }} style={styles.avatar} />
              </View>
              <View style={styles.reviewUserMeta}>
                <Text style={styles.username}>{review.username}</Text>
                <View style={styles.starsRow}>
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      color={i < review.rating ? "#949FF1" : "#E5E5E5"}
                      fill={i < review.rating ? "#949FF1" : "#E5E5E5"}
                      size={12}
                    />
                  ))}
                </View>
              </View>
            </View>
            <Text style={styles.reviewText}>{review.comment}</Text>
          </View>
        ))}
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
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: "#F9F9F6",
    borderRadius: 12,
    borderColor: "#EDF0FE",
    borderWidth: 2,
    padding: 16,
    gap: 8,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#EDF0FE",
    overflow: "hidden",
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  reviewUserMeta: {
    justifyContent: "center",
    gap: 2,
  },
  username: {
    fontSize: 12,
    fontWeight: "700",
    color: colours.text_primary,
  },
  starsRow: {
    flexDirection: "row",
    gap: 2,
  },
  reviewText: {
    fontSize: 11,
    color: colours.text_primary,
    lineHeight: 16,
  },
});
