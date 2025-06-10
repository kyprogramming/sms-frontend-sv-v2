<script lang="ts">
	import { genUploader } from "uploadthing/client";
	export const { uploadFiles } = genUploader<any>({
		url: "http://localhost:5000/api/upload",
	});
	export let label: string = "Upload Image";
	export let required: boolean = false;
	export let imageUrl: string = "";
	export let onSelect: (file: File | null) => void;
	import { Eye } from "@lucide/svelte";

	let fileInput: HTMLInputElement | null = null;
	let previewUrl: string | null = imageUrl;
	let showModal = false;

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target?.files?.[0];
		if (file) {
			previewUrl = URL.createObjectURL(file);
			const res = await uploadFiles("imageUploader", { files: [file] });
			console.log("Uploaded image URL:", imageUrl);
			imageUrl = res[0]?.ufsUrl ?? "";
			onSelect(file);
		} else {
			// previewUrl = null;
			onSelect(null);
		}
	}

	function triggerFileSelect() {
		fileInput?.click();
	}

	function removeImage() {
		previewUrl = null;
		if (fileInput) fileInput.value = "";
		onSelect(null);
	}

	function toggleModal() {
		showModal = !showModal;
	}
</script>

<div class="image-upload">
	<!-- svelte-ignore a11y_label_has_associated_control -->
	<label class="block mb-2 font-medium">
		{label}
		{#if required}<span class="required">*</span>{/if}
	</label>

	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="upload-box" on:click={triggerFileSelect}>
		{#if previewUrl}
			<!-- svelte-ignore a11y_img_redundant_alt -->
			<img src={previewUrl} alt="Image preview" class="preview" />
			<button
				type="button"
				on:click|stopPropagation={removeImage}
				class="remove-btn"
				aria-label="Remove">×</button
			>
			<button
				type="button"
				on:click|stopPropagation={toggleModal}
				class="view-btn"
				aria-label="View"><Eye size={18} /></button
			>
		{:else}
			<p class="placeholder">Click to select image</p>
		{/if}
	</div>

	<input
		type="file"
		accept="image/*"
		bind:this={fileInput}
		class="hidden custom-file-input"
		on:change={handleFileChange}
	/>
</div>

{#if showModal && previewUrl}
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="modal-backdrop" on:click={toggleModal}>
		<div class="modal-content" on:click|stopPropagation>
			<img src={previewUrl} alt="Large preview" />
			<button class="close-modal" on:click={toggleModal}>×</button>
		</div>
	</div>
{/if}

<style>
	.image-upload {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.upload-box {
		position: relative;
		border: 2px dashed #ccc;
		border-radius: 0.5rem;
		padding: 1rem;
		cursor: pointer;
		text-align: center;
		background-color: #f9f9f9;
		min-height: 160px;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.upload-box:hover {
		border-color: #888;
	}

	.placeholder {
		color: #777;
	}

	.preview {
		max-width: 100%;
		max-height: 200px;
		border-radius: 0.5rem;
	}

	.remove-btn,
	.view-btn {
		position: absolute;
		background-color: #e53e3e;
		color: white;
		border: none;
		border-radius: 50%;
		width: 28px;
		height: 28px;
		font-size: 16px;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		padding: 0;
	}

	.remove-btn {
		top: -1px;
		right: -1px;
	}

	.view-btn {
		bottom: -1px;
		right: -1px;
		background-color: #3182ce;
	}

	.view-btn:hover {
		background-color: #2b6cb0;
	}

	.remove-btn:hover {
		background-color: #c53030;
	}

	/* Modal Styles */
	.modal-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
	}

	.modal-content {
		position: relative;
		background: white;
		padding: 1rem;
		border-radius: 0.5rem;
		max-width: 90%;
		max-height: 90%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.modal-content img {
		max-width: 100%;
		max-height: 80vh;
		border-radius: 0.5rem;
	}

	.close-modal {
		position: absolute;
		top: 8px;
		right: 8px;
		background: #e53e3e;
		color: white;
		border: none;
		border-radius: 50%;
		width: 28px;
		height: 28px;
		font-size: 18px;
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.close-modal:hover {
		background: #c53030;
	}

	.custom-file-input {
		width: 100%;
		height: 35px;
		border: 1px solid #ccc;
		border-radius: 0.3rem;
		background-color: var(--clr-bg-1);
		transition: all 0.1s ease;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.custom-file-input:focus {
		outline: none;
		border-color: var(--info);
		box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
	}

	/* Style the Choose File button (Chrome/Edge/Firefox) */
	.custom-file-input::-webkit-file-upload-button {
		background-color: var(--clr-bg-5);
		color: white;
		/* border: none; */
		/* padding: 0.5rem; */
		margin-right: 1rem;
		cursor: pointer;
	}

	.custom-file-input::file-selector-button {
		/* background-color: #1e293b; */
		color: white;
		border: none;
		padding: 0.5rem 2rem;
		height: 35px;
		/* margin-right: 1rem; */
		cursor: pointer;
	}

	.custom-file-input::-webkit-file-upload-button:hover,
	.custom-file-input::file-selector-button:hover {
		background-color: #334155;
	}
</style>
