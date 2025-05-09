import { writable } from "svelte/store";

export const searchText = writable('');
export const currentPage = writable(0);
export const rowsPerPage = writable(0);
export const totalItems = writable(0);
export const totalPages = writable(0);
