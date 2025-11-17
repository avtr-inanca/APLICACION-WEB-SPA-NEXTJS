"use client";
import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuth } from "@/app/contexts/AuthContext";
import {
	getUserAnimeCollection,
	updateAnimeInCollection,
	removeAnimeFromCollection,
	UserAnime,
} from "@/app/api/animeCollection";

export default function PanelPage() {
	const [collection, setCollection] = useState<UserAnime[]>([]);
	const [loading, setLoading] = useState(true);
	const [filter, setFilter] = useState<UserAnime["status"] | "all">("all");
	const [editingId, setEditingId] = useState<string | null>(null);
	const [editData, setEditData] = useState<{
		episodes_watched: number;
		status: UserAnime["status"];
		rating: number | null;
	} | null>(null);
	const { t } = useLanguage();
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			loadCollection();
		}
	}, [user]);

	async function loadCollection() {
		if (!user) return;
		try {
			setLoading(true);
			const data = await getUserAnimeCollection(user.id);
			setCollection(data);
		} catch (err) {
			console.error("Failed to load collection:", err);
		} finally {
			setLoading(false);
		}
	}

	async function handleUpdate(id: string) {
		if (!editData) return;
		try {
			await updateAnimeInCollection(id, editData);
			await loadCollection();
			setEditingId(null);
			setEditData(null);
		} catch (err) {
			console.error("Failed to update:", err);
			alert(t("failedToUpdate"));
		}
	}

	async function handleRemove(id: string) {
		if (!confirm(t("confirmRemove"))) {
			return;
		}
		try {
			await removeAnimeFromCollection(id);
			await loadCollection();
		} catch (err) {
			console.error("Failed to remove:", err);
			alert(t("failedToRemove"));
		}
	}

	function startEdit(item: UserAnime) {
		setEditingId(item.id);
		setEditData({
			episodes_watched: item.episodes_watched,
			status: item.status,
			rating: item.rating,
		});
	}

	const filteredCollection =
		filter === "all"
			? collection
			: collection.filter((item) => item.status === filter);

	const statusOptions: Array<{ value: UserAnime["status"]; label: string }> = [
		{ value: "watching", label: t("currentlyWatching") },
		{ value: "completed", label: t("completed") },
		{ value: "on_hold", label: t("onHold") },
		{ value: "dropped", label: t("dropped") },
		{ value: "plan_to_watch", label: t("watchLater") },
	];

	return (
		<ProtectedRoute>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
					{t("myCollection")}
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
						{t("all")}
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
						{t("loading")}
					</div>
				) : filteredCollection.length === 0 ? (
					<div className="text-center py-12 text-[var(--muted-font-color)]">
						{collection.length === 0
							? t("emptyCollection")
							: t("noResultsFilter")}
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
													{t("status")}
												</label>
												<select
													value={editData.status}
													onChange={(e) =>
														setEditData({
															...editData,
															status: e.target.value as UserAnime["status"],
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
													{t("episodes")} {t("watched")}
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
													{t("rating")} (1-10)
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
													{t("save")}
												</button>
												<button
													onClick={() => {
														setEditingId(null);
														setEditData(null);
													}}
													className="btn-secondary flex-1 text-sm"
												>
													{t("cancel")}
												</button>
											</div>
										</div>
									) : (
										<>
											<div className="mb-3 space-y-2">
												<div className="flex items-center justify-between">
													<span className="text-sm text-[var(--muted-font-color)]">
														{t("status")}:
													</span>
													<span className="text-sm font-medium text-[var(--foreground)]">
														{statusOptions.find((opt) => opt.value === item.status)?.label ||
															item.status}
													</span>
												</div>
												<div className="flex items-center justify-between">
													<span className="text-sm text-[var(--muted-font-color)]">
														{t("episodes")} {t("watched")}:
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
															{t("rating")}:
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
													{t("trackEpisodes")}
												</button>
												<button
													onClick={() => handleRemove(item.id)}
													className="px-3 py-2 rounded-lg text-sm font-medium bg-[var(--error)]/10 text-[var(--error)] hover:bg-[var(--error)]/20 transition-colors"
												>
													{t("remove")}
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


