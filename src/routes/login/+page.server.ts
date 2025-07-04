import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user) {
		const role = locals.user.role;
		if (role) throw redirect(303, `/${role}/dashboard`);
	}
	return {};
};
