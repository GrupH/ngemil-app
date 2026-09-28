import { LocationProvider } from "@/context/LocationContext";
import { NearbyLocationProvider } from "@/context/NearbyLocationContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <LocationProvider>
          <NearbyLocationProvider>
            <Stack screenOptions={{ headerShown: false }}></Stack>
          </NearbyLocationProvider>
        </LocationProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
