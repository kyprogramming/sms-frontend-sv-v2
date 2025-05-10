import { error, redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	const user = locals.user;
	const isLoggedIn = user?.authenticated; // e.g. from cookies or auth
	if (!user || !isLoggedIn || user.role !== "admin") {
        error(401, "User Unauthenticated!");
	}
	return {
		user: locals.user || null,
	};
};
