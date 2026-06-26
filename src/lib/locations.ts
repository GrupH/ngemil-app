import { supabase } from "./supabase";

export async function getAllLocations() {
  return supabase.from("locations").select(`
      id,
      name,
      address,
      description,
      submitted_by,
      location_images(storage_path, is_cover),
      location_ratings(rating, comment, user_id, created_at),
      location_rating_summary(avg_rating, rating_count)
    `);
}

export async function getLocationById(id: string) {
  return supabase
    .from("locations")
    .select(
      `
      id,
      name,
      address,
      description,
      submitted_by,
      location_images(storage_path, is_cover),
      location_ratings(id, rating, comment, profiles(username, avatar_url), created_at),
      location_rating_summary(avg_rating, rating_count),
      location_tag_vote_summary(vote_count, tags(tag))
    `,
    )
    .eq("id", id)
    .single();
}

export async function getNearbyLocations(
  lat: number,
  lng: number,
  radius_m: number,
) {
  return supabase.rpc("locations_nearby", { lat, lng, radius_m });
}

export async function submitLocation(
  name: string,
  address: string,
  description: string,
  lat: number,
  lng: number,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return supabase.from("locations").insert({
    name,
    address,
    description,
    submitted_by: user?.id,
    coordinates: `POINT(${lng} ${lat})`,
  });
}
