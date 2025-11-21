"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/app/contexts/AuthContext";
import { useLanguage } from "@/app/contexts/LanguageContext";
import "../styles/header.css";

export default function Header() {
	const {user, signOut} = useAuthContext();
	const {language, setLanguage, t} = useLanguage();
	const pathname = usePathname();
	const router = useRouter();

	const handleSignOut = async () => {
		await signOut();
		router.push("/");
	};

	return (
		<header className="bg-white dark:bg-[var(--muted)] shadow-md mb-6 sticky top-0 z-50">
			<nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
				<Link href="/home" className="text-4xl font-bold text-[var(--primary)]">
					My Anime Log
				</Link>
				<div className="flex items-center flex-wrap justify-center">
					{user && (
						<div className="flex gap-2">
							<Link href="/home" className={`px-3 py-2 rounded-md text-sm font-medium ${
								pathname === "/home" 
									? "bg-[var(--primary)] !text-white"
									: "unselected-navigation-button"
							}`}>
								{t("Home")}
							</Link>
							<Link href="/search" className={`px-3 py-2 rounded-md text-sm font-medium ${
								pathname === "/search" 
									? "bg-[var(--primary)] !text-white" 
									: "unselected-navigation-button"
							}`}>
								{t("Search")}
							</Link>
							<Link href="/collection" className={`px-3 py-2 rounded-md text-sm font-medium ${
								pathname === "/collection" 
									? "bg-[var(--primary)] !text-white" 
									: "unselected-navigation-button"
							}`}>
								{t("My Collection")}
							</Link>
						</div>
					)}
  					<span className="text-[var(--border)] text-xl mx-2">|</span>
					<div className="flex items-center gap-2">
						<button
							onClick={() => setLanguage("en")}
							className={`px-4 py-2 rounded text-m font-medium transition-colors ${
								language === "en" 
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] bg-[var(--muted-secondary)]"
						}`}>
							EN
						</button>
						<button
							onClick={() => setLanguage("es")}
							className={`px-4 py-2 rounded text-m font-medium transition-colors ${
								language === "es"
									? "bg-[var(--primary)] text-white" 
									: "text-[var(--foreground)] bg-[var(--muted-secondary)]"
						}`}>
							ES
						</button>
					</div>
  					<span className="text-[var(--border)] text-xl mx-2">|</span>					
					{user && (
						<div className="flex items-center">
							<button onClick={handleSignOut} className="logout-button px-3 py-2 rounded font-bold">
								{t("Logout")}
							</button>
						</div>
					)}
				</div>
			</nav>
		</header>
	);
}
