import { CoordsType } from "@/types/types";
import * as Location from "expo-location";
import { useEffect, useState } from "react";

export interface PlaceInfo {
  name: string;
  fullName: string;
}

export interface LocationState extends PlaceInfo {
  coords: CoordsType | null;
  loading: boolean;
  error: string | null;
}

const FALLBACK_PLACE: PlaceInfo = {
  name: "Active Location",
  fullName: "Active Location",
};

export function formatPlace(
  addr?: Location.LocationGeocodedAddress,
): PlaceInfo {
  if (!addr) return FALLBACK_PLACE;

  const name =
    addr.district || addr.city || addr.subregion || FALLBACK_PLACE.name;
  const fullName =
    [addr.district || addr.street, addr.city].filter(Boolean).join(", ") ||
    name;

  return { name, fullName };
}

export async function reverseGeocode(
  coords: CoordsType,
): Promise<PlaceInfo | null> {
  try {
    const results = await Location.reverseGeocodeAsync(coords);
    return results.length > 0 ? formatPlace(results[0]) : null;
  } catch (e) {
    console.warn("Failed to reverse geocode location:", e);
    return null;
  }
}

export function useLocation(enabled: boolean = true) {
  const [state, setState] = useState<LocationState>({
    coords: null,
    name: "Searching...",
    fullName: "Searching Location...",
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!enabled) return;

    let subscription: Location.LocationSubscription | null = null;
    let lastGeocodedCoords: CoordsType | null = null;
    let lastName = "Active Location";
    let lastFullName = "Active Location";

    async function startLocationTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setState({
            coords: null,
            name: "Permission to access location was denied",
            fullName: "Permission to access location was denied",
            loading: false,
            error: "Permission to access location was denied",
          });
          return;
        }
        // Start watching the location with 50m interval
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            distanceInterval: 50,
          },
          async (userLoc) => {
            const currentCoords = {
              latitude: userLoc.coords.latitude,
              longitude: userLoc.coords.longitude,
            };

            let place = {
              fullName: lastFullName,
              name: lastName,
            };

            const dist = lastGeocodedCoords
              ? Math.hypot(
                  (currentCoords.latitude - lastGeocodedCoords.latitude) *
                    111000,
                  (currentCoords.longitude - lastGeocodedCoords.longitude) *
                    111000,
                )
              : 999;

            if (!lastGeocodedCoords || dist > 100) {
              const result = await reverseGeocode(currentCoords);
              if (result) {
                place = result;
                lastGeocodedCoords = currentCoords;
              }
            }

            setState({
              coords: currentCoords,
              name: place.name,
              fullName: place.fullName,
              loading: false,
              error: null,
            });
          },
        );
      } catch (err: any) {
        setState({
          coords: null,
          name: "",
          fullName: "",
          loading: false,
          error: err.message || "Failed to start location tracking",
        });
      }
    }
    startLocationTracking();
    return () => {
      if (subscription) {
        subscription.remove();
      }
    };
  }, []);

  return state;
}
