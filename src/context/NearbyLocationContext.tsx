import { useLocation } from "@/hooks/useLocation";
import { getNearbyLocations } from "@/lib/locations";
import { NearbyLocations, PlaceData } from "@/types/types";
import { useQuery } from "@tanstack/react-query";
import { createContext, useContext } from "react";

const NearbyLocationContext = createContext({
    nearbyLocations:[{
            id: "",
            imageUrl: "",
            title: "",
            rating: -1,
            distance: "0 km",
            tags: [],
            description: "",
            address: "",
            photos: [],
            reviews: [],
            menuItems: [],
        }],
    isLoading: false
})

function NearbyLocationProvider({children}: {children: React.ReactNode}){
    const { coords } = useLocation();
    
    function parseLocationData(location: NearbyLocations): PlaceData {
        const distanceKm =
        location.distance_m != null
        ? `${(location.distance_m / 1000).toFixed(1)} km`
        : "err";

        const tags = (location.tags ?? []).map((t: any) => ({
        name: t.name,
        count: t.count,
        }));

        return {
            id: location.id,
            imageUrl: location.cover_image ?? "",
            title: location.name,
            rating: location.avg_rating ?? -1,
            distance: distanceKm,
            tags,
            description: location.description,
            address: location.address,
            photos: [],
            reviews: [],
            menuItems: [],
        };
    }

    const { data: nearbyLocations = [], isLoading } = useQuery({
        queryKey: ["nearbyLocations", coords?.latitude, coords?.longitude],
        enabled: !!coords,
        queryFn: async () => {
        const { data, error } = await getNearbyLocations(
            coords!.latitude,
            coords!.longitude,
            50000, // TODO: decide max distance
        );

        if (error) throw error;

        return (data ?? []).map(parseLocationData);
        },
    });

    return(
        <NearbyLocationContext.Provider
            value={{
                nearbyLocations,
                isLoading
            }}>
            {children}
        </NearbyLocationContext.Provider>
    )
}

function useNearbyLocationContext() {
    const context = useContext(NearbyLocationContext);
    if (!context) throw new Error("Context is used outside of provider");
    return context;
}

export { NearbyLocationProvider, useNearbyLocationContext };
