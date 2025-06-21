import { API_BASE_URL, ENV, UI_BASE_URL } from '$lib/utils/env.config';
import { error } from '@sveltejs/kit';
import { isLoading } from '$lib/stores/loading';
import type { PageLoad } from './$types';

// const api_base_url = import.meta.env.SSR && ENV === 'development' ? `${API_BASE_URL}` : `${UI_BASE_URL}${API_BASE_URL}`;
const api_base_url = ENV === 'development' ? `${API_BASE_URL}` : `${UI_BASE_URL}${API_BASE_URL}`;

export const load: PageLoad = async ({ url, fetch }) => {
	const id = url.searchParams.get('id');
	let studentRes = null;
	try {
		isLoading.set(true);
		// Fetch student data if id is provided
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

		// Fetch fee discounts
		const feeDiscountRes = await fetch(`${API_BASE_URL}/fee-discount/list`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});
		if (!feeDiscountRes.ok) {
			const message = await feeDiscountRes.text();
			throw error(feeDiscountRes.status, message || 'Failed to fetch fee discounts');
        }
        
		// Parse all responses with promise all responses
		const [studentData, feeMasters, feeDiscounts] = await Promise.all([
			studentRes?.json(),
			feeMasterRes.json(),
			feeDiscountRes.json(),
		]);

		console.log('Server: Student data By findById:', studentData);
		console.log('Server: feeMaster data By list:', feeMasters);
		console.log('Server: feeDiscount data By list:', feeDiscounts);

		return {
			studentData,
			feeMasters,
			feeDiscounts,
		};
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	} finally {
		isLoading.set(false);
	}
};
