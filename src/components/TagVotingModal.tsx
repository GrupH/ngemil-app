import { colours } from "@/constants/style";
import { getAllTags, getUserTagVotesForLocation, unvoteTag, voteTag } from "@/lib/tags";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { Check, CheckCircle2 } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import ModalComponent, { type ModalHandle } from "./ModalComponent";
import TagVotingSkeleton from "./Skeleton/TagVotingSkeleton";

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
  const modalRef = useRef<ModalHandle>(null);

  const queryClient = useQueryClient();
  const { id } = useLocalSearchParams<{ id: string }>();

  const { data: allTags, isLoading} = useQuery({
    queryKey: ["allTags"],
    queryFn: async () => {
      const { data: tags, error: tagsError } = await getAllTags()

      if (tagsError) throw tagsError;

      return tags;
    }
  })

  const { data: tagsData, isLoading: locationTagsLoading } = useQuery({
    queryKey: ["locationTags", id],
    queryFn: async () => {

      if(!allTags) return []
      

      //TODO (optional): add tag colors in supabase

      const { data: votes, error: votesError } = await getUserTagVotesForLocation(id)

      if (votesError) throw votesError;

      const votedTagIds = new Set(votes.map((v) => v.tag_id));

      return allTags.map(tag => ({
        id: tag.id,
        label: tag.tag,
        voted: votedTagIds.has(tag.id),
      }));
    },
  });

  const [tags, setTags] = useState<Tag[]>([]);
  const [initialVotedIds, setInitialVotedIds] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (tagsData) {
      setTags(tagsData);
      setInitialVotedIds(new Set(tagsData.filter((t) => t.voted).map((t) => t.id)));
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

  const voteDiff = useMemo(() => {
    const currentVotedIds = new Set(tags.filter((t) => t.voted).map((t) => t.id));
    const toAdd = [...currentVotedIds].filter((tagId) => !initialVotedIds.has(tagId));
    const toRemove = [...initialVotedIds].filter((tagId) => !currentVotedIds.has(tagId));
      return { toAdd, toRemove };
  }, [tags, initialVotedIds]);

  const hasChanges = voteDiff.toAdd.length > 0 || voteDiff.toRemove.length > 0;

  const handleSubmitVotes = async () => {
    if (!id || isSubmitting) return;

    const { toAdd, toRemove } = voteDiff;

    if (toAdd.length === 0 && toRemove.length === 0) {
      modalRef.current?.close();
      return;
    }

    setIsSubmitting(true);
    try {
      const results = await Promise.all([
        ...toAdd.map((tagId) => voteTag(id, tagId)),
        ...toRemove.map((tagId) => unvoteTag(id, tagId)),
      ]);

      const failed = results.find((r) => r.error);
      if (failed) throw failed.error;

      queryClient.invalidateQueries({ queryKey: ["locationTags", id] });
      queryClient.invalidateQueries({ queryKey: ["locationById", id] });
      modalRef.current?.close();
    } catch (err) {
      console.error("Failed to submit tag votes:", err);
      //TODO: toast for success
    } finally {
      setIsSubmitting(false);
    }
  };

  if(isLoading || locationTagsLoading) return <TagVotingSkeleton modalVisible={modalVisible} setModalVisible={setModalVisible}/>

  return (
    <ModalComponent
      ref={modalRef}
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
    >
      {/* Main info section (not scrollable) */}
      <View style={styles.infoContainer}>
        {/* Title */}
        <Text style={styles.placeTitle}>Vote for Tags</Text>

        {/* Subtitle / helper row */}
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <CheckCircle2 color={colours.accent_1} size={16} />
            <Text style={styles.infoTextBold}>{votedCount} selected</Text>
          </View>
          <Text style={styles.infoTextMuted}>
            Tap a tag to vote for how well it fits this spot
          </Text>
        </View>
      </View>

      {/* Scrollable tag list, wrapped in a View rather than being a direct
          child of the modal's content Pressable */}
      <View style={styles.scrollWrapper}>
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
      </View>

      {/* Footer action */}
      <View style={styles.footer}>
        <Pressable
          style={[styles.detailButton, (!hasChanges || isSubmitting) && styles.buttonDisabled]}
          onPress={handleSubmitVotes}
          disabled={!hasChanges || isSubmitting}
        >
          <Text style={[styles.detailButtonText, (!hasChanges || isSubmitting) && styles.buttonDisabledText]}>
            {isSubmitting ? "Submitting..." : "Submit Votes"}
          </Text>
        </Pressable>
      </View>
    </ModalComponent>
  );
}

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