import { supabase } from './supabase';

export async function getAllTags() {
  return supabase
    .from('tags')
    .select('id, name')
    .order('name');
}

export async function getTagsForLocation(locationId: string) {
  return supabase
    .from('location_tag_vote_summary')
    .select('tag_id, vote_count, tags(name)')
    .eq('location_id', locationId)
    .order('vote_count', { ascending: false });
}

export async function getUserTagVotesForLocation(locationId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase
    .from('location_tag_votes')
    .select('tag_id')
    .eq('location_id', locationId)
    .eq('user_id', user!.id);
}

export async function voteTag(locationId: string, tagId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase
    .from('location_tag_votes')
    .insert({
      location_id: locationId,
      tag_id: tagId,
      user_id: user!.id,
    });
}

export async function unvoteTag(locationId: string, tagId: string) {
  const { data: { user } } = await supabase.auth.getUser();
  return supabase
    .from('location_tag_votes')
    .delete()
    .eq('location_id', locationId)
    .eq('tag_id', tagId)
    .eq('user_id', user!.id);
}