<script lang="ts">
	export let title: string = "";
	export let items: { label: string; href?: string }[] = [];
    	import { Menu, Logs, PlusCircle } from "@lucide/svelte";
</script>

<div class="container-breadcrumb">
    <div class="flex-items-center">
        <h1 class="heading">{title}</h1>
    	<!-- <PlusCircle class="lucide-icon" color="green" /> -->
    </div>
	<nav class="breadcrumb">
		{#each items as item, i}
			{#if item.href}
				<a href={item.href}>{item.label}</a>
				{#if i < items.length - 1}
					<span class="separator">→</span>
				{/if}
			{:else}
				<span>{item.label}</span>
			{/if}
		{/each}
	</nav>
</div>

<style>
	.container-breadcrumb {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 10px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: var(--shadow-sm);
		margin-bottom: 10px;
	}

	.heading {
		margin: 0;
		/* font-size: 1.5rem; */
		font-weight: bold;
		color: #333;
	}

	.breadcrumb {
		/* font-size: 0.9rem; */
		display: flex;
		align-items: center;
		gap: 0.4rem;
	}

	.breadcrumb a {
		color: #1e90ff;
		text-decoration: none;
	}

	.breadcrumb a:hover {
		text-decoration: underline;
	}

	.breadcrumb span {
		color: #333;
	}

	.separator {
		color: #aaa;
	}
</style>
