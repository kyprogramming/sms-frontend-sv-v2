<script lang="ts">
    	import { ChevronRight } from "@lucide/svelte";
	interface Props {
		title?: string;
		items?: { label: string; href?: string }[];
	}

	let { title = "", items = [] }: Props = $props();
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
					<span class="separator">
                       <ChevronRight/>
                        <!-- → -->
                    </span>
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
		padding: 0.5rem;
		background-color: #ffffff;
		border-radius: var(--radius-sm);
		box-shadow: var(--shadow-sm);
	}

	.heading {
		margin: 0;
		color: var(--clr-bg-5);
	}

	.breadcrumb {
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
