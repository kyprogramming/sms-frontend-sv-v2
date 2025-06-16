export function formatDate(value: string | number | Date): string {
	if (!value) return '';
	return new Date(value).toLocaleDateString('en-GB', {
		day: '2-digit',
		month: 'short',
		year: 'numeric',
	});
}

export function formatLocalDate(date: Date | null): string {
	if (!(date instanceof Date) || isNaN(date.getTime())) {
		throw new Error('Invalid Date object provided');
	}
	const year = date.getFullYear();
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const day = String(date.getDate()).padStart(2, '0');

	return `${year}-${month}-${day}`;
}
