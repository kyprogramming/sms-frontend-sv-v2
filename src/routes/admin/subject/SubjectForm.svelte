<script lang="ts">
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal } from "$lib/stores/modalStore";
	import { createSubject, updateSubject } from "$lib/services/subject";

	import { BrushCleaning, Save } from "@lucide/svelte";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";

	import { subjectFormSchema, type SubjectFormDataType } from "$lib/utils/schemas";
	import { formErrors } from "$lib/stores/formStore";
	import { onMount } from "svelte";
	import { isEqual } from "$lib/utils/utils";
	import { MESSAGES } from "$lib/utils/messages";
	import { SUBJECT_TYPE } from "$lib/utils/constants";

	let { onRefreshPage, subjectData = null, action } = $props();
    
    export function initializeSubjectFormData(): SubjectFormDataType {
		return { name: "", code: "", type: "" };
	}
	// Reactive form state
    let formData: SubjectFormDataType = $state(initializeSubjectFormData());
	let touched: Partial<Record<keyof SubjectFormDataType, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({ name: "", code: "", type: "" });
	});

	// Form reset handler
	function handleResetForm() {
		populateFormData();
		// Reset form errors and touched state
		formErrors.set({});
		formSubmitted = false;
		touched = { name: false, code: false, type: false };
	}

	// Populate form data based on action
	function populateFormData() {
		if (action === "update") {
			formData = {...subjectData}
		}
	}

	// Handle field changes
    function handleChange(field: keyof SubjectFormDataType, value: string ): void {
	formData[field] = value;
	touched = { ...touched, [field]: true };
	validateForm(subjectFormSchema, formData);
}
	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(subjectFormSchema, formData);
		if (!isValid) return;

		if (action === "update" && subjectData) {
            const isUnChanged = isEqual(subjectData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: "warning" });
				return;
			}
			await updateSubject(subjectData._id, formData);
			showSnackbar({ message: "Subject updated successfully", type: "success" });
		} else {
			await createSubject(formData);
			showSnackbar({ message: "Subject created successfully", type: "success" });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="radio-item">Subject Type <span class="required">*</span></label>
		<div class="radio-section" class:has-error={$formErrors.type && (touched.type || formSubmitted)}>
			{#each SUBJECT_TYPE as type}
				<div class="radio-item">
					<label class="radio-label">
						<input name="type" type="radio" class="radio-input" value={type.name} checked={formData.type === type.name} onchange={() => handleChange("type", type.name)} onblur={() => handleChange("type", formData.type)} />
						<span class="radio-custom"></span>
						<span class="radio-text">{type.name}</span>
					</label>
				</div>
			{/each}
		</div>
		{#if $formErrors.type && (touched.type || formSubmitted)}
			<p class="error-text">{$formErrors.type}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="name">Subject Name <span class="required">*</span></label>
		<input id="name" type="text" name="name" placeholder="Subject name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? "input-error" : ""}`} bind:value={formData.name} oninput={(e) => handleChange("name", (e.target as HTMLInputElement).value)} onblur={() => handleChange("name", formData.name)} />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="code">Subject Code</label>
		<input id="code" type="text" name="code" class={`w-full`} placeholder="Subject code" bind:value={formData.code} oninput={(e) => handleChange("code", (e.target as HTMLInputElement).value)} onblur={() => handleChange("code", String(formData.code))} />
	</div>

    <div class="form-actions">
		<button type="button" class="btn ripple btn-secondary" onclick={handleResetForm} disabled={$isLoading}>
			<BrushCleaning />
			<span>Reset Form</span>
		</button>

		<button class="btn ripple" type="submit" disabled={$isLoading}>
			<LoaderIcon />
			{#if !$isLoading}
				<Save />
			{/if}
			{#if action === "update"}
				Update Subject
			{:else}
				Save Subject
			{/if}
		</button>
	</div>
</form>

<style>
	label {
		display: block;
		font-weight: bold;
		margin-bottom: 0.5rem;
	}

	.required {
		color: red;
	}

	.radio-section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.radio-item {
		display: flex;
		align-items: center;
	}

	.radio-label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.radio-input {
		display: none;
	}

	.radio-custom {
		width: 1rem;
		height: 1rem;
		border: 2px solid #ccc;
		border-radius: 50%;
		margin-right: 0.5rem;
		position: relative;
	}

	.radio-input:checked + .radio-custom::after {
		content: "";
		width: 0.6rem;
		height: 0.6rem;
		background: #007bff;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.has-error .radio-custom {
		border-color: red;
	}
</style>
