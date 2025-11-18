import { SupabaseClient } from "@supabase/supabase-js";
import { supabaseClient } from "./supabaseClient";
import { SupabaseAnimeData } from "./supabaseTypes";
import { JikanAnimeData } from "@/lib/jikan/jikanApi";

type Client = SupabaseClient;

const resolveClient = (client?: Client) => client ?? supabaseClient;

export const supabaseCollectionService = {
	// READ: Read the anime collection of the user.
	async getCollection(userId: string, client?: Client): Promise<SupabaseAnimeData[]> {
		const activeClient = resolveClient(client);
		const { data, error } = await activeClient
			.from("user_anime_collection")
			.select("*")
			.eq("user_id", userId)
			.order("updated_at", {ascending: false});
		if (error) {
			throw error;
		}
		return (data || []);
	},
	// CREATE: Create an anime entry on the user's collection.
	async addAnime(
		userId: string,
		anime: JikanAnimeData,
		status: SupabaseAnimeData["status"] = "plan_to_watch",
		client?: Client
	): Promise<SupabaseAnimeData> {
		const activeClient = resolveClient(client);
		const { data, error } = await activeClient
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
	},
	// UPDATE: Update the status of an anime in the user's collection.
	async updateCollection(
		id: string,
		updates: Partial<Pick<SupabaseAnimeData, "status" | "episodes_watched" | "rating" | "notes">>,
		client?: Client,
		userId?: string
	): Promise<SupabaseAnimeData | null> {
		const activeClient = resolveClient(client);
		let query = activeClient
			.from("user_anime_collection")
			.update({
				...updates,
				updated_at: new Date().toISOString(),
			})
			.eq("id", id);
		if (userId) {
			query = query.eq("user_id", userId);
		}
		const { data, error } = await query.select().maybeSingle();
		if (error) {
			if (error.code === "PGRST116") {
				return null;
			}
			throw error;
		}
		return data;
	},
	// DELETE: Delete an anime from the user's collection.
	async removeAnime(id: string, client?: Client, userId?: string): Promise<boolean> {
		const activeClient = resolveClient(client);
		let query = activeClient
			.from("user_anime_collection")
			.delete()
			.eq("id", id);
		if (userId) {
			query = query.eq("user_id", userId);
		}
		const { data, error } = await query.select("id").maybeSingle();
		if (error) {
			if (error.code === "PGRST116") {
				return false;
			}
			throw error;
		}
		return Boolean(data);
	},
	// READ: Read a specific anime from the user's collection.
	async getAnime(userId: string, animeId: number, client?: Client): Promise<SupabaseAnimeData | null> {
		const activeClient = resolveClient(client);
		const { data, error } = await activeClient
			.from("user_anime_collection")
			.select("*")
			.eq("user_id", userId)
			.eq("anime_id", animeId)
			.single();
		if (error) {
			if (error.code === "PGRST116") {
				return null; // Anime entry not found
			}
			throw error;
		}
		return data;
	},
	// READ: Read a collection entry by id.
	async getCollectionItem(id: string, client?: Client): Promise<SupabaseAnimeData | null> {
		const activeClient = resolveClient(client);
		const { data, error } = await activeClient
			.from("user_anime_collection")
			.select("*")
			.eq("id", id)
			.single();
		if (error) {
			if (error.code === "PGRST116") {
				return null;
			}
			throw error;
		}
		return data;
	}
}