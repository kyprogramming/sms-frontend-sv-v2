<script lang="ts">
	import { PlusCircle, XCircle } from '@lucide/svelte';
	import ImageUploader from './ImageUploader.svelte';
	import DropdownCategory from './DropdownCategory.svelte';

	let { index, document = $bindable(), onRemove = (index: any) => {}, onUpdate = (index: any, date: any) => {} } = $props();

	function handleImageSelect(url: string, title: string) {
		onUpdate(index, { ...document, url: url, title: title });
	}
</script>

<div class="col-2">
	<div class="header-bar">
		<DropdownCategory role="staff" bind:selected={document.category} onChange={(val) => console.log('Selected Category:', val)} />
		<button class="remove-button" type="button" onclick={() => onRemove(index)}>
			<XCircle color="red" />
		</button>
	</div>
	<ImageUploader label="" title={document.title} bind:url={document.url} onSelect={handleImageSelect} />
	<span class="doc-title">
		{document.title?.split('.')[0]}
		<!-- {document.title} -->
	</span>
</div><!-- prettier-ignore -->
<style>
	.doc-title { display: block; text-align: center; margin-top: 0.5rem; font-weight: 500; text-transform: lowercase; /* First character uppercase */ }
	/* .doc-title::first-letter { text-transform: uppercase; }
	*/

	.header-bar { display: flex; justify-content: space-between; align-items: center; gap: 5px; }
	.plus-button,
	.remove-button { color: green; background-color: rgb(238, 237, 237); border-radius: 6px; border: none; cursor: pointer; display: flex; align-items: start; align-self: center; padding: 9px; margin: 0px; }
	.remove-button { color: red; }
	.plus-button:hover,
	.remove-button:hover { background-color: rgb(204, 202, 202); }
</style>
