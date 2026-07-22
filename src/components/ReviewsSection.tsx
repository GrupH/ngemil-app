import { colours } from "@/constants/style";
import { useAuth } from "@/hooks/auth";
import type { Review } from "@/types/types";
import { ChevronRight, Plus, Star, User } from "lucide-react-native";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ReviewsSectionProps = {
  reviews: Review[];
  isModal?: boolean;
  onAddReview?: () => void;
};

export default function ReviewsSection({
  reviews,
  isModal = false,
  onAddReview,
}: ReviewsSectionProps) {
  const hasReviews = reviews && reviews.length > 0;

  const { user } = useAuth()

  // Compact preview (e.g. inside another modal) stays silent when empty,
  // same behaviour the section always had.
  if (!hasReviews && isModal) return null;

  const showAddButton = !isModal && !!onAddReview && !reviews.find((review) => review.user_id === user?.id);

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>
        {isModal ? "TOP REVIEWS" : "REVIEWS"}
      </Text>

      {hasReviews && (
        <View style={styles.reviewsList}>
          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatarContainer}>
                  {review.avatar ? (
                    <Image
                      source={{ uri: review.avatar }}
                      style={styles.avatar}
                    />
                  ) : (
                    <User color={colours.accent_1} />
                  )}
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
      )}

      {showAddButton && (
        <Pressable
          style={({ pressed }) => [
            styles.addReviewCard,
            pressed && styles.addReviewCardPressed,
          ]}
          onPress={!reviews.find((review) => review.user_id === user?.id) ? onAddReview : () => {}}
        >
          <View style={styles.addReviewIconCircle}>
            <Plus color={colours.secondary_bg} size={16} strokeWidth={2.5} />
          </View>
          <View style={styles.addReviewTextGroup}>
            <Text style={styles.addReviewTitle}>
              {hasReviews ? "Write a review" : "Be the first to review"}
            </Text>
            <Text style={styles.addReviewSubtitle}>
              {hasReviews
                ? "Share your take on this spot"
                : "Help others discover this spot"}
            </Text>
          </View>
          <ChevronRight color={colours.accent_1} size={18} />
        </Pressable>
      )}
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
  addReviewCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colours.secondary_bg,
    borderRadius: 14,
    borderColor: colours.border_1,
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  addReviewCardPressed: {
    opacity: 0.65,
  },
  addReviewIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colours.accent_1,
    alignItems: "center",
    justifyContent: "center",
  },
  addReviewTextGroup: {
    flex: 1,
    gap: 1,
  },
  addReviewTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colours.text_primary,
  },
  addReviewSubtitle: {
    fontSize: 11,
    fontWeight: "500",
    color: colours.text_secondary,
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: colours.secondary_bg,
    borderRadius: 12,
    borderColor: colours.border_1,
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
    alignItems: "center",
    justifyContent: "center",
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
