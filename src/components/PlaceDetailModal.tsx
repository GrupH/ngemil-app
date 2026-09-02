import PhotoCarousel from "@/components/PhotoCarousel";
import TagsSection from "@/components/TagsSection";
import { useTheme } from "@/context/ThemeContext";
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
  const { colours } = useTheme();

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
      {/* Main info section */}
      <View style={[styles.infoContainer, { borderBottomColor: colours.border_1 }]}>
        {/* Title */}
        <Text style={[styles.placeTitle, { color: colours.text_primary }]}>
          {place.title}
        </Text>

        {/* Info Row - Rating and Distance */}
        <View style={styles.infoRow}>
          {place.rating > -1 && (
            <View style={styles.infoItem}>
              <Star color={colours.accent_1} fill={colours.accent_1} size={16} />
              <Text style={[styles.infoTextBold, { color: colours.text_primary }]}>
                {place.rating.toFixed(1)}
              </Text>
              <Text style={[styles.infoTextMuted, { color: colours.text_secondary }]}>
                ({reviews.length} Review{reviews.length > 1 && "s"})
              </Text>
            </View>
          )}
          <View style={styles.infoItem}>
            <MapPin color="#fff" fill={colours.accent_1} size={16} />
            <Text style={[styles.infoTextBold, { color: colours.text_primary }]}>
              {place.distance}
            </Text>
          </View>
        </View>

        {/* Photos Carousel */}
        <PhotoCarousel photos={photos} />

        {/* Description */}
        <Text style={[styles.descriptionText, { color: colours.text_secondary }]}>
          {place.description}
        </Text>
      </View>

      {/* Scrollable section */}
      <View style={styles.scrollWrapper}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* TAGS Section */}
          {place.tags.length > 0 && <TagsSection tags={place.tags} isAdd />}

          {/* TOP MENUS Section */}
          <TopMenusSection menuItems={place.menuItems || []} />

          {/* REVIEWS Section */}
          <ReviewsSection reviews={reviews} isModal />

          <Pressable
            style={[styles.detailButton, { backgroundColor: colours.accent_1 }]}
            onPress={() => {
              modalRef.current?.close();
              router.push({
                pathname: "/place-detail/[id]",
                params: { id: String(place.id) },
              });
            }}
          >
            <Text style={[styles.detailButtonText, { color: colours.secondary_bg }]}>
              View Full Details
            </Text>
          </Pressable>
        </ScrollView>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  infoContainer: {
    borderBottomWidth: 1,
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
  },
  infoTextMuted: {
    fontSize: 14,
    fontWeight: "500",
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  detailButton: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 12,
  },
  detailButtonText: {
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
  },
});