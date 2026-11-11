import { ImageOff } from "lucide-react-native";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export default function ImagePlaceholder({
  style,
  size,
}: {
  style?: StyleProp<ViewStyle>;
  size?: number;
}) {
  return (
    <View style={[styles.container, style]}>
      <ImageOff color="#bababa" size={size ? size : 40} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#dadada",
    justifyContent: "center",
    alignItems: "center",
  },
});
