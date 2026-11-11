import { colours } from "@/constants/style";
import { ScrollView, StyleSheet, View } from "react-native";
import Bone, { SHIMMER_BASE } from "./Bone";

// ─── Shared section skeletons ──────────────────────────────────────────────────

const CarouselSkeleton = () => (
  <View style={styles.carouselRow}>
    <Bone width="72%" height={180} borderRadius={12} />
    <Bone width="24%" height={180} borderRadius={12} />
  </View>
);

const InfoRowSkeleton = () => (
  <View style={styles.infoRow}>
    <View style={styles.row}>
      <Bone width={16} height={16} borderRadius={8} />
      <Bone width={36} height={14} borderRadius={4} />
      <Bone width={72} height={14} borderRadius={4} />
    </View>
    <View style={styles.row}>
      <Bone width={16} height={16} borderRadius={8} />
      <Bone width={48} height={14} borderRadius={4} />
    </View>
  </View>
);

const DescriptionSkeleton = () => (
  <View style={styles.descriptionBlock}>
    <Bone width="100%" height={13} borderRadius={4} />
    <Bone width="88%" height={13} borderRadius={4} />
    <Bone width="65%" height={13} borderRadius={4} />
  </View>
);

const TagsSkeleton = () => (
  <View style={styles.sectionBlock}>
    <Bone width={60} height={13} borderRadius={4} />
    <View style={styles.row}>
      <Bone width={72} height={28} borderRadius={100} />
      <Bone width={60} height={28} borderRadius={100} />
      <Bone width={80} height={28} borderRadius={100} />
    </View>
  </View>
);

const MenuItemSkeleton = () => (
  <View style={styles.menuItem}>
    <Bone width={80} height={80} borderRadius={10} />
    <View style={styles.menuText}>
      <Bone width="75%" height={13} borderRadius={4} />
      <Bone width="45%" height={12} borderRadius={4} />
    </View>
  </View>
);

const TopMenusSkeleton = () => (
  <View style={styles.sectionBlock}>
    <Bone width={90} height={13} borderRadius={4} />
    <View style={styles.menuList}>
      <MenuItemSkeleton />
      <MenuItemSkeleton />
      <MenuItemSkeleton />
    </View>
  </View>
);

const ReviewSkeleton = () => (
  <View style={styles.reviewItem}>
    <View style={styles.row}>
      <Bone width={36} height={36} borderRadius={18} />
      <View style={styles.reviewMeta}>
        <Bone width={100} height={13} borderRadius={4} />
        <View style={styles.row}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Bone key={i} width={12} height={12} borderRadius={3} />
          ))}
        </View>
      </View>
    </View>
    <Bone width="95%" height={12} borderRadius={4} style={{ marginTop: 8 }} />
    <Bone width="80%" height={12} borderRadius={4} style={{ marginTop: 4 }} />
  </View>
);

const ReviewsSkeleton = () => (
  <View style={styles.sectionBlock}>
    <Bone width={72} height={13} borderRadius={4} />
    <ReviewSkeleton />
    <ReviewSkeleton />
  </View>
);

// ─── Variant: modal ────────────────────────────────────────────────────────────
//
// Fixed header (drag handle + title + info row + carousel + description)
// sits above the ScrollView, mirroring PlaceDetailModal's infoContainer.

const ModalSkeleton = () => (
  <>
    {/* Fixed info section */}
    <View style={styles.modalInfoContainer}>
      <View style={styles.dragHandleContainer}>
        <View style={styles.dragHandle} />
      </View>
      <Bone width="60%" height={22} borderRadius={5} />
      <InfoRowSkeleton />
      <CarouselSkeleton />
      <DescriptionSkeleton />
    </View>

    {/* Scrollable sections */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.modalScrollContent}
    >
      <TagsSkeleton />
      <TopMenusSkeleton />
      <ReviewsSkeleton />
      {/* "View Full Details" button */}
      <Bone width="100%" height={44} borderRadius={12} />
    </ScrollView>
  </>
);

// ─── Variant: page ─────────────────────────────────────────────────────────────
//
// Fixed header row (back button + title) sits outside the ScrollView.
// Everything else — carousel, info row, description, sections — scrolls,
// matching the page's single ScrollView layout.

const PageSkeleton = () => (
  <>
    {/* Fixed page header */}
    <View style={styles.pageHeader}>
      <Bone width={36} height={36} borderRadius={10} />
      <Bone width="55%" height={22} borderRadius={5} />
    </View>

    {/* Single scrollable body */}
    <ScrollView
      showsVerticalScrollIndicator={false}
      scrollEnabled={false}
      contentContainerStyle={styles.pageScrollContent}
    >
      <CarouselSkeleton />
      <InfoRowSkeleton />
      <DescriptionSkeleton />
      <TagsSkeleton />
      <TopMenusSkeleton />
      <ReviewsSkeleton />
    </ScrollView>
  </>
);

// ─── Unified export ────────────────────────────────────────────────────────────

type PlaceDetailSkeletonProps = {
  variant: "modal" | "page";
};

/**
 * Skeleton for both PlaceDetailModal and the place-detail page.
 *
 * Modal — drop inside the modalContent Pressable:
 *   <PlaceDetailSkeleton variant="modal" />
 *
 * Page — drop inside the outer View (same level as the real Pressable content):
 *   <PlaceDetailSkeleton variant="page" />
 */
const PlaceDetailSkeleton = ({ variant }: PlaceDetailSkeletonProps) =>
  variant === "modal" ? <ModalSkeleton /> : <PageSkeleton />;

export default PlaceDetailSkeleton;

const styles = StyleSheet.create({
  // ── Modal-specific ──
  modalInfoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginTop: 16,
    paddingTop: 16,
  },
  dragHandleContainer: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 14,
  },
  dragHandle: {
    width: 48,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: SHIMMER_BASE,
  },
  modalScrollContent: {
    paddingVertical: 24,
  },

  // ── Page-specific ──
  pageHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    padding: 24,
  },
  pageScrollContent: {
    padding: 24,
  },

  // ── Shared section layout ──
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  carouselRow: {
    flexDirection: "row",
    gap: 8,
    overflow: "hidden",
  },
  descriptionBlock: {
    gap: 6,
    marginTop: 16,
    marginBottom: 24,
  },
  sectionBlock: {
    gap: 12,
    marginBottom: 28,
  },
  menuList: {
    gap: 12,
  },
  menuItem: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  menuText: {
    flex: 1,
    gap: 8,
  },
  reviewItem: {
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: SHIMMER_BASE,
  },
  reviewMeta: {
    flex: 1,
    gap: 6,
  },
  row: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
});
