import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Animated,
  Dimensions,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  PanResponder,
  Platform,
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
  /** Wraps the sheet in a KeyboardAvoidingView, useful for forms with text inputs. Default false. */
  keyboardAvoiding?: boolean;
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
      closeDuration = 250,
      contentStyle,
      keyboardAvoiding = false,
    },
    ref
  ) {
  const backdropOpacity = useRef(new Animated.Value(0)).current;
  const sheetTranslateY = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  // KeyboardAvoidingView doesn't work on Android inside RN's <Modal>, because
  // the Modal renders in a separate native Dialog window that doesn't get
  // resize events the way the main Activity window does. So on Android we
  // track the keyboard ourselves and apply the offset manually.
  const [androidKeyboardHeight, setAndroidKeyboardHeight] = useState(0);

  useEffect(() => {
    if (Platform.OS !== "android" || !keyboardAvoiding) return;

    const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
      setAndroidKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setAndroidKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardAvoiding]);

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

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (_, gestureState) => gestureState.dy > 2,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          sheetTranslateY.setValue(gestureState.dy);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 100 || gestureState.vy > 0.5) {
          handleClose();
        } else {
          Animated.spring(sheetTranslateY, {
            toValue: 0,
            useNativeDriver: true,
            bounciness: 4,
          }).start();
        }
      },
    })
  ).current;

  // Lets any child content (e.g. a "View Details" button) trigger the same
  // animated close instead of calling onClose directly and skipping it.
  useImperativeHandle(ref, () => ({
    close: handleClose,
  }));

  const sheetContent = (
    <View
      style={[
        styles.modalContent,
        { maxHeight },
        Platform.OS === "android" && keyboardAvoiding
          ? { marginBottom: androidKeyboardHeight }
          : null,
        contentStyle,
      ]}
    >
      <View style={styles.dragHandleContainer} {...panResponder.panHandlers}>
        <View style={styles.dragHandle} />
      </View>

      {children}
    </View>
  );

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
        {keyboardAvoiding ? (
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            style={styles.keyboardWrap}
          >
            {sheetContent}
          </KeyboardAvoidingView>
        ) : (
          sheetContent
        )}
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
  keyboardWrap: {
    width: "100%",
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