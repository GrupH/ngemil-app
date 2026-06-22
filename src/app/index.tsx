import LocationPill from "@/components/LocationPill";
import NearbySpotCard from "@/components/NearbySpotCard";
import PlaceDetailModal, { PlaceData } from "@/components/PlaceDetailModal";
import ProfileButton from "@/components/ProfileButton";
import SearchBar from "@/components/SearchBar";
import SpotOfTheDayCard from "@/components/SpotOfTheDayCard";
import { colours } from "@/constants/style";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
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
  },
  {
    id: "2",
    imageUrl:
      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=600&q=80",
    title: "The Good Bagel - Gading Serpong",
    rating: 4.6,
    distance: "1.2 km",
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
    menuItems: [
      {
        id: "m2_1",
        name: "Artisan Bagel Sandwich",
        price: "Rp 38.000",
        imageUrl:
          "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m2_2",
        name: "Soft Cream Cheese Bagel",
        price: "Rp 28.000",
        imageUrl:
          "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m2_3",
        name: "Oat Milk Iced Latte",
        price: "Rp 32.000",
        imageUrl:
          "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    id: "3",
    imageUrl:
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
    title: "Kopi Nako - Serpong",
    rating: 4.4,
    distance: "1.8 km",
    tags: ["Coffee", "Cafe", "Cozy"],
    description:
      "Coffee shop dengan desain industrial estetik, menyajikan es kopi nusantara dan snacks.",
    photos: [
      "https://images.unsplash.com/photo-1509042239860-f550ce710b93?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb3_1",
        username: "coffee_guru",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=coffee",
        comment:
          "Suasana sore hari di sini sangat nyaman untuk WFH. Es Kopi Nako manisnya pas!",
      },
    ],
    menuItems: [
      {
        id: "m3_1",
        name: "Es Kopi Nako",
        price: "Rp 23.000",
        imageUrl:
          "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m3_2",
        name: "Croissant Butter",
        price: "Rp 25.000",
        imageUrl:
          "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m3_3",
        name: "French Fries",
        price: "Rp 20.000",
        imageUrl:
          "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    id: "4",
    imageUrl:
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80",
    title: "Sushi Hiro - Gading Serpong",
    rating: 4.8,
    distance: "2.1 km",
    tags: ["Japanese", "Sushi", "Premium"],
    description:
      "Restoran sushi autentik terkenal dengan sushi anak tangga yang artistik dan bahan segar.",
    photos: [
      "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb4_1",
        username: "sushi_lover_99",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=sushi",
        comment:
          "Bahan-bahannya sangat segar dan penyajian sushinya estetik sekali. Pelayanannya top!",
      },
    ],
    menuItems: [
      {
        id: "m4_1",
        name: "Salmon Aburi Sushi",
        price: "Rp 40.000",
        imageUrl:
          "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m4_2",
        name: "Hiro Aburi Sushi Set",
        price: "Rp 120.000",
        imageUrl:
          "https://images.unsplash.com/photo-1611143669185-af224c5e3252?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m4_3",
        name: "Chicken Teriyaki",
        price: "Rp 65.000",
        imageUrl:
          "https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    id: "5",
    imageUrl:
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
    title: "Martabak Pecenongan 78",
    rating: 4.7,
    distance: "0.5 km",
    tags: ["Indonesian", "Sweet", "StreetFood"],
    description:
      "Legenda martabak manis dan telur premium dengan aneka topping melimpah dan adonan lembut.",
    photos: [
      "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb5_1",
        username: "martabak_hunter",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=martabak",
        comment:
          "Topping kejunya melimpah banget, wisman berasa harum harum mentega. Martabak terbaik!",
      },
    ],
    menuItems: [
      {
        id: "m5_1",
        name: "Martabak Manis Nutella Keju",
        price: "Rp 85.000",
        imageUrl:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m5_2",
        name: "Martabak Telur Daging Sapi",
        price: "Rp 75.000",
        imageUrl:
          "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=300&q=80",
      },
    ],
  },
  {
    id: "6",
    imageUrl:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
    title: "Gelato Divino - Mall Serpong",
    rating: 4.6,
    distance: "0.9 km",
    tags: ["Gelato", "Dessert", "Sweet"],
    description:
      "Gelato Italia artisan autentik dengan bahan buah-buahan segar alami dan rasa super creamy.",
    photos: [
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=600&q=80",
    ],
    reviews: [
      {
        id: "rb6_1",
        username: "dessert_queen",
        rating: 5,
        avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=gelato",
        comment:
          "Pistachio dan Dark Chocolatenya mantap! Gelatonya padat tapi super lembut di mulut.",
      },
    ],
    menuItems: [
      {
        id: "m6_1",
        name: "Double Scoop Gelato Cup",
        price: "Rp 45.000",
        imageUrl:
          "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=300&q=80",
      },
      {
        id: "m6_2",
        name: "Waffle Cone Gelato",
        price: "Rp 50.000",
        imageUrl:
          "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?auto=format&fit=crop&w=300&q=80",
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
        <View style={styles.mapCard}>
          <Pressable onPress={() => router.push('/map')} style={styles.openMapButton}>
            <Text>Expand</Text>
          </Pressable>
        </View>

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
                menuItems: [
                  {
                    id: "m_spot_1",
                    name: "Artisan Bagel Sandwich",
                    price: "Rp 38.000",
                    imageUrl:
                      "https://images.unsplash.com/photo-1541532713592-79a0317b6b77?auto=format&fit=crop&w=300&q=80",
                  },
                  {
                    id: "m_spot_2",
                    name: "Soft Cream Cheese Bagel",
                    price: "Rp 28.000",
                    imageUrl:
                      "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=300&q=80",
                  },
                  {
                    id: "m_spot_3",
                    name: "Oat Milk Iced Latte",
                    price: "Rp 32.000",
                    imageUrl:
                      "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=300&q=80",
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
    borderRadius: 12,
    borderColor: "#EDF0FE",
    borderWidth: 2,
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
  openMapButton: {
    width: 44,
    height: 22,
    borderRadius: 12,
    backgroundColor: colours.accent_1,
    borderWidth: 2,
    borderColor: colours.border_1,
    justifyContent: "center",
    alignItems: "center",
  }
});
