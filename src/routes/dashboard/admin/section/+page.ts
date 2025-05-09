import type { PageLoad } from "../../../home/$types";
const PUBLIC_API_BASE_URL = "http://localhost:5000";

export const load: PageLoad = async ({ fetch }) => {
	const res = await fetch(`${PUBLIC_API_BASE_URL}/api/section`, {
		method: "GET",
		credentials: "include",
	});
	if (!res.ok) {
		console.error('Failed to fetch sections');
		return { data: [] };
	}
    const data = await res.json();
    console.log("Data from Server:", data);
	return {data};
};