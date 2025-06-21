import { error } from '@sveltejs/kit';
import { API_BASE_URL, ENV, UI_BASE_URL } from '$lib/utils/env.config';
import type { PageLoad } from './$types';
import { isLoading } from '$lib/stores/loading';
import { fetchWithErrorHandling } from '$lib/utils/helper';

const api_base_url = ENV === 'development' ? API_BASE_URL : `${UI_BASE_URL}${API_BASE_URL}`;

export const load: PageLoad = async ({ url, fetch }) => {
	const id = url.searchParams.get('id');
	isLoading.set(true);

	try {
		const studentPromise = id ? fetchWithErrorHandling(fetch, `${api_base_url}/student/${id}`, 'Failed to fetch student data') : Promise.resolve(null);
		const feeMasterPromise = fetchWithErrorHandling(fetch, `${API_BASE_URL}/fee-master/list`, 'Failed to fetch fee masters');
		const feeDiscountPromise = fetchWithErrorHandling(fetch, `${API_BASE_URL}/fee-discount/list`, 'Failed to fetch fee discounts');

		const [studentRes, feeMasterRes, feeDiscountRes] = await Promise.all([studentPromise, feeMasterPromise, feeDiscountPromise]);
		const [studentData, feeMasters, feeDiscounts] = await Promise.all([studentRes?.json() ?? null, feeMasterRes.json(), feeDiscountRes.json()]);

		// console.log('Server: studentData feeMasters feeDiscounts:', studentData, feeMasters, feeDiscounts);
		return { studentData, feeMasters, feeDiscounts };
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	} finally {
		isLoading.set(false);
	}
};
