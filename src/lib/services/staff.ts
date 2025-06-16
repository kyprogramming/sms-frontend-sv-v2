import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse } from '$lib/utils/utils';

// Create class
export async function createStaff(data: any) {
	// console.log(data);
	const res = await fetchWrapper(`${API_BASE_URL}/staff`, {
		method: 'POST',
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create class');
}

// Update staff
export async function updateStaff(id: string, data: any) {
	const res = await fetchWrapper(`${API_BASE_URL}/staff/${id}`, {
		method: 'PUT',
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update staff');
}

// Fetch staff list
export async function fetchStaffList(params: URLSearchParams) {
	let res = await fetchWrapper(`${API_BASE_URL}/staff?${params.toString()}`, { method: 'GET' });
	return handleResponse(res, 'Failed to fetch staff');
}
