'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import "./styles/pages/login.css"

export default function HomePage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLogin, setIsLogin] = useState(true);
	const [message, setMessage] = useState('');

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setMessage('');

		if (isLogin) {
			const { error } = await supabase.auth.signInWithPassword({ email, password });
			if (error) {
				setMessage(error.message);
			} else {
				setMessage('Logged in!');
			}
		} else {
			const { error } = await supabase.auth.signUp({ email, password });
			if (error) {
				setMessage(error.message);
			} else {
				setMessage('Check your email to confirm sign up.');
			}
		}
	}
	
	return (
		<main className="login-background min-h-screen flex flex-col items-center justify-center">
			<div className="login-form">
				<h1 className="text-2xl font-semibold mb-4" style={{color: "var(--foreground)"}}>
					{isLogin ? 'Login' : 'Sign Up'}
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
						{isLogin ? "Login" : "Sign Up"}
					</button>
				</form>
				<p className="text-muted text-center text-sm mt-4">
				{isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
					<button className="btn-secondary mt-2" style={{width: "100%"}} onClick={() => setIsLogin(!isLogin)}>
						{isLogin ? "Sign Up" : "Login"}
					</button>
				</p>
				{message && <p className="text-error text-center mt-4 text-sm">{message}</p>}
			</div>
		</main>
	);
}
