import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
	throw new Error("NEXT_PUBLIC_SUPABASE_URL is not set");
}

if (!supabaseAnonKey) {
	throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not set");
}

export const createSupabaseServerClient = (accessToken?: string) =>
	createClient(supabaseUrl, supabaseAnonKey, {
		auth: {
			autoRefreshToken: false,
			persistSession: false,
		},
		global: accessToken
			? {
					headers: {
						Authorization: `Bearer ${accessToken}`,
					},
				}
			: undefined,
	});

