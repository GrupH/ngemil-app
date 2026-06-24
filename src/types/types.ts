export type SpotProps = {
  imageUrl: string;
  title: string;
  rating: number;
  distance: string;
  tags: {name: string, count: number}[];
  description: string;
  onPress?: () => void;
};