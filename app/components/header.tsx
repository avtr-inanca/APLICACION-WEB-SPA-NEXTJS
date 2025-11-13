"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/contexts/AuthContext";
import { useLanguage } from "@/app/contexts/LanguageContext";

export default function Header() {
	const {user, signOut} = useAuth();
	const {language, setLanguage, t} = useLanguage();
	const pathname = usePathname();
	const router = useRouter();

	// Don't show header on login page
	if (pathname === "/") {
		return null;
	}

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	return (
		<header className="bg-white dark:bg-[var(--muted)] shadow-md mb-6 sticky top-0 z-50">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
				<Link href="/home" className="text-xl font-bold text-[var(--primary)] hover:text-[var(--secondary)] transition-colors">
					My Anime Log
				</Link>
				<div className="flex items-center gap-4 flex-wrap justify-center">
					{user ? (
						<div>
							<Link href="/home" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								pathname === "/home" 
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] hover:bg-[var(--muted)]"
							}`}>
								{t("home")}
							</Link>
							<Link href="/search" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								pathname === "/search" 
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] hover:bg-[var(--muted)]"
							}`}>
								{t("search")}
							</Link>
							<Link href="/panel" className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
								pathname === "/panel" 
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] hover:bg-[var(--muted)]"
							}`}>
								{t("panel")}
							</Link>
							<button onClick={handleSignOut} className="px-3 py-2 rounded-md text-sm font-medium text-[var(--error)] hover:bg-[var(--muted)] transition-colors">
								{t("logout")}
							</button>
						</div>
					) : ( // Not logged into the page
						<Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
							{t("login")}
						</Link>
					)}
					
					<div className="flex items-center gap-2 border-l border-[var(--border)] pl-4 ml-4">
						<button
							onClick={() => setLanguage("en")}
							className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
								language === "en" 
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] hover:bg-[var(--muted)]"
						}`}>
							EN
						</button>
						<button
							onClick={() => setLanguage("es")}
							className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
								language === "es" 
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] hover:bg-[var(--muted)]"
						}`}>
							ES
						</button>
					</div>
				</div>
			</nav>
		</header>
	);
}
