<script lang="ts">
	import { onMount } from "svelte";

	// Props
	export let images: string[] = ["https://picsum.photos/id/1018/1200/400", "https://picsum.photos/id/1020/1200/400", "https://picsum.photos/id/1033/1200/400"];

	// State
	let currentIndex = 0;

	// Auto play interval
	let intervalDuration = 3000;
	let interval: number | null = null;

	function next() {
		currentIndex = (currentIndex + 1) % images.length;
	}

	function prev() {
		currentIndex = (currentIndex - 1 + images.length) % images.length;
	}

	function startAutoPlay() {
		if (intervalDuration > 0) {
			interval = setInterval(next, intervalDuration) as unknown as number;
		}
	}

	function stopAutoPlay() {
		if (interval !== null) {
			clearInterval(interval);
		}
	}

	onMount(() => {
		startAutoPlay();
		return () => {
			stopAutoPlay();
		};
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="carousel" on:mouseenter={stopAutoPlay} on:mouseleave={startAutoPlay}>
	<div class="carousel-track" style="transform: translateX(-{currentIndex * 100}%);">
		{#each images as image}
			<div class="carousel-item">
				<img src={image} alt="Slide" />
			</div>
		{/each}
	</div>

	<div class="carousel-controls">
		<button on:click={prev} class="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none">❮</button>
		<button on:click={next} class="bg-black bg-opacity-50 text-white p-2 rounded-full focus:outline-none">❯</button>
	</div>

	<div class="carousel-indicators">
		{#each images as _, index}
			<!-- svelte-ignore a11y_consider_explicit_label -->
			<button class="indicator {index === currentIndex ? 'active' : ''}" on:click={() => (currentIndex = index)}></button>
		{/each}
	</div>
</div>

<style>
	.carousel {
		position: relative;
		width: 100%;
		max-width: 100%;
		overflow: hidden;
		border-radius: 0.5rem;
		/* margin-top: 10px; */
	}

	.carousel-track {
		display: flex;
		transition: transform 0.5s ease-in-out;
	}

	.carousel-item {
		min-width: 100%;
		transition: transform 0.3s ease;
	}

	.carousel-item img {
		width: 100%;
		display: block;
	}

	.carousel-controls {
		position: absolute;
		top: 50%;
		width: 100%;
		display: flex;
		justify-content: space-between;
		transform: translateY(-50%);
		padding: 0 1rem;
	}

	.carousel-indicators {
		position: absolute;
		bottom: 1rem;
		left: 50%;
		transform: translateX(-50%);
		display: flex;
		gap: 0.5rem;
	}

	.indicator {
		width: 0.75rem;
		height: 0.75rem;
		background-color: rgba(255, 255, 255, 0.6);
		border-radius: 999px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.indicator.active {
		background-color: white;
	}
</style>
