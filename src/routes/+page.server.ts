// src/routes/+page.server.ts
import type { PageServerLoad } from "./$types";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.authenticated) {
		throw redirect(302, `/${locals.user?.role}/dashboard`);
	}
};
