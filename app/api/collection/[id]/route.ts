import { NextResponse } from "next/server";
import { supabaseCollectionService } from "@/lib/supabase/supabaseCollectionService";
import { getAuthorizedContext } from "@/lib/auth/supabaseAuthService";

// Update the status of an anime in the user's collection.
// PUT: /api/collection/:id
export async function PUT(request: Request, context: {params: Promise<{id: string}>}) {
	const { id } = await context.params;
	const { errorResponse, supabase, userId } = await getAuthorizedContext(request);
	if (errorResponse) {
		return errorResponse;
	}
	try {
		const body = await request.json();
		const updated = await supabaseCollectionService.updateCollection(id, body, supabase, userId);
		if (!updated) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		return NextResponse.json(updated);
	} catch (error) {
		console.error("Update collection error", error);
		const message = error instanceof Error ? error.message : "Failed to update anime";
		return NextResponse.json({error: message}, {status: 500});
	}
}

// Delete an anime from the user's collection.
// DELETE: /api/collection/:id
export async function DELETE(request: Request, context: {params: Promise<{id: string}>}) {
	const { id } = await context.params;
	const { errorResponse, supabase, userId } = await getAuthorizedContext(request);
	if (errorResponse) {
		return errorResponse;
	}
	try {
		const removed = await supabaseCollectionService.removeAnime(id, supabase, userId);
		if (!removed) {
			return NextResponse.json({ error: "Not found" }, { status: 404 });
		}
		return NextResponse.json({success: true});
	} catch (error) {
		console.error("Remove collection item error", error);
		const message = error instanceof Error ? error.message : "Failed to remove anime";
		return NextResponse.json({error: message}, {status: 500});
	}
}
