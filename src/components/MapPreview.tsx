import { mapStyle } from "@/constants/mapStyle";
import { colours } from "@/constants/style";
import Mapbox from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { Expand } from "lucide-react-native";
import { Pressable, StyleSheet, Text, View } from "react-native";
export default function MapPreview({
  coords,
}: {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
}) {
  const router = useRouter();

  return (
    <View style={styles.mapCard}>
      <Mapbox.MapView
        style={StyleSheet.absoluteFill}
        styleURL={JSON.stringify(mapStyle)}
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
