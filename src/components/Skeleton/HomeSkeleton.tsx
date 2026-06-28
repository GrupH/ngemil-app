import { colours } from "@/constants/style";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Bone, { SHIMMER_BASE } from "./Bone";

const SectionLabelBone = () => (
  <Bone width={120} height={14} borderRadius={4} />
);

const SpotOfTheDaySkeleton = () => (
  <View style={skeletonStyles.sotdCard}>
    {/* Cover image area */}
    <Bone width="100%" height={180} borderRadius={12} />

    <View style={skeletonStyles.sotdContent}>
      {/* Title */}
      <Bone width="65%" height={16} borderRadius={4} />
      {/* Rating + distance row */}
      <View style={skeletonStyles.row}>
        <Bone width={60} height={12} borderRadius={4} />
        <Bone width={50} height={12} borderRadius={4} />
      </View>
      {/* Tags row */}
      <View style={skeletonStyles.row}>
        <Bone width={70} height={24} borderRadius={100} />
        <Bone width={55} height={24} borderRadius={100} />
        <Bone width={65} height={24} borderRadius={100} />
      </View>
      {/* Description lines */}
      <Bone width="90%" height={12} borderRadius={4} />
      <Bone width="75%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
    </View>
  </View>
);

const NearbyCardSkeleton = () => (
  <View style={skeletonStyles.nearbyCard}>
    <Bone width="100%" height={120} borderRadius={10} />
    <View style={skeletonStyles.nearbyContent}>
      <Bone width="80%" height={13} borderRadius={4} />
      <View style={skeletonStyles.row}>
        <Bone width={44} height={11} borderRadius={4} />
        <Bone width={38} height={11} borderRadius={4} />
      </View>
      {/* Tag pills */}
      <View style={skeletonStyles.row}>
        <Bone width={52} height={20} borderRadius={100} />
        <Bone width={44} height={20} borderRadius={100} />
      </View>
    </View>
  </View>
);

const HomeSkeleton = () => {
  return (
    <SafeAreaView style={skeletonStyles.page}>
      <ScrollView
        contentContainerStyle={skeletonStyles.scrollContainer}
        showsVerticalScrollIndicator={false}
        scrollEnabled={false} // Disable scroll while loading
      >
        {/* Header Row: location pill + profile button */}
        <View style={skeletonStyles.headerRow}>
          <Bone width={140} height={36} borderRadius={100} />
          <Bone width={40} height={40} borderRadius={100} />
        </View>

        {/* Map Card Preview */}
        <Bone
          width="100%"
          height={240}
          borderRadius={12}
          style={{ marginTop: 24 }}
        />

        {/* Search Bar */}
        <Bone
          width="100%"
          height={48}
          borderRadius={12}
          style={{ marginTop: 24 }}
        />

        {/* Spot of the Day */}
        <View style={skeletonStyles.section}>
          <SectionLabelBone />
          <SpotOfTheDaySkeleton />
        </View>

        {/* Nearby Grid */}
        <View style={skeletonStyles.section}>
          <SectionLabelBone />
          <View style={skeletonStyles.gridContainer}>
            {[0, 1, 2, 3].map((i) => (
              <View key={i} style={skeletonStyles.gridColumn}>
                <NearbyCardSkeleton />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeSkeleton;

const skeletonStyles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colours.primary_bg,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  section: {
    marginTop: 32,
    gap: 12,
  },
  // Spot of the Day
  sotdCard: {
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: colours.primary_bg,
    borderWidth: 2,
    borderColor: SHIMMER_BASE,
  },
  sotdContent: {
    padding: 14,
    gap: 10,
  },
  // Nearby
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 16,
  },
  gridColumn: {
    width: "47.5%",
  },
  nearbyCard: {
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: colours.primary_bg,
    borderWidth: 2,
    borderColor: SHIMMER_BASE,
  },
  nearbyContent: {
    padding: 10,
    gap: 8,
  },
  // Shared
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
