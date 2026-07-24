import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  View,
  type ViewStyle,
} from "react-native";

type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  /** Max height of the sheet as a percentage string or number of px. Default "85%". */
  maxHeight?: ViewStyle["maxHeight"];
  /** Whether tapping the backdrop closes the modal. Default true. */
  closeOnBackdropPress?: boolean;
  /** Duration (ms) for the open animation. Default 300. */
  openDuration?: number;
  /** Duration (ms) for the close animation. Default 250. */
  closeDuration?: number;
  /** Extra styles applied to the sheet container. */
  contentStyle?: ViewStyle;
};

/** Methods children can call via a ref to trigger the animated close. */
export type ModalHandle = {
  close: () => void;
};

const SCREEN_HEIGHT = Dimensions.get("window").height;

const ModalComponent = forwardRef<ModalHandle, ModalProps>(
  function UniversalModal(
    {
      visible,
      onClose,
      children,
      maxHeight = "85%",
      closeOnBackdropPress = true,
      openDuration = 300,
      closeDuration = 200,
      contentStyle
    },
    ref
  ) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: openDuration,
          useNativeDriver: true,
        }),
        Animated.timing(sheetTranslateY, {
          toValue: 0,
          duration: openDuration,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, backdropOpacity, sheetTranslateY, openDuration]);

  // Animates out, then hands control back to the parent to actually unmount
  const handleClose = () => {
    Animated.parallel([
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: closeDuration,
        useNativeDriver: true,
      }),
      Animated.timing(sheetTranslateY, {
        toValue: SCREEN_HEIGHT,
        duration: closeDuration,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  // Lets any child content (e.g. a "View Details" button) trigger the same
  // animated close instead of calling onClose directly and skipping it.
  useImperativeHandle(ref, () => ({
    close: handleClose,
  }));

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      {/* Backdrop */}
      <Pressable
        style={styles.backdropTouchable}
        onPress={closeOnBackdropPress ? handleClose : undefined}
      >
        <Animated.View
          style={[styles.backdrop, { opacity: backdropOpacity }]}
        />
      </Pressable>

      {/* Sheet */}
      <Animated.View
        style={[
          styles.sheetWrapper,
          { transform: [{ translateY: sheetTranslateY }] },
        ]}
        pointerEvents="box-none"
      >
        <View
          style={[styles.modalContent, { maxHeight }, contentStyle]}
        >
          <View style={styles.dragHandleContainer}>
            <View style={styles.dragHandle} />
          </View>

          {children}
        </View>
      </Animated.View>
    </Modal>
  );
  }
);

export default ModalComponent;

const styles = StyleSheet.create({
  backdropTouchable: {
    ...StyleSheet.absoluteFill,
    zIndex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  sheetWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    zIndex: 2,
  },
  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
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
});