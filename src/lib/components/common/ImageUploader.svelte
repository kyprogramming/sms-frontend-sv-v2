<script lang="ts">
	import { genUploader } from "uploadthing/client";
	import { CheckCircle, Trash2, CameraOff, Loader } from "@lucide/svelte";
	export const { uploadFiles } = genUploader<any>({
		url: "http://localhost:5000/api/upload",
	});
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

	async function handleFileChange(event: Event) {
		try {
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

				isLoading = true;
				const res = await uploadFiles("imageUploader", {
					files: [file],
				});

				clearInterval(uploadInterval);

				uploadProgress = 100;
				isUploading = false;
				uploadComplete = true;

				photoUrl = res[0]?.ufsUrl ?? "";
				onSelect(photoUrl);
			} else {
				onSelect(null);
			}
		} catch (error) {
		} finally {
            isLoading = false;
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
	<label for="upload-box">
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
           
			<button type="button" class="remove-btn" onclick={removeImage}>
				<Trash2 color="red" />
			</button>
			{#if isUploading}
				<div class="progress-overlay">
					<div class="progress-bar" style="width: {uploadProgress}%"></div>
					<span class="progress-text">{uploadProgress}%</span>
                    {#if isLoading}
                    <div class="sun-spinner">
                        <Loader />
                    </div>
                {/if}
				</div>
			{:else if uploadComplete || photoUrl}
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
		padding: 4px;
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

	.preview {
		max-width: 100%;
		margin-top: 20px;
		max-height: 250px;
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

	.sun-spinner {
		/* position: relative; */
		width: 18px;
		height: 18px;
		animation: rotate 1s linear infinite;
	}

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
