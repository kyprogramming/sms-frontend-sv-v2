// Helper functions
import { error } from '@sveltejs/kit';


// Function to fetch data with error handling
const commonOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include' as RequestCredentials,
};

export async function fetchWithErrorHandling(fetch: typeof window.fetch, url: string, errorMessage: string) {
    const res = await fetch(url, commonOptions);
    if (!res.ok) {
        const message = await res.text();
        throw error(res.status, message || errorMessage);
    }
    return res;
}

