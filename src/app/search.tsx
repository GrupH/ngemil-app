import BackButton from "@/components/BackButton";
import NoResults from "@/components/NoResults";
import PlaceDetailModal from "@/components/PlaceDetailModal";
import SearchBar from "@/components/SearchBar";
import SearchResultCard from "@/components/SearchResultCard";
import { colours } from "@/constants/style";
import { useNearbyLocationContext } from "@/context/NearbyLocationContext";
import { useLocation } from "@/hooks/useLocation";
import {
  getLocationById,
  parseLocationSearchResult,
  searchLocations,
} from "@/lib/locations";
import { getAllTags } from "@/lib/tags";
import { PlaceData } from "@/types/types";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { History, Sparkles, X } from "lucide-react-native";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RECENT_SEARCHES_KEY = "@ngemil_recent_searches";
const DEFAULT_TAGS = [
  "Street Food",
  "Halal",
  "Coffee",
  "Dessert",
  "Late Night",
  "Cheap",
  "Wifi",
  "Outdoor",
];

export default function SearchPage() {
  const router = useRouter();
  const { coords } = useLocation();
  const { nearbyLocations } = useNearbyLocationContext();

  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [searchResults, setSearchResults] = useState<PlaceData[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Modal details state
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceData | null>(null);

  // Load recent searches on mount
  useEffect(() => {
    (async () => {
      try {
        // check local storage
        const stored = await AsyncStorage.getItem(RECENT_SEARCHES_KEY);
        if (stored) {
          setRecentSearches(JSON.parse(stored));
        }
      } catch (e) {
        console.error("Failed to load recent searches:", e);
      }
    })();
  }, []);

  // Fetch popular tags for category exploration
  const { data: popularTags = DEFAULT_TAGS } = useQuery({
    queryKey: ["popularTagsForSearch"],
    queryFn: async () => {
      const { data, error } = await getAllTags();
      if (error || !data || data.length === 0) return DEFAULT_TAGS;
      return data.map((t: any) => t.tag);
    },
  });

  // Save a recent search term
  const saveRecentSearch = useCallback(
    async (term: string) => {
      const trimmed = term.trim();
      if (!trimmed) return;
      try {
        const filtered = recentSearches.filter(
          (item) => item.toLowerCase() !== trimmed.toLowerCase(),
        );
        const updated = [trimmed, ...filtered].slice(0, 8);
        setRecentSearches(updated);
        await AsyncStorage.setItem(
          RECENT_SEARCHES_KEY,
          JSON.stringify(updated),
        );
      } catch (e) {
        console.error("Failed to save recent search:", e);
      }
    },
    [recentSearches],
  );

  // Remove a single recent search term
  const removeRecentSearch = async (term: string) => {
    try {
      const updated = recentSearches.filter((item) => item !== term);
      setRecentSearches(updated);
      await AsyncStorage.setItem(
        RECENT_SEARCHES_KEY,
        JSON.stringify(updated),
      );
    } catch (e) {
      console.error("Failed to remove recent search:", e);
    }
  };

  // Clear all recent searches
  const clearRecentSearches = async () => {
    try {
      setRecentSearches([]);
      await AsyncStorage.removeItem(RECENT_SEARCHES_KEY);
    } catch (e) {
      console.error("Failed to clear recent searches:", e);
    }
  };

  // Debounce input changes
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  // Execute global search
  useEffect(() => {
    let active = true;

    if (!debouncedQuery) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    searchLocations(debouncedQuery)
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error("Global search error:", error);
          setSearchResults([]);
        } else {
          const parsed = (data ?? []).map((loc) =>
            parseLocationSearchResult(loc, coords, nearbyLocations),
          );
          setSearchResults(parsed);
        }
      })
      .catch((err) => {
        if (!active) return;
        console.error("Search failed:", err);
        setSearchResults([]);
      })
      .finally(() => {
        if (active) setIsSearching(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedQuery, coords, nearbyLocations]);

  // Handle select tag or recent search
  const handleSelectTerm = (term: string) => {
    setQuery(term);
    saveRecentSearch(term);
  };

  const handleSubmit = () => {
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }
  };

  const handleOpenPlace = async (place: PlaceData) => {
    setSelectedPlace(place);
    setModalVisible(true);
    if (query.trim()) {
      saveRecentSearch(query.trim());
    }

    const { data, error } = await getLocationById(place.id);
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

  const hasQuery = query.trim().length > 0;

  return (
    <SafeAreaView style={styles.page}>
      {/* Header with Back button and Search Bar */}
      <View style={styles.header}>
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
        <View style={styles.searchBarWrapper}>
          <SearchBar
            placeholder="What are you craving today?"
            value={query}
            onChangeText={setQuery}
            autoFocus={true}
            onClear={() => setQuery("")}
            onSubmit={handleSubmit}
          />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* VIEW A: Pre-search (Empty query) */}
        {!hasQuery && (
          <View style={styles.preSearchContainer}>
            {/* Recent Searches (GoFood style) */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>RECENT SEARCHES</Text>
                  <Pressable onPress={clearRecentSearches} hitSlop={8}>
                    <Text style={styles.clearAllText}>Clear All</Text>
                  </Pressable>
                </View>

                <View style={styles.recentList}>
                  {recentSearches.map((term, index) => (
                    <View key={`${term}-${index}`} style={styles.recentItemRow}>
                      <Pressable
                        style={styles.recentItemPressable}
                        onPress={() => handleSelectTerm(term)}
                      >
                        <History color="#8B889E" size={16} />
                        <Text style={styles.recentText}>{term}</Text>
                      </Pressable>
                      <Pressable
                        onPress={() => removeRecentSearch(term)}
                        hitSlop={8}
                        style={styles.recentDeleteButton}
                      >
                        <X color="#CBC6C6" size={16} />
                      </Pressable>
                    </View>
                  ))}
                </View>
              </View>
            )}

            {/* Popular Categories / Tags */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <View style={styles.titleWithIcon}>
                  <Sparkles color={colours.accent_1} size={16} />
                  <Text style={styles.sectionTitle}>POPULAR CATEGORIES</Text>
                </View>
              </View>

              <View style={styles.chipsWrap}>
                {popularTags.map((tag: string, index: number) => (
                  <Pressable
                    key={`${tag}-${index}`}
                    style={({ pressed }) => [
                      styles.categoryChip,
                      pressed && styles.categoryChipPressed,
                    ]}
                    onPress={() => handleSelectTerm(tag)}
                  >
                    <Text style={styles.categoryChipText}>{tag}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* VIEW B: Active Search & Results */}
        {hasQuery && (
          <View style={styles.resultsContainer}>
            {isSearching ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colours.accent_1} />
                <Text style={styles.loadingText}>
                  Searching spots for "{debouncedQuery}"...
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              <View style={styles.resultsSection}>
                <Text style={styles.sectionTitle}>
                  SPOTS FOUND ({searchResults.length})
                </Text>

                <View style={styles.cardsList}>
                  {searchResults.map((place) => (
                    <SearchResultCard
                      key={place.id}
                      place={place}
                      onPress={() => handleOpenPlace(place)}
                    />
                  ))}
                </View>
              </View>
            ) : (
              <View style={styles.noResultsWrapper}>
                <NoResults
                  title={`No spots found for "${debouncedQuery}"`}
                  subtitle="Try searching with a different snack, spot, or explore tags below."
                />

                {/* Helpful category fallback chips under empty state */}
                <View style={styles.fallbackTagsSection}>
                  <Text style={styles.fallbackTitle}>Or try exploring:</Text>
                  <View style={styles.chipsWrap}>
                    {popularTags.slice(0, 6).map((tag: string, index: number) => (
                      <Pressable
                        key={`empty-${tag}-${index}`}
                        style={styles.categoryChip}
                        onPress={() => handleSelectTerm(tag)}
                      >
                        <Text style={styles.categoryChipText}>{tag}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      {/* Place Detail Modal */}
      <PlaceDetailModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        place={selectedPlace}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colours.primary_bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
    backgroundColor: colours.primary_bg,
  },
  searchBarWrapper: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  preSearchContainer: {
    gap: 28,
  },
  section: {
    gap: 14,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  titleWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colours.heading,
    letterSpacing: 0.5,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: colours.accent_1,
  },
  recentList: {
    backgroundColor: colours.secondary_bg,
    borderRadius: 14,
    borderColor: colours.border_1,
    borderWidth: 1.5,
    overflow: "hidden",
  },
  recentItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
  },
  recentItemPressable: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  recentText: {
    fontSize: 14,
    fontWeight: "600",
    color: colours.text_primary,
  },
  recentDeleteButton: {
    padding: 4,
  },
  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  categoryChip: {
    backgroundColor: colours.secondary_bg,
    borderRadius: 999,
    borderWidth: 1.5,
    borderColor: colours.border_1,
    paddingHorizontal: 16,
    paddingVertical: 9,
    shadowColor: "#0A0B1A",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  categoryChipPressed: {
    backgroundColor: colours.accent_1,
    borderColor: colours.accent_1,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colours.text_primary,
  },
  resultsContainer: {
    width: "100%",
  },
  loadingContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
  },
  loadingText: {
    fontSize: 14,
    color: colours.text_secondary,
    fontWeight: "600",
  },
  resultsSection: {
    gap: 14,
  },
  cardsList: {
    gap: 12,
  },
  noResultsWrapper: {
    alignItems: "center",
    paddingTop: 20,
    gap: 24,
  },
  fallbackTagsSection: {
    width: "100%",
    gap: 12,
  },
  fallbackTitle: {
    fontSize: 13,
    fontWeight: "700",
    color: colours.heading,
  },
});
