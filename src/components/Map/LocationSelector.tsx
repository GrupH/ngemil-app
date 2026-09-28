import { colours } from "@/constants/style";
import { MapPin, Search, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import BackButton from "../BackButton";
import NoResults from "../NoResults";

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN!;

export type LocationResult = {
  id: string;
  name: string;
  context: string;
  longitude: number;
  latitude: number;
};

async function searchLocations(
  query: string,
  signal: AbortSignal,
): Promise<LocationResult[]> {
  const params = new URLSearchParams({
    q: query,
    access_token: MAPBOX_TOKEN,
    autocomplete: "true",
    limit: "6",
    types: "place,locality,neighborhood,district",
    language: "en",
  });

  const res = await fetch(
    `https://api.mapbox.com/search/geocode/v6/forward?${params}`,
    { signal },
  );
  if (!res.ok) throw new Error(`Mapbox error ${res.status}`);
  const json = await res.json();

  return (json.features ?? []).map((f: any) => ({
    id: f.id,
    name: f.properties.name,
    context: f.properties.place_formatted ?? "",
    longitude: f.geometry.coordinates[0],
    latitude: f.geometry.coordinates[1],
  }));
}

export default function LocationSelector({
  currLocation,
  onSelect,
}: {
  currLocation: string;
  onSelect: (location: LocationResult) => void;
}) {
  const containerRef = useRef<View>(null);
  const inputRef = useRef<TextInput>(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<LocationResult[]>([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;

    const q = query.trim();
    if (q.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    setLoading(true);

    const timeout = setTimeout(async () => {
      try {
        const data = await searchLocations(q, controller.signal);
        setResults(data);
      } catch (e: any) {
        if (e.name !== "AbortError") setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [query, open]);

  const handlePick = (item: LocationResult) => {
    onSelect(item);
    setOpen(false);
  };

  return (
    <>
      {/* Tappable container (the original) */}
      <Pressable
        ref={containerRef as any}
        collapsable={false}
        onPress={handleOpen}
        style={styles.pressable}
      >
        <View
          style={[
            styles.locationContainer,
            {
              backgroundColor: colours.input_bg,
              borderColor: colours.border_1,
            },
          ]}
        >
          <Search color={colours.accent_1} size={20} strokeWidth={2.5} />
          <Text
            style={[styles.locationText, { color: colours.text_primary }]}
            ellipsizeMode="tail"
            numberOfLines={1}
          >
            {currLocation}
          </Text>
        </View>
      </Pressable>

      <Modal
        visible={open}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={handleClose}
        onShow={() => inputRef.current?.focus()}
      >
        <View style={[styles.screen, { backgroundColor: colours.primary_bg }]}>
          <View style={styles.headerContainer}>
            <BackButton onPress={handleClose} type="Close" />
            <View
              style={[
                styles.locationContainer,
                {
                  backgroundColor: colours.primary_bg,
                  borderColor: colours.border_1,
                },
              ]}
            >
              <TextInput
                ref={inputRef}
                value={query}
                onChangeText={setQuery}
                placeholder={"Enter a location"}
                placeholderTextColor={colours.text_placeholder}
                style={[styles.locationText, { color: colours.text_primary }]}
                autoCorrect={false}
                returnKeyType="search"
              />
              {loading ? (
                <ActivityIndicator size="small" color={colours.accent_1} />
              ) : query.length > 0 ? (
                <Pressable onPress={() => setQuery("")} hitSlop={10}>
                  <X color={colours.text_primary} size={18} />
                </Pressable>
              ) : null}
            </View>
          </View>

          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            keyboardShouldPersistTaps="handled"
            style={[styles.list]}
            renderItem={({ item }) => (
              <Pressable
                onPress={() => handlePick(item)}
                style={({ pressed }) => [
                  styles.row,
                  { borderBottomColor: colours.border_1 },
                  pressed && { opacity: 0.6 },
                ]}
              >
                <MapPin color={colours.accent_1} size={18} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[styles.rowTitle, { color: colours.text_primary }]}
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  {!!item.context && (
                    <Text
                      style={[
                        styles.rowSubtitle,
                        { color: colours.text_primary },
                      ]}
                      numberOfLines={1}
                    >
                      {item.context}
                    </Text>
                  )}
                </View>
              </Pressable>
            )}
            ListEmptyComponent={
              query.trim().length >= 2 && !loading ? (
                <NoResults
                  title="No location found"
                  subtitle="Please enter a valid location"
                />
              ) : null
            }
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
  },
  headerContainer: {
    width: "100%",
    padding: 24,
    flexDirection: "row",
    gap: 24,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 14,
    gap: 10,
    elevation: 2,
    flex: 1,
  },
  locationText: {
    fontSize: 14,
    flex: 1,
  },
  screen: {
    flex: 1,
  },
  list: {
    flex: 1,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "600",
  },
  rowSubtitle: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
  empty: {
    textAlign: "center",
    opacity: 0.6,
    marginTop: 24,
  },
});
