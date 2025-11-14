"use client";
import React, { useState, FormEvent } from "react";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { searchAnime, JikanAnime } from "@/lib/jikanApi";
import { addAnimeToCollection, getAnimeInCollection } from "@/lib/animeCollection";
import { useRouter } from "next/navigation";
import ExpandableText from "@/app/components/ExpandableText";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const [animes, setAnimes] = useState<JikanAnime[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [addingIds, setAddingIds] = useState<Set<number>>(new Set());
	const { t } = useLanguage();
	const { user } = useAuth();
	const router = useRouter();

	async function handleSearch(e: FormEvent) {
		e.preventDefault();
		if (!query.trim()) return;

		setLoading(true);
		setError(null);
		try {
			const response = await searchAnime(query);
			setAnimes(response.data);
		} catch (err) {
			setError(t("searchError"));
			console.error(err);
		} finally {
			setLoading(false);
		}
	}

	async function handleAddToCollection(anime: JikanAnime) {
		if (!user) {
			router.push("/");
			return;
		}

		setAddingIds(prev => new Set(prev).add(anime.mal_id));
		try {
			const existing = await getAnimeInCollection(user.id, anime.mal_id);
			if (existing) {
				alert(t("alreadyInCollection"));
				return;
			}
			await addAnimeToCollection(user.id, anime, "plan_to_watch");
			alert(t("addedToCollection"));
		} catch (err) {
			console.error(err);
			alert(t("failedToAdd"));
		} finally {
			setAddingIds(prev => {
				const newSet = new Set(prev);
				newSet.delete(anime.mal_id);
				return newSet;
			});
		}
	}

	return (
		<ProtectedRoute>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<h1 className="text-3xl font-bold mb-6 text-[var(--foreground)]">
					{t("searchAnime")}
				</h1>

				<form onSubmit={handleSearch} className="mb-8">
					<div className="flex flex-col sm:flex-row gap-3">
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder={t("enterAnimeName")}
							className="flex-1 px-4 py-2 rounded-lg border border-[var(--input-border)] bg-[var(--input-bg)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
						/>
						<button
							type="submit"
							disabled={loading}
							className="btn-primary px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
						>
							{loading ? t("loading") : t("search")}
						</button>
					</div>
				</form>

				{error && (
					<div className="mb-4 p-4 bg-[var(--error)]/10 border border-[var(--error)] rounded-lg text-[var(--error)]">
						{error}
					</div>
				)}

				{animes.length > 0 && (
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
						{animes.map((anime) => (
							<div key={anime.mal_id} className="bg-[var(--muted)] rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-[var(--border)] flex flex-col">
								{/* Image of the anime */}
								{anime.images.jpg.large_image_url && (
									<img
										src={anime.images.jpg.large_image_url}
										alt={anime.title}
										className="w-full h-64 object-cover"
									/>
								)}
								{/* Card content */}
								<div className="p-4 flex flex-col flex-grow">
									<h3 className="font-semibold text-lg text-[var(--foreground)] line-clamp-2 mb-1">
										{anime.title}
									</h3>
									<div className="text-sm text-[var(--muted-font-color)]">
										{anime.episodes && (
											<p className="text-sm text-[var(--muted-font-color)]">
												{t("episodes")}: {anime.episodes}
											</p>
										)}
										{anime.score && (
											<div className="flex items-center gap-2 mb-3">
												<span className="text-[var(--accent)] font-bold">
													⭐ {anime.score}
												</span>
											</div>
										)}
									</div>
										{anime.synopsis && (											
											<ExpandableText text={anime.synopsis}/>
										)}
									
									<div className="mt-auto pt-4">
										<button className="btn-primary w-full text-sm disabled:opacity-50"
											onClick={() => handleAddToCollection(anime)}
											disabled={addingIds.has(anime.mal_id)}
										>
											{addingIds.has(anime.mal_id)
												? t("loading")
												: t("addToCollection")}
										</button>
									</div>
								</div>
							</div>
						))}
					</div>
				)}

				{!loading && animes.length === 0 && query && !error && (
					<div className="text-center py-12 text-[var(--muted-font-color)]">
						{t("noResults")}
					</div>
				)}
			</div>
		</ProtectedRoute>
	);
}
