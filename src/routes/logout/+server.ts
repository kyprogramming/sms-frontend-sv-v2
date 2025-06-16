// src/routes/logout/+server.ts
import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	cookies.delete('session_token', { path: '/' });
	throw redirect(302, '/login');
};
