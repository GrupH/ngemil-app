import { PlaceInfo, reverseGeocode, useLocation } from "@/hooks/useLocation";
import { CoordsType } from "@/types/types";
import { createContext, useContext, useState } from "react";

interface LocationContextType {
  coords: CoordsType | null;
  name: string;
  fullName: string;
  isLoading: boolean;
  selectCoords: (coords: CoordsType) => void;
  followUser: () => void;
  isManual: boolean;
}

const LocationContext = createContext<LocationContextType>({
  coords: null,
  name: "Active Location",
  fullName: "Active Location",
  isManual: false,
  isLoading: true,
  selectCoords: () => {},
  followUser: () => {},
});

function LocationProvider({ children }: { children: React.ReactNode }) {
  const [isManual, setManual] = useState<boolean>(false);
  const [manualCoords, setManualCoords] = useState<CoordsType | null>(null);
  const [manualInfo, setManualInfo] = useState<PlaceInfo | null>(null);

  const {
    coords: gps,
    loading,
    fullName: gpsFullName,
    name: gpsName,
  } = useLocation(!isManual);

  const selectCoords = async (coords: CoordsType) => {
    setManual(true);

    setManualCoords(coords);
    setManualCoords(coords);
    setManualInfo(null);

    const locResult = await reverseGeocode(coords);

    if (locResult) setManualInfo(locResult);
  };

  const followUser = () => {
    setManual(false);
    setManualCoords(null);
    setManualInfo(null);
  };

  const coords = isManual ? manualCoords : gps;
  const name = isManual ? (manualInfo?.name ?? "Selected Location") : gpsName;
  const fullName = isManual
    ? (manualInfo?.fullName ?? "Selected Location")
    : gpsFullName;
  const isLoading = isManual ? manualInfo === null : loading;

  return (
    <LocationContext.Provider
      value={{
        coords,
        name,
        fullName,
        isLoading,
        selectCoords,
        followUser,
        isManual,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

function useLocationContext() {
  const context = useContext(LocationContext);
  if (!context) throw new Error("Context is used outside of provider");
  return context;
}

export { LocationProvider, useLocationContext };
