import { supabase } from "./supabase";

export async function submitPhotos(uri: string, locationId: string, isCoverImage: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const response = await fetch(uri);
  const arrayBuffer = await response.arrayBuffer();

  const fileExt = uri.split(".").pop() ?? "jpg";
  const fileName = `${locationId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("location-images")
    .upload(fileName, arrayBuffer, {
      contentType: `image/${fileExt}`,
    });

  if (uploadError) return { error: uploadError };

  const { data: imgData } = supabase.storage
    .from("location-images")
    .getPublicUrl(uploadData.path);

  const imageUrl = imgData.publicUrl;

  return supabase.from("location_images").insert({
    uploaded_by: user?.id,
    storage_path: imageUrl,
    location_id: locationId,
    is_cover: isCoverImage
  });
}