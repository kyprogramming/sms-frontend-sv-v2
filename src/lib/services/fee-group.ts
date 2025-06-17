import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';

export interface FeeHeadPayload {
	name: string;
	categoryId: string;
	amount: number;
	description?: string;
}

export async function createFeeHead(data: FeeHeadPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group`, {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create fee head');
}

export async function fetchFeeHeads(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee heads');
}

export async function fetchFeeHeadById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee head');
}

export async function updateFeeHead(id: string, data: FeeHeadPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update fee head');
}

export async function deleteFeeHeadById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-group/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete fee head');
}
