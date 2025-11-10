import Link from "next/link";

export default function Header() {
	return (
		<header style={{backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0,0,0,0.1)", marginBottom: "1.5rem"}}>
		<nav style={{maxWidth: "900px", margin: "0 auto", padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
			<Link href="/" style={{fontSize: "1.25rem", fontWeight: "bold", color: "#2563eb"}}>
			My App
			</Link>
			<div style={{display: "flex", gap: "1rem"}}>
			<Link href="/about" style={{textDecoration: "none", color: "#333"}}>
				About
			</Link>
			</div>
		</nav>
		</header>
	);
}
