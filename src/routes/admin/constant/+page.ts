import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from '$lib/utils/env.config';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { isLoading } from '$lib/stores/loading';

export const load: PageLoad = async ({ fetch }) => {
	try {
		isLoading.set(true);
		const params = new URLSearchParams({
			search: '',
			page: '1',
			limit: DEFAULT_PAGE_LIMIT,
		});
		const res = await fetch(`${API_BASE_URL}/constant?${params.toString()}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!res.ok) {
			const message = await res.text();
			throw error(res.status, message || 'Failed to fetch constants');
		}

		const data = await res.json();
		console.log('data from server:', data);
		return { data };
	} catch (err) {
		throw error;
	} finally {
		isLoading.set(false);
	}
};
