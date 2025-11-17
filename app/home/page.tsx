"use client";
import React from "react";
import Link from "next/link";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function HomePage() {
	const { t } = useLanguage();

	return (
		<ProtectedRoute>
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="text-center mb-12">
					<h1 className="text-4xl font-bold mb-4 text-[var(--foreground)]">
						{t("home")}
					</h1>
					<p className="text-lg text-[var(--muted-font-color)] mb-8">
						{t("welcomeMessage")}
					</p>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
					<Link
						href="/search"
						className="bg-[var(--muted)] rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-[var(--border)] text-center group"
					>
						<div className="text-4xl mb-4">🔍</div>
						<h2 className="text-2xl font-semibold mb-2 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
							{t("search")}
						</h2>
						<p className="text-[var(--muted-font-color)]">
							{t("searchDescription")}
						</p>
					</Link>

					<Link
						href="/collection"
						className="bg-[var(--muted)] rounded-lg p-8 shadow-md hover:shadow-lg transition-shadow border border-[var(--border)] text-center group"
					>
						<div className="text-4xl mb-4">📚</div>
						<h2 className="text-2xl font-semibold mb-2 text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
							{t("collection")}
						</h2>
						<p className="text-[var(--muted-font-color)]">
							{t("collectionDescription")}
						</p>
					</Link>
				</div>
			</div>
		</ProtectedRoute>
	);
}
