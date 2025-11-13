import { supabase } from "./supabaseClient";
import { JikanAnime } from "./jikanApi";

export interface UserAnime {
	id: string;
	user_id: string;
	anime_id: number;
	anime_data: JikanAnime;
	status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
	episodes_watched: number;
	rating: number | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}

export async function getUserAnimeCollection(userId: string): Promise<UserAnime[]> {
	const { data, error } = await supabase
		.from("user_anime_collection")
		.select("*")
		.eq("user_id", userId)
		.order("updated_at", { ascending: false });

	if (error) {
		throw error;
	}
	return data || [];
}

export async function addAnimeToCollection(
	userId: string,
	anime: JikanAnime,
	status: UserAnime["status"] = "plan_to_watch"
): Promise<UserAnime> {
	const { data, error } = await supabase
		.from("user_anime_collection")
		.insert({
			user_id: userId,
			anime_id: anime.mal_id,
			anime_data: anime,
			status,
			episodes_watched: 0,
		})
		.select()
		.single();

	if (error) {
		throw error;
	}
	return data;
}

export async function updateAnimeInCollection(
	id: string,
	updates: Partial<Pick<UserAnime, "status" | "episodes_watched" | "rating" | "notes">>
): Promise<UserAnime> {
	const { data, error } = await supabase
		.from("user_anime_collection")
		.update({
			...updates,
			updated_at: new Date().toISOString(),
		})
		.eq("id", id)
		.select()
		.single();

	if (error) {
		throw error;
	}
	return data;
}

export async function removeAnimeFromCollection(id: string): Promise<void> {
	const { error } = await supabase
		.from("user_anime_collection")
		.delete()
		.eq("id", id);

	if (error) {
		throw error;
	}
}

export async function getAnimeInCollection(userId: string, animeId: number): Promise<UserAnime | null> {
	const { data, error } = await supabase
		.from("user_anime_collection")
		.select("*")
		.eq("user_id", userId)
		.eq("anime_id", animeId)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			return null; // Not found
		}
		throw error;
	}
	return data;
}

