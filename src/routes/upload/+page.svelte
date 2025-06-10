<script lang="ts">
	import { genUploader } from "uploadthing/client";

	export const { uploadFiles } = genUploader<any>({
		url: "http://localhost:5000/api/upload",
	});

	let fileInput: HTMLInputElement;
	let uploadedUrl = "";
	let errorMessage = "";

	async function handleUpload() {
		const file = fileInput.files?.[0];
		if (!file) {
			errorMessage = "No file selected.";
			return;
		}

		try {
			const res = await uploadFiles("imageUploader", { files: [file] });
			uploadedUrl = res[0]?.url ?? "";
			errorMessage = "";
		} catch (err) {
			console.error(err);
			errorMessage = "Upload failed.";
		}
	}
</script>

<input type="file" bind:this={fileInput} />
<button on:click={handleUpload}>Upload</button>

{#if uploadedUrl}
	<p>✅ Uploaded: <a href={uploadedUrl} target="_blank">{uploadedUrl}</a></p>
	<img src={uploadedUrl} alt="Preview" style="max-width: 200px;" />
{/if}

{#if errorMessage}
	<p style="color: red;">{errorMessage}</p>
{/if}

<style>
	.dropzone {
		border: 2px dashed #ccc;
		padding: 2rem;
		text-align: center;
		border-radius: 1rem;
		transition: background 0.3s;
	}

	.dropzone.drag-over {
		background-color: #f9f9f9;
	}
</style>
