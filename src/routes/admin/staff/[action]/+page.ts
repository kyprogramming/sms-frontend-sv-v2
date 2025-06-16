import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from '$lib/utils/env.config';
import { isLoading } from '$lib/stores/loading';

import { apiRequest } from '$lib/utils/api';
import type { PageLoad } from '../../class/$types';

export const load: PageLoad = async ({ fetch, url }) => {
	const id = url.searchParams.get('id');

	try {
		if (!id) return { staffData: null };
		isLoading.set(true);
		const res = await fetch(`${API_BASE_URL}/staff/${id}`, { method: 'GET', headers: { 'Content-Type': 'application/json' }, credentials: 'include' });
		const staffData = await res.json();
		return { staffData };
	} catch (error) {
		throw error;
	} finally {
		isLoading.set(false);
	}
};
