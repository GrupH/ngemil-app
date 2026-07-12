import { colours } from "@/constants/style";
import { Check, CheckCircle2 } from "lucide-react-native";
import { useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

type Tag = {
  id: string;
  label: string;
  votes: number;
  voted: boolean;
};

const INITIAL_TAGS: Tag[] = [
  { id: "cozy", label: "Cozy", votes: 24, voted: false },
  { id: "good_for_groups", label: "Good for Groups", votes: 18, voted: true },
  { id: "quiet", label: "Quiet", votes: 12, voted: false },
  { id: "instagrammable", label: "Instagrammable", votes: 31, voted: false },
  { id: "pet_friendly", label: "Pet Friendly", votes: 9, voted: false },
  { id: "late_night", label: "Late Night", votes: 15, voted: false },
  { id: "budget_friendly", label: "Budget Friendly", votes: 22, voted: true },
  { id: "outdoor_seating", label: "Outdoor Seating", votes: 27, voted: false },
  { id: "live_music", label: "Live Music", votes: 6, voted: false },
  { id: "family_friendly", label: "Family Friendly", votes: 11, voted: false },
];

type TagVotingModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function TagVotingModal({
  modalVisible,
  setModalVisible,
}: TagVotingModalProps) {
  const [tags, setTags] = useState<Tag[]>(INITIAL_TAGS);

  const votedCount = useMemo(() => tags.filter((t) => t.voted).length, [tags]);

  const toggleVote = (id: string) => {
    setTags((prev) =>
      prev.map((tag) =>
        tag.id === id
          ? { ...tag, voted: !tag.voted, votes: tag.voted ? tag.votes - 1 : tag.votes + 1 }
          : tag
      )
    );
  };

  const sortedTags = useMemo(
    () => [...tags].sort((a, b) => b.votes - a.votes),
    [tags]
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      {/* The invisible backdrop to close the modal on tap */}
      <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)}>
        {/* The modal content container */}
        <Pressable
          style={styles.modalContent}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Main info section (not scrollable) */}
          <View style={styles.infoContainer}>
            {/* Drag handle */}
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View>

            {/* Title */}
            <Text style={styles.placeTitle}>Vote for Tags</Text>

            {/* Subtitle / helper row */}
            <View style={styles.infoRow}>
              <View style={styles.infoItem}>
                <CheckCircle2 color={colours.accent_1} size={16}/>
                <Text style={styles.infoTextBold}>{votedCount} selected</Text>
              </View>
              <Text style={styles.infoTextMuted}>
                Tap a tag to vote for how well it fits this spot
              </Text>
            </View>
          </View>

          {/* Scrollable tag list */}
          <ScrollView
            style={styles.scrollArea}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.chipWrap}>
              {sortedTags.map((tag) => (
                <Pressable
                  key={tag.id}
                  style={({ pressed }) => [
                    styles.chip,
                    tag.voted && styles.chipSelected,
                    pressed && styles.chipPressed,
                  ]}
                  onPress={() => toggleVote(tag.id)}
                >
                  {tag.voted && (
                    <Check
                      color={colours.secondary_bg}
                      size={14}
                      style={styles.chipCheckIcon}
                    />
                  )}
                  <Text
                    style={[
                      styles.chipText,
                      tag.voted && styles.chipTextSelected,
                    ]}
                  >
                    {tag.label}
                  </Text>
                  <View
                    style={[
                      styles.countBadge,
                      tag.voted && styles.countBadgeSelected,
                    ]}
                  >
                    <Text
                      style={[
                        styles.countText,
                        tag.voted && styles.countTextSelected,
                      ]}
                    >
                      {tag.votes}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </ScrollView>

          {/* Footer action */}
          <View style={styles.footer}>
            <Pressable
              style={[styles.detailButton, votedCount === 0 && styles.buttonDisabled]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={[styles.detailButtonText, votedCount === 0 && styles.buttonDisabledText]}>
                Submit Votes
              </Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    maxHeight: "85%",
    width: "100%",
    paddingHorizontal: 24,
    paddingBottom: 34,
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
    backgroundColor: "#E5E5E5",
  },
  infoContainer: {
    borderBottomWidth: 1,
    borderBottomColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    marginTop: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  placeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: colours.text_primary,
    fontFamily: "System",
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
  infoTextBold: {
    fontSize: 14,
    fontWeight: "700",
    color: colours.text_primary,
  },
  infoTextMuted: {
    fontSize: 13,
    fontWeight: "500",
    color: colours.text_secondary,
    lineHeight: 18,
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
  chip: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: colours.border_1,
    backgroundColor: colours.primary_bg,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 14,
    gap: 6,
  },
  chipSelected: {
    borderColor: colours.accent_1,
    backgroundColor: colours.accent_1,
  },
  chipPressed: {
    opacity: 0.7,
  },
  chipCheckIcon: {
    marginRight: -2,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "600",
    color: colours.text_primary,
  },
  chipTextSelected: {
    color: colours.secondary_bg,
  },
  countBadge: {
    backgroundColor: colours.border_1,
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
    minWidth: 22,
    alignItems: "center",
  },
  countBadgeSelected: {
    backgroundColor: "rgba(255, 255, 255, 0.25)",
  },
  countText: {
    fontSize: 12,
    fontWeight: "700",
    color: colours.text_secondary,
  },
  countTextSelected: {
    color: colours.secondary_bg,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: colours.border_1,
    marginHorizontal: -24,
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  detailButton: {
    width: "100%",
    backgroundColor: colours.accent_1,
    borderRadius: 12,
    paddingVertical: 14,
  },
  detailButtonText: {
    color: colours.secondary_bg,
    width: "100%",
    fontWeight: "700",
    textAlign: "center",
    fontSize: 15,
  },
  buttonDisabled:{
    backgroundColor: colours.border_1
  },
  buttonDisabledText: {
    color: colours.border_2,
    opacity: 0.5
  }
});