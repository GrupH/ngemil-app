import { colours } from "@/constants/style";
import type { MenuItem } from "@/types/types";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";

type TopMenusSectionProps = {
  menuItems: MenuItem[];
};

export default function TopMenusSection({ menuItems }: TopMenusSectionProps) {
  if (!menuItems || menuItems.length === 0) return null;

  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.sectionHeading}>TOP MENUS</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.menuScrollView}
        contentContainerStyle={styles.menuContent}
      >
        {menuItems.map((item) => (
          <View key={item.id} style={styles.menuCard}>
            <View style={styles.menuImageContainer}>
              <Image source={{ uri: item.imageUrl }} style={styles.menuImage} />
            </View>
            <View style={styles.menuInfo}>
              <Text style={styles.menuName} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.menuPrice}>{item.price}</Text>
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
    color: colours.heading,
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
    backgroundColor: "#F9F9F6",
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#EDF0FE",
  },
  menuImageContainer: {
    width: "100%",
    height: 90,
    backgroundColor: "#EDF0FE",
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
    color: colours.text_primary,
    lineHeight: 16,
    height: 32,
  },
  menuPrice: {
    fontSize: 11,
    fontWeight: "600",
    color: "#949FF1",
  },
});
