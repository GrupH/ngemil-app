import BackButton from "@/components/BackButton";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/hooks/auth";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import {
  Bell,
  Globe,
  Mail,
  Moon,
  ShieldCheck,
  Sun,
  User as UserIcon,
} from "lucide-react-native";
import { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const DEFAULT_AVATAR =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";

export default function ProfilePage() {
  const { user } = useAuth();
  const router = useRouter();
  const { colours, isDarkMode, toggleTheme } = useTheme();

  // Preferences UI state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState<"id" | "en">("id");

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  const username =
    user?.user_metadata?.username || user?.email?.split("@")[0] || "SnackExplorer";
  const email = user?.email || "user@ngemil.app";
  const avatarUrl = user?.user_metadata?.avatar_url || DEFAULT_AVATAR;

  return (
    <SafeAreaView style={[styles.page, { backgroundColor: colours.primary_bg }]}>
      <View style={styles.header}>
        <BackButton onPress={() => router.back()} type="Back" />
        <Text style={[styles.headerTitle, { color: colours.heading }]}>Akun Saya</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Card */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: colours.card_bg,
              borderColor: colours.border_1,
            },
          ]}
        >
          <View style={styles.avatarWrapper}>
            <Image
              source={{ uri: avatarUrl }}
              style={[styles.avatar, { borderColor: colours.accent_1 }]}
            />
          </View>

          <View style={styles.profileMeta}>
            <Text style={[styles.profileName, { color: colours.text_primary }]}>
              {username}
            </Text>

            <View style={styles.emailBadgeRow}>
              <Mail color={colours.text_secondary} size={14} />
              <Text style={[styles.profileEmail, { color: colours.text_secondary }]}>
                {email}
              </Text>
            </View>

            <View style={[styles.statusBadge, { backgroundColor: colours.border_1 }]}>
              <ShieldCheck color={colours.accent_1} size={13} />
              <Text style={[styles.statusText, { color: colours.accent_1 }]}>
                {user ? "Pengguna Terverifikasi" : "Guest Mode"}
              </Text>
            </View>
          </View>
        </View>

        {/* SECTION: PREFERENCES */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionHeader, { color: colours.heading }]}>
            PREFERENSI
          </Text>

          <View
            style={[
              styles.cardGroup,
              {
                backgroundColor: colours.card_bg,
                borderColor: colours.border_1,
              },
            ]}
          >
            {/* Dark Mode Preference */}
            <View style={styles.cardItemRow}>
              <View style={styles.itemLeft}>
                {isDarkMode ? (
                  <Moon color={colours.accent_1} size={22} />
                ) : (
                  <Sun color={colours.accent_1} size={22} />
                )}
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemTitle, { color: colours.text_primary }]}>
                    Mode Gelap (Dark Mode)
                  </Text>
                  <Text style={[styles.itemSub, { color: colours.text_secondary }]}>
                    {isDarkMode ? "Aktif (Tampilan Gelap)" : "Non-aktif (Tampilan Terang)"}
                  </Text>
                </View>
              </View>
              <Switch
                value={isDarkMode}
                onValueChange={(val) => toggleTheme(val)}
                trackColor={{ false: colours.border_1, true: colours.accent_1 }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colours.border_1 }]} />

            {/* Notifications Switch */}
            <View style={styles.cardItemRow}>
              <View style={styles.itemLeft}>
                <Bell color={colours.accent_1} size={22} />
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemTitle, { color: colours.text_primary }]}>
                    Notifikasi Rekomendasi
                  </Text>
                  <Text style={[styles.itemSub, { color: colours.text_secondary }]}>
                    Rekomendasi tempat ngemil terdekat
                  </Text>
                </View>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: colours.border_1, true: colours.accent_1 }}
                thumbColor="#FFFFFF"
              />
            </View>

            <View style={[styles.divider, { backgroundColor: colours.border_1 }]} />

            {/* Language Selector */}
            <View style={styles.cardItemRow}>
              <View style={styles.itemLeft}>
                <Globe color={colours.accent_1} size={22} />
                <View style={styles.itemTextContainer}>
                  <Text style={[styles.itemTitle, { color: colours.text_primary }]}>
                    Bahasa / Language
                  </Text>
                  <Text style={[styles.itemSub, { color: colours.text_secondary }]}>
                    {selectedLanguage === "id" ? "Bahasa Indonesia" : "English"}
                  </Text>
                </View>
              </View>
              <View style={styles.languagePills}>
                <TouchableOpacity
                  style={[
                    styles.langPill,
                    {
                      borderColor:
                        selectedLanguage === "id"
                          ? colours.accent_1
                          : colours.border_1,
                      backgroundColor:
                        selectedLanguage === "id"
                          ? colours.accent_1
                          : "transparent",
                    },
                  ]}
                  onPress={() => setSelectedLanguage("id")}
                >
                  <Text
                    style={[
                      styles.langText,
                      {
                        color:
                          selectedLanguage === "id"
                            ? "#FFF"
                            : colours.text_secondary,
                      },
                    ]}
                  >
                    ID
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.langPill,
                    {
                      borderColor:
                        selectedLanguage === "en"
                          ? colours.accent_1
                          : colours.border_1,
                      backgroundColor:
                        selectedLanguage === "en"
                          ? colours.accent_1
                          : "transparent",
                    },
                  ]}
                  onPress={() => setSelectedLanguage("en")}
                >
                  <Text
                    style={[
                      styles.langText,
                      {
                        color:
                          selectedLanguage === "en"
                            ? "#FFF"
                            : colours.text_secondary,
                      },
                    ]}
                  >
                    EN
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* SIGN OUT / LOGIN BUTTON */}
        <View style={styles.bottomSection}>
          {user ? (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colours.accent_1, borderColor: colours.border_1 },
              ]}
              onPress={handleSignOut}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Sign Out</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: colours.accent_1, borderColor: colours.border_1 },
              ]}
              onPress={() => router.push("/auth")}
              activeOpacity={0.8}
            >
              <Text style={styles.actionButtonText}>Masuk / Daftar</Text>
            </TouchableOpacity>
          )}

          <Text style={[styles.versionText, { color: colours.text_secondary }]}>
            Ngemil App v1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  page: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    gap: 24,
  },
  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    borderWidth: 2,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  avatarWrapper: {
    position: "relative",
  },
  avatar: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
  },
  profileMeta: {
    flex: 1,
    gap: 4,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "800",
  },
  emailBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  profileEmail: {
    fontSize: 13,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    marginTop: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  sectionContainer: {
    gap: 12,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  cardGroup: {
    borderRadius: 12,
    borderWidth: 2,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 12,
    elevation: 3,
  },
  cardItemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: "700",
  },
  itemSub: {
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    width: "100%",
  },
  languagePills: {
    flexDirection: "row",
    gap: 6,
  },
  langPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 2,
  },
  langText: {
    fontSize: 12,
    fontWeight: "700",
  },
  bottomSection: {
    marginTop: 8,
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    borderWidth: 2,
  },
  actionButtonText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 15,
  },
  versionText: {
    textAlign: "center",
    fontSize: 12,
  },
});
