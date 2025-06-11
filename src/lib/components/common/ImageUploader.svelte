<script lang="ts">
	import { genUploader } from "uploadthing/client";
	import { CheckCircle, Trash2, CameraOff } from "@lucide/svelte";
	import LoaderIcon from "./LoaderIcon.svelte";
	import { onMount } from "svelte";
	// import { closeModal } from "$lib/stores/modalStore";

	export const { uploadFiles } = genUploader<any>({
		url: "http://localhost:5000/api/upload",
	});

	// let {
	// 	label = "Upload Image",
	// 	required = false,
	// 	photoUrl = "",
	// 	onSelect,
	// } = $props<{
	// 	label?: string;
	// 	required?: boolean;
	// 	photoUrl?: string;
	// 	onSelect: (file: File | null) => void;
	// }>();

	let {
		label = "Upload Image",
		required = false,
		photoUrl = $bindable(""),
		onSelect = () => {},
	} = $props();

	let fileInput: HTMLInputElement | null = null;
	let showModal = $state(false);
	let uploadProgress = $state(0);
	let isUploading = $state(false);
	let uploadComplete = $state(false);
	let isLoading = $state(false);

	// Reactively assign preview URL when external photoUrl changes
	// if (photoUrl) {
	// 	uploadComplete = true;
	// }
	// console.log("photoUrl:", photoUrl);
	// console.log("photoUrl:", photoUrl);

	async function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		const file = target?.files?.[0];
		if (file) {
			photoUrl = URL.createObjectURL(file);
			isUploading = true;
			uploadProgress = 0;
			uploadComplete = false;

			const uploadInterval = setInterval(() => {
				if (uploadProgress < 95) {
					uploadProgress += 3;
				}
			}, 150);

			const res = await uploadFiles("imageUploader", {
				files: [file],
			});

			clearInterval(uploadInterval);

			uploadProgress = 100;
			isUploading = false;
			uploadComplete = true;

			photoUrl = res[0]?.ufsUrl ?? "";
			onSelect(file);
		} else {
			onSelect(null);
		}
	}

	function removeImage(e: MouseEvent) {
        e.stopPropagation();
		photoUrl = "";
		uploadComplete = false;
		uploadProgress = 0;
		if (fileInput) fileInput.value = "";
		onSelect(null);
	}

	function toggleModal() {
		if (photoUrl) showModal = !showModal;
		else {
			fileInput?.click();
		}
	}

	function closeModal(e: MouseEvent) {
		e.stopPropagation();
		if (photoUrl) showModal = !showModal;
	}
</script>

<div class="image-upload">
	<label for="upload-box" class="block mb-2 font-medium">
		{label}
		{#if required}<span class="required">*</span>{/if}
	</label>

	<div
		class="upload-box"
		role="button"
		tabindex="0"
		onclick={toggleModal}
		onkeydown={toggleModal}
	>
		{#if photoUrl}
			<img src={photoUrl} alt="Preview" class="preview" />
			<button
				type="button"
				class="remove-btn"
				onclick={removeImage}
			>
				<Trash2 color="red" />
			</button>
			<!-- <button
				type="button"
				class="view-btn"
				on:click|stopPropagation={toggleModal}
			>
				<Eye color="blue" />
			</button> -->

			{#if isUploading}
				<div class="progress-overlay">
					<div class="progress-bar" style="width: {uploadProgress}%"></div>
					<span class="progress-text">{uploadProgress}%</span>
					<!-- <LoaderIcon />
					{#if !isLoading}
						<LoaderIcon />
					{/if} -->
				</div>
			{:else if uploadComplete}
				<div class="success-overlay">
					<CheckCircle color="green" />
				</div>
			{/if}
		{:else}
			<CameraOff />
		{/if}
	</div>

	<input
		type="file"
		accept="image/*"
		bind:this={fileInput}
		class="custom-file-input"
		onchange={handleFileChange}
	/>
</div>

{#if showModal && photoUrl}
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		onclick={toggleModal}
		onkeydown={(e) => {
			if (e.key === "Enter" || e.key === " ") {
				toggleModal();
			}
		}}
	>
		<div class="modal-content">
			<img src={photoUrl} alt="Large preview" />
			<button class="close-modal" onclick={closeModal}>×</button>
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
		margin-top: 20px;
		max-height: 200px;
		border-radius: 0.5rem;
	}

	.remove-btn {
		position: absolute;
		background-color: transparent;
		/* color: white; */
		border: none;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
	}
	.remove-btn {
		top: 0;
		right: 0;
		padding: 5px;
	}

	.progress-overlay {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.7);
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.progress-bar {
		height: 6px;
		width: 80%;
		background-color: #38bdf8;
		border-radius: 4px;
		margin-bottom: 0.5rem;
		transition: width 0.3s ease;
	}
	.progress-text {
		font-size: 0.9rem;
		color: #333;
	}
	.success-overlay {
		position: absolute;
		top: 0;
		left: 0;
		background-color: transparent;
		border-radius: 50%;
		padding: 4px;
	}
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
	}
	.modal-content img {
		max-width: 100%;
		max-height: 80vh;
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
		padding: 0px;
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
		/* margin-right: 1rem; */
		cursor: pointer;
	}

	.custom-file-input::file-selector-button {
		/* background-color: #1e293b; */
		color: white;
		border: none;
		/* padding: 0.5rem 2rem; */
		height: 35px;
		/* margin-right: 1rem; */
		cursor: pointer;
	}

	.custom-file-input::-webkit-file-upload-button:hover,
	.custom-file-input::file-selector-button:hover {
		background-color: #334155;
	}
</style>
