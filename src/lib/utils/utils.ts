
export function decodeJwt(token: string) {
	const payload = JSON.parse(atob(token.split(".")[1]));
	return payload;
}
