<script lang="ts">
	interface Props {
		segment: string;
		children?: import('svelte').Snippet;
	}

	let { segment, children }: Props = $props();
</script>

<!-- <Sidebar role="admin" /> -->
<main class="p-4">
	{@render children?.()}
</main>
