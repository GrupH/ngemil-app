import { useAuth } from "@/hooks/auth";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export default function RootLayout() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    router.replace("/");

    if (!user) {
      router.replace("/auth");
    } else if (user) {
      router.replace("/");
    }
  }, [user, loading, router]);

  return <Stack screenOptions={{ headerShown: false }}></Stack>;
}
