import { error } from '@sveltejs/kit';
import { API_BASE_URL, ENV, UI_BASE_URL } from '$lib/utils/env.config';
import type { LayoutServerLoad } from './$types';
import { fetchWithErrorHandling } from '$lib/utils/helper';

const apiBaseUrl = import.meta.env.SSR && ENV === 'development' ? API_BASE_URL : `${UI_BASE_URL}${API_BASE_URL}`;

export const load: LayoutServerLoad = async ({ locals, cookies, fetch }) => {
	if (!locals.user) {
		return {
			user: null,
			role: null,
			classList: [],
			sectionData: [],
			feeTypeData: [],
		};
	}

	try {
        const [classesRes, sectionsRes, feeTypesRes] = await Promise.all(
            [
                fetchWithErrorHandling(fetch, `${apiBaseUrl}/class/list`, 'Failed to fetch class list'),
                fetchWithErrorHandling(fetch, `${apiBaseUrl}/section/list`, 'Failed to fetch section list'),
                fetchWithErrorHandling(fetch, `${apiBaseUrl}/fee-type/list`, 'Failed to fetch fee types')
            ]);
		const [classList, sectionData, feeTypeData] = await Promise.all([classesRes.json(), sectionsRes.json(), feeTypesRes.json()]);

		return {
			user: locals.user,
			role: locals.user.role,
			classList: classList?.data || [],
			sectionData: sectionData?.data || [],
			feeTypeData: feeTypeData?.data || [],
		};
	} catch (err) {
		throw error(500, err instanceof Error ? err.message : 'An unknown error occurred');
	}
};
