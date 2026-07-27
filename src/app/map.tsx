import BackButton from "@/components/BackButton";
import { mapStyle } from "@/constants/mapStyle";
import { colours } from "@/constants/style";
import { useLocation } from "@/hooks/useLocation";
import Mapbox from "@rnmapbox/maps";
import { router } from "expo-router";
import { Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { StyleSheet, TextInput, View } from "react-native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

export default function MapPage() {
  const { fullName: locationName, coords } = useLocation();

  const[currLocation, setCurrLocation] = useState<string>(locationName)

  useEffect(() => {
    setCurrLocation(locationName)
  }, [locationName])

  return (
    <View style={styles.page}>
      <View style={styles.headerContainer}>
        <BackButton
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace("/");
            }
          }}
        />
        <View style={styles.inputContainer}>
          <Search color="#949FF1" size={20} />
          <TextInput placeholderTextColor="#CBC6C6" style={styles.input} value={currLocation}/>
        </View>
      </View>

      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          styleURL={JSON.stringify(mapStyle)}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
        >
          <Mapbox.Camera
            zoomLevel={16}
            centerCoordinate={
              coords ? [coords.longitude, coords.latitude] : [106.8272, -6.1751] // TODO: decide what happens when no coords
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
  headerContainer: {
    position: "absolute",
    width: "100%",
    padding: 24,
    top: 0,
    zIndex: 10,
    flexDirection: "row",
    gap: 24,
  },
  map: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colours.secondary_bg,
    borderRadius: 999,
    borderColor: colours.border_1,
    borderWidth: 2,
    paddingHorizontal: 14,
    gap: 10,
    elevation: 2,
    flex: 1,
  },
  input: {
    fontSize: 16,
    color: colours.text_primary,
    flex: 1,
  },
});
