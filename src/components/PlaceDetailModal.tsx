import PhotoCarousel from "@/components/PhotoCarousel";
import ReviewsSection, { Review } from "@/components/ReviewsSection";
import TagsSection from "@/components/TagsSection";
import TopMenusSection, { MenuItem } from "@/components/TopMenusSection";
import { colours } from "@/constants/style";
import { MapPin, Star } from "lucide-react-native";
import {
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
  address: string;
  tags: {name: string, count: number}[];
  description: string;
  photos?: string[];
  reviews?: Review[];
  menuItems?: MenuItem[];
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
          {/* Main info section (not scrollable) */}
          <View style={styles.infoContainer}>
            {/* Drag handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

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

            {/* Photos Carousel */}
            <PhotoCarousel photos={photos} />

            {/* Description */}
            <Text style={styles.descriptionText}>{place.description}</Text>
          </View>

          {/* Scrollable section */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* TAGS Section */}
            <TagsSection tags={place.tags} />

            {/* TOP MENUS Section */}
            <TopMenusSection menuItems={place.menuItems || []} />

            {/* REVIEWS Section */}
            <ReviewsSection reviews={reviews} />
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
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginTop: 16,
    paddingTop: 16,
  },
  scrollContent: {
    paddingVertical: 24,
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
  descriptionText: {
    fontSize: 14,
    color: "#605E70",
    lineHeight: 22,
    marginBottom: 24,
  },
});
