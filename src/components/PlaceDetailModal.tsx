import PhotoCarousel from "@/components/PhotoCarousel";
import TagsSection from "@/components/TagsSection";
import { colours } from "@/constants/style";
import type { PlaceData } from "@/types/types";
import { useRouter } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { useRef } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import ModalComponent, { type ModalHandle } from "./ModalComponent";
import ReviewsSection from "./ReviewsSection";
import TopMenusSection from "./TopMenusSection";

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
  const router = useRouter();
  const modalRef = useRef<ModalHandle>(null);

  if (!place) return null;

  const photos =
    place.photos && place.photos.length > 0 ? place.photos : [place.imageUrl];

  const reviews = place.reviews || [];

  return (
    <ModalComponent
      ref={modalRef}
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
    >
      {/* Main info section (not scrollable) */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.placeTitle}>{place.title}</Text>

        {/* Info Row - Rating and Distance */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Star color="#949FF1" fill="#949FF1" size={16} />
            <Text style={styles.infoTextBold}>{place.rating.toFixed(1)}</Text>
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

      {/* Scrollable section, wrapped in a View rather than being a direct
          child of the modal's content Pressable */}
      <View style={styles.scrollWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* TAGS Section */}
          <TagsSection tags={place.tags} isAdd />

          {/* TOP MENUS Section */}
          <TopMenusSection menuItems={place.menuItems || []} />

          {/* REVIEWS Section */}
          <ReviewsSection reviews={reviews} isModal />

          <Pressable
            style={styles.detailButton}
            onPress={() => {
              // Animate the sheet closed first, then navigate
              modalRef.current?.close();
              router.push({
                pathname: "/place-detail/[id]",
                params: { id: String(place.id) },
              });
            }}
          >
            <Text style={styles.detailButtonText}>View Full Details</Text>
          </Pressable>
        </ScrollView>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginTop: 16,
    paddingTop: 16,
  },
  scrollWrapper: {
    flexShrink: 1,
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
  detailButton: {
    width: "100%",
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    paddingVertical: 12,
  },
  detailButtonText: {
    color: colours.secondary_bg,
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
  },
});