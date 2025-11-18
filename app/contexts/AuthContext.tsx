"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { User } from "@supabase/supabase-js";
import { getInitialAuthSession, listenToAuthChanges, signOutUser } from "@/lib/auth/supabaseAuthService";

interface AuthContextType {
	user: User | null;
	loading: boolean;
	signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		// Get initial session
		getInitialAuthSession().then((initialUser) => {
			setUser(initialUser);
			setLoading(false);
    	});
		// Listen for auth changes
		const authSubscription = listenToAuthChanges((newUser) => {
			setUser(newUser);
			setLoading(false);
		});
		return () => { authSubscription.unsubscribe(); }
	}, []);

	const signOut = async () => {
		await signOutUser();
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, loading, signOut }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuthContext() {
	const authContext = useContext(AuthContext);
	if (!authContext) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return authContext;
}
