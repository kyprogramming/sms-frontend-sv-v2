<script lang="ts">
	interface Props {
		label: string;
		onClick: () => void;
	}

	let { label, onClick }: Props = $props();
</script>

<button onclick={onClick} class="logout-button">
	{label}
</button>

<!-- prettier-ignore -->
<style>
	.logout-button { background-color: #ef4444; /* red-500 */ color: white; padding: 0.5rem 1rem; border-radius: 0.375rem; font-weight: 500; border: none; cursor: pointer; transition: background-color 0.2s ease; }
	.logout-button:hover { background-color: #dc2626; /* red-600 */ }
	.logout-button:focus { outline: none; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.5); /* red-500/50 */ }
</style>
