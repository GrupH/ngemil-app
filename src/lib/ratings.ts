import { supabase } from './supabase';

export async function getRatingsForLocation(locationId: string) {
  return supabase
    .from('location_ratings')
    .select('id, rating, comment, user_id, created_at')
    .eq('location_id', locationId)
    .order('created_at', { ascending: false });
}

export async function getUserRatingForLocation(locationId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase
    .from('location_ratings')
    .select('id, rating, comment')
    .eq('location_id', locationId)
    .eq('user_id', user!.id)
    .maybeSingle();
}

export async function submitRating(locationId: string, rating: number, comment?: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase
    .from('location_ratings')
    .insert({
      location_id: locationId,
      user_id: user!.id,
      rating,
      comment,
    });
}

export async function deleteRating(locationId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase
    .from('location_ratings')
    .delete()
    .eq('location_id', locationId)
    .eq('user_id', user!.id);
}