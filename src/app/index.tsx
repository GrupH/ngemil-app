import LocationPill from "@/components/LocationPill";
import MapPreview from "@/components/MapPreview";
import NearbySpotCard from "@/components/NearbySpotCard";
import NoResults from "@/components/NoResults";
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

  const spotOfTheDay = nearbyLocations[0]; // TODO

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
        {spotOfTheDay && (
          <View style={styles.spotSection}>
            <Text style={styles.sectionTitle}>SPOT OF THE DAY</Text>
            <SpotOfTheDayCard
              imageUrl={spotOfTheDay.imageUrl}
              title={spotOfTheDay.title}
              rating={spotOfTheDay.rating}
              distance={spotOfTheDay.distance}
              tags={spotOfTheDay.tags}
              description={spotOfTheDay.description}
              onPress={() => handleOpenPlace(spotOfTheDay)}
            />
          </View>
        )}

        {/* Nearby Spots Section */}
        <View style={styles.nearbySection}>
          <Text style={styles.sectionTitle}>NEARBY</Text>
          {nearbyLocations && nearbyLocations.length > 0 ? (
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
          ) : (
            <NoResults
              title="Nothing nearby the selected area"
              subtitle="Try widening your search radius or check back later."
            />
          )}
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
