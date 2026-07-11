import * as Location from "expo-location";
import { useEffect, useState } from "react";

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
    name: "Searching...",
    loading: true,
    error: null,
  });

  useEffect(() => {
    let subscription: Location.LocationSubscription | null = null;

    async function startLocationTracking() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setState({
            coords: null,
            name: "Permission to access location was denied",
            loading: false,
            error: "Permission to access location was denied",
          });
          return;
        }
        // Start watching the location instead of getting it once
        subscription = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            // trigger an update whenever the user moves (value) meters
            // adjust it if u want lol
            distanceInterval: 15,
          },
          async (userLoc) => {
            const currentCoords = {
              latitude: userLoc.coords.latitude,
              longitude: userLoc.coords.longitude,
            };

            let name = "Active Location";
            // Try to reverse geocode the updated coordinates
            try {
              const geocode = await Location.reverseGeocodeAsync(currentCoords);
              if (geocode && geocode.length > 0) {
                const addr = geocode[0];
                name =
                  addr.street ||
                  addr.name ||
                  addr.district ||
                  addr.city ||
                  addr.subregion ||
                  "Active Location";
              }
            } catch (e) {
              console.warn("Failed to reverse geocode location:", e);
            }
            // Update state dynamically with the new location data
            setState({
              coords: currentCoords,
              name,
              loading: false,
              error: null,
            });
          },
        );
      } catch (err: any) {
        setState({
          coords: null,
          name: "Jakarta",
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

  // old logic
  // useEffect(() => {
  //   async function getLocation() {
  //     try {
  //       const { status } = await Location.requestForegroundPermissionsAsync();
  //       if (status !== "granted") {
  //         setState({
  //           coords: null,
  //           name: "Akses Lokasi Ditolak",
  //           loading: false,
  //           error: "Permission to access location was denied",
  //         });
  //         return;
  //       }

  //       let userLoc = null;
  //       try {
  //         userLoc = await Location.getCurrentPositionAsync({
  //           accuracy: Location.Accuracy.Balanced,
  //         });
  //       } catch (e) {
  //         console.warn(
  //           "Failed to get current position, trying last known position:",
  //           e,
  //         );
  //         try {
  //           userLoc = await Location.getLastKnownPositionAsync();
  //         } catch (e2) {
  //           console.warn("Failed to get last known position:", e2);
  //         }
  //       }

  //       let coords;
  //       let name = "Jakarta"; // General fallback location

  //       if (userLoc) {
  //         coords = {
  //           latitude: userLoc.coords.latitude,
  //           longitude: userLoc.coords.longitude,
  //         };

  //         // Try to reverse geocode
  //         try {
  //           const geocode = await Location.reverseGeocodeAsync(coords);
  //           if (geocode && geocode.length > 0) {
  //             const addr = geocode[0];
  //             name =
  //               addr.street ||
  //               addr.name ||
  //               addr.district ||
  //               addr.city ||
  //               addr.subregion ||
  //               "Lokasi Aktif";
  //           }
  //         } catch (e) {
  //           console.warn("Failed to reverse geocode location:", e);
  //           name = "Lokasi Aktif";
  //         }
  //       } else {
  //         // If location is completely unavailable, fall back to Jakarta name but keep coords null
  //         coords = null;
  //         name = "Jakarta";
  //       }

  //       setState({
  //         coords,
  //         name,
  //         loading: false,
  //         error: null,
  //       });
  //     } catch (err: any) {
  //       // Safe catch-all fallback
  //       setState({
  //         coords: null,
  //         name: "Jakarta",
  //         loading: false,
  //         error: err.message || "Failed to get location",
  //       });
  //     }
  //   }

  //   getLocation();
  // }, []);

  return state;
}
