import Tag from "@/components/Tag";
import { colours } from "@/constants/style";
import { MapPin, Plus, Star } from "lucide-react-native";
import {
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export type PlaceData = {
  id: string;
  imageUrl: string;
  title: string;
  rating: number;
  distance: string;
  tags: string[];
  description: string;
  photos?: string[];
  reviews?: {
    id: string;
    username: string;
    rating: number;
    avatar: string;
    comment: string;
  }[];
};

type PlaceDetailModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  place: PlaceData | null;
};

export default function PlaceDetailModal({
  modalVisible,
  setModalVisible,
  place,
}: PlaceDetailModalProps) {
  if (!place) return null;

  const photos =
    place.photos && place.photos.length > 0 ? place.photos : [place.imageUrl];

  const reviews = place.reviews || [];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      {/* The invisible backdrop to close the modal on tap */}
      <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
        {/* The modal content container */}
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Drag handle */}
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Title */}
            <Text style={styles.placeTitle}>{place.title}</Text>

            {/* Info Row - Rating and Distance */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <Star color="#949FF1" fill="#949FF1" size={16} />
                <Text style={styles.infoTextBold}>
                  {place.rating.toFixed(1)}
                </Text>
                <Text style={styles.infoTextMuted}>
                  ({reviews.length} reviews)
                </Text>
              </View>
              <View style={styles.infoItem}>
                <MapPin color="#fff" fill="#949FF1" size={16} />
                <Text style={styles.infoTextBold}>{place.distance}</Text>
              </View>
            </View>

            {/* Photos Grid */}
            <View style={styles.photosGrid}>
              {/* Left/Main Photo */}
              <View
                style={[
                  styles.leftPhotoContainer,
                  photos.length < 3 && { flex: 1 },
                ]}
              >
                <Image source={{ uri: photos[0] }} style={styles.photo} />
              </View>

              {/* If exactly 2 photos, render second photo as a full-height side-by-side panel */}
              {photos.length === 2 && (
                <View style={{ flex: 1, borderRadius: 20, overflow: "hidden" }}>
                  <Image source={{ uri: photos[1] }} style={styles.photo} />
                </View>
              )}

              {/* If 3 or more photos, render standard right-side panel */}
              {photos.length >= 3 && (
                <View style={styles.rightPhotosContainer}>
                  <View style={styles.rightPhotoTop}>
                    <Image source={{ uri: photos[1] }} style={styles.photo} />
                  </View>
                  <View style={styles.rightPhotoBottom}>
                    <Image source={{ uri: photos[2] }} style={styles.photo} />
                    {photos.length > 3 && (
                      <View style={styles.photoOverlay}>
                        <Text style={styles.overlayText}>
                          +{photos.length - 3} Photos
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              )}
            </View>

            {/* TAGS Section */}
            <View style={styles.sectionContainer}>
              <Text style={styles.sectionHeading}>TAGS</Text>
              <View style={styles.tagRow}>
                {place.tags.map((tag, index) => {
                  const count = 10 + index * 5 + (tag.length % 7);
                  return <Tag key={tag} text={tag} count={count} />;
                })}
                <View style={styles.addTagButton}>
                  <Plus color="#8B889E" size={14} />
                  <Text style={styles.addTagText}>Add</Text>
                </View>
              </View>
            </View>

            {/* REVIEWS Section */}
            {reviews.length > 0 && (
              <View style={styles.sectionContainer}>
                <Text style={styles.sectionHeading}>REVIEWS</Text>
                <View style={styles.reviewsList}>
                  {reviews.map((review) => (
                    <View key={review.id} style={styles.reviewCard}>
                      <View style={styles.reviewHeader}>
                        <View style={styles.avatarContainer}>
                          <Image
                            source={{ uri: review.avatar }}
                            style={styles.avatar}
                          />
                        </View>
                        <View style={styles.reviewUserMeta}>
                          <Text style={styles.username}>{review.username}</Text>
                          <View style={styles.starsRow}>
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                color={
                                  i < review.rating ? "#949FF1" : "#E5E5E5"
                                }
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
            )}
          </ScrollView>
        </Pressable>
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
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxHeight: "85%",
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
  scrollContent: {
    paddingBottom: 24,
  },
  placeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colours.text_primary,
    fontFamily: "System",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 8,
    marginBottom: 20,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  infoTextBold: {
    fontSize: 14,
    fontWeight: "700",
    color: colours.text_primary,
  },
  infoTextMuted: {
    fontSize: 14,
    fontWeight: "500",
    color: colours.text_secondary,
  },
  photosGrid: {
    flexDirection: "row",
    height: 180,
    gap: 12,
    marginBottom: 24,
  },
  leftPhotoContainer: {
    flex: 1.1,
    borderRadius: 20,
    overflow: "hidden",
  },
  rightPhotosContainer: {
    flex: 0.9,
    flexDirection: "column",
    gap: 12,
  },
  rightPhotoTop: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
  },
  rightPhotoBottom: {
    flex: 1,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  photoOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlayText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
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
  tagRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  addTagButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#EDF0FE",
    borderStyle: "dashed",
    backgroundColor: "transparent",
  },
  addTagText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#8B889E",
  },
  reviewsList: {
    gap: 12,
  },
  reviewCard: {
    backgroundColor: "#F9F9F6",
    borderRadius: 20,
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
