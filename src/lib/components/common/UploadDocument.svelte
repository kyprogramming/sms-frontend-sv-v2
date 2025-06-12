<script lang="ts">
	import { PlusCircle, XCircle } from "@lucide/svelte";
	import ImageUploader from "./ImageUploader.svelte";
	import DropdownCategory from "./DropdownCategory.svelte";

	let { index, document = $bindable(), categories, isFirst, onAdd = (e: any) => {}, onRemove = (index: any) => {}, onUpdate = (index: any, date: any) => {} } = $props();

	function handleImageSelect(url: string, title: string) {
		onUpdate(index, { ...document, url: url, title: title });
	}

	function handleCategoryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		onUpdate(index, { ...document, category: target.value });
	}
</script>

<div class="col-2">
	<span class="doc-title">
		{document.title?.split(".")[0]}
	</span>
	<div class="header-bar">
		<!-- <select bind:value={document.category} onselect={handleCategoryChange}>
			<option value="" disabled>Select category</option>
			{#each categories as category}
				<option value={category}>{category}</option>
			{/each}
		</select> -->
		<DropdownCategory role="staff" bind:selected={document.category} onChange={(val) => console.log("Selected Category:", val)} />

		{#if isFirst}
			<button class="plus-button" type="button" onclick={() => onAdd()}>
				<PlusCircle />
			</button>
		{:else}
			<button class="remove-button" type="button" onclick={() => onRemove(index)}>
				<XCircle color="red" />
			</button>
		{/if}
	</div>
	<ImageUploader label="" bind:url={document.url} onSelect={handleImageSelect} />
</div>

<style>
	.doc-title {
		display: inline-block;
		max-width: 200px;
		font-weight: 500;
		color: #1f2937; /* gray-800 */
		font-size: 0.875rem; /* text-sm */
		white-space: nowrap;
		overflow: hidden;
		text-overflow: ellipsis;
		border-radius: 6px;
		padding: 4px 8px;
	}
	.doc-title::first-letter {
		text-transform: uppercase;
	}

	.header-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 5px;
	}

	.plus-button,
	.remove-button {
		color: green;
		background-color: rgb(238, 237, 237);
		border-radius: 6px;
		border: none;
		cursor: pointer;
		display: flex;
		align-items: start;
		align-self: center;
		padding: 9px;
		margin: 0px;
	}
	.remove-button {
		color: red;
	}
	.plus-button:hover,
	.remove-button:hover {
		background-color: rgb(204, 202, 202);
	}
</style>
