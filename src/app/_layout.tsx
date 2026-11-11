import { NearbyLocationProvider } from "@/context/NearbyLocationContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";

export default function RootLayout() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NearbyLocationProvider>
        <Stack screenOptions={{ headerShown: false }}></Stack>
      </NearbyLocationProvider>
    </QueryClientProvider>
  );
}
