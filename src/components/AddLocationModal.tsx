import { colours } from "@/constants/style";
import { submitLocation } from "@/lib/locations";
import { CoordsType } from "@/types/types";
import { useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { Camera, ImagePlus, LocateFixed, X } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import ModalComponent, { type ModalHandle } from "./ModalComponent";

const MAX_DESCRIPTION_LENGTH = 250;
const MAX_PHOTOS = 5;

type AddLocationModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  coords: CoordsType | null;
  onRequestPickLocation: (startCoords: CoordsType) => void; // NEW
};

type LocationDetailType = {
    name: string
    address: string
    description: string
} & CoordsType

export default function AddLocationModal({
  modalVisible,
  setModalVisible,
  onRequestPickLocation,
  coords
}: AddLocationModalProps) {
  const modalRef = useRef<ModalHandle>(null);

  const defaultLocationDetails = {
    name: "",
    address: "",
    description: "",
    latitude: coords?.latitude || 0,
    longitude: coords?.longitude || 0
  }

  const queryClient = useQueryClient();

  const [newLocationDetails, setLocationDetails] = useState<LocationDetailType>(defaultLocationDetails);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [pickerVisible, setPickerVisible] = useState(false);

  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if(coords && coords.latitude && coords.longitude){
        setLocationDetails((prev: LocationDetailType) => ({ ...prev, latitude: coords.latitude, longitude: coords.longitude }))
    }
  }, [coords])

  // SUBMIT LOCATION
  const canSubmit = (newLocationDetails.name !== "") && (newLocationDetails.address !== "") && (newLocationDetails.description !== "")

  async function handleSubmitLocation(){

    //TODO: toast for submission errors

    if(!newLocationDetails.latitude || !newLocationDetails.longitude || newLocationDetails.latitude === 0 || newLocationDetails.longitude === 0) console.log("no coord") // error here

    if(newLocationDetails.name === "" || newLocationDetails.address === "" || newLocationDetails.description === "") console.log("no detail") // error here

    setIsSubmitting(true)
    try{
        const { error } = await submitLocation(
            newLocationDetails.name,
            newLocationDetails.address,
            newLocationDetails.description,
            newLocationDetails.latitude,
            newLocationDetails.longitude
        )

        if (error) throw error;

        queryClient.invalidateQueries({ queryKey: ["nearbyLocations", coords?.latitude, coords?.longitude] });

        setLocationDetails(defaultLocationDetails)
        setPhotos([])
        modalRef.current?.close();
    } catch(err){
        console.error("Failed to submit new location:", err);
        setSubmitError("Couldn't submit new location. Please try again.");
    } finally {
        setIsSubmitting(false);
    }

  }

  // ADJUST LOCATION
  function handleAdjustLocation() {
    onRequestPickLocation({
      latitude: newLocationDetails.latitude || coords?.latitude || 0,
      longitude: newLocationDetails.longitude || coords?.longitude || 0,
    });
  }

  // PHOTOS
  async function handlePickFromGallery() {
  if (photos.length >= MAX_PHOTOS) return;

  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== "granted") {
    console.log("Gallery permission denied"); // TODO: toast
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.7, // lower it if need to save supabase storage
    allowsMultipleSelection: true,
    selectionLimit: MAX_PHOTOS - photos.length,
  });

  if (!result.canceled) {
    const newUris = result.assets.map((asset) => asset.uri);
    setPhotos((prev) => [...prev, ...newUris].slice(0, MAX_PHOTOS));
  }
}

async function handleTakePhoto() {
  if (photos.length >= MAX_PHOTOS) return;

  const { status } = await ImagePicker.requestCameraPermissionsAsync();
  if (status !== "granted") {
    console.log("Camera permission denied"); // TODO: toast
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    quality: 0.7,
  });

  if (!result.canceled) {
    const newUri = result.assets[0].uri;
    setPhotos((prev) => [...prev, newUri].slice(0, MAX_PHOTOS));
  }
}

function handleRemovePhoto(uriToRemove: string) {
  setPhotos((prev) => prev.filter((uri) => uri !== uriToRemove));
}

  return (
    <ModalComponent
      ref={modalRef}
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      maxHeight='100%'
      keyboardAvoiding
    >
      <Text style={styles.placeTitle}>Add a New Location</Text>
      <Text style={styles.infoTextMuted}>
        Please provide the proper details of the location
      </Text>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g. Central Park Cafe"
            placeholderTextColor={colours.text_placeholder}
            value={newLocationDetails.name}
            onChangeText={(text: string) =>
                setLocationDetails((prev: LocationDetailType) => ({ ...prev, name: text }))
            }
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Address</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="e.g. 123 Main St, Springfield"
            placeholderTextColor={colours.text_placeholder}
            value={newLocationDetails.address}
            onChangeText={(text: string) =>
                setLocationDetails((prev: LocationDetailType) => ({ ...prev, address: text }))
            }
          />
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Exact Location</Text>
        <Pressable style={styles.locationPickerButton} onPress={handleAdjustLocation}>
          <LocateFixed color={colours.accent_1} size={18} />
          <Text style={styles.locationPickerText}>
            {newLocationDetails.latitude && newLocationDetails.longitude
              ? `${newLocationDetails.latitude.toFixed(5)}, ${newLocationDetails.longitude.toFixed(5)}`
              : "Adjust pin on map"}
          </Text>
        </Pressable>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Description</Text>
        <View style={styles.reviewInputContainer}>
          <TextInput
            style={styles.reviewInput}
            placeholder="What makes this place worth visiting?"
            placeholderTextColor={colours.text_placeholder}
            multiline
            maxLength={MAX_DESCRIPTION_LENGTH}
            value={newLocationDetails.description}
            onChangeText={(text: string) =>
                setLocationDetails((prev: LocationDetailType) => ({ ...prev, description: text }))
            }
            textAlignVertical="top"
          />
          <Text style={styles.charCount}>
            {newLocationDetails.description.length}/{MAX_DESCRIPTION_LENGTH}
          </Text>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <View style={styles.photoHeaderRow}>
          <Text style={styles.fieldLabel}>Add Place Photos</Text>
          <Text style={styles.photoCount}>
            {photos.length}/{MAX_PHOTOS}
          </Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photoScroll}>
          {photos.map((uri) => (
            <View key={uri} style={styles.photoThumbWrapper}>
              <Image source={{ uri }} style={styles.photoThumb} />
              <Pressable
                style={styles.photoRemoveButton}
                onPress={() => handleRemovePhoto(uri)}
                hitSlop={8}
              >
                <X color={colours.secondary_bg} size={14} strokeWidth={3} />
              </Pressable>
            </View>
          ))}

          {photos.length < MAX_PHOTOS && (
            <View style={styles.photoAddTile}>
              <Pressable style={styles.photoAddButton} onPress={handleTakePhoto}>
                <Camera color={colours.accent_1} size={20} />
              </Pressable>
              <Pressable style={styles.photoAddButton} onPress={handlePickFromGallery}>
                <ImagePlus color={colours.accent_1} size={20} />
              </Pressable>
            </View>
          )}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <Pressable
            style={[styles.detailButton, !canSubmit && styles.buttonDisabled]}
            onPress={handleSubmitLocation}
            disabled={!canSubmit}
        >
            <Text
                style={[
                styles.detailButtonText,
                !canSubmit && styles.buttonDisabledText,
                ]}
            >
                {isSubmitting ? "Submitting..." : "Add Location"}
            </Text>
        </Pressable>
    </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  placeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colours.text_primary,
    fontFamily: "System",
    marginTop: 4,
  },
  infoTextMuted: {
    fontSize: 13,
    fontWeight: "500",
    color: colours.text_secondary,
    lineHeight: 18,
    marginTop: 6,
  },
  fieldGroup: {
    marginTop: 20,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: colours.text_primary,
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderColor: colours.border_1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    fontSize: 14,
    fontWeight: "500",
    color: colours.text_primary,
    padding: 0,
  },
  reviewInputContainer: {
    borderWidth: 1.5,
    borderColor: colours.border_1,
    borderRadius: 16,
    padding: 14,
  },
  reviewInput: {
    minHeight: 100,
    fontSize: 14,
    fontWeight: "500",
    color: colours.text_primary,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 11,
    fontWeight: "500",
    color: colours.text_secondary,
    marginTop: 4,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 16,
    marginTop: 24,
  },
  detailButton: {
    width: "100%",
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  detailButtonText: {
    color: colours.secondary_bg,
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 15,
  },
  buttonDisabled:{
    backgroundColor: colours.border_1
  },
  buttonDisabledText: {
    color: colours.border_2,
    opacity: 0.5
  },
  locationPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colours.border_1,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  locationPickerText: {
    fontSize: 14,
    fontWeight: "500",
    color: colours.text_primary,
  },
  photoHeaderRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: 8,
  },
  photoCount: {
    fontSize: 12,
    fontWeight: "500",
    color: colours.text_secondary,
  },
  photoScroll: {
    flexDirection: "row",
  },
  photoThumbWrapper: {
    marginRight: 10,
    position: "relative",
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colours.border_1,
  },
  photoRemoveButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colours.text_primary,
    alignItems: "center",
    justifyContent: "center",
  },
  photoAddTile: {
    flexDirection: "row",
    gap: 8,
    width: 80,
    height: 80,
  },
  photoAddButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: colours.border_1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
});