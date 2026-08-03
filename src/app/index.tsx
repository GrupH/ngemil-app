import LocationPill from "@/components/LocationPill";
import MapPreview from "@/components/MapPreview";
import NearbySpotCard from "@/components/NearbySpotCard";
import PlaceDetailModal from "@/components/PlaceDetailModal";
import ProfileButton from "@/components/ProfileButton";
import SearchBar from "@/components/SearchBar";
import HomeSkeleton from "@/components/Skeleton/HomeSkeleton";
import SpotOfTheDayCard from "@/components/SpotOfTheDayCard";
import { colours } from "@/constants/style";
import { useNearbyLocationContext } from "@/context/NearbyLocationContext";
import { useLocation } from "@/hooks/useLocation";
import { getLocationById } from "@/lib/locations";
import { PlaceData } from "@/types/types";
import Mapbox from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

const SAMPLE_SPOT = {
  id: "1",
  imageUrl:
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
  title: "EXAMPLE RESTAURANT",
  rating: 4.5,
  distance: "0.7 km",
  tags: ["Japanese", "Halal", "Cafe"],
  description:
    "Restoran Jepang dengan aneka menu sushi, ramen, dan katsu lezat di suasana cozy.",
  photos: [
    "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
  ],
  reviews: [
    {
      id: "r1",
      username: "user_2197639",
      rating: 1,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=alien",
      comment:
        "Overhyped, not worth the wait, and I wouldn't eat here again. The oat milk soup, ramen, and tuna were not a good combination at all. Each component felt very distinct and disconnected from the others, making the dish feel awkward and unbalanced.",
    },
    {
      id: "r2",
      username: "user_2830974",
      rating: 5,
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=foodie",
      comment:
        "ordered chicken katsu curry, midori salmon roll, matcha ice cream. katsu curry was good. i like how the veggies and onion were still crunchy and not mushy. midori salmon roll, something was off, perhaps too much rice, i couldn't focus on enjoying the taste of salmon and tuna.",
    },
  ],
  menuItems: [
    {
      id: "m1_1",
      name: "Midori Salmon Roll",
      price: "Rp 45.000",
      imageUrl:
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "m1_2",
      name: "Chicken Katsu Curry",
      price: "Rp 55.000",
      imageUrl:
        "https://images.unsplash.com/photo-1626804475315-9644b37a2fe4?auto=format&fit=crop&w=300&q=80",
    },
    {
      id: "m1_3",
      name: "Matcha Ice Cream",
      price: "Rp 20.000",
      imageUrl:
        "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=300&q=80",
    },
  ],
};

const App = () => {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const router = useRouter();
  const { name: locationName, coords } = useLocation();

  const handleOpenPlace = async (place: PlaceData) => {
    setSelectedPlace(place);
    setModalVisible(true);
    const { data, error } = await getLocationById(place.id); // TODO : Make a nerfed version of "getLocationById" to be less detailed with the fetch for modal

    if (!error && data) {
      const images = data.location_images ?? [];
      const photos = images.map((i: any) => i.storage_path);
      const reviews = (data.location_ratings ?? []).map((r: any) => ({
        id: r.id,
        user_id: r.user_id,
        username: r.profiles.username,
        rating: r.rating,
        comment: r.comment,
        avatar: r.profiles.avatar_url,
      }));

      setSelectedPlace({
        ...place,
        photos,
        reviews,
      });
    }
  };

  const {nearbyLocations, isLoading} = useNearbyLocationContext()

  const spotOfTheDay = nearbyLocations[0] ?? SAMPLE_SPOT; // TODO

  if (isLoading) return <HomeSkeleton />;

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerRow}>
          <LocationPill
            title={locationName}
            onPress={() => router.push("/map")}
          />
          <ProfileButton onPress={() => router.push("/profile")} />
        </View>

        {/* Map Card Preview */}
        <MapPreview coords={coords} />

        {/* Search Bar Section */}
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Search for snacks or hangout spots..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Spot of the Day Section */}
        <View style={styles.spotSection}>
          <Text style={styles.sectionTitle}>SPOT OF THE DAY</Text>
          {spotOfTheDay && (
            <SpotOfTheDayCard
              imageUrl={spotOfTheDay.imageUrl}
              title={spotOfTheDay.title}
              rating={spotOfTheDay.rating}
              distance={spotOfTheDay.distance}
              tags={spotOfTheDay.tags}
              description={spotOfTheDay.description}
              onPress={() => handleOpenPlace(spotOfTheDay)}
            />
          )}
        </View>

        {/* Nearby Spots Section */}
        <View style={styles.nearbySection}>
          <Text style={styles.sectionTitle}>NEARBY</Text>
          <View style={styles.gridContainer}>
            {nearbyLocations.map((spot: PlaceData) => (
              <View key={spot.id} style={styles.gridColumn}>
                <NearbySpotCard
                  imageUrl={spot.imageUrl}
                  title={spot.title}
                  rating={spot.rating}
                  distance={spot.distance}
                  tags={spot.tags}
                  description={spot.description}
                  onPress={() => handleOpenPlace(spot)}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Place Detail Modal Popup */}
      <PlaceDetailModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        place={selectedPlace}
      />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colours.primary_bg,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  mapCard: {
    height: 240,
    backgroundColor: colours.border_1,
    borderRadius: 12,
    borderColor: "#EDF0FE",
    borderWidth: 2,
    marginTop: 24,
    padding: 16,
    overflow: "hidden",
    position: "relative",
  },
  searchBarContainer: {
    marginTop: 24,
    width: "100%",
  },
  spotSection: {
    marginTop: 32,
    gap: 12,
  },
  nearbySection: {
    marginTop: 32,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colours.heading,
    letterSpacing: 0.5,
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  gridColumn: {
    width: "47.5%",
  },
  openMapButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 100,
    backgroundColor: colours.accent_1,
    borderWidth: 2,
    borderColor: colours.border_1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 6,
  },
  openMapButtonText: {
    color: colours.secondary_bg,
    fontWeight: "800",
  },
});
