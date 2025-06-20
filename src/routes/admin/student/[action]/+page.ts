import { API_BASE_URL, DEFAULT_PAGE_LIMIT, ENV, UI_BASE_URL } from '$lib/utils/env.config';
import { error } from '@sveltejs/kit';
import { isLoading } from '$lib/stores/loading';
import type { PageLoad } from './$types';
import { apiRequest } from '$lib/utils/api';

// const api_base_url = import.meta.env.SSR && ENV === 'development' ? `${API_BASE_URL}` : `${UI_BASE_URL}${API_BASE_URL}`;
const api_base_url = ENV === 'development' ? `${API_BASE_URL}` : `${UI_BASE_URL}${API_BASE_URL}`;

// export const load: PageLoad = async ({ url, fetch }) => {
// 	const id = url.searchParams.get('id');

// 	try {
// 		if (!id) return { studentData: null };
// 		isLoading.set(true);
// 		const studentData = await apiRequest<any>(`${API_BASE_URL}/student/${id}`, 'GET');
// 		return { studentData };
// 	} catch (error) {
// 		throw error;
// 	} finally {
// 		isLoading.set(false);
// 	}
// };

export const load: PageLoad = async ({ url, fetch }) => {
    const id = url.searchParams.get('id');
    console.log('ID:',id);
	let studentRes = null;
	try {
		isLoading.set(true);
		// Fetch student data if ID is provided
        if (id) {
			studentRes = await fetch(`${api_base_url}/student/${id}`, {
				method: 'GET',
				headers: { 'Content-Type': 'application/json' },
				credentials: 'include',
			});
			if (!studentRes.ok) {
				const message = await studentRes.text();
				throw error(studentRes.status, message || 'Failed to fetch student data');
			}
        }

		// Fetch fee masters
		const feeMasterRes = await fetch(`${API_BASE_URL}/fee-master/list`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!feeMasterRes.ok) {
			const message = await feeMasterRes.text();
			throw error(feeMasterRes.status, message || 'Failed to fetch fee masters');
		}

		// // Fetch fee groups
		// const feeGroupRes = await fetch(`${API_BASE_URL}/fee-group/list`, {
		// 	method: 'GET',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	credentials: 'include',
		// });

		// if (!feeGroupRes.ok) {
		// 	const message = await feeGroupRes.text();
		// 	throw error(feeGroupRes.status, message || 'Failed to fetch fee groups');
		// }

		// // Fetch fee types
		// const feeTypeRes = await fetch(`${API_BASE_URL}/fee-type/list`, {
		// 	method: 'GET',
		// 	headers: { 'Content-Type': 'application/json' },
		// 	credentials: 'include',
		// });

		// if (!feeTypeRes.ok) {
		// 	const message = await feeTypeRes.text();
		// 	throw error(feeTypeRes.status, message || 'Failed to fetch fee types');
		// }

		// Parse all responses
		const [studentData, feeMasters] = await Promise.all([studentRes?.json(), feeMasterRes.json()]);

        console.log('Server: Student data By findById:', studentData);
        console.log('Server: FeeMaster data By list:', feeMasters);

		return {
			studentData,
			feeMasters
		};
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	} finally {
		isLoading.set(false);
	}
};
