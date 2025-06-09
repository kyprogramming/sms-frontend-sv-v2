// +layout.ts
import { API_BASE_URL } from "$lib/utils/env.config";
import { classList } from "$lib/stores/masterData";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// You can optionally redirect or return nulls
		return {
			user: null,
			role: null,
		};
	}

	return {
		user: locals.user,
		role: locals.user.role,
	};
};
