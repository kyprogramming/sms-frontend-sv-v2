<script lang="ts">
	import { snackbars } from './store';
	import { fly, fade } from 'svelte/transition';
	import { CheckCircle, AlertTriangle, Info, XCircle } from '@lucide/svelte';

	const icons = {
		success: CheckCircle,
		error: XCircle,
		info: Info,
		warning: AlertTriangle,
	};
</script>

<div class="snackbar-container">
	{#each $snackbars as snackbar (snackbar.id)}
		{@const SvelteComponent = icons[snackbar.type]}
		<div class="snackbar {snackbar.type}" in:fly={{ y: -20, duration: 200 }} out:fade={{ duration: 200 }}>
			<!-- Close Button -->
			<button class="close-btn" onclick={() => snackbars.update((n) => n.filter((s) => s.id !== snackbar.id))} aria-label="Close"> &times; </button>

			<!-- Icon and Message -->
			<SvelteComponent size={20} />
			<span>{snackbar.message}</span>

			<!-- Progress Bar -->
			<div class="progress-bar" style="animation-duration: {snackbar.duration || 4000}ms;"></div>
		</div>
	{/each}
</div>

<style>
	.snackbar-container {
		position: fixed;
		bottom: 1rem;
		right: 1rem;
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 1000;
	}

	.snackbar {
		min-width: 320px;
		padding: 1rem;
		border-radius: 6px;
		display: flex;
		align-items: center;
		gap: 10px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
		color: white;
		position: relative;
		overflow: hidden;
	}

	.close-btn {
		position: absolute;
		top: 0;
		right: 5px;
		background: transparent;
		border: none;
		color: white;
		font-size: 1rem;
		cursor: pointer;
		padding: 0;
		line-height: 1;
	}

	.close-btn:hover {
		/* color: rgba(255, 255, 255, 0.8); */
		color: #000000;
		border-radius: 50%;
	}

	.snackbar.success {
		background: #16a34a;
	} /* green */
	.snackbar.error {
		background: #dc2626;
	} /* red */
	.snackbar.info {
		background: #2563eb;
	} /* blue */
	.snackbar.warning {
		background: #f59e0b;
	} /* yellow */

	.progress-bar {
		position: absolute;
		bottom: 0;
		left: 0;
		height: 4px;
		background: rgba(255, 255, 255, 0.6);
		width: 0%;
		animation: growRight linear forwards;
	}

	@keyframes growRight {
		from {
			width: 0%;
		}
		to {
			width: 100%;
		}
	}
</style>
