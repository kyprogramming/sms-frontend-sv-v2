import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from '$lib/utils/env.config';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { isLoading } from '$lib/stores/loading';

export const load: PageLoad = async ({ fetch }) => {
	try {
		isLoading.set(true);

		// Fetch fee masters
		const feeMasterParams = new URLSearchParams({
			search: '',
			page: '1',
			limit: DEFAULT_PAGE_LIMIT,
		});
		const feeMasterRes = await fetch(`${API_BASE_URL}/fee-master?${feeMasterParams.toString()}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!feeMasterRes.ok) {
			const message = await feeMasterRes.text();
			throw error(feeMasterRes.status, message || 'Failed to fetch fee masters');
		}

		// Fetch fee groups
		const feeGroupRes = await fetch(`${API_BASE_URL}/fee-group/list`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!feeGroupRes.ok) {
			const message = await feeGroupRes.text();
			throw error(feeGroupRes.status, message || 'Failed to fetch fee groups');
		}

		// Fetch fee types
		const feeTypeRes = await fetch(`${API_BASE_URL}/fee-type/list`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!feeTypeRes.ok) {
			const message = await feeTypeRes.text();
			throw error(feeTypeRes.status, message || 'Failed to fetch fee types');
		}

		// Parse all responses
		const [feeMasters, feeGroups, feeTypes] = await Promise.all([feeMasterRes.json(), feeGroupRes.json(), feeTypeRes.json()]);

		return {
			data: feeMasters,
			feeGroups,
			feeTypes,
		};
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	} finally {
		isLoading.set(false);
	}
};
