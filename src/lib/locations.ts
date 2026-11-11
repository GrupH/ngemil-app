import { PlaceData } from "@/types/types";
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
      location_ratings(id, rating, comment, user_id, profiles(username, avatar_url), created_at),
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
  })
  .select()
  .single();
}

export function parseWKBHex(hex: string): { latitude: number; longitude: number } | null {
  try {
    const cleanHex = hex.trim();
    if (cleanHex.length < 42) return null;

    const bytes = new Uint8Array(cleanHex.length / 2);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = parseInt(cleanHex.substr(i * 2, 2), 16);
    }

    const view = new DataView(bytes.buffer);
    const isLittle = bytes[0] === 1;

    const geomType = view.getUint32(1, isLittle);
    const hasSRID = !!(geomType & 0x20000000);
    const offset = hasSRID ? 9 : 5;

    if (offset + 16 > bytes.length) return null;

    const lng = view.getFloat64(offset, isLittle);
    const lat = view.getFloat64(offset + 8, isLittle);

    if (isNaN(lat) || isNaN(lng)) return null;
    return { latitude: lat, longitude: lng };
  } catch {
    return null;
  }
}

export function parseCoordinates(coords: any): { latitude: number; longitude: number } | null {
  if (!coords) return null;

  if (
    typeof coords === "object" &&
    typeof coords.latitude === "number" &&
    typeof coords.longitude === "number"
  ) {
    return { latitude: coords.latitude, longitude: coords.longitude };
  }

  if (typeof coords === "object" && Array.isArray(coords.coordinates)) {
    const [lng, lat] = coords.coordinates;
    if (typeof lat === "number" && typeof lng === "number") {
      return { latitude: lat, longitude: lng };
    }
  }

  if (typeof coords === "string") {
    const trimmed = coords.trim();

    // 1. PostGIS WKB Hex string (e.g. 0101000020e6100000...)
    if (/^[0-9a-fA-F]+$/.test(trimmed) && trimmed.length >= 42) {
      const decoded = parseWKBHex(trimmed);
      if (decoded) return decoded;
    }

    // 2. WKT format: POINT(lng lat)
    if (trimmed.includes("POINT")) {
      const match = trimmed.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
      if (match) {
        const lng = parseFloat(match[1]);
        const lat = parseFloat(match[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { latitude: lat, longitude: lng };
        }
      }
    }
  }

  return null;
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function searchLocations(searchTerm: string) {
  const cleanTerm = searchTerm.trim();
  if (!cleanTerm) return { data: [], error: null };

  try {
    // 1. Check if any tags match the search query
    const { data: matchedTags } = await supabase
      .from("tags")
      .select("id")
      .ilike("tag", `%${cleanTerm}%`);

    let locationIdsFromTags: string[] = [];
    if (matchedTags && matchedTags.length > 0) {
      const tagIds = matchedTags.map((t) => t.id);
      const { data: locTagVotes } = await supabase
        .from("location_tag_vote_summary")
        .select("location_id")
        .in("tag_id", tagIds);

      if (locTagVotes && locTagVotes.length > 0) {
        locationIdsFromTags = locTagVotes
          .map((v: any) => v.location_id)
          .filter(Boolean);
      }
    }

    // 2. Query locations matching text or associated tags
    let query = supabase.from("locations").select(`
      id,
      name,
      address,
      description,
      coordinates,
      location_images(storage_path, is_cover),
      location_rating_summary(avg_rating, rating_count),
      location_tag_vote_summary(vote_count, tags(tag))
    `);

    if (locationIdsFromTags.length > 0) {
      const idList = locationIdsFromTags.slice(0, 50).join(",");
      query = query.or(
        `name.ilike.%${cleanTerm}%,description.ilike.%${cleanTerm}%,address.ilike.%${cleanTerm}%,id.in.(${idList})`,
      );
    } else {
      query = query.or(
        `name.ilike.%${cleanTerm}%,description.ilike.%${cleanTerm}%,address.ilike.%${cleanTerm}%`,
      );
    }

    const { data, error } = await query.limit(30);
    return { data: data ?? [], error };
  } catch (err: any) {
    return { data: [], error: err };
  }
}

export function parseLocationSearchResult(
  loc: any,
  userCoords?: { latitude: number; longitude: number } | null,
  knownNearby?: { id: string; distance: string }[],
): PlaceData {
  const images = loc.location_images ?? [];
  const coverImage =
    images.find((i: any) => i.is_cover)?.storage_path ||
    images[0]?.storage_path ||
    "";
  const photos = images.map((i: any) => i.storage_path);

  const tags = (loc.location_tag_vote_summary ?? [])
    .map((t: any) => ({
      name: t.tags?.tag || "",
      count: t.vote_count ?? 0,
    }))
    .filter((t: any) => t.name !== "");

  const parsedCoords = parseCoordinates(loc.coordinates);

  const nearbyMatch = knownNearby?.find((n) => n.id === loc.id);
  let distanceStr =
    nearbyMatch?.distance &&
    nearbyMatch.distance !== "N/A" &&
    nearbyMatch.distance !== "err"
      ? nearbyMatch.distance
      : "";

  if (!distanceStr && userCoords && parsedCoords) {
    const dist = calculateDistanceKm(
      userCoords.latitude,
      userCoords.longitude,
      parsedCoords.latitude,
      parsedCoords.longitude,
    );
    distanceStr = `${dist.toFixed(1)} km`;
  }

  const rating =
    loc.location_rating_summary?.[0]?.avg_rating ??
    (typeof loc.avg_rating === "number" ? loc.avg_rating : -1);

  return {
    id: loc.id,
    imageUrl: coverImage,
    title: loc.name,
    rating,
    distance: distanceStr || "N/A",
    latitude: parsedCoords?.latitude ?? 0,
    longitude: parsedCoords?.longitude ?? 0,
    tags,
    description: loc.description ?? "",
    address: loc.address ?? "",
    photos,
    reviews: [],
    menuItems: [],
  };
}

