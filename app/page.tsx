'use client';
import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
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
				window.location.href = "/home"
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
		<div style={{background: "#202030", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh"}}>
			<div style={{background: "#f0f0f0", padding: "20px", borderRadius: "10px", width: "300px", textAlign: "center", boxShadow: "0 0 10px rgba(0,0,0,0.1)"}}>
				<h1 style={{color: "#202020"}}>{isLogin ? 'Login' : 'Sign Up'}</h1>
				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem"}}>
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={e => setEmail(e.target.value)}
						style={{border: "rounded"}}
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={e => setPassword(e.target.value)}
						required
					/>
					<button type="submit" style={{color: "white", background: "#2563eb", fontWeight: 500, padding: "0.5rem", borderRadius: "0.375rem", cursor: "pointer", border: "none", width: "100%"}}>
						{isLogin ? 'Login' : 'Sign Up'}
					</button>
				</form>
				<p style={{color: "#6b7280", textAlign: "center", fontSize: '0.875rem', marginTop: "0.75rem"}}>
				{isLogin ? "Don't have an account?" : 'Already registered?'}{' '}
					<button style={{color: "#2563eb", fontWeight: 500, padding: "0.5rem", borderRadius: "0.375rem", cursor: "pointer", border: "none", width: "100%"}} onClick={() => setIsLogin(!isLogin)}>
						{isLogin ? 'Sign Up' : 'Login'}
					</button>
				</p>
				{message && <p style={{color: "#dc2626", textAlign: "center", marginTop: "1rem", fontSize: "0.875rem"}}>{message}</p>}
			</div>
    	</div>
	);
}
