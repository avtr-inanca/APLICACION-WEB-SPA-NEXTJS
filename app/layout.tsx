import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";
import Header from "./components/Header";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: "My Anime Collection",
	description: "Manage your personal anime collection",
};

export default function RootLayout({children,}: Readonly<{children: React.ReactNode;}>) {
	return (
		<html>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}>
				<AuthProvider>
					<LanguageProvider>
						<Header/>
						{children}
					</LanguageProvider>
				</AuthProvider>
			</body>
		</html>
	);
}

