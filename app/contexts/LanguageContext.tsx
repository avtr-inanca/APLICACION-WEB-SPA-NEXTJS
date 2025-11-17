"use client";
import { createContext, useContext, useState, ReactNode, useEffect } from "react";

type Language = "en" | "es";

interface Translations {
	[key: string]: {
		en: string;
		es: string;
	};
}

const translations: Translations = {
	login: { en: "Login", es: "Iniciar sesión" },
	register: { en: "Register", es: "Registrarse" },
	logout: { en: "Logout", es: "Cerrar sesión" },
	home: { en: "Home", es: "Inicio" },
	search: { en: "Search", es: "Buscar" },
	collection: { en: "My Collection2", es: "Mi Colección2" },
	myCollection: { en: "My Collection", es: "Mi Colección" },
	watchLater: { en: "Watch Later", es: "Ver después" },
	currentlyWatching: { en: "Currently Watching", es: "Viendo ahora" },
	completed: { en: "Completed", es: "Completado" },
	episodes: { en: "Episodes", es: "Episodios" },
	watched: { en: "Watched", es: "Vistos" },
	addToCollection: { en: "Add to Collection", es: "Agregar a Colección" },
	searchAnime: { en: "Search Anime", es: "Buscar Anime" },
	enterAnimeName: { en: "Enter anime name...", es: "Ingresa el nombre del anime..." },
	noResults: { en: "No results found", es: "No se encontraron resultados" },
	loading: { en: "Loading...", es: "Cargando..." },
	email: { en: "Email", es: "Correo electrónico" },
	password: { en: "Password", es: "Contraseña" },
	verifying: { en: "Verifying...", es: "Verificando..." },
	loggedIn: { en: "Logged in!", es: "¡Sesión iniciada!" },
	checkEmail: { en: "Check your email to confirm registration", es: "Revisa tu correo para confirmar el registro" },
	animeCollection: { en: "Anime Collection", es: "Colección de Anime" },
	trackEpisodes: { en: "Track Episodes", es: "Rastrear Episodios" },
	markAsWatched: { en: "Mark as Watched", es: "Marcar como Visto" },
	removeFromCollection: { en: "Remove from Collection", es: "Eliminar de Colección" },
	status: { en: "Status", es: "Estado" },
	rating: { en: "Rating", es: "Calificación" },
	score: { en: "Score", es: "Puntuación" },
	year: { en: "Year", es: "Año" },
	genres: { en: "Genres", es: "Géneros" },
	studio: { en: "Studio", es: "Estudio" },
	episode: { en: "Episode", es: "Episodio" },
	of: { en: "of", es: "de" },
	onHold: { en: "On Hold", es: "En pausa" },
	dropped: { en: "Dropped", es: "Abandonado" },
	save: { en: "Save", es: "Guardar" },
	cancel: { en: "Cancel", es: "Cancelar" },
	remove: { en: "Remove", es: "Eliminar" },
	all: { en: "All", es: "Todos" },
	welcomeMessage: { en: "Welcome to your anime collection manager. Search for anime and track your progress!", es: "¡Bienvenido a tu gestor de colección de anime. Busca anime y rastrea tu progreso!" },
	searchDescription: { en: "Search for anime using the Jikan API and add them to your collection", es: "Busca anime usando la API de Jikan y agrégalos a tu colección" },
	CollectionDescription: { en: "Manage your personal anime collection, track episodes, and rate your favorites", es: "Gestiona tu colección personal de anime, rastrea episodios y califica tus favoritos" },
	alreadyInCollection: { en: "This anime is already in your collection!", es: "¡Este anime ya está en tu colección!" },
	addedToCollection: { en: "Anime added to your collection!", es: "¡Anime agregado a tu colección!" },
	failedToAdd: { en: "Failed to add anime to collection", es: "Error al agregar anime a la colección" },
	confirmRemove: { en: "Are you sure you want to remove this anime from your collection?", es: "¿Estás seguro de que quieres eliminar este anime de tu colección?" },
	failedToUpdate: { en: "Failed to update anime", es: "Error al actualizar anime" },
	failedToRemove: { en: "Failed to remove anime", es: "Error al eliminar anime" },
	emptyCollection: { en: "Your collection is empty. Start by searching for anime!", es: "Tu colección está vacía. ¡Comienza buscando anime!" },
	noResultsFilter: { en: "No anime found with this filter.", es: "No se encontraron anime con este filtro." },
	searchError: { en: "Failed to search anime. Please try again.", es: "Error al buscar anime. Por favor, intenta de nuevo." },
};

interface LanguageContextType {
	language: Language;
	setLanguage: (lang: Language) => void;
	t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
	const [language, setLanguage] = useState<Language>("en");

	useEffect(() => {
		// Load language from localStorage
		const savedLang = localStorage.getItem("language") as Language | null;
		if (savedLang && (savedLang === "en" || savedLang === "es")) {
			setLanguage(savedLang);
		}
	}, []);

	const handleSetLanguage = (lang: Language) => {
		setLanguage(lang);
		localStorage.setItem("language", lang);
	};

	const t = (key: string): string => {
		return translations[key]?.[language] || key;
	};

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

