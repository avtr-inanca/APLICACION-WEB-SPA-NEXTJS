import { JikanAnimeData } from "@/lib/jikan/jikanApi";

export interface SupabaseAnimeData {
	id: string;
	user_id: string;
	anime_id: number;
	anime_data: JikanAnimeData;
	status: "watching" | "completed" | "on_hold" | "dropped" | "plan_to_watch";
	episodes_watched: number;
	rating: number | null;
	notes: string | null;
	created_at: string;
	updated_at: string;
}