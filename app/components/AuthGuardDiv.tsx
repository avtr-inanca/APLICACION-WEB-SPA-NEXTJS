"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/contexts/AuthContext";

export default function AuthGuardDiv({ children }: { children: React.ReactNode }) {
	const { user, loading } = useAuthContext();
	const router = useRouter();

	useEffect(() => {
		if (!loading && !user) {
			router.push("/");
		}
	}, [user, loading, router]);

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
				<div className="text-[var(--foreground)]">Loading...</div>
			</div>
		);
	}

	if (!user) {
		return null;
	}

	return (
		<>
			{children}
		</>
	);
}

