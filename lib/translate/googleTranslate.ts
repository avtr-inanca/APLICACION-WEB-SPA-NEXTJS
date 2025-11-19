import { NextRequest, NextResponse } from "next/server";

// Translation cache: stores translated text by language and key, used to avoid repeated API calls
const translationCache = new Map<string, string>();

// Google Translate API endpoint (free, no API key required for basic usage)
export async function translateText(text: string, targetLang: string): Promise<string> {
	// Check cache first
	const cacheKey = `${text}:${targetLang}`;
	if (translationCache.has(cacheKey)) {
		return translationCache.get(cacheKey)!;
	}
	try {
		// Use Google Translate's free endpoint
		const response = await fetch(
			`https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLang}&dt=t&q=${encodeURIComponent(
				text
			)}`
		);

		if (!response.ok) {
			throw new Error("Error response from translation API");
		}

		const data = await response.json();
		// The response format is: [[["translated text", "original text", ...], ...], ...]
		const translatedText = data[0]?.[0]?.[0] || text;

		// Cache the translation
		translationCache.set(cacheKey, translatedText);

		return translatedText;
	} catch (error) {
		console.error("Translation error:", error);
		// Return original text if translation fails
		return text;
	}
}
