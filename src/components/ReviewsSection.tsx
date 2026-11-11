import { colours } from "@/constants/style";
import { useAuth } from "@/hooks/auth";
import { deleteRating } from "@/lib/ratings";
import type { Review } from "@/types/types";
import { ExistingReviewType } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { ChevronRight, EllipsisVertical, Pencil, Plus, Star, Trash2, User } from "lucide-react-native";
import { useMemo, useRef, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

type ReviewsSectionProps = {
  reviews: Review[];
  isModal?: boolean;
  onAddReview?: (isEdit: boolean, existingData: ExistingReviewType) => void;
};

export default function ReviewsSection({
  reviews,
  isModal = false,
  onAddReview,
}: ReviewsSectionProps) {
  const hasReviews = reviews && reviews.length > 0;

  const { user } = useAuth();
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [editReviewModal, setEditReviewModal] = useState<boolean>(false)
  const editReviewModalRef = useRef(null)

  // Put the logged-in user's review first, keep the rest in their existing order
  const orderedReviews = useMemo(() => {
    if (!hasReviews || !user?.id) return reviews;
    const ownReview = reviews.find((review) => review.user_id === user.id);
    if (!ownReview) return reviews;
    return [ownReview, ...reviews.filter((review) => review.user_id !== user.id)];
  }, [reviews, hasReviews, user?.id]);

  if (!hasReviews && isModal) return null;

  const userHasReview = !!reviews.find((review) => review.user_id === user?.id);
  const showAddButton = !isModal && !!onAddReview && !userHasReview;

  function handleEditReviewModal(){
    setEditReviewModal((prev) => !prev)
  }

  async function handleDeleteReview(){
    if (!id){
      console.log("no id", id)
      return
    }

    try{
      const { error } = await deleteRating(id)

      if (error) throw error

      setEditReviewModal(false)
      reviews.filter((review) => review.user_id !== id)

      queryClient.invalidateQueries({ queryKey: ["locationById", id] });
      queryClient.invalidateQueries({ queryKey: ["locationRatings", id] });
    } catch(err){
      console.error("Failed to delete rating:", err); //TODO: error TOAST 
    }
  }

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>
        {isModal ? "TOP REVIEWS" : "REVIEWS"}
      </Text>

      {hasReviews && (
        <View style={styles.reviewsList}>
          {orderedReviews.map((review) => {
            const isOwnReview = review.user_id === user?.id;

            return (
              <View
                key={review.id}
                style={[
                  styles.reviewCard,
                  isOwnReview && styles.ownReviewCard,
                ]}
              >
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
                    <Text style={styles.username}>
                      {review.username}
                      {isOwnReview ? " (You)" : ""}
                    </Text>
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
                  {(isOwnReview && !isModal) && <Pressable onPress={handleEditReviewModal} style={{position:"absolute", right:0}}><EllipsisVertical size={18} color={colours.border_2}/></Pressable>}
                </View>
                <Text style={styles.reviewText}>{review.comment}</Text>

                {(isOwnReview && editReviewModal && !isModal) &&
                  <View style={styles.editReviewModal} ref={editReviewModalRef}>
                      <Pressable style={styles.editReviewModalButtons} onPress={() => {onAddReview && 
                        onAddReview(true, {rating: review.rating, review: review.comment})
                        setEditReviewModal(false)
                      }}>
                      <Pencil size={20} color={colours.text_primary}/>
                      <Text style={styles.editReviewModalButtonsText}>Edit</Text>
                    </Pressable>
                    <Pressable style={styles.editReviewModalButtons} onPress={handleDeleteReview}>
                      <Trash2 size={20} color={colours.text_primary} />
                      <Text style={styles.editReviewModalButtonsText}>Delete</Text>
                    </Pressable>
                  </View>
                }
              </View>
            );
          })}
        </View>
      )}

      {showAddButton && (
        <Pressable
          style={({ pressed }) => [
            styles.addReviewCard,
            pressed && styles.addReviewCardPressed,
          ]}
          onPress={() => onAddReview && onAddReview(false, {rating: 0, review: ""})}
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
  ownReviewCard: {
    borderColor: colours.accent_1,
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
  editReviewModal:{
    position:"absolute",
    top:-84,
    right:20,
    padding:12,
    gap:12,
    backgroundColor: colours.secondary_bg,
    borderWidth: 2,
    borderColor: colours.border_1,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 4,
  },
  editReviewModalButtons:{
    gap: 16,
    paddingVertical: 4,
    paddingLeft: 2,
    paddingRight: 36,
    flexDirection: "row"
  },
  editReviewModalButtonsText:{
    fontSize: 16,
    color: colours.text_primary
  }
});