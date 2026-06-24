export type SpotProps = {
  imageUrl: string;
  title: string;
  rating: number;
  distance: string;
  tags: { name: string; count: number }[];
  description: string;
  onPress?: () => void;
};

export type NearbyLocations = {
  id: string;
  name: string;
  address: string;
  description: string;
  distance_m: number;
  avg_rating: number;
  rating_count: number;
  cover_image: string;
  tags: {
    name: string;
    count: number;
  }[];
};
