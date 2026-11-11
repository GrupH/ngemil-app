import AddReviewModal from "@/components/AddReviewModal";
import BackButton from "@/components/BackButton";
import PhotoCarousel from "@/components/PhotoCarousel";
import ReviewsSection from "@/components/ReviewsSection";
import PlaceDetailSkeleton from "@/components/Skeleton/PlaceDetailSkeleton";
import TagsSection from "@/components/TagsSection";
import TagVotingModal from "@/components/TagVotingModal";
import TopMenusSection from "@/components/TopMenusSection";
import { useNearbyLocationContext } from "@/context/NearbyLocationContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/auth";
import { getLocationById } from "@/lib/locations";
import type { LocationByID, PlaceData } from "@/types/types";
import { ExistingReviewType } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PlaceDetailPage() {
  const { user } = useAuth();
  const { colours } = useTheme();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { nearbyLocations } = useNearbyLocationContext();
  const distanceToLoc = nearbyLocations.find((location) => location.id === id)?.distance;

  const [tagModalOpen, setTagModal] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModal] = useState<boolean>(false);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [existingReviewData, setExistingReviewData] = useState<ExistingReviewType>({
    rating: 0,
    review: "",
  });

  const { data: locationData, isLoading } = useQuery({
    queryKey: ["locationById", id],
    queryFn: async () => {
      const { data, error } = await getLocationById(id);

      if (error) throw error;

      return parseLocationData(data);
    },
  });

  const photos =
    locationData?.photos && locationData?.photos.length > 0
      ? locationData?.photos
      : [locationData?.imageUrl];

  const reviews = locationData?.reviews || [];

  function parseLocationData(location: LocationByID): PlaceData {
    return {
      id: location.id,
      imageUrl: "",
      title: location.name,
      rating: location.location_rating_summary[0]?.avg_rating ?? -1,
      distance: distanceToLoc ?? "unknown",
      latitude: 0,
      longitude: 0,
      tags: location.location_tag_vote_summary.map((item) => {
        const tagObj = Array.isArray(item.tags) ? item.tags[0] : item.tags;
        return {
          name: tagObj?.tag || "",
          count: item.vote_count,
        };
      }),
      description: location.description,
      address: location.address,
      photos: location.location_images.map((item) => item.storage_path),
      reviews: location.location_ratings.map((item) => {
        const profile = Array.isArray(item.profiles) ? item.profiles[0] : item.profiles;
        return {
          id: item.id,
          user_id: item.user_id,
          comment: item.comment,
          avatar: profile?.avatar_url || "",
          username: profile?.username || "Anonymous",
          rating: item.rating,
        };
      }),
      menuItems: [],
    };
  }

  function setModalVisible(visible: boolean) {
    if (visible && !user) {
      router.push({
        pathname: "/auth",
        params: { redirectTo: "/place-detail/[id]", id },
      });
      return;
    }

    setTagModal(visible);
  }

  function setReviewModalVisible(visible: boolean) {
    if (visible && !user) {
      router.push({
        pathname: "/auth",
        params: { redirectTo: "/place-detail/[id]", id },
      });
      return;
    }

    setReviewModal(visible);
  }

  function handleAddEditReview(
    isEdit: boolean = false,
    existingData: ExistingReviewType = {
      rating: 0,
      review: "",
    }
  ) {
    setReviewModalVisible(true);
    setEdit(isEdit);
    setExistingReviewData(existingData);
  }

  if (isLoading) return <PlaceDetailSkeleton variant="page" />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colours.primary_bg }}>
      <View style={[styles.mainContent, { backgroundColor: colours.primary_bg }]}>
        <View style={styles.headerContainer}>
          <BackButton
            type="Back"
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
          />
          {/* Title */}
          <Text style={[styles.placeTitle, { color: colours.text_primary }]}>
            {locationData?.title}
          </Text>
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollableContent}
        >
          {/* Photos Carousel */}
          <View>
            <PhotoCarousel photos={photos} />
          </View>

          {/* Info Row - Rating and Distance */}
          <View style={styles.infoRow}>
            {locationData?.rating && locationData?.rating > -1 && (
              <View style={styles.infoItem}>
                <Star color={colours.accent_1} fill={colours.accent_1} size={16} />
                <Text style={[styles.infoTextBold, { color: colours.text_primary }]}>
                  {locationData?.rating.toFixed(1)}
                </Text>
              </View>
            )}

            <View style={styles.infoItem}>
              <MapPin color="#fff" fill={colours.accent_1} size={16} />
              <Text style={[styles.infoTextBold, { color: colours.text_primary }]}>
                {locationData?.distance}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text style={[styles.descriptionText, { color: colours.text_secondary }]}>
            {locationData?.description}
          </Text>

          {/* TAGS Section */}
          <TagsSection
            tags={locationData?.tags || []}
            openModal={() => setModalVisible(true)}
          />

          {/* TOP MENUS Section */}
          <TopMenusSection menuItems={locationData?.menuItems || []} />

          {/* REVIEWS Section */}
          <ReviewsSection
            reviews={reviews}
            onAddReview={handleAddEditReview}
          />
        </ScrollView>
      </View>
      <TagVotingModal
        modalVisible={tagModalOpen}
        setModalVisible={setModalVisible}
      />
      <AddReviewModal
        modalVisible={reviewModalOpen}
        setModalVisible={setReviewModalVisible}
        isEdit={isEdit}
        existingData={existingReviewData}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    width: "100%",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
  },
  mainContent: {
    height: "100%",
    width: "100%",
  },
  scrollableContent: {
    padding: 24,
    width: "100%",
    flexGrow: 1,
  },
  placeTitle: {
    flexShrink: 1,
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
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
});