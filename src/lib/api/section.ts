import { goto, invalidate } from "$app/navigation";

const API_BASE = "http://localhost:5000/api";

export interface ISection extends Document {
	name: string;
}

export async function createSection(data: any) {
	try {
		const res = await fetch(`${API_BASE}/section`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
			credentials: "include",
		});
		if (!res.ok) throw new Error("Failed to create section");
		// Refresh the page's load() function
		// await invalidate("/dashboard/admin/section");
        // await invalidate("http://localhost:5000/api/section");
        await goto("/dashboard/admin/section");
		return await res.json();
	} catch (error) {
		console.error("Create Section Error:", error);
		throw error;
	}
}
