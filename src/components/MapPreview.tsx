import { colours } from "@/constants/style";
import { useNearbyLocationContext } from "@/context/NearbyLocationContext";
import { CoordsType } from "@/types/types";
import Mapbox from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { Expand, MapPin } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function MapPreview({ coords }: { coords: CoordsType | null }) {
  const router = useRouter();
  const { nearbyLocations, isLoading } = useNearbyLocationContext();

  return (
    <View style={styles.mapCard}>
      <Mapbox.MapView
        style={StyleSheet.absoluteFill}
        styleURL={"mapbox://styles/qrome/cms5onyxy000r01rd2e5w8fas"}
        zoomEnabled={false}
        scrollEnabled={false}
        pitchEnabled={false}
        rotateEnabled={false}
        logoEnabled={false}
        attributionEnabled={false}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          zoomLevel={14}
          followZoomLevel={14}
          followUserLocation={true}
          followUserMode={Mapbox.UserTrackingMode.Follow}
          centerCoordinate={
            coords ? [coords.longitude, coords.latitude] : [106.8272, -6.1751]
          }
        />
        {coords && <Mapbox.UserLocation visible={true} />}
        {!isLoading &&
          nearbyLocations.map((location) => (
            <Mapbox.PointAnnotation
              id={location.id}
              key={location.id}
              coordinate={[location.longitude, location.latitude]}
            >
              <View collapsable={false}>
                <MapPin
                  color={colours.accent_1}
                  fill={colours.secondary_bg}
                  strokeWidth={2}
                  size={28}
                />
              </View>
            </Mapbox.PointAnnotation>
          ))}
      </Mapbox.MapView>
      <Pressable
        onPress={() => router.push("/map")}
        style={styles.openMapButton}
      >
        <Expand size={16} color={colours.secondary_bg} />
        <Text style={styles.openMapButtonText}>Expand</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
  openMapButton: {
    position: "absolute",
    bottom: 16,
    right: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 100,
    backgroundColor: colours.accent_1,
    borderWidth: 2,
    borderColor: colours.border_1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 8,
  },
  openMapButtonText: {
    color: colours.secondary_bg,
    fontSize: 14,
    fontWeight: "800",
  },
});
