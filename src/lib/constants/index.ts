// src/lib/constants.ts
export const COOKIE_OPTIONS = {
	path: "/",
	httpOnly: true,
	secure: import.meta.env.PROD, // false in dev for localhost HTTP
	sameSite: "strict" as const,
	maxAge: 60 * 60 * 24 * 7, // 1 week
};

export const CASTE_CATEGORIES = [
	{ id: 1, name: "General" },
	{ id: 2, name: "OBC" },
	{ id: 3, name: "SC" },
	{ id: 4, name: "ST" },
	{ id: 5, name: "Special" },
	{ id: 6, name: "Physical Challenged" },
];

export const GENDERS = [
	{ id: 1, name: "Male" },
	{ id: 2, name: "Female" },
	{ id: 3, name: "Other" },
];

export const SECTIONS = [
	{ id: 1, name: "A" },
	{ id: 2, name: "B" },
	{ id: 3, name: "C" },
	{ id: 4, name: "D" },
	{ id: 5, name: "E" },
	{ id: 5, name: "F" },
];