"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabaseClient } from "@/lib/supabase/supabaseClient";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import "./styles/pages/login.css";

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginMode, setLoginMode] = useState(true);
	const [message, setMessage] = useState("");
	const { user } = useAuthContext();
	const { t } = useLanguage();
	const router = useRouter();

	useEffect(() => {
		if (user) {
			router.push("/home");
		}
	}, [user, router]);

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		setMessage(t("verifying"));
		if (loginMode) {
			const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
			if (error) {
				setMessage(error.message);
			} else {
				setMessage(t("loggedIn"));
				router.push("/home");
			}
		} else {
			const { error } = await supabaseClient.auth.signUp({ email, password });
			if (error) {
				setMessage(error.message);
			} else {
				setMessage(t("checkEmail"));
			}
		}
	}
	
	return (
		<main className="login-background fixed inset-0 flex flex-col items-center justify-center overflow-hidden">
			<div className="login-form">
				<h1 className="text-2xl font-semibold mb-4 text-[var(--foreground)]">
					{loginMode ? t("login") : t("register")}
				</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						type="email"
						placeholder={t("email")}
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
						className="w-full"
					/>
					<input
						type="password"
						placeholder={t("password")}
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
						className="w-full"
					/>
					<button type="submit" className="btn-primary text-lg w-full">
						{loginMode ? t("login") : t("register")}
					</button>
				</form>
				<button 
					className="btn-secondary mt-2 w-full" 
					onClick={() => setLoginMode(!loginMode)}
				>
					{loginMode ? t("register") : t("login")}
				</button>
				{message !== "" && (
					<p className="text-error mt-4 text-sm text-center">{message}</p>
				)}
			</div>
		</main>
	);
}
