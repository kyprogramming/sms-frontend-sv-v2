<script lang="ts">
	import { isLoading } from '$lib/stores/loading';
	import { CircleX, Trash2 } from '@lucide/svelte';
	import { fade, fly } from 'svelte/transition';
	import LoaderIcon from './LoaderIcon.svelte';

	let { title = 'Confirm Delete', size = 'md', selectedName, onDelete, onCancel } = $props();

	function handleModalClick(event: MouseEvent | KeyboardEvent) {
		event.stopPropagation();
	}

	function handleDelete() {
		onDelete?.();
	}

	function handleCancel() {
		onCancel?.();
	}
</script>

<div class="modal-overlay" transition:fade={{ duration: 150 }}>
	<div
		role="button"
		tabindex="0"
		class="modal-content {size}"
		onclick={handleModalClick}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				handleModalClick(e);
			}
		}}
		transition:fly={{ y: -20, duration: 150 }}
	>
		<div class="modal-header">
			<h2>{title}</h2>
			<button class="close-button" onclick={handleCancel}>&times;</button>
		</div>

		<div class="modal-body">
			<h1>Are you sure you want to delete this item?</h1>
			<h2>{selectedName}</h2>
			<div class="modal-actions">
				<button type="button" class="btn ripple btn-secondary" onclick={handleCancel}>
					<CircleX />
					<span>Cancel</span>
				</button>

				<button type="button" class="btn ripple delete-button" onclick={handleDelete}>
					<LoaderIcon />
					{#if !$isLoading}
						<Trash2 />
					{/if}
					<span>Delete</span>
				</button>
			</div>
		</div>
	</div>
</div>

<!-- prettier-ignore -->
<style>
	.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
	.modal-content { background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; }
	/* Size classes */
	.modal-content.sm { max-width: 400px; }
	.modal-content.md { max-width: 600px; }
	.modal-content.lg { max-width: 800px; }
	.modal-content.xl { max-width: 1140px; }
	.modal-content.full { width: 95%; height: 95vh; max-width: none; }
	.modal-header { display: flex; padding: 5px; background-color: var(--clr-bg-2); display: flex; justify-content: space-between; align-items: center; }
	.modal-body { padding: 1rem; }

	.modal-body h2 { font-size: 14px; font-weight: 600; opacity: 0.7; }
	.modal-header h2 { margin: 0; font-size: 1rem; font-weight: 600; padding: 0; margin-left: 15px; align-items: center; justify-content: center; }
	.close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
	.close-button:hover { color: #f00a0a; background: rgba(240, 10, 10, 0.1); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
	.modal-actions { display: flex; justify-content: flex-end; gap: 1rem; }
	.cancel-button,
	.delete-button { background-color: #e53e3e; color: white; transition: background-color 0.2s; }
	.cancel-button { background-color: #f0f0f0; color: #333; }
	.cancel-button:hover { background-color: #d1d1d1; }
	.delete-button:hover { background-color: #c53030; }
	.cancel-button:active,
	.delete-button:active { transform: scale(0.98); }
</style>
