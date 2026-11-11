import AddLocationModal from "@/components/AddLocationModal";
import BackButton from "@/components/BackButton";
import Chip from "@/components/Map/Chip";
import LocationSelector, {
  LocationResult,
} from "@/components/Map/LocationSelector";
import { useLocationContext } from "@/context/LocationContext";
import { useNearbyLocationContext } from "@/context/NearbyLocationContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/auth";
import { CoordsType } from "@/types/types";
import Mapbox from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { LocateFixed, MapPin, Plus } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

export default function MapPage() {
  const {
    fullName: locationName,
    coords,
    selectCoords,
    followUser,
    isManual,
  } = useLocationContext();
  const { user } = useAuth();
  const router = useRouter();
  const { colours, isDarkMode } = useTheme();

  const { nearbyLocations, isLoading } = useNearbyLocationContext();

  const [currLocation, setCurrLocation] = useState<string>(locationName);
  const [currCoords, setCurrCoords] = useState<CoordsType | null>(coords);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickerCenter, setPickerCenter] = useState<CoordsType | null>(null);

  const [zoomLevel, setZoomLevel] = useState<number>(0);

  const cameraRef = useRef<Mapbox.Camera>(null);
  const shapeSourceRef = useRef<Mapbox.ShapeSource>(null);

  useEffect(() => {
    setCurrLocation(locationName);
    setCurrCoords(coords);
  }, [locationName, coords]);

  function handleStartPicking(startCoords: CoordsType) {
    setPickerCenter(startCoords);
    setModalVisible(false);
    setIsPickingLocation(true);
  }

  function handleCameraChanged(state: Mapbox.MapState) {
    const zoom = state.properties.zoom;
    setZoomLevel(zoom);

    if (!isPickingLocation) return;
    const [longitude, latitude] = state.properties.center;
    setPickerCenter({ latitude, longitude });
  }

  function handleConfirmPick() {
    setIsPickingLocation(false);
    setModalVisible(true);
  }

  function handleCancelPick() {
    setIsPickingLocation(false);
    setModalVisible(true);
  }

  function handleChangeLocation(location: LocationResult) {
    selectCoords({
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  async function handleClusterPress(e: any) {
    const feature = e.features?.[0];
    if (!feature?.properties?.cluster) return;

    const zoom = await shapeSourceRef.current?.getClusterExpansionZoom(feature);
    cameraRef.current?.setCamera({
      centerCoordinate: feature.geometry.coordinates,
      zoomLevel: zoom ?? zoomLevel + 1,
      animationDuration: 400,
    });
  }

  const locationsGeoJSON = useMemo<GeoJSON.FeatureCollection>(
    () => ({
      type: "FeatureCollection",
      features: nearbyLocations.map((l) => ({
        type: "Feature",
        id: l.id,
        properties: { id: l.id, title: l.title },
        geometry: { type: "Point", coordinates: [l.longitude, l.latitude] },
      })),
    }),
    [nearbyLocations],
  );

  return (
    <View style={[styles.page, { backgroundColor: colours.primary_bg }]}>
      {!isPickingLocation && (
        <View style={styles.headerContainer}>
          <BackButton
            onPress={() =>
              router.canGoBack() ? router.back() : router.replace("/")
            }
            type="Back"
          />
          <LocationSelector
            currLocation={currLocation}
            onSelect={handleChangeLocation}
          />
        </View>
      )}

      {!isPickingLocation && (
        <>
          {isManual && coords && (
            <View style={styles.resetLocationContainer}>
              <Pressable
                style={[
                  styles.resetLocationIconCircle,
                  {
                    backgroundColor: colours.secondary_bg,
                    borderColor: colours.border_1,
                  },
                ]}
                onPress={followUser}
              >
                <LocateFixed
                  color={colours.accent_1}
                  size={28}
                  strokeWidth={2}
                />
              </Pressable>
            </View>
          )}
          {coords && (
            <View style={styles.addLocationContainer}>
              <Pressable
                style={[
                  styles.addLocationIconCircle,
                  { backgroundColor: colours.accent_1 },
                ]}
                onPress={() => {
                  if (!user) {
                    router.push({
                      pathname: "/auth",
                      params: { redirectTo: "/map" },
                    });
                  }
                  setModalVisible(true);
                }}
              >
                <Plus color="#FFFFFF" size={28} strokeWidth={2} />
              </Pressable>
            </View>
          )}
        </>
      )}

      <AddLocationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        coords={pickerCenter ?? currCoords}
        onRequestPickLocation={handleStartPicking}
      />

      {/* Picking-mode UI */}
      {isPickingLocation && (
        <>
          <BackButton
            onPress={handleCancelPick}
            style={styles.pickerBackButton}
            type="Close"
          />
          <View style={styles.pinContainer} pointerEvents="none">
            <MapPin
              color={colours.accent_1}
              size={40}
              fill={colours.accent_1}
            />
          </View>
          <View style={styles.pickerFooter}>
            <Pressable
              style={[
                styles.pickerConfirmButton,
                { backgroundColor: colours.accent_1 },
              ]}
              onPress={handleConfirmPick}
            >
              <Text
                style={[
                  styles.pickerConfirmText,
                  { color: colours.secondary_bg },
                ]}
              >
                Confirm Location
              </Text>
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          styleURL={
            isDarkMode
              ? "mapbox://styles/mapbox/dark-v11"
              : "mapbox://styles/qrome/cms5onyxy000r01rd2e5w8fas"
          }
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          onCameraChanged={handleCameraChanged}
        >
          <Mapbox.Camera
            ref={cameraRef}
            minZoomLevel={12}
            maxZoomLevel={20}
            zoomLevel={isPickingLocation ? 18 : 16}
            followUserLocation={!isPickingLocation && !isManual}
            followUserMode={Mapbox.UserTrackingMode.Follow}
            centerCoordinate={
              isPickingLocation && pickerCenter
                ? [pickerCenter.longitude, pickerCenter.latitude]
                : coords
                  ? [coords.longitude, coords.latitude]
                  : [106.8272, -6.1751]
            }
            animationMode="flyTo"
            animationDuration={isPickingLocation ? 300 : 500}
          />
          {!isLoading &&
            zoomLevel >= 14 &&
            nearbyLocations.map((location) => (
              <Mapbox.PointAnnotation
                id={location.id}
                key={location.id}
                coordinate={[location.longitude, location.latitude]}
              >
                <View collapsable={false}>
                  <Chip
                    name={location.title}
                    dist={location.distance}
                    img={location.imageUrl}
                    type="detailed"
                  />
                </View>
              </Mapbox.PointAnnotation>
            ))}
          {!isLoading && (
            <Mapbox.ShapeSource
              id="locations-source"
              ref={shapeSourceRef}
              shape={locationsGeoJSON}
              cluster
              clusterRadius={50}
              clusterMaxZoomLevel={13}
              onPress={handleClusterPress}
            >
              {/* Cluster bubbles (size grows with count) */}
              <Mapbox.CircleLayer
                id="clusters"
                maxZoomLevel={14}
                filter={["has", "point_count"]}
                style={{
                  circleColor: colours.primary_bg,
                  circleStrokeColor: colours.accent_1,
                  circleStrokeWidth: 2,
                  circleRadius: [
                    "step",
                    ["get", "point_count"],
                    16,
                    10,
                    20,
                    50,
                    26,
                  ],
                }}
              />

              {/* Count label */}
              <Mapbox.SymbolLayer
                id="cluster-count"
                maxZoomLevel={14}
                filter={["has", "point_count"]}
                style={{
                  textField: ["get", "point_count_abbreviated"],
                  textSize: 13,
                  textColor: colours.text_primary,
                  textAllowOverlap: true,
                  textIgnorePlacement: true,
                }}
              />

              {/* Locations that aren't part of any cluster */}
              <Mapbox.CircleLayer
                id="single-points"
                maxZoomLevel={14}
                filter={["!", ["has", "point_count"]]}
                style={{
                  circleColor: colours.accent_1,
                  circleStrokeColor: colours.primary_bg,
                  circleStrokeWidth: 2,
                  circleRadius: 8,
                }}
              />
            </Mapbox.ShapeSource>
          )}
          {coords && !isPickingLocation && (
            <Mapbox.UserLocation visible={true} />
          )}
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
    borderRadius: 999,
    borderWidth: 2,
    paddingHorizontal: 14,
    gap: 10,
    elevation: 2,
    flex: 1,
  },
  input: {
    fontSize: 14,
    flex: 1,
  },
  addLocationContainer: {
    position: "absolute",
    padding: 24,
    bottom: 0,
    right: 0,
    zIndex: 10,
  },
  addLocationIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  resetLocationContainer: {
    position: "absolute",
    padding: 24,
    bottom: 0,
    left: 0,
    zIndex: 10,
  },
  resetLocationIconCircle: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderRadius: 99,
    alignItems: "center",
    justifyContent: "center",
  },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -40,
    zIndex: 10,
  },
  pickerFooter: {
    position: "absolute",
    padding: 24,
    bottom: 0,
    width: "100%",
    flexDirection: "row",
    gap: 12,
    zIndex: 10,
  },
  pickerConfirmButton: {
    flex: 2,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pickerConfirmText: {
    fontWeight: "700",
    fontSize: 15,
  },
  pickerBackButton: {
    position: "absolute",
    zIndex: 10,
    top: 24,
    left: 24,
  },
  annotationImg: {
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 4,
  },
});
