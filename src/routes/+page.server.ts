import { API_BASE_URL } from '$lib/utils/env.config';
import { classList } from '$lib/stores/masterData';
import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ locals }) => {
	if (locals.user?.authenticated) {
		throw redirect(302, `/${locals.user?.role}/dashboard`);
	}

	// const [resClasses] = await Promise.all([fetch(`${API_BASE_URL}/class/list`, { method: "GET", headers: { "Content-Type": "application/json" }, credentials: "include" })]);
	// const [classList] = await Promise.all([resClasses.json()]);

	// console.log("classList for store:", classList);
	// // Save to store
	// classList.set(classList);
	return {};
};
