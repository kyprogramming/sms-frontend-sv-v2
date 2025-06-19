import { API_BASE_URL, DEFAULT_PAGE_LIMIT } from '$lib/utils/env.config';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { isLoading } from '$lib/stores/loading';

export const load: PageLoad = async ({ fetch }) => {
	try {
		isLoading.set(true);

		// Fetch student fee assignments
		const assignmentParams = new URLSearchParams({
			search: '',
			page: '1',
			limit: DEFAULT_PAGE_LIMIT,
		});
		const assignmentRes = await fetch(`${API_BASE_URL}/fee-assignment?${assignmentParams.toString()}`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!assignmentRes.ok) {
			const message = await assignmentRes.text();
			throw error(assignmentRes.status, message || 'Failed to fetch student fee assignments');
		}

		// Fetch students
		const studentRes = await fetch(`${API_BASE_URL}/student/list`, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'include',
		});

		if (!studentRes.ok) {
			const message = await studentRes.text();
			throw error(studentRes.status, message || 'Failed to fetch students');
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

		// Parse all responses
		const [assignments, students, feeMasters] = await Promise.all([assignmentRes.json(), studentRes.json(), feeMasterRes.json()]);

		return {
			data: assignments,
			students,
			feeMasters,
		};
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	} finally {
		isLoading.set(false);
	}
};
