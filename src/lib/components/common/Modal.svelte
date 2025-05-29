<script lang="ts" module>
	export type ModalSize = "sm" | "md" | "lg" | "xl" | "full";
</script>

<script lang="ts">
	import { isModalOpen, closeModal } from "$lib/stores/modalStore";
	import { fade, fly } from "svelte/transition";
	interface Props {
		title?: string;
		size?: ModalSize;
		children?: import('svelte').Snippet;
	}

	let { title = "Title", size = "md", children }: Props = $props();

	function handleOverlayClick(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (target.classList.contains("modal-overlay")) {
			closeModal();
		}
	}

	function handleModalClick(event: MouseEvent) {
		event.stopPropagation();
	}
</script>

{#if $isModalOpen}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-overlay" onclick={handleOverlayClick} transition:fade={{ duration: 150 }}>
		<div
			class="modal-content"
			class:sm={size === "sm"}
			class:md={size === "md"}
			class:lg={size === "lg"}
			class:xl={size === "xl"}
			class:full={size === "full"}
			onclick={handleModalClick}
			transition:fly={{ y: -20, duration: 150 }}
		>
			<div class="modal-header">
				<h2>{title}</h2>
				<button class="close-button" onclick={closeModal}>&times;</button>
			</div>

			<div class="modal-body">
				{@render children?.()}
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
		background-color: var(--clr-bg-2);
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
</style>
