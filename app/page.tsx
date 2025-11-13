"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import "./styles/pages/login.css"

export default function LoginPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginMode, setLoginMode] = useState(true);
	const [message, setMessage] = useState("");

	async function handleSubmit(event: React.FormEvent) {
		event.preventDefault();
		setMessage("Verifying...");
		if (loginMode) { // Logging in
			const {error} = await supabase.auth.signInWithPassword({email, password});
			if (error) {
				setMessage(error.message);
			} else {
				setMessage('Logged in!');
			}
		} else { // Registering
			const {error} = await supabase.auth.signUp({email, password});
			if (error) {
				setMessage(error.message);
			} else {
				setMessage("Check your email to confirm registration");
			}
		}
	}
	
	return (
		<main className="login-background min-h-screen flex flex-col items-center justify-center">
			<div className="login-form">
				<h1 className="text-2xl font-semibold mb-4" style={{color: "var(--foreground)"}}>
					{loginMode ? "Login" : "Register"}
				</h1>
				<form onSubmit={handleSubmit} className="flex flex-col gap-3">
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					<button type="submit" className="btn-primary text-lg">
						{loginMode ? "Login" : "Register"}
					</button>
				</form>
				<button className="btn-secondary mt-2" style={{width: "100%"}} onClick={() => setLoginMode(!loginMode)}>
					{loginMode ? "Register" : "Login"}
				</button>
				{(message != "") && (<p className="text-error mt-4 text-sm">{message}</p>)}
			</div>
		</main>
	);
}
