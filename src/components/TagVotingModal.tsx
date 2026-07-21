import { colours } from "@/constants/style";
import { getAllTags } from "@/lib/tags";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Check, CheckCircle2 } from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
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
  voted: boolean;
};

type TagVotingModalProps = {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
};

export default function TagVotingModal({
  modalVisible,
  setModalVisible,
}: TagVotingModalProps) {

  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: tagsData, isLoading } = useQuery({
    queryKey: ["locationTags", id],
    queryFn: async () => {
      const { data: tags, error: tagsError } = await getAllTags()

      //TODO: make adding tags require login
      //TODO (optional): add tag colors in supabasez

      //const { data: votes, error: votesError } = await getUserTagVotesForLocation(id)

      if (tagsError) throw tagsError;
      //if (votesError) throw votesError;

      //const votedTagIds = new Set(votes.map(v => v.tag_id));

      return tags.map(tag => ({
        id: tag.id,
        label: tag.tag,
        voted: false,
      }));
    },
  });

  const [tags, setTags] = useState<Tag[]>([]);

  useEffect(() => {
    if (tagsData) {
      setTags(tagsData);
    }
  }, [tagsData]);

  const votedCount = useMemo(() => tags.filter((t) => t.voted).length, [tags]);

  const toggleVote = (id: string) => {
    setTags((prev) =>
      prev.map((tag) =>
        tag.id === id
          ? { ...tag, voted: !tag.voted }
          : tag
      )
    );
  };

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
              {tags.map((tag) => (
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