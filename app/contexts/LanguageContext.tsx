"use client";
import { createContext, useContext, useState, ReactNode, useEffect, useCallback, useRef } from "react";
import { translateText } from "@/lib/translate/googleTranslate";

type Language = "en" | "es";

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({children}: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>("en");
	// Local cache of the context, in case react re-renderizes the component.	
	const [translations, setTranslations] = useState<Record<string, string>>({});
	// Usage of languageRef in case user changes language while translation is in progress.
	const languageRef = useRef(language);
	// Update languageRef when language changes
	useEffect(() => {
		languageRef.current = language;
	}, [language]);
	const handleSetLanguage = (lang: Language) => {
		setLanguage(lang);
		localStorage.setItem("language", lang);
	};
	const t = useCallback((text: string): string => {
		// If language is English, return text without changes
		if (language === "en") {
			return text;
		}
		// Use available translation if possible.
		if (translations[text]) {
			return translations[text];
		}
		// If not translated yet, then start async translation
		translateText(text, language).then((translated) => {
			// Avoid update if language changed during translation.
			if (languageRef.current === language) {
				setTranslations((prev) => ({ ...prev, [text]: translated }));
			}
		});
		// Meanwhile show original text
		return text;
	}, [language, translations]);
	return (
		<LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
			{children}
		</LanguageContext.Provider>
	);
}

export function useLanguage() {
	const context = useContext(LanguageContext);
	if (context === undefined) {
		throw new Error("useLanguage must be used within a LanguageProvider");
	}
	return context;
}

