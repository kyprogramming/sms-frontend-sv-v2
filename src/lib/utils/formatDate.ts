// src/lib/utils/formatDate.ts

export function formatDate(value: string | number | Date): string {
	if (!value) return "";
	return new Date(value).toLocaleDateString("en-GB", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
}
