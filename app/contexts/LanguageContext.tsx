"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

type Language = "en" | "es";

const LanguageContext = createContext<{
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
} | null>(null);

// Initialize i18next once
if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		lng: "en",
		fallbackLng: "en",
		interpolation: { escapeValue: false },
		resources: {} // Empty; translations loaded dynamically
	});
}

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>("en");

	const { t } = useTranslation();

	// Load translation files dynamically when language changes
	useEffect(() => {
		async function loadTranslations() {
			const data = await fetch(`/lang/${language}/common.json`).then(res => res.json());
			i18n.addResources(language, "translation", data);
			i18n.changeLanguage(language);
		}
		loadTranslations();
	}, [language]);

	// Load saved language
	useEffect(() => {
		const saved = localStorage.getItem("language") as Language | null;
		if (saved === "en" || saved === "es") {
			setLanguage(saved);
		}
	}, []);

	const handleSetLanguage = (lang: Language) => {
		setLanguage(lang);
		localStorage.setItem("language", lang);
	};

	return (
		<LanguageContext.Provider value={{language, setLanguage: handleSetLanguage, t}}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const ctx = useContext(LanguageContext);
	if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
	return ctx;
}
