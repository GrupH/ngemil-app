import { colours } from "@/constants/style";
import { submitRating } from "@/lib/ratings";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Star } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const MAX_REVIEW_LENGTH = 500;

const RATING_LABELS: Record<number, string> = {
  1: "Not great",
  2: "Could be better",
  3: "Pretty good",
  4: "Really good",
  5: "Amazing!",
};

type RatingReviewModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  placeName?: string;
  onSubmit?: (rating: number, review: string) => void;
};

export default function RatingReviewModal({
  modalVisible,
  setModalVisible,
  placeName,
  onSubmit,
}: RatingReviewModalProps) {
  const { id } = useLocalSearchParams<{ id: string }>();
  const queryClient = useQueryClient();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const canSubmit = rating > 0 && !isSubmitting;

  const ratingLabel = useMemo(
    () => (rating > 0 ? RATING_LABELS[rating] : "Tap a star to rate"),
    [rating]
  );

  const handleRate = (value: number) => {
    if (rating === value) {
      setRating(0);
      return;
    }
    setRating(value);
    if (submitError) setSubmitError(null);
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !id) return;

    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const trimmedReview = review.trim();
      const { error } = await submitRating(
        id,
        rating,
        trimmedReview.length > 0 ? trimmedReview : undefined
      );

      if (error) throw error;

      onSubmit?.(rating, trimmedReview);
      queryClient.invalidateQueries({ queryKey: ["locationById", id] });
      queryClient.invalidateQueries({ queryKey: ["locationRatings", id] });

      setRating(0);
      setReview("");
      setModalVisible(false);
    } catch (err) {
      console.error("Failed to submit rating:", err);
      setSubmitError("Couldn't submit your review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={handleClose}
    >
      <Pressable style={styles.backdrop} onPress={handleClose}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.keyboardWrap}
        >
          <Pressable
            style={styles.modalContent}
            onPress={(e) => e.stopPropagation()}
          >
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            <Text style={styles.placeTitle}>Add Your Review</Text>
            <Text style={styles.infoTextMuted}>
              {placeName
                ? `Share your experience at ${placeName}`
                : "Share your experience with this spot"}
            </Text>

            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((value) => {
                const filled = value <= rating;
                return (
                  <Pressable
                    key={value}
                    style={({ pressed }) => [
                      styles.starButton,
                      pressed && styles.starButtonPressed,
                    ]}
                    onPress={() => handleRate(value)}
                    hitSlop={6}
                  >
                    <Star
                      size={36}
                      color={filled ? colours.accent_1 : colours.border_1}
                      fill={filled ? colours.accent_1 : "transparent"}
                      strokeWidth={filled ? 0 : 1.5}
                    />
                  </Pressable>
                );
              })}
            </View>

            <Text
              style={[
                styles.ratingLabel,
                rating > 0 && styles.ratingLabelActive,
              ]}
            >
              {ratingLabel}
            </Text>

            <View style={styles.reviewInputContainer}>
              <TextInput
                style={styles.reviewInput}
                placeholder="What stood out? What could be better? (optional)"
                placeholderTextColor={colours.text_placeholder}
                multiline
                maxLength={MAX_REVIEW_LENGTH}
                value={review}
                onChangeText={setReview}
                textAlignVertical="top"
              />
              <Text style={styles.charCount}>
                {review.length}/{MAX_REVIEW_LENGTH}
              </Text>
            </View>

            <View style={styles.footer}>
              <Pressable
                style={[
                  styles.detailButton,
                  !canSubmit && styles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={!canSubmit}
              >
                <Text
                  style={[
                    styles.detailButtonText,
                    !canSubmit && styles.buttonDisabledText,
                  ]}
                >
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Text>
              </Pressable>
            </View>
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  keyboardWrap: {
    width: "100%",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 34,
  },
  dragHandleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#E5E5E5",
  },
  placeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colours.text_primary,
    fontFamily: "System",
    marginTop: 4,
  },
  infoTextMuted: {
    fontSize: 13,
    fontWeight: "500",
    color: colours.text_secondary,
    lineHeight: 18,
    marginTop: 6,
  },
  starRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 28,
  },
  starButton: {
    padding: 4,
  },
  starButtonPressed: {
    opacity: 0.6,
  },
  ratingLabel: {
    marginTop: 12,
    textAlign: "center",
    fontSize: 14,
    fontWeight: "600",
    color: colours.text_secondary,
  },
  ratingLabelActive: {
    color: colours.accent_1,
  },
  reviewInputContainer: {
    marginTop: 24,
    borderWidth: 1.5,
    borderColor: colours.border_1,
    borderRadius: 16,
    padding: 14,
  },
  reviewInput: {
    minHeight: 120,
    fontSize: 14,
    fontWeight: "500",
    color: colours.text_primary,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 11,
    fontWeight: "500",
    color: colours.text_secondary,
    marginTop: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 16,
    marginTop: 24,
  },
  detailButton: {
    width: "100%",
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  detailButtonText: {
    color: colours.secondary_bg,
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 15,
  },
  buttonDisabled: {
    backgroundColor: colours.border_1,
  },
  buttonDisabledText: {
    color: colours.border_2,
    opacity: 0.5,
  },
});