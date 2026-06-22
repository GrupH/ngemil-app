import BackButton from "@/components/BackButton";
import Mapbox from "@rnmapbox/maps";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import { useLocation } from "@/hooks/useLocation";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

export default function MapPage() {
  const { coords } = useLocation();

  return (
    <View style={styles.page}>
      <View style={styles.backButtonContainer}>
        <BackButton
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
        />
      </View>

      <View style={styles.container}>
        <Mapbox.MapView style={styles.map}>
          <Mapbox.Camera
            zoomLevel={15}
            centerCoordinate={
              coords ? [coords.longitude, coords.latitude] : [106.8272, -6.1751]
            }
            animationMode="flyTo"
            animationDuration={2000}
          />
          {coords && <Mapbox.UserLocation visible={true} />}
        </Mapbox.MapView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  container: {
    height: "100%",
    width: "100%",
  },
  backButtonContainer: {
    position: "absolute",
    top: 36,
    left: 16,
    zIndex: 10,
  },
  map: {
    flex: 1,
  },
});
