// src/lib/stores/loading.ts
import { writable } from "svelte/store";

export const isModalOpen = writable(false);

export function openModal() {
	isModalOpen.set(true);
}

export function closeModal() {
	isModalOpen.set(false);
}