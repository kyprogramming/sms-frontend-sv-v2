// +layout.ts
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
	if (!locals.user) {
		// You can optionally redirect or return nulls
		return {
			user: null,
			role: null,
		};
	}
    console.log("locals.user", locals.user);
	return {
		user: locals.user,
		role: locals.user.role,
	};
};
