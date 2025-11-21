"use client";
import { useState, useEffect } from "react";
import ProtectedRoute from "@/app/components/AuthGuardDiv";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { SupabaseAnimeData } from "@/lib/supabase/supabaseTypes";
import { supabaseClient } from "@/lib/supabase/supabaseClient";

export default function CollectionPage() {
	const [collection, setCollection] = useState<SupabaseAnimeData[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<SupabaseAnimeData["status"] | "all">("all");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editData, setEditData] = useState<{
		episodes_watched: number;
		status: SupabaseAnimeData["status"];
		rating: number | null;
	} | null>(null);
	const { t } = useLanguage();
	const { user } = useAuthContext();

	useEffect(() => {
		if (user) {
			loadCollection();
		}
	}, [user]);

	async function getAccessToken() {
		const { data } = await supabaseClient.auth.getSession();
		return data.session?.access_token ?? null;
	}

	async function authorizedFetch(input: RequestInfo, init?: RequestInit) {
		const token = await getAccessToken();
		if (!token) {
			throw new Error("Missing auth token");
		}
		const headers = new Headers(init?.headers);
		headers.set("Authorization", `Bearer ${token}`);
		return fetch(input, {
			...init,
			headers,
		});
	}

	async function loadCollection() {
		if (!user) return;
		try {
			setLoading(true);
			const res = await authorizedFetch("/api/collection");
			if (!res.ok) {
				throw new Error("Failed to load collection");
			}
			const data = await res.json();
			setCollection(data);
		} catch (error) {
			console.error("Failed to load collection: ", error);
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdate(id: string) {
		if (!editData) return;
		try {
			const response = await authorizedFetch(`/api/collection/${id}`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(editData),
			});
			if (!response.ok) {
				throw new Error("Failed to update");
			}
			await loadCollection();
			setEditingId(null);
		} catch (error) {
			console.error("Failed to update:", error);
			alert(t("Failed to update anime"));
		}
	}

	async function handleRemove(id: string) {
		if (!confirm(t("Are you sure you want to remove this anime from your collection?"))) return;
		try {
			const response = await authorizedFetch(`/api/collection/${id}`, {
				method: "DELETE",
			});
			if (!response.ok) {
				throw new Error("Failed to remove anime from the user's collection");
			}
			await loadCollection();
		} catch (error) {
			console.error("Failed to remove anime from the user's collection: ", error);
			alert(t("Anime couldn't be removed"));
		}
	}

	function startEdit(item: SupabaseAnimeData) {
		setEditingId(item.id);
		setEditData({
			episodes_watched: item.episodes_watched,
			status: item.status,
			rating: item.rating,
		});
	}

	const filteredCollection = (
		(filter === "all")
			? collection
			: collection.filter((item) => item.status === filter)
	);

	const statusOptions: Array<{ value: SupabaseAnimeData["status"]; label: string }> = [
		{ value: "watching", label: t("Currently Watching") },
		{ value: "completed", label: t("Completed") },
		{ value: "on_hold", label: t("On Hold") },
		{ value: "dropped", label: t("Dropped") },
		{ value: "plan_to_watch", label: t("Watch Later") },
	];

	return (
		<ProtectedRoute>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
					{t("My Collection")}
				</h1>

				{/* Filter buttons */}
				<div className="mb-6 flex flex-wrap gap-2">
					<button
						onClick={() => setFilter("all")}
						className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
							filter === "all"
								? "bg-[var(--primary)] text-white"
								: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]"
						}`}
					>
						{t("All")}
					</button>
					{statusOptions.map((option) => (
						<button
							key={option.value}
							onClick={() => setFilter(option.value)}
							className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
								filter === option.value
									? "bg-[var(--primary)] text-white"
									: "bg-[var(--muted)] text-[var(--foreground)] hover:bg-[var(--border)]"
							}`}
						>
							{option.label}
						</button>
					))}
				</div>

				{loading ? (
					<div className="text-center py-12 text-[var(--muted-font-color)]">
						{t("Loading...")}
					</div>
				) : filteredCollection.length === 0 ? (
					<div className="text-center py-12 text-[var(--muted-font-color)]">
						{collection.length === 0
							? t("Your collection is empty. Start by searching for anime!")
							: t("No anime found with this filter.")}
					</div>
				) : (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{filteredCollection.map((item) => (
							<div
								key={item.id}
								className="bg-[var(--muted)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-[var(--border)]"
							>
								{item.anime_data.images.jpg.large_image_url && (
									<img
										src={item.anime_data.images.jpg.large_image_url}
										alt={item.anime_data.title}
										className="w-full h-64 object-cover"
									/>
								)}
								<div className="p-4">
									<h3 className="font-semibold text-lg mb-2 text-[var(--foreground)] line-clamp-2">
										{item.anime_data.title}
									</h3>

									{editingId === item.id && editData ? (
										<div className="space-y-3">
											<div>
												<label className="block text-sm font-medium text-[var(--foreground)] mb-1">
													{t("Status")}
												</label>
												<select
													value={editData.status}
													onChange={(e) =>
														setEditData({
															...editData,
															status: e.target.value as SupabaseAnimeData["status"],
														})
													}
													className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)]"
												>
													{statusOptions.map((opt) => (
														<option key={opt.value} value={opt.value}>
															{opt.label}
														</option>
													))}
												</select>
											</div>
											<div>
												<label className="block text-sm font-medium text-[var(--foreground)] mb-1">
													{t("Episodes")} {t("Watched")}
												</label>
												<input
													type="number"
													min="0"
													max={item.anime_data.episodes || 999}
													value={editData.episodes_watched}
													onChange={(e) =>
														setEditData({
															...editData,
															episodes_watched: parseInt(e.target.value) || 0,
														})
													}
													className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)]"
												/>
												{item.anime_data.episodes && (
													<p className="text-xs text-[var(--muted-font-color)] mt-1">
														{t("of")} {item.anime_data.episodes} {t("episodes")}
													</p>
												)}
											</div>
											<div>
												<label className="block text-sm font-medium text-[var(--foreground)] mb-1">
													{t("Rating")} (1-10)
												</label>
												<input
													type="number"
													min="1"
													max="10"
													value={editData.rating || ""}
													onChange={(e) =>
														setEditData({
															...editData,
															rating: e.target.value ? parseInt(e.target.value) : null,
														})
													}
													className="w-full px-3 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)]"
												/>
											</div>
											<div className="flex gap-2">
												<button
													onClick={() => handleUpdate(item.id)}
													className="btn-primary flex-1 text-sm"
												>
													{t("Save")}
												</button>
												<button
													onClick={() => {
														setEditingId(null);
														setEditData(null);
													}}
													className="btn-secondary flex-1 text-sm"
												>
													{t("Cancel")}
												</button>
											</div>
										</div>
									) : (
										<>
											<div className="mb-3 space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-sm text-[var(--muted-font-color)]">
														{t("Status")}:
													</span>
													<span className="text-sm font-medium text-[var(--foreground)]">
														{statusOptions.find((opt) => opt.value === item.status)?.label ||
															item.status}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-sm text-[var(--muted-font-color)]">
														{t("Episodes")} {t("Watched")}:
													</span>
													<span className="text-sm font-medium text-[var(--foreground)]">
														{item.episodes_watched}
														{item.anime_data.episodes &&
															` / ${item.anime_data.episodes}`}
													</span>
												</div>
												{item.rating && (
													<div className="flex items-center justify-between">
														<span className="text-sm text-[var(--muted-font-color)]">
															{t("Rating")}:
														</span>
														<span className="text-sm font-medium text-[var(--accent)]">
															⭐ {item.rating}/10
														</span>
													</div>
												)}
											</div>
											<div className="flex gap-2">
												<button
													onClick={() => startEdit(item)}
													className="btn-primary flex-1 text-sm"
												>
													{t("Edit entry")}
												</button>
												<button
													onClick={() => handleRemove(item.id)}
													className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors"
												>
													{t("Remove")}
												</button>
											</div>
										</>
									)}
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
}


