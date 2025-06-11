<script lang="ts">
	import { PlusCircle, XCircle } from "@lucide/svelte";
	import ImageUploader from "./ImageUploader.svelte";

	let {
		index,
		section = $bindable(),
		categories ,
		isFirst,
		onAdd = (e: any) => {},
		onRemove = (index: any) => {},
		onUpdate = (index: any, date: any) => {},
	} = $props();

	function handleImageSelect(url: string) {
		onUpdate(index, { ...section, photoUrl: url });
	}

	function handleCategoryChange(event: Event) {
		const target = event.target as HTMLSelectElement;
		onUpdate(index, { ...section, category: target.value });
	}
</script>

<div class="col-2">
	<div class="header-bar">
		<select bind:value={section.category} onselect={handleCategoryChange}>
			<option value="" disabled>Select category</option>
			{#each categories as category}
				<option value={category}>{category}</option>
			{/each}
		</select>

		{#if isFirst}
			<button class="plus-button" type="button" onclick={() => onAdd()}>
				<PlusCircle />
			</button>
		{:else}
			<button
				class="remove-button"
				type="button"
				onclick={() => onRemove(index)}
			>
				<XCircle color="red" />
			</button>
		{/if}
	</div>
	<ImageUploader
		label=""
		bind:photoUrl={section.photoUrl}
		onSelect={handleImageSelect}
	/>
</div>

<style>
	.header-bar {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 0.5rem;
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
