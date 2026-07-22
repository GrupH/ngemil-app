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

export type Review = {
  id: string;
  user_id: string,
  username: string;
  rating: number;
  avatar: string;
  comment: string;
};

export type MenuItem = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
};

// LOCATION BY ID
export interface LocationImage {
  is_cover: boolean;
  storage_path: string;
}

export interface LocationRatingSummary {
  avg_rating: number;
  rating_count: number;
}

export interface LocationRating {
  id: string;
  user_id: string,
  rating: number;
  comment: string;
  created_at: string;
  profiles: {
    username: any;
    avatar_url: any;
  };
}

export interface LocationTagVoteSummary {
  tags: { tag: any };
  vote_count: any;
}

export type LocationByID = {
  id: string;
  user_id: string;
  name: string;
  description: string;
  address: string;
  submitted_by: string | null;

  location_images: LocationImage[];
  location_rating_summary: LocationRatingSummary[];
  location_ratings: LocationRating[];
  location_tag_vote_summary: LocationTagVoteSummary[];
};

export type PlaceData = {
  id: string;
  imageUrl: string;
  title: string;
  rating: number;
  distance: string;
  address: string;
  tags: { name: string; count: number }[];
  description: string;
  photos?: string[];
  reviews?: Review[];
  menuItems?: MenuItem[];
};
