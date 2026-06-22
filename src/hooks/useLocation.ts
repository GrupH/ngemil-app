import { useState, useEffect } from "react";
import * as Location from "expo-location";

export interface LocationState {
  coords: {
    latitude: number;
    longitude: number;
  } | null;
  name: string;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coords: null,
    name: "Mencari lokasi...",
    loading: true,
    error: null,
  });

  useEffect(() => {
    async function getLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setState({
            coords: null,
            name: "Akses Lokasi Ditolak",
            loading: false,
            error: "Permission to access location was denied",
          });
          return;
        }

        const userLoc = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.Balanced,
        });

        const coords = {
          latitude: userLoc.coords.latitude,
          longitude: userLoc.coords.longitude,
        };

        // Try to reverse geocode
        let name = "Lokasi Aktif";
        try {
          const geocode = await Location.reverseGeocodeAsync(coords);
          if (geocode && geocode.length > 0) {
            const addr = geocode[0];
            // Format nice title (e.g. "Sudirman", "Plaza Indonesia", etc.)
            name =
              addr.street ||
              addr.name ||
              addr.district ||
              addr.city ||
              addr.subregion ||
              "Lokasi Aktif";
          }
        } catch (e) {
          console.warn("Failed to reverse geocode location:", e);
        }

        setState({
          coords,
          name,
          loading: false,
          error: null,
        });
      } catch (err: any) {
        setState({
          coords: null,
          name: "Gagal memuat lokasi",
          loading: false,
          error: err.message || "Failed to get location",
        });
      }
    }

    getLocation();
  }, []);

  return state;
}
