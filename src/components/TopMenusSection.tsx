import { useTheme } from "@/context/ThemeContext";
import type { MenuItem } from "@/types/types";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

type TopMenusSectionProps = {
  menuItems: MenuItem[];
};

export default function TopMenusSection({ menuItems }: TopMenusSectionProps) {
  const { colours } = useTheme();

  if (!menuItems || menuItems.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionHeading, { color: colours.heading }]}>TOP MENUS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.menuScrollView}
        contentContainerStyle={styles.menuContent}
      >
        {menuItems.map((item) => (
          <View
            key={item.id}
            style={[
              styles.menuCard,
              {
                backgroundColor: colours.card_bg,
                borderColor: colours.border_1,
              },
            ]}
          >
            <View
              style={[
                styles.menuImageContainer,
                { backgroundColor: colours.border_1 },
              ]}
            >
              <Image source={{ uri: item.imageUrl }} style={styles.menuImage} />
            </View>
            <View style={styles.menuInfo}>
              <Text
                style={[styles.menuName, { color: colours.text_primary }]}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              <Text style={[styles.menuPrice, { color: colours.accent_1 }]}>
                {item.price}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuScrollView: {
    marginHorizontal: -24,
  },
  menuContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  menuCard: {
    width: 130,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
  },
  menuImageContainer: {
    width: "100%",
    height: 90,
  },
  menuImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  menuInfo: {
    padding: 10,
    gap: 4,
  },
  menuName: {
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    height: 32,
  },
  menuPrice: {
    fontSize: 11,
    fontWeight: "600",
  },
});
