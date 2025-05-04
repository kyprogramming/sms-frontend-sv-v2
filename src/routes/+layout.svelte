<script lang="ts">
	import LoadingBar from "$lib/components/LoadingBar.svelte";
	import Snackbar from "$lib/components/snackbar/Snackbar.svelte";
	import "../app.css";
	import "../app-input.css";
</script>

<LoadingBar />
<slot />
<Snackbar />
