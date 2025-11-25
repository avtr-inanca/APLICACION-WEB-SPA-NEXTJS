"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";

type SupportedLanguage = "en" | "es";

const LanguageContext = createContext<{
	currentLanguage: SupportedLanguage;
	changeLanguage: (newLanguage: SupportedLanguage) => void;
	t: (key: string) => string;
} | null>(null);

// Initialize i18next once
if (!i18n.isInitialized) {
	i18n.use(initReactI18next).init({
		lng: "en",
		fallbackLng: "en",
		interpolation: { escapeValue: false },
		resources: {}
	});
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  	const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("en");
	const { t } = useTranslation();
	// Load translation files dynamically when language changes
	useEffect(() => {
		async function loadTranslationFile() {
			try {
				const translationData = await fetch(`/lang/${currentLanguage}/common.json`).then(res => res.json());
				i18n.addResources(currentLanguage, "translation", translationData);
				i18n.changeLanguage(currentLanguage);
			} catch (error) {
				console.error("Error loading translations: ", error);
			}
		}
		loadTranslationFile();
	}, [currentLanguage]);
	// Load saved language
	useEffect(() => {
		const savedLanguage = localStorage.getItem("language") as SupportedLanguage | null;
		if (savedLanguage === "en" || savedLanguage === "es") setCurrentLanguage(savedLanguage);
	}, []);
	const changeLanguage = (newLanguage: SupportedLanguage) => {
		setCurrentLanguage(newLanguage);
		localStorage.setItem("language", newLanguage);
	};
	return (
		<LanguageContext.Provider value={{currentLanguage, changeLanguage, t}}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (!context) throw new Error("useLanguage must be used within LanguageProvider");
	return context;
}
