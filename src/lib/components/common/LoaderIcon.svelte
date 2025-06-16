<script>
	import { isLoading } from '$lib/stores/loading';
	import { Loader } from '@lucide/svelte';
</script>

{#if $isLoading}
	<div class="sun-spinner">
		<Loader />
	</div>
{/if}<!-- prettier-ignore -->
<style>
	.sun-spinner { /* position: relative; */ width: 18px; height: 18px; animation: rotate 1s linear infinite; }
    @keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
