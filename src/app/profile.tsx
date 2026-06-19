import BackButton from "@/components/BackButton";
import { colours } from "@/constants/style";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.page}>
      <View style={styles.container}>
        <View style={styles.topSection}>
          <BackButton onPress={handleBack} />
          <View style={styles.content}>
            <Text style={styles.title}>Akun Saya</Text>
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignOut}>
          <Text style={styles.buttonText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colours.primary_bg,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  topSection: {
    gap: 24,
  },
  content: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: colours.heading,
  },
  email: {
    fontSize: 18,
    color: colours.text_primary,
  },
  button: {
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 1,
    borderColor: colours.border_1,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },
  signOutPressed: {
    opacity: 0.9,
    backgroundColor: "#FFF5F4",
  },
  versionText: {
    textAlign: "center",
    fontSize: 11,
    color: colours.text_secondary,
    marginTop: 8,
  },
});
