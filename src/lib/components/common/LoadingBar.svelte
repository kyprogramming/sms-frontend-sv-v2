<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { isLoading } from '$lib/stores/loading';

	let progress = $state(0);
	let show = $state(false);
	let interval: NodeJS.Timeout;

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

	onMount(() => {
		const unsubscribe = isLoading.subscribe((loading) => {
			if (loading) {
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
		});

		onDestroy(() => {
			unsubscribe();
			stopAnimation();
		});
	});
</script>

{#if show}
	<div class="loading-bar" style="transform: scaleX({progress / 100}); transition: transform 0.2s cubic-bezier(0.25, 0.8, 0.25, 1);"></div>
{/if}<!-- prettier-ignore -->
<style>
	.loading-bar { height: 1.5px; background: #3b82f6; position: fixed; top: 0; left: 0; right: 0; transform-origin: left; z-index: 1000; }
</style>
