<script lang="ts">
	import { isLoading } from "$lib/stores/loading";
	import { onDestroy } from "svelte";

	let progress = 0;
	let show = false;
	let interval: NodeJS.Timeout;

	$: if ($isLoading) {
		show = true;
		startAnimation();
	} else {
		stopAnimation();
		progress = 100;
		setTimeout(() => {
			show = false;
			progress = 0;
		}, 300);
	}

	function startAnimation() {
		progress = 0;
		clearInterval(interval);
		interval = setInterval(() => {
			progress = Math.random() * 80 + 10; // animate between 10–90%
		}, 500);
	}

	function stopAnimation() {
		clearInterval(interval);
	}

	onDestroy(stopAnimation);
</script>

{#if show}
	<div class="loading-bar" style="transform: scaleX({progress / 100}); transition: transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);"></div>
{/if}

<style>
	.loading-bar {
		height: 4px;
		background: #3b82f6;
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		transform-origin: left;
		z-index: 9999;
	}
</style>
