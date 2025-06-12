<script lang="ts">
	import { onMount } from 'svelte';
	import * as pdfjsLib from 'pdfjs-dist';
	// @ts-ignore to avoid TS error for worker
	// eslint-disable-next-line @typescript-eslint/ban-ts-comment
	// @ts-ignore
	import workerSrc from 'pdfjs-dist/build/pdf.worker.mjs?url';

	pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;

    export let pdfUrl: string;
	let canvasEl: HTMLCanvasElement;

	// onMount(async () => {
	// 	if (!pdfUrl || !canvasEl) return;

	// 	const loadingTask = pdfjsLib.getDocument(pdfUrl);
	// 	const pdf = await loadingTask.promise;

	// 	const page = await pdf.getPage(1);
	// 	const viewport = page.getViewport({ scale: 1.5 });
	// 	const context = canvasEl.getContext('2d');

	// 	canvasEl.height = viewport.height;
	// 	canvasEl.width = viewport.width;

	// 	await page.render({ canvasContext: context!, viewport }).promise;
	// });
</script>

<!-- svelte-ignore element_invalid_self_closing_tag -->
<!-- <canvas bind:this={canvasEl} class="pdf-canvas" /> -->
<iframe src={pdfUrl} width="100%" height="800px"></iframe>

<style>
	.pdf-canvas {
		max-width: 100%;
        max-height: 600px;
		border: 1px solid #ccc;
		box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        margin-top:1.5rem;
        border-radius: 0.5rem;
	}
</style>