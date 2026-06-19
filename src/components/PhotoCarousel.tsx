import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";

type PhotoCarouselProps = {
  photos: string[];
};

export default function PhotoCarousel({ photos }: PhotoCarouselProps) {
  const { width: screenWidth } = useWindowDimensions();
  const photoWidth = photos.length === 1 ? screenWidth - 48 : screenWidth - 72;

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.carouselScrollView}
      contentContainerStyle={styles.carouselContent}
    >
      {photos.map((photo, index) => (
        <View
          key={index}
          style={[styles.carouselPhotoContainer, { width: photoWidth }]}
        >
          <Image source={{ uri: photo }} style={styles.photo} />
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  carouselScrollView: {
    marginHorizontal: -24,
    marginBottom: 24,
  },
  carouselContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  carouselPhotoContainer: {
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
  },
  photo: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});
