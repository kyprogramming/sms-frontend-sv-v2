import { error } from '@sveltejs/kit';
import { API_BASE_URL, DEFAULT_PAGE_LIMIT, ENV, UI_BASE_URL } from '$lib/utils/env.config';
import { isLoading } from '$lib/stores/loading';
import { fetchWithErrorHandling } from '$lib/utils/helper';
import type { PageLoad } from './$types';

const api_base_url = ENV === 'development' ? API_BASE_URL : `${UI_BASE_URL}${API_BASE_URL}`;

export const load: PageLoad = async ({ fetch }) => {
	try {
		isLoading.set(true);
		const params = new URLSearchParams({search: '',page: '1',limit: DEFAULT_PAGE_LIMIT,});
		const resStudentList = await fetchWithErrorHandling(fetch, `${api_base_url}/student?${params.toString()}`, 'Failed to fetch student data');
		const studentList = await resStudentList.json();
		return { studentList };
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	} finally {
		isLoading.set(false);
	}
};
