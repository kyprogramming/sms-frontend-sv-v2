<script lang="ts">
	interface Props {
		id: string;
		tags?: string[];
		fieldName: string;
	}

	let { id, tags = $bindable([]), fieldName }: Props = $props();
	let input = $state("");

	function addTag() {
		const trimmed = input.trim();
		if (trimmed && !tags.includes(trimmed) && tags.length < 10) {
			tags = [...tags, trimmed];
		}
		input = "";
	}

	function handleKey(e: KeyboardEvent) {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault();
			addTag();
		}
	}

	function removeTag(index: number) {
		tags = tags.filter((_, i) => i !== index);
	}
</script>

<div class="tag-input-wrapper" {id}>
	{#each tags as tag, index}
		<span class="tag">
			{tag}
			<button class="close-btn" onclick={() => removeTag(index)}>&times;</button>
		</span>
	{/each}

	{#if tags.length < 10}
		<input class="tag-input" type="text" bind:value={input} placeholder={`Enter ${fieldName} and press Enter`} onkeydown={handleKey} />
	{/if}
</div>

<style>
	.tag-input-wrapper {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		border-radius: 6px;
		gap: 0.5rem;
	}

	.tag {
		display: flex;
		align-items: center;
		background-color: #f0f0f0;
		border-radius: 6px;
		padding-left: 6px;
		/* padding: 4px 8px; */
		font-size: 14px;
	}

	.close-btn {
		background: none;
		border: none;
		margin-left: 6px;
		font-size: 14px;
		cursor: pointer;
		color: #666;
	}

	.close-btn:hover {
		color: #000;
	}

	.tag-input {
		flex: 1;
		min-width: 100px;
		font-size: 14px;
		padding: 4px;
		border: 1px solid #ccc;
	}
</style>
