import { useState } from "react";

export default function ExpandableText({ text }: { text: string }) {
	const [expanded, setExpanded] = useState(false);

	return (
		<div className="text-sm text-[var(--foreground)]">
			<p className={expanded ? "" : "line-clamp-3"}>
				{text}
			</p>

			<button
				type="button"
				className="mt-1 text-[var(--accent)] underline text-l"
				onClick={() => setExpanded(!expanded)}
			>
				{expanded ? "Show less" : "Read more"}
			</button>
		</div>
	);
}
