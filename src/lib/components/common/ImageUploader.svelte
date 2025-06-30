<script lang="ts">
	import { genUploader } from 'uploadthing/client';
	import { CheckCircle, Trash2, CameraOff, Loader, Maximize2 } from '@lucide/svelte';
	export const { uploadFiles } = genUploader<any>({
		url: 'http://localhost:5000/api/upload',
	});
	let { label = 'Upload Image', required = false, title = '', url = $bindable(''), onSelect = () => {}, action } = $props();

	let fileInput: HTMLInputElement | null = null;
	let showModal = $state(false);
	let uploadProgress = $state(0);
	let isUploading = $state(false);
	let uploadComplete = $state(false);
	let isLoading = $state(false);
	let fileName = $state(title);

	async function handleFileChange(event: Event) {
		try {
			const target = event.target as HTMLInputElement;
			const file = target?.files?.[0];
			if (file) {
				url = URL.createObjectURL(file);
				fileName = file.name;
				console.log('file', file);
				isUploading = true;
				uploadProgress = 0;
				uploadComplete = false;

				const uploadInterval = setInterval(() => {
					if (uploadProgress < 95) {
						uploadProgress += 3;
					}
				}, 150);

				isLoading = true;
				const res = await uploadFiles('imageUploader', {
					files: [file],
				});

				clearInterval(uploadInterval);

				uploadProgress = 100;
				isUploading = false;
				uploadComplete = true;

				url = res[0]?.ufsUrl ?? '';
				onSelect(url, file.name);
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
		url = '';
		uploadComplete = false;
		uploadProgress = 0;
		if (fileInput) fileInput.value = '';
		onSelect(null);
	}

	function toggleModal() {
		if (url) showModal = !showModal;
		else {
			fileInput?.click();
		}
	}

	function closeModal(e: MouseEvent) {
		e.stopPropagation();
		if (url) showModal = !showModal;
	}
</script>

<div class="image-upload">
	<label for="upload-box">
		{label}
		{#if required}<span class="required">*</span>{/if}
	</label>

	<div class="upload-box" role="button" tabindex="0" onclick={toggleModal} onkeydown={toggleModal}>
		{#if url}
			{#if fileName.toLowerCase().endsWith('.pdf')}
				<div class="pdf-preview-container">
					<iframe src={url} class="pdf-preview" title="PDF Preview"></iframe>
					<div class="pdf-overlay">
						<Maximize2 class="maximize-icon" />
						<span>Click to view fullscreen</span>
					</div>
				</div>
			{:else}
				<div class="pdf-preview-container">
					<img src={url} alt="Preview" class="preview" />
					<div class="pdf-overlay">
						<Maximize2 class="maximize-icon" />
						<span>Click to view fullscreen</span>
					</div>
				</div>
			{/if}

			{#if action !== 'view'}
				<button type="button" class="remove-btn" onclick={removeImage}>
					<Trash2 color="red" />
				</button>
			{/if}

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
			{:else if uploadComplete || url}
				<div class="success-overlay">
					<CheckCircle color="green" />
				</div>
			{/if}
		{:else}
			<CameraOff />
		{/if}
	</div>
	{#if action !== 'view'}
		<input type="file" accept="image/*,application/pdf" bind:this={fileInput} class="custom-file-input" onchange={handleFileChange} />
	{/if}
</div>

{#if showModal && (fileName || url)}
	<div
		class="modal-backdrop"
		role="button"
		tabindex="0"
		onclick={toggleModal}
		onkeydown={(e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				toggleModal();
			}
		}}>
		<div class="modal-content">
			{#if fileName.toLowerCase().endsWith('.pdf')}
				<!-- <iframe src={url} width="800px" height="700px"></iframe> -->
				<iframe src={url} class="pdf-modal-view" title="PDF Fullscreen" allowfullscreen></iframe>
			{:else}
				<img src={url} alt="Large preview" />
			{/if}
			<button class="close-modal" onclick={closeModal}>×</button>
		</div>
	</div>
{/if}

<!-- prettier-ignore -->
<style>
	.image-upload { display: flex; flex-direction: column; gap: 0.5rem; }
	.upload-box { position: relative; border: 2px dashed #ccc; border-radius: 0.5rem; padding: 8px; cursor: pointer; text-align: center; background-color: #f9f9f9; min-height: 160px; display: flex; align-items: center; justify-content: center; overflow: hidden; }
	.upload-box:hover { border-color: #888; }
	.preview { max-width: 100%; margin-top: 20px; max-height: 250px; border-radius: 0.5rem; object-fit: contain; }
	/* PDF Preview Styles */
	.pdf-preview-container { position: relative; width: 100%; height: 250px; border-radius: 0.5rem; overflow: hidden; cursor: pointer; }
	.pdf-preview { width: 100%; height: 100%; border: none; margin-top: 1.5rem; border-radius: 0.5rem; pointer-events: none; /* Prevent iframe from intercepting clicks */ }
	.pdf-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.3); display: flex; flex-direction: column; align-items: center; justify-content: center; color: white; opacity: 0; transition: opacity 0.2s ease; margin-top: 1.5rem; border-radius: 0.5rem; }
	.pdf-preview-container:hover .pdf-overlay { opacity: 1; }
	.maximize-icon { width: 24px; height: 24px; margin-bottom: 8px; }
	.remove-btn { position: absolute; top: 0; right: 0; padding: 5px; background-color: transparent; /* color: white; */ border: none; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 2; }
	.progress-overlay { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: rgba(255, 255, 255, 0.7); display: flex; flex-direction: column; justify-content: center; align-items: center; z-index: 1; }
	.progress-bar { height: 6px; width: 80%; background-color: #38bdf8; border-radius: 4px; margin-bottom: 0.5rem; transition: width 0.3s ease; }
	.progress-text { font-size: 0.9rem; color: #333; }
	.success-overlay { position: absolute; top: 0; left: 0; background-color: transparent; border-radius: 50%; padding: 4px; z-index: 1; }
	.modal-backdrop { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background-color: rgba(0, 0, 0, 0.7); display: flex; align-items: center; justify-content: center; z-index: 1000; }
	.modal-content { position: relative; background: white; padding: 1rem; border-radius: 0.5rem; width: 90%; height: 90%; max-width: 900px; max-height: 90vh; display: flex; justify-content: center; align-items: center; }
	.pdf-modal-view { width: 100%; height: 100%; border: none; }
	.modal-content img { max-width: 100%; max-height: 80vh; object-fit: contain; }
	.close-modal { position: absolute; top: 8px; right: 8px; background: #e53e3e; color: white; border: none; border-radius: 50%; width: 28px; height: 28px; font-size: 18px; cursor: pointer; padding: 0px; z-index: 2; }
	.close-modal:hover { background: #c53030; }
	.custom-file-input { width: 100%; height: 35px; border: 1px solid #ccc; border-radius: 0.3rem; background-color: var(--clr-bg-1); transition: all 0.1s ease; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
	.custom-file-input:focus { outline: none; border-color: var(--info); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
	/* Style the Choose File button (Chrome/Edge/Firefox) */
	.custom-file-input::-webkit-file-upload-button { background-color: var(--clr-bg-5); color: white; /* border: none; */ /* padding: 0.5rem; */ /* margin-right: 1rem; */ cursor: pointer; }
	.custom-file-input::file-selector-button { /* background-color: #1e293b; */ color: white; border: none; /* padding: 0.5rem 2rem; */ height: 35px; /* margin-right: 1rem; */ cursor: pointer; }
	.custom-file-input::-webkit-file-upload-button:hover,
	.custom-file-input::file-selector-button:hover { background-color: #334155; }
	.sun-spinner { /* position: relative; */ width: 18px; height: 18px; animation: rotate 1s linear infinite; }
	/* .preview { width: 100%; border: none; }
	*/

	@keyframes rotate {
		100% {
			transform: rotate(360deg);
		}
	}
</style>
