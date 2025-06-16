<script lang="ts">
	interface Props {
		id?: string;
		filePath?: string;
		onFileSelect?: (file: File) => void;
	}

	let { id = '', filePath = $bindable(''), onFileSelect = () => {} }: Props = $props();

	let fileInput: HTMLInputElement | undefined = $state();
	let file: File | null = $state(null);
	let previewUrl: string = $state('');
	let uploading = $state(false);
	let progress = $state(0);

	const uploadFile = async () => {
		if (!file) return;
		uploading = true;
		progress = 0;

		const formData = new FormData();
		formData.append('file', file);

		const xhr = new XMLHttpRequest();
		xhr.open('POST', 'http://localhost:5000/api/upload');

		xhr.upload.addEventListener('progress', (e) => {
			if (e.lengthComputable) {
				progress = Math.round((e.loaded / e.total) * 100);
			}
		});

		xhr.onload = () => {
			uploading = false;
			if (xhr.status === 200) {
				const res = JSON.parse(xhr.responseText);
				filePath = res.filePath;
				previewUrl = res.filePath;
			} else {
				// alert("Upload failed");
			}
		};

		xhr.onerror = () => {
			uploading = false;
			// alert("Upload error");
		};

		xhr.send(formData);
	};

	function handleFileChange(event: Event) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			file = target.files[0];
			if (file) onFileSelect(file);
			previewUrl = URL.createObjectURL(file);
			uploadFile();
		}
	}
</script>

<div class="form-group">
	<input type="file" {id} class="custom-file-input" bind:this={fileInput} onchange={handleFileChange} accept="image/*" />

	{#if uploading}
		<progress max="100" value={progress}>{progress}%</progress>
	{/if}
	<!-- 
	{#if previewUrl}
		<div style="margin-top: 10px; overflow: hidden; border-radius: 12px; width: max-content;">
			<img src={previewUrl} alt="Preview" style="max-height: 100px; border-radius: 12px;" />
		</div>
	{/if}
    -->

	{#if previewUrl}
		<div class="preview-container">
			<img src={previewUrl} alt="Preview" class="preview-img" />
			<div class="file-info">
				<p style="font-size: 11px;"><strong>Name:</strong> {file?.name.substring(0, 35)}</p>
				<p style="font-size: 11px;"><strong>Size:</strong> {file ? (file.size / 1024).toFixed(2) + ' KB' : ''}</p>
			</div>
		</div>
	{/if}
</div>
<!-- prettier-ignore -->
<style>
	.form-group { font-family: sans-serif; font-size: 14px; margin-bottom: 1rem; }
	.custom-file-input { width: 100%; height: 35px; border: 1px solid #ccc; border-radius: 0.3rem; background-color: var(--clr-bg-1); transition: all 0.1s ease; -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
	.custom-file-input:focus { outline: none; border-color: var(--info); box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2); }
	/* Style the Choose File button (Chrome/Edge/Firefox) */
	.custom-file-input::-webkit-file-upload-button { background-color: var(--clr-bg-5); color: white; /* border: none; */ /* padding: 0.5rem; */ margin-right: 1rem; cursor: pointer; }
	.custom-file-input::file-selector-button { /* background-color: #1e293b; */ color: white; border: none; padding: 0.5rem 2rem; height: 35px; /* margin-right: 1rem; */ cursor: pointer; }
	.custom-file-input::-webkit-file-upload-button:hover,
	.custom-file-input::file-selector-button:hover { background-color: #334155; }
	.preview-container { display: flex; align-items: center; gap: 1rem; margin-top: 10px; background-color: #f8f8f8; padding: 10px; border-radius: 12px; /* width: fit-content; */ box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1); width: 100%; }
	.preview-img { max-height: 100px; border-radius: 12px; object-fit: cover; }
	.file-info { font-size: 10px; color: #333; }
</style>
