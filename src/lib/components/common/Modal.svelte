<script lang="ts" module>
	export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';
</script>

<script lang="ts">
	import { fade, fly } from 'svelte/transition';

	let { title = 'Title', size = 'md', children, onClose, onCancel } = $props();

	function handleModalClick(event: MouseEvent | KeyboardEvent) {
		event.stopPropagation();
	}

	function handleCancel() {
		onCancel?.();
	}
</script>

<div class="modal-overlay" transition:fade={{ duration: 150 }}>
	<div
		role="button"
		tabindex="0"
		class="modal-content"
		class:sm={size === 'sm'}
		class:md={size === 'md'}
		class:lg={size === 'lg'}
		class:xl={size === 'xl'}
		class:full={size === 'full'}
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
			{@render children?.()}
		</div>
	</div>
</div>

<!-- prettier-ignore -->
<style>
	.modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center; z-index: 1000; }
	.modal-content { background: white; border-radius: 8px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15); width: 90%; max-width: 500px; max-height: 90vh; /* overflow-y: auto; */ }
	/* Size classes */
	.modal-content.sm { max-width: 400px; }
	.modal-content.md { max-width: 600px; }
	.modal-content.lg { max-width: 800px; }
	.modal-content.xl { max-width: 1140px; }
	.modal-content.full { width: 95%; height: 95vh; max-width: none; }
	.modal-header { display: flex; padding: 5px; background-color: var(--clr-bg-2); display: flex; justify-content: space-between; align-items: center; border-radius: 8px 8px 0 0; }
	.modal-body { padding: 1rem; z-index: 10; }
	.modal-header h2 { margin: 0; font-size: 1rem; font-weight: 600; padding: 0; margin-left: 15px; align-items: center; justify-content: center; }
	.close-button { background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #6b7280; border-radius: 50%; width: 2rem; height: 2rem; display: flex; align-items: center; justify-content: center; transition: all 0.2s ease; }
	.close-button:hover { color: #f00a0a; background: rgba(240, 10, 10, 0.1); box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
	.close-button:active { transform: scale(0.95); }
</style>
