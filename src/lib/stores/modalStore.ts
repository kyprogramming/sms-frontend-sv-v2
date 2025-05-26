import { writable } from "svelte/store";

export const isModalOpen = writable(false);
export const isDeleteModalOpen = writable(false);
export const modalData = writable<any>(null);
export const isUpdate = writable<boolean>(false);

export function openModal() {
	isModalOpen.set(true);
	isUpdate.set(false);
}

export function openEditModal() {
	isUpdate.set(true);
	isModalOpen.set(true);
}

export function closeModal() {
	isModalOpen.set(false);
}

export function openDeleteModal(data: any = null) {
	isDeleteModalOpen.set(true);
	modalData.set(data);
}

export function closeDeleteModal() {
	isDeleteModalOpen.set(false);
}
