
<script lang="ts">
	import { isDeleteModalOpen, closeDeleteModal } from "$lib/stores/modalStore";
	import { fade, fly } from "svelte/transition";

	interface Props {
		title?: string;
		size?: "sm" | "md" | "lg" | "xl" | "full";
		onDelete: () => void;
		onCancel: () => void;
	}

	let {
		title = "Confirm Delete",
		size = "md",
		onDelete,
		onCancel
	}: Props = $props();

	function handleOverlayClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains("modal-overlay")) {
			handleCancel();
		}
	}

	function handleModalClick(event: MouseEvent) {
		event.stopPropagation();
	}

	function handleDelete() {
		onDelete?.();
		closeDeleteModal();
	}

	function handleCancel() {
		onCancel?.();
		closeDeleteModal();
	}

	export {
		title,
		size,
		onDelete,
		onCancel,
	}
</script>

{#if $isDeleteModalOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={handleOverlayClick} transition:fade={{ duration: 150 }}>
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="modal-content {size}" onclick={handleModalClick} transition:fly={{ y: -20, duration: 150 }}>
			<div class="modal-header">
				<h2>{title}</h2>
				<button class="close-button" onclick={handleCancel}>&times;</button>
			</div>

			<div class="modal-body">
				<p>Are you sure you want to delete this item?</p>
				<div class="modal-actions">
					<button class="cancel-button" onclick={handleCancel}>Cancel</button>
					<button class="delete-button" onclick={handleDelete}>Delete</button>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.modal-overlay {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		display: flex;
		justify-content: center;
		align-items: center;
		z-index: 1000;
	}

	.modal-content {
		background: white;
		border-radius: 8px;
		box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
		width: 90%;
		max-width: 500px;
		max-height: 90vh;
		overflow-y: auto;
	}

	/* Size classes */
	.modal-content.sm {
		max-width: 400px;
	}
	.modal-content.md {
		max-width: 600px;
	}
	.modal-content.lg {
		max-width: 800px;
	}
	.modal-content.xl {
		max-width: 1140px;
	}
	.modal-content.full {
		width: 95%;
		height: 95vh;
		max-width: none;
	}

	.modal-header {
		padding: 0.5rem;
		background-color: var(--gray1);
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.modal-body {
		padding: 1.5rem;
	}

	.modal-header h2 {
		margin: 0;
		font-size: 1.25rem;
		font-weight: 600;
	}

	.close-button {
		background: none;
		border: none;
		font-size: 1.5rem;
		cursor: pointer;
		color: #6b7280;
		border-radius: 50%;
		width: 2rem;
		height: 2rem;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.2s ease;
	}

	.close-button:hover {
		color: #f00a0a;
		background: rgba(240, 10, 10, 0.1);
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.close-button:active {
		transform: scale(0.95);
	}

	.modal-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	.cancel-button,
	.delete-button {
		padding: 0.5rem 1rem;
		font-size: 1rem;
		border-radius: 8px;
		border: none;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.cancel-button {
		background-color: #f0f0f0;
		color: #333;
	}

	.delete-button {
		background-color: #e53e3e;
		color: white;
	}

	.cancel-button:hover {
		background-color: #d1d1d1;
	}

	.delete-button:hover {
		background-color: #c53030;
	}

	.cancel-button:active,
	.delete-button:active {
		transform: scale(0.98);
	}
</style>
