import { useTheme } from "@/context/ThemeContext";
import { submitLocation } from "@/lib/locations";
import { submitPhotos } from "@/lib/photos";
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
  onRequestPickLocation: (startCoords: CoordsType) => void;
};

type LocationDetailType = {
  name: string;
  address: string;
  description: string;
} & CoordsType;

export default function AddLocationModal({
  modalVisible,
  setModalVisible,
  onRequestPickLocation,
  coords,
}: AddLocationModalProps) {
  const modalRef = useRef<ModalHandle>(null);
  const { colours } = useTheme();

  const defaultLocationDetails = {
    name: "",
    address: "",
    description: "",
    latitude: coords?.latitude || 0,
    longitude: coords?.longitude || 0,
  };

  const queryClient = useQueryClient();

  const [newLocationDetails, setLocationDetails] = useState<LocationDetailType>(
    defaultLocationDetails
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [photos, setPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (coords && coords.latitude && coords.longitude) {
      setLocationDetails((prev: LocationDetailType) => ({
        ...prev,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }));
    }
  }, [coords]);

  const canSubmit =
    newLocationDetails.name !== "" &&
    newLocationDetails.address !== "" &&
    newLocationDetails.description !== "";

  async function handleSubmitLocation() {
    if (
      !newLocationDetails.latitude ||
      !newLocationDetails.longitude ||
      newLocationDetails.latitude === 0 ||
      newLocationDetails.longitude === 0
    )
      console.log("no coord");

    if (
      newLocationDetails.name === "" ||
      newLocationDetails.address === "" ||
      newLocationDetails.description === ""
    )
      console.log("no detail");

    setIsSubmitting(true);
    try {
      const { data, error } = await submitLocation(
        newLocationDetails.name,
        newLocationDetails.address,
        newLocationDetails.description,
        newLocationDetails.latitude,
        newLocationDetails.longitude
      );

      if (error) throw error;

      const locationId = data?.id;

      if (photos.length > 0) {
        const photoResults = await Promise.allSettled(
          photos.map((uri, index) =>
            submitPhotos(uri, locationId, index === 0)
          )
        );

        const failedCount = photoResults.filter(
          (r) =>
            r.status === "rejected" ||
            (r.status === "fulfilled" && r.value.error)
        ).length;

        if (failedCount > 0) {
          console.error(
            `${failedCount} of ${photos.length} photos failed to upload`
          );
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["nearbyLocations", coords?.latitude, coords?.longitude],
      });
      queryClient.invalidateQueries({ queryKey: ["locationById", locationId] });
    } catch (err) {
      console.error("Failed to submit new location:", err);
      setSubmitError("Couldn't submit new location. Please try again.");
    } finally {
      setIsSubmitting(false);
      setLocationDetails(defaultLocationDetails);
      setPhotos([]);
      modalRef.current?.close();
    }
  }

  function handleAdjustLocation() {
    onRequestPickLocation({
      latitude: newLocationDetails.latitude || coords?.latitude || 0,
      longitude: newLocationDetails.longitude || coords?.longitude || 0,
    });
  }

  async function handlePickFromGallery() {
    if (photos.length >= MAX_PHOTOS) return;

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      console.log("Gallery permission denied");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
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
      console.log("Camera permission denied");
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
      maxHeight="100%"
      keyboardAvoiding
    >
      <Text style={[styles.placeTitle, { color: colours.text_primary }]}>
        Add a New Location
      </Text>
      <Text style={[styles.infoTextMuted, { color: colours.text_secondary }]}>
        Please provide the proper details of the location
      </Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        style={styles.formScroll}
        contentContainerStyle={styles.formScrollContent}
      >
        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colours.text_primary }]}>
            Name
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colours.input_bg,
                borderColor: colours.border_1,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colours.text_primary }]}
              placeholder="e.g. Central Park Cafe"
              placeholderTextColor={colours.text_placeholder}
              value={newLocationDetails.name}
              onChangeText={(text: string) =>
                setLocationDetails((prev: LocationDetailType) => ({
                  ...prev,
                  name: text,
                }))
              }
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colours.text_primary }]}>
            Address
          </Text>
          <View
            style={[
              styles.inputContainer,
              {
                backgroundColor: colours.input_bg,
                borderColor: colours.border_1,
              },
            ]}
          >
            <TextInput
              style={[styles.input, { color: colours.text_primary }]}
              placeholder="e.g. 123 Main St, Springfield"
              placeholderTextColor={colours.text_placeholder}
              value={newLocationDetails.address}
              onChangeText={(text: string) =>
                setLocationDetails((prev: LocationDetailType) => ({
                  ...prev,
                  address: text,
                }))
              }
            />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colours.text_primary }]}>
            Exact Location
          </Text>
          <Pressable
            style={[
              styles.locationPickerButton,
              {
                backgroundColor: colours.input_bg,
                borderColor: colours.border_1,
              },
            ]}
            onPress={handleAdjustLocation}
          >
            <LocateFixed color={colours.accent_1} size={18} />
            <Text style={[styles.locationPickerText, { color: colours.text_primary }]}>
              {newLocationDetails.latitude && newLocationDetails.longitude
                ? `${newLocationDetails.latitude.toFixed(
                    5
                  )}, ${newLocationDetails.longitude.toFixed(5)}`
                : "Adjust pin on map"}
            </Text>
          </Pressable>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={[styles.fieldLabel, { color: colours.text_primary }]}>
            Description
          </Text>
          <View
            style={[
              styles.reviewInputContainer,
              {
                backgroundColor: colours.input_bg,
                borderColor: colours.border_1,
              },
            ]}
          >
            <TextInput
              style={[styles.reviewInput, { color: colours.text_primary }]}
              placeholder="What makes this place worth visiting?"
              placeholderTextColor={colours.text_placeholder}
              multiline
              maxLength={MAX_DESCRIPTION_LENGTH}
              value={newLocationDetails.description}
              onChangeText={(text: string) =>
                setLocationDetails((prev: LocationDetailType) => ({
                  ...prev,
                  description: text,
                }))
              }
              textAlignVertical="top"
            />
            <Text style={[styles.charCount, { color: colours.text_secondary }]}>
              {newLocationDetails.description.length}/{MAX_DESCRIPTION_LENGTH}
            </Text>
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <View style={styles.photoHeaderRow}>
            <Text style={[styles.fieldLabel, { color: colours.text_primary }]}>
              Add Place Photos
            </Text>
            <Text style={[styles.photoCount, { color: colours.text_secondary }]}>
              {photos.length}/{MAX_PHOTOS}
            </Text>
          </View>

          {photos.length < MAX_PHOTOS && (
            <View style={styles.photoAddTile}>
              <Pressable
                style={[
                  styles.photoAddButton,
                  { borderColor: colours.border_1 },
                ]}
                onPress={handleTakePhoto}
              >
                <Camera color={colours.accent_1} size={20} />
              </Pressable>
              <Pressable
                style={[
                  styles.photoAddButton,
                  { borderColor: colours.border_1 },
                ]}
                onPress={handlePickFromGallery}
              >
                <ImagePlus color={colours.accent_1} size={20} />
              </Pressable>
            </View>
          )}

          {photos.length > 0 && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.photoScroll}
            >
              {photos.map((uri) => (
                <View key={uri} style={styles.photoThumbWrapper}>
                  <Image source={{ uri }} style={styles.photoThumb} />
                  <Pressable
                    style={[
                      styles.photoRemoveButton,
                      { backgroundColor: colours.text_primary },
                    ]}
                    onPress={() => handleRemovePhoto(uri)}
                    hitSlop={8}
                  >
                    <X color={colours.card_bg} size={14} strokeWidth={3} />
                  </Pressable>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { borderTopColor: colours.border_1 }]}>
        <Pressable
          style={[
            styles.detailButton,
            { backgroundColor: colours.accent_1 },
            !canSubmit && { backgroundColor: colours.border_1 },
          ]}
          onPress={handleSubmitLocation}
          disabled={!canSubmit}
        >
          <Text
            style={[
              styles.detailButtonText,
              { color: colours.secondary_bg },
              !canSubmit && { color: colours.text_secondary, opacity: 0.5 },
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
    marginTop: 4,
  },
  infoTextMuted: {
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 8,
  },
  formScroll: {
    flexShrink: 1,
  },
  formScrollContent: {
    paddingBottom: 16,
  },
  fieldGroup: {
    marginTop: 16,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: "700",
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  input: {
    fontSize: 14,
    fontWeight: "500",
    padding: 0,
  },
  reviewInputContainer: {
    borderWidth: 1.5,
    borderRadius: 16,
    padding: 14,
  },
  reviewInput: {
    minHeight: 100,
    fontSize: 14,
    fontWeight: "500",
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 4,
  },
  footer: {
    borderTopWidth: 1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 16,
    marginTop: 12,
  },
  detailButton: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 14,
  },
  detailButtonText: {
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 15,
  },
  locationPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  locationPickerText: {
    fontSize: 14,
    fontWeight: "500",
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
  },
  photoScroll: {
    flexDirection: "row",
    paddingTop: 16,
  },
  photoThumbWrapper: {
    marginRight: 10,
    position: "relative",
  },
  photoThumb: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  photoRemoveButton: {
    position: "absolute",
    top: -6,
    right: -6,
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  photoAddTile: {
    flexDirection: "row",
    gap: 8,
    width: "100%",
    height: 60,
  },
  photoAddButton: {
    flex: 1,
    borderWidth: 1.5,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderStyle: "dashed",
  },
});