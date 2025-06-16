import type { Handle, HandleServerError } from '@sveltejs/kit';
import { decodeJwt } from '$lib/utils/utils';

export const handle: Handle = async ({ event, resolve }) => {
	try {
		const sessionToken = event.cookies.get('session_token');

		if (sessionToken) {
			const decoded = decodeJwt(sessionToken);

			event.locals.user = {
				id: decoded.id,
				name: decoded.name,
				email: decoded.email,
				role: decoded.role,
				authenticated: true,
			};
		}

		const response = await resolve(event);
		return response;
	} catch (error) {
		console.error('Error caught in handle():', error);
		throw error; // optional: you can customize this if needed
	}
};

export const handleError: HandleServerError = ({ error, event }) => {
	let message = 'An unexpected error occurred. Please try again.';
	let code = 'UNKNOWN';

	if (error instanceof Error) {
		console.error('Global error:', error.message);
		message = error.message;
		code = error.name;
	} else {
		console.error('Global error:', error);
	}
	console.error('At route:', event.url.pathname);
	return { message, code };
};
