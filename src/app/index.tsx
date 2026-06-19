import LocationPill from "@/components/LocationPill";
import NearbySpotCard from "@/components/NearbySpotCard";
import PlaceDetailModal, { PlaceData } from "@/components/PlaceDetailModal";
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
    imageUrl:
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=600&q=80",
    title: "Midori Japanese Restaurant",
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
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description:
      "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
    photos: [
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb2_1",
        username: "user_bagel_lover",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bagel",
        comment:
          "Best bagels in town! Extremely soft and fresh. The cream cheese filling is perfect.",
      },
      {
        id: "rb2_2",
        username: "user_joe",
        rating: 4,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=joe",
        comment:
          "Great texture on the artisan bagels. I highly recommend the breakfast sandwich bagel.",
      },
    ],
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description:
      "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
    photos: [
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb3_1",
        username: "user_bagel_lover",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bagel",
        comment:
          "Best bagels in town! Extremely soft and fresh. The cream cheese filling is perfect.",
      },
    ],
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description:
      "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
    photos: [
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb4_1",
        username: "user_bagel_lover",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bagel",
        comment:
          "Best bagels in town! Extremely soft and fresh. The cream cheese filling is perfect.",
      },
    ],
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description:
      "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
    photos: [
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb5_1",
        username: "user_bagel_lover",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bagel",
        comment:
          "Best bagels in town! Extremely soft and fresh. The cream cheese filling is perfect.",
      },
    ],
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.5,
    distance: "0.7 km",
    tags: ["Bakery", "Halal", "Cafe"],
    description:
      "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
    photos: [
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb6_1",
        username: "user_bagel_lover",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=bagel",
        comment:
          "Best bagels in town! Extremely soft and fresh. The cream cheese filling is perfect.",
      },
    ],
  },
];

const App = () => {
  const [search, setSearch] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);
  const router = useRouter();

  const handleOpenPlace = (place: PlaceData) => {
    setSelectedPlace(place);
    setModalVisible(true);
  };

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
            onPress={() =>
              handleOpenPlace({
                id: "spot-of-the-day",
                imageUrl:
                  "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
                title: "The Good Bagel - Gading Serpong",
                rating: 4.5,
                distance: "0.7 km",
                tags: ["Bakery", "Halal", "Cafe"],
                description:
                  "Bagel-shop yang menghadirkan artisan bagel, sandwich bagel, dan beverages.",
                photos: [
                  "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
                  "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
                ],
                reviews: [
                  {
                    id: "rb_spot_1",
                    username: "user_bagel_lover",
                    rating: 5,
                    avatar:
                      "https://api.dicebear.com/7.x/bottts/svg?seed=bagel",
                    comment:
                      "Best bagels in town! Extremely soft and fresh. The cream cheese filling is perfect.",
                  },
                  {
                    id: "rb_spot_2",
                    username: "user_joe",
                    rating: 4,
                    avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=joe",
                    comment:
                      "Great texture on the artisan bagels. I highly recommend the breakfast sandwich bagel.",
                  },
                ],
              })
            }
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
