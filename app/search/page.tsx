"use client";
import React, { useState } from "react";

export default function SearchPage() {
	const [query, setQuery] = useState("");
	const [result, setResult] = useState<string | null>(null);

	function handleSearch(e: React.FormEvent) {
		e.preventDefault();
		if (!query) return;
		setResult(`You searched for: ${query} (API integration will come later)`);
	}

	return (
		<div>
		<h1>Search Anime</h1>
		<form onSubmit={handleSearch} style={{ marginTop: "10px" }}>
			<input
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Enter anime name..."
				style={{ color: "#f0f0f0", padding: "8px", width: "250px" }}
			/>
			<button type="submit" style={{
				padding: "8px 16px",
				marginLeft: "10px",
				backgroundColor: "#0070f3",
				color: "white",
				border: "none",
				borderRadius: "4px"
			}}>
			Search
			</button>
		</form>

		{result && <p style={{ marginTop: "15px" }}>{result}</p>}
		</div>
	);
}
