"use client";

import { FormEvent, useEffect, useState } from "react";
import ProtectedRoute from "@/app/components/AuthGuardDiv";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import { supabaseClient } from "@/lib/supabase/supabaseClient";

type AlertState = {
	type: "success" | "error";
	message: string;
} | null;

export default function UserPanelPage() {
	const { user } = useAuthContext();
	const { t } = useLanguage();
	const [displayName, setDisplayName] = useState("");
	const [profileAlert, setProfileAlert] = useState<AlertState>(null);
	const [passwordAlert, setPasswordAlert] = useState<AlertState>(null);
	const [profileLoading, setProfileLoading] = useState(false);
	const [passwordLoading, setPasswordLoading] = useState(false);
	const [newPassword, setNewPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");

	useEffect(() => {
		setDisplayName(user?.user_metadata?.displayName ?? "");
	}, [user]);

	const handleProfileUpdate = async (event: FormEvent) => {
		event.preventDefault();
		setProfileAlert(null);
		setProfileLoading(true);
		const { error } = await supabaseClient.auth.updateUser({
			data: { displayName: displayName || null },
		});
		if (error) {
			setProfileAlert({ type: "error", message: error.message });
		} else {
			setProfileAlert({ type: "success", message: t("Profile updated successfully") });
		}
		setProfileLoading(false);
	};

	const handlePasswordUpdate = async (event: FormEvent) => {
		event.preventDefault();
		setPasswordAlert(null);
		if (newPassword.length < 8) {
			setPasswordAlert({ type: "error", message: t("Password must be at least 8 characters") });
			return;
		}
		if (newPassword !== confirmPassword) {
			setPasswordAlert({ type: "error", message: t("Passwords do not match") });
			return;
		}
		setPasswordLoading(true);
		const { error } = await supabaseClient.auth.updateUser({ password: newPassword });
		if (error) {
			setPasswordAlert({ type: "error", message: error.message });
		} else {
			setPasswordAlert({ type: "success", message: t("Password changed successfully") });
			setNewPassword("");
			setConfirmPassword("");
		}
		setPasswordLoading(false);
	};

	return (
		<ProtectedRoute>
			<main className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
				<section className="rounded-xl border border-[var(--border)] bg-[var(--muted)] p-4 sm:p-6 shadow-sm">
					<h1 className="text-2xl sm:text-3xl font-semibold text-[var(--foreground)] mb-3 sm:mb-4">{t("User Panel")}</h1>
					<p className="text-sm sm:text-base text-[var(--muted-font-color)]">
						{t("Review your account information and manage security preferences.")}
					</p>
				</section>

				<section className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--muted)] p-4 sm:p-6 shadow-sm">
					<h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-3 sm:mb-4">
						{t("Account overview")}
					</h2>
					<dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
						<div>
							<dt className="text-sm text-[var(--muted-font-color)]">{t("Email")}</dt>
							<dd className="text-base sm:text-lg text-[var(--foreground)] font-medium break-words">{user?.email}</dd>
						</div>
						<div>
							<dt className="text-sm text-[var(--muted-font-color)]">{t("User ID")}</dt>
							<dd className="text-base sm:text-lg text-[var(--foreground)] font-mono break-words">{user?.id}</dd>
						</div>
						<div>
							<dt className="text-sm text-[var(--muted-font-color)]">{t("Created at")}</dt>
							<dd className="text-base sm:text-lg text-[var(--foreground)]">
								{user?.created_at ? new Date(user.created_at).toLocaleString() : t("Unavailable")}
							</dd>
						</div>
						<div>
							<dt className="text-sm text-[var(--muted-font-color)]">{t("Last sign in")}</dt>
							<dd className="text-base sm:text-lg text-[var(--foreground)]">
								{user?.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : t("Unavailable")}
							</dd>
						</div>
						<div>
							<dt className="text-sm text-[var(--muted-font-color)]">{t("Display name")}</dt>
							<dd className="text-base sm:text-lg text-[var(--foreground)]">
								{user?.user_metadata?.displayName ?? t("Unavailable")}
							</dd>
						</div>
					</dl>
				</section>

				<section className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--muted)] p-4 sm:p-6 shadow-sm">
					<h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-3 sm:mb-4">
						{t("Profile details")}
					</h2>
					<form onSubmit={handleProfileUpdate} className="space-y-4">
						<label className="flex flex-col gap-2">
							<span className="text-sm text-[var(--muted-font-color)]">{t("Display name")}</span>
							<input
								type="text"
								value={displayName}
								onChange={(event) => setDisplayName(event.target.value)}
								className="rounded-md border border-[var(--border)] px-3 py-2 bg-transparent text-[var(--foreground)] w-full"
								placeholder={t("Enter a public display name")}
							/>
						</label>
						<button
							type="submit"
							className="btn-primary w-full sm:w-auto px-4 py-2 font-semibold disabled:opacity-60"
							disabled={profileLoading}
						>
							{profileLoading ? t("Saving...") : t("Save changes")}
						</button>
						{profileAlert && (
							<p
								className={`${profileAlert.type === "success" ? "text-green-600" : "text-red-500"} text-sm`}
							>
								{profileAlert.message}
							</p>
						)}
					</form>
				</section>

				<section className="rounded-xl border border-[var(--border)] bg-white dark:bg-[var(--muted)] p-4 sm:p-6 shadow-sm">
					<h2 className="text-lg sm:text-xl font-semibold text-[var(--foreground)] mb-3 sm:mb-4">
						{t("Change password")}
					</h2>
					<form onSubmit={handlePasswordUpdate} className="space-y-4">
						<label className="flex flex-col gap-2">
							<span className="text-sm text-[var(--muted-font-color)]">{t("New password")}</span>
							<input
								type="password"
								value={newPassword}
								onChange={(event) => setNewPassword(event.target.value)}
								required
								className="rounded-md border border-[var(--border)] px-3 py-2 bg-transparent text-[var(--foreground)] w-full"
								placeholder={t("Enter a new password")}
							/>
						</label>
						<label className="flex flex-col gap-2">
							<span className="text-sm text-[var(--muted-font-color)]">{t("Confirm password")}</span>
							<input
								type="password"
								value={confirmPassword}
								onChange={(event) => setConfirmPassword(event.target.value)}
								required
								className="rounded-md border border-[var(--border)] px-3 py-2 bg-transparent text-[var(--foreground)] w-full"
								placeholder={t("Repeat the new password")}
							/>
						</label>
						<button
							type="submit"
							className="btn-primary w-full sm:w-auto px-4 py-2 font-semibold disabled:opacity-60"
							disabled={passwordLoading}
						>
							{passwordLoading ? t("Updating...") : t("Update password")}
						</button>
						{passwordAlert && (
							<p
								className={`${passwordAlert.type === "success" ? "text-green-600" : "text-red-500"} text-sm`}
							>
								{passwordAlert.message}
							</p>
						)}
					</form>
				</section>
			</main>
		</ProtectedRoute>
	);
}