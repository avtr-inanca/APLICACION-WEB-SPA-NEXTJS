import React from "react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div>
      <h1>Home</h1>
      <Link href="/search" style={{
        display: "inline-block",
        marginTop: "10px",
        padding: "8px 16px",
        backgroundColor: "#0070f3",
        color: "white",
        textDecoration: "none",
        borderRadius: "4px"
      }}>Go to Search
      </Link>
      <Link href="/panel" style={{
        display: "inline-block",
        marginTop: "10px",
        padding: "8px 16px",
        backgroundColor: "#0070f3",
        color: "white",
        textDecoration: "none",
        borderRadius: "4px"
      }}>Go to my panel
      </Link>
    </div>
  );
}
