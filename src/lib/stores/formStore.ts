import { writable } from 'svelte/store';

export const formErrors = writable<Record<string, any>>({});
