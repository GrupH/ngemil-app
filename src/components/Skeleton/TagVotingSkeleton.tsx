import { colours } from "@/constants/style";
import { forwardRef } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import ModalComponent, { type ModalHandle } from "../ModalComponent";
import Bone from "./Bone";

const CHIP_WIDTHS = [70, 55, 90, 65, 50, 80, 60, 75];

type TagVotingModalSkeletonProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

const TagVotingSkeleton = forwardRef<
  ModalHandle,
  TagVotingModalSkeletonProps
>(({ modalVisible, setModalVisible }, ref) => {
  return (
    <ModalComponent
      ref={ref}
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
    >
      <View style={styles.infoContainer}>
        <Bone width={160} height={22} borderRadius={4} />
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Bone width={16} height={16} borderRadius={8} />
            <Bone width={90} height={14} borderRadius={4} />
          </View>
          <Bone width="80%" height={13} borderRadius={4} />
        </View>
      </View>
      <View style={styles.scrollWrapper}>
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEnabled={false}
        >
          <View style={styles.chipWrap}>
            {CHIP_WIDTHS.map((w, i) => (
              <Bone key={i} width={w} height={32} borderRadius={20} />
            ))}
          </View>
        </ScrollView>
      </View>
      <View style={styles.footer}>
        <Bone width="100%" height={48} borderRadius={12} />
      </View>
    </ModalComponent>
  );
});

TagVotingSkeleton.displayName = "TagVotingSkeleton";

export default TagVotingSkeleton;

const styles = StyleSheet.create({
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginTop: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  infoRow: {
    marginTop: 10,
    marginBottom: 4,
    gap: 6,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  scrollWrapper: {
    flexShrink: 1,
  },
  scrollArea: {
    marginTop: 4,
  },
  scrollContent: {
    paddingVertical: 20,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
});