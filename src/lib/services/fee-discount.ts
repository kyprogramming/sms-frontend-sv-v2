import type { FeeDiscountPayload } from '$lib/schemas/fee-discount.schema';
import { API_BASE_URL } from '$lib/utils/env.config';
import { fetchWrapper } from '$lib/utils/fetchWrapper';
import { handleResponse, JSON_HEADERS } from '$lib/utils/utils';


export async function createFeeDiscount(data: FeeDiscountPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-discount`, {
		method: 'POST',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to create fee discount');
}

export async function fetchFeeDiscounts(params: URLSearchParams) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-discount?${params.toString()}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee discounts');
}

export async function fetchFeeDiscountById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-discount/${id}`, {
		method: 'GET',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to fetch fee discount');
}

export async function updateFeeDiscount(id: string, data: FeeDiscountPayload) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-discount/${id}`, {
		method: 'PUT',
		headers: JSON_HEADERS,
		body: JSON.stringify(data),
	});
	return handleResponse(res, 'Failed to update fee discount');
}

export async function deleteFeeDiscountById(id: string) {
	const res = await fetchWrapper(`${API_BASE_URL}/fee-discount/${id}`, {
		method: 'DELETE',
		headers: JSON_HEADERS,
	});
	return handleResponse(res, 'Failed to delete fee discount');
}
