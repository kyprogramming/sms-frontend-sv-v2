import { API_BASE_URL, ENV, UI_BASE_URL } from "$lib/utils/env.config";
import { classList } from "$lib/stores/masterData";
import type { LayoutServerLoad } from "./$types";

const url = import.meta.env.SSR && ENV === "development" ? `${API_BASE_URL}` : `${UI_BASE_URL}${API_BASE_URL}`;
export const load: LayoutServerLoad = async ({ locals, cookies }) => {
	if (!locals.user) {
		return {
			user: null,
			role: null,
		};
	}

	const authToken = cookies.get("session_token"); // replace with actual cookie name

	const headers = {
		"Content-Type": "application/json",
		Cookie: `session_token=${authToken}`,
	};

	const [resClasses, resSections] = await Promise.all([
		fetch(`${url}/class/list`, { method: "GET", headers }),
		fetch(`${url}/section/list`, { method: "GET", headers }),
	]);

	if (resClasses.status === 401 || resSections.status === 401) {
		console.error("Unauthorized request");
	}

	const classData = await resClasses.json();
	const sectionData = await resSections.json();

	return {
		user: locals.user,
		role: locals.user.role,
		classData: classData?.data || [],
		sectionData: sectionData?.data || [],
	};
};
