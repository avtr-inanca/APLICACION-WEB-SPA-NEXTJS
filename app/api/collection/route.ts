import { NextResponse } from "next/server";
import { supabaseCollectionService } from "@/lib/supabase/supabaseCollectionService";
import { getAuthorizedContext } from "@/lib/auth/supabaseAuthService";

// Read the anime collection of the user.
// GET: /api/collection
export async function GET(request: Request) {
	const { errorResponse, supabase, userId } = await getAuthorizedContext(request);
	if (errorResponse) {
		return errorResponse;
	}
	try {
		const data = await supabaseCollectionService.getCollection(userId, supabase);
		return NextResponse.json(data);
	} catch (error) {
		console.error(error);
		return NextResponse.json({error: "Failed to fetch collection"}, {status: 500});
	}
}

// Create an anime entry on the user's collection.
// POST: /api/collection
export async function POST(request: Request) {
	const { errorResponse, supabase, userId } = await getAuthorizedContext(request);
	if (errorResponse) {
		return errorResponse;
	}
	try {
		const body = await request.json();
		const {anime, status} = body;
		if (!anime) {
			return NextResponse.json(
				{error: "Missing required fields: anime"},
				{status: 400}
			);
		}
		const created = await supabaseCollectionService.addAnime(userId, anime, status, supabase);
		return NextResponse.json(created);
	} catch (error) {
		console.error(error);
		return NextResponse.json({error: "Failed to add anime"}, {status: 500});
	}
}
