import BackButton from "@/components/BackButton";
import Mapbox from "@rnmapbox/maps";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";

Mapbox.setAccessToken(process.env.MAPBOX_KEY!);

export default function MapPage() {
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
        <Mapbox.MapView style={styles.map} />
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
    flex: 1
  }
});
