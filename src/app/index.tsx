import LocationPill from "@/components/LocationPill";
import NearbySpotCard from "@/components/NearbySpotCard";
import ProfileButton from "@/components/ProfileButton";
import SearchBar from "@/components/SearchBar";
import SpotOfTheDayCard from "@/components/SpotOfTheDayCard";
import { colours } from "@/constants/style";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const NEARBY_SPOTS = [
  {
    id: "1",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description: "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
  },
  {
    id: "2",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description: "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
  },
  {
    id: "3",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description: "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
  },
  {
    id: "4",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description: "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
  },
  {
    id: "5",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description: "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
  },
  {
    id: "6",
    imageUrl: "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description: "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
  },
];

const App = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <SafeAreaView style={styles.page}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerRow}>
          <LocationPill title="Plaza Indonesia" onPress={() => {}} />
          <ProfileButton onPress={() => router.push("/profile")} />
        </View>

        {/* Map Card Placeholder */}
        <View style={styles.mapCard} />

        {/* Search Bar Section */}
        <View style={styles.searchBarContainer}>
          <SearchBar
            placeholder="Cari cemilan atau tempat makan..."
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Spot of the Day Section */}
        <View style={styles.spotSection}>
          <Text style={styles.sectionTitle}>SPOT OF THE DAY</Text>
          <SpotOfTheDayCard
            imageUrl="https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80"
            title="The Good Bagel - Gading Serpong"
            rating={4.5}
            distance="0.7 km"
            tags={["Bakery", "Halal", "Cafe"]}
            description="Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages."
            onPress={() => {}}
          />
        </View>

        {/* Nearby Spots Section */}
        <View style={styles.nearbySection}>
          <Text style={styles.sectionTitle}>NEARBY</Text>
          <View style={styles.gridContainer}>
            {NEARBY_SPOTS.map((spot) => (
              <View key={spot.id} style={styles.gridColumn}>
                <NearbySpotCard
                  imageUrl={spot.imageUrl}
                  title={spot.title}
                  rating={spot.rating}
                  distance={spot.distance}
                  tags={spot.tags}
                  description={spot.description}
                  onPress={() => {}}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
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
    borderRadius: 20,
    marginTop: 24,
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
});


