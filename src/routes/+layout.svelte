<script lang="ts">

	import "../app.css";
	import "../app-input.css";
	import LoadingBar from "$lib/components/common/LoadingBar.svelte";
	import Snackbar from "$lib/components/snackbar/Snackbar.svelte";

	export let data;
	export let children;
</script>

<LoadingBar />

{#if data.user}
	<!-- Redirect handled in +layout.ts or +page.ts per role folder -->
	{@render children()}
{:else}
	<!-- Public layout -->
	{@render children()}
{/if}

<Snackbar />
