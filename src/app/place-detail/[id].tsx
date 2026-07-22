import AddReviewModal from "@/components/AddReviewModal";
import BackButton from "@/components/BackButton";
import PhotoCarousel from "@/components/PhotoCarousel";
import ReviewsSection from "@/components/ReviewsSection";
import PlaceDetailSkeleton from "@/components/Skeleton/PlaceDetailSkeleton";
import TagsSection from "@/components/TagsSection";
import TagVotingModal from "@/components/TagVotingModal";
import TopMenusSection from "@/components/TopMenusSection";
import { colours } from "@/constants/style";
import { useAuth } from "@/hooks/auth";
import { getLocationById } from "@/lib/locations";
import type { LocationByID, PlaceData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { MapPin, Star } from "lucide-react-native";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

export default function PlaceDetailPage() {
  const { user } = useAuth()
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [tagModalOpen, setTagModal] = useState<boolean>(false);
  const [reviewModalOpen, setReviewModal] = useState<boolean>(false);

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
      rating: location.location_rating_summary[0].avg_rating ?? -1,
      distance: "0 km",
      tags: location.location_tag_vote_summary.map((item) => {
        return {
          name: item.tags.tag,
          count: item.vote_count,
        };
      }),
      description: location.description,
      address: location.address,
      photos: location.location_images.map((item) => item.storage_path),
      reviews: location.location_ratings.map((item) => {
        return {
          id: item.id,
          user_id: item.user_id,
          comment: item.comment,
          avatar: item.profiles.avatar_url,
          username: item.profiles.username,
          rating: item.rating,
        };
      }),
      menuItems: [],
    };
  }

  function setModalVisible(visible: boolean) {
    if (visible && !user) {
      router.push({
        pathname: '/auth',
        params: { redirectTo: '/place-detail/[id]', id },
      });
      return;
    }

    setTagModal(visible);
  }

  function setReviewModalVisible(visible: boolean) {
    if (visible && !user) {
      router.push({
        pathname: '/auth',
        params: { redirectTo: '/place-detail/[id]', id },
      });
      return;
    }
    
    setReviewModal(visible);
  }

  if (isLoading) return <PlaceDetailSkeleton variant="page" />;

  return (
    <View>
      <Pressable
        style={styles.mainContent}
        onPress={(e) => e.stopPropagation()}
      >
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() => {
              if (router.canGoBack()) {
                router.back();
              } else {
                router.replace("/");
              }
            }}
          />
          {/* Title */}
          <Text style={styles.placeTitle}>{locationData?.title}</Text>
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
            <View style={styles.infoItem}>
              <Star color="#949FF1" fill="#949FF1" size={16} />
              <Text style={styles.infoTextBold}>
                {locationData?.rating.toFixed(1)}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <MapPin color="#fff" fill="#949FF1" size={16} />
              <Text style={styles.infoTextBold}>{locationData?.distance}</Text>
            </View>
          </View>

          {/* Description */}
          <Text style={styles.descriptionText}>
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
            onAddReview={() => setReviewModalVisible(true)}
          />
        </ScrollView>
      </Pressable>
      <TagVotingModal
        modalVisible={tagModalOpen}
        setModalVisible={setModalVisible}
      />  
      <AddReviewModal
        modalVisible={reviewModalOpen}
        setModalVisible={setReviewModalVisible}
      />
    </View>
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
    backgroundColor: colours.primary_bg,
    height: "100%",
    width: "100%",
  },
  scrollableContent: {
    padding: 24,
    width: "100%",
    height: "100%",
  },
  placeTitle: {
    flexShrink: 1,
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