import { colours } from "@/constants/style";
import { CoordsType } from "@/types/types";
import Mapbox from "@rnmapbox/maps";
import { Check, MapPin, X } from "lucide-react-native";
import { useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

type EditLocationMapProps = {
  visible: boolean;
  initialCoords: CoordsType;
  onClose: () => void;
  onConfirm: (coords: CoordsType) => void;
};

export default function EditLocationMap({
  visible,
  initialCoords,
  onClose,
  onConfirm,
}: EditLocationMapProps) {
  const [centerCoords, setCenterCoords] = useState<CoordsType>(initialCoords);

  // Fires as the map pans - reads whatever's under the fixed center pin
  function handleCameraChanged(state: Mapbox.MapState) {
    const [longitude, latitude] = state.properties.center;
    setCenterCoords({ latitude, longitude });
  }

  function handleConfirm() {
    onConfirm(centerCoords);
    onClose();
  }

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.container}>
        <Mapbox.MapView
          style={styles.map}
          styleURL={"mapbox://styles/qrome/cms5onyxy000r01rd2e5w8fas"}
          scaleBarEnabled={false}
          logoEnabled={false}
          attributionEnabled={false}
          onCameraChanged={handleCameraChanged}
        >
          <Mapbox.Camera
            zoomLevel={17}
            centerCoordinate={[initialCoords.longitude, initialCoords.latitude]}
          />
        </Mapbox.MapView>

        {/* Fixed pin overlay - does NOT move with the map, the map moves under it */}
        <View style={styles.pinContainer} pointerEvents="none">
          <MapPin color={colours.accent_1} size={40} fill={colours.accent_1} />
        </View>

        <View style={styles.topBar}>
          <Pressable style={styles.iconButton} onPress={onClose}>
            <X color={colours.text_primary} size={22} />
          </Pressable>
          <View style={styles.coordsBadge}>
            <Text style={styles.coordsText}>
              {centerCoords.latitude.toFixed(5)}, {centerCoords.longitude.toFixed(5)}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Pressable style={styles.confirmButton} onPress={handleConfirm}>
            <Check color={colours.secondary_bg} size={20} strokeWidth={2.5} />
            <Text style={styles.confirmButtonText}>Confirm Location</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colours.secondary_bg },
  map: { flex: 1 },
  pinContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -20,
    marginTop: -40, // shifts the icon so its TIP (not center) sits on the true coordinate
    zIndex: 5,
  },
  topBar: {
    position: "absolute",
    top: 0,
    width: "100%",
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    zIndex: 10,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colours.secondary_bg,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  coordsBadge: {
    backgroundColor: colours.secondary_bg,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 8,
    elevation: 3,
  },
  coordsText: { fontSize: 13, fontWeight: "600", color: colours.text_primary },
  footer: { position: "absolute", bottom: 0, width: "100%", padding: 24, zIndex: 10 },
  confirmButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  confirmButtonText: { color: colours.secondary_bg, fontWeight: "700", fontSize: 15 },
});