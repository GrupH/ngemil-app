import AddLocationModal from "@/components/AddLocationModal";
import BackButton from "@/components/BackButton";
import { colours } from "@/constants/style";
import { useNearbyLocationContext } from "@/context/NearbyLocationContext";
import { useAuth } from "@/hooks/auth";
import { useLocation } from "@/hooks/useLocation";
import { CoordsType } from "@/types/types";
import Mapbox from "@rnmapbox/maps";
import { useRouter } from "expo-router";
import { MapPin, Plus, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

export default function MapPage() {
  const { fullName: locationName, coords } = useLocation();
  const { user } = useAuth()
  const router = useRouter()

  const { nearbyLocations, isLoading } = useNearbyLocationContext()

  const [currLocation, setCurrLocation] = useState<string>(locationName)
  const [currCoords, setCurrCoords] = useState<CoordsType | null>(coords)
  const [modalVisible, setModalVisible] = useState<boolean>(false)

  // NEW: picking mode state
  const [isPickingLocation, setIsPickingLocation] = useState(false);
  const [pickerCenter, setPickerCenter] = useState<CoordsType | null>(null);

  useEffect(() => {
    setCurrLocation(locationName)
    setCurrCoords(coords)
  }, [locationName, coords])

  function handleStartPicking(startCoords: CoordsType) {
    setPickerCenter(startCoords);
    setModalVisible(false);      // hide modal, reveal map underneath
    setIsPickingLocation(true);
  }

  function handleCameraChanged(state: Mapbox.MapState) {
    if (!isPickingLocation) return;
    const [longitude, latitude] = state.properties.center;
    setPickerCenter({ latitude, longitude });
  }

  function handleConfirmPick() {
    setIsPickingLocation(false);
    setModalVisible(true);       // pickerCenter gets passed back in as coords
  }

  function handleCancelPick() {
    setIsPickingLocation(false);
    setModalVisible(true);
  }

  return (
    <View style={styles.page}>
      {!isPickingLocation && (
        <View style={styles.headerContainer}>
          <BackButton onPress={() => router.canGoBack() ? router.back() : router.replace("/")} type="Back"/>
          <View style={styles.inputContainer}>
            <Search color="#949FF1" size={20} />
            <TextInput placeholderTextColor="#CBC6C6" style={styles.input} value={currLocation}/>
          </View>
        </View>
      )}

      {!isPickingLocation && (
        <View style={styles.addLocationContainer}>
          <Pressable style={styles.addLocationIconCircle} onPress={() => {
            if(!user){
              router.push({
                pathname: '/auth',
                params: { redirectTo: '/map'},
              });
            }
            setModalVisible(true)
            }}>
            <Plus color={colours.secondary_bg} size={28} strokeWidth={2} />
          </Pressable>
        </View>
      )}

      <AddLocationModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        coords={pickerCenter ?? currCoords}
        onRequestPickLocation={handleStartPicking}
      />

      {/* Picking-mode UI, overlaid on the SAME map */}
      {isPickingLocation && (
        <>
          <BackButton onPress={handleCancelPick} style={styles.pickerBackButton} type="Close"/>
          <View style={styles.pinContainer} pointerEvents="none">
            <MapPin color={colours.accent_1} size={40} fill={colours.accent_1} />
          </View>
          <View style={styles.pickerFooter}>
            <Pressable style={styles.pickerConfirmButton} onPress={handleConfirmPick}>
              <Text style={styles.pickerConfirmText}>Confirm Location</Text>
            </Pressable>
          </View>
        </>
      )}

      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          styleURL={'mapbox://styles/qrome/cms5onyxy000r01rd2e5w8fas'}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          onCameraChanged={handleCameraChanged}
        >
          <Mapbox.Camera
            zoomLevel={isPickingLocation ? 18 : 16}
            centerCoordinate={
              isPickingLocation && pickerCenter
                ? [pickerCenter.longitude, pickerCenter.latitude]
                : coords ? [coords.longitude, coords.latitude] : [106.8272, -6.1751]
            }
            animationMode="flyTo"
            animationDuration={isPickingLocation ? 300 : 500}
          /> 
          {!isLoading && nearbyLocations.map((location) => (
            <Mapbox.PointAnnotation id={location.id} key={location.id} coordinate={[location.longitude, location.latitude]}>
              {location.imageUrl ? <Image source={{uri: location.imageUrl}} style={styles.annotationImg}/> : <View style={[styles.annotationImg, {padding:5, backgroundColor: "red"}]}></View>}
            </Mapbox.PointAnnotation>
          ))}
          {coords && !isPickingLocation && <Mapbox.UserLocation visible={true} />}
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
  addLocationContainer:{
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
    backgroundColor: colours.accent_1,
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
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  pickerConfirmText: { 
    color: colours.secondary_bg, 
    fontWeight: "700", 
    fontSize: 15 
  },
  pickerBackButton:{
    position: "absolute",
    zIndex: 10,
    top: 24,
    left: 24,
  },
  annotationImg:{
    width: 40,
    height: 40,
    borderRadius: 999,
    borderWidth: 4,
    borderColor: colours.border_2
  }
});
