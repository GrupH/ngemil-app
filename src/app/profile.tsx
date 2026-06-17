import { colours } from "@/constants/style";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/lib/supabase";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function ProfilePage() {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.email}>{user?.email}</Text>

      <TouchableOpacity style={styles.button} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colours.primary_bg,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  email: {
    fontSize: 20,
    color: colours.text_secondary,
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
});
