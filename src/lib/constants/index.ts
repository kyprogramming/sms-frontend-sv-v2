// src/lib/constants.ts
export const COOKIE_OPTIONS = {
	path: "/",
	httpOnly: true,
	secure: import.meta.env.PROD, // false in dev for localhost HTTP
	sameSite: "strict" as const,
	maxAge: 60 * 60 * 24 * 7, // 1 week
};
