import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { User } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/auth/supabaseServerClient";

export const getInitialAuthSession = async (): Promise<User | null> => {
	const {data:{session}} = await supabaseClient.auth.getSession();
	return session?.user ?? null;
};

export const listenToAuthChanges = (callback: (user: any) => void) => {
	const {data:{subscription}} = supabaseClient.auth.onAuthStateChange(
		(_event, session) => {
			callback(session?.user ?? null);
		}
	);
	return subscription;
};

export const signOutUser = async () => {
	await supabaseClient.auth.signOut();
};

export async function getAuthorizedContext(request: Request) {
	const authHeader = request.headers.get("Authorization");
	if (!authHeader?.startsWith("Bearer ")) {
		return {
			errorResponse: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
		};
	}
	const token = authHeader.split(" ")[1];
	const supabase = createSupabaseServerClient(token);
	const { data, error } = await supabase.auth.getUser(token);
	if (error || !data.user) {
		return {
			errorResponse: NextResponse.json({ error: "Invalid token" }, { status: 401 }),
		};
	}
	return { supabase, userId: data.user.id };
}

