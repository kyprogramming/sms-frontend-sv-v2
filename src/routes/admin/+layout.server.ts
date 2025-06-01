import { API_BASE_URL } from "$lib/constants/env.config";
import { classList } from "$lib/stores/masterData";
import type { LayoutServerLoad } from "./$types";

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
		fetch(`${API_BASE_URL}/class/list`, { method: "GET", headers }),
		fetch(`${API_BASE_URL}/section/list`, { method: "GET", headers }),
	]);

	if (resClasses.status === 401 || resSections.status === 401) {
		console.error("Unauthorized request");
	}

    const classData = await resClasses.json();
    const sectionData = await resSections.json();
    
    // if (!classData || !Array.isArray(classData.data)) { 
    //     console.error("Invalid class data received from server");
    //     return {
    //         user: locals.user,
    //         role: locals.user.role,
    //         classData: [],
    //     };
    // }
   
	return {
		user: locals.user,
		role: locals.user.role,
		classData: classData?.data || [],
		sectionData: sectionData?.data || [],
	};
};
