<script lang="ts">
	import { run } from "svelte/legacy";

	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createClass, updateClass } from "$lib/services/class";

	import { page } from "$app/state";
	import { BrushCleaning, Save } from "@lucide/svelte";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";

	import { classFormSchema, type ClassInputType } from "$lib/utils/schemas";
	import { formErrors } from "$lib/stores/formStore";
	import { onMount } from "svelte";
	import { areFieldsUnchanged } from "$lib/utils/utils";
	import { MESSAGES } from "$lib/utils/messages";

	let allSections = page.data?.sectionData || [];

	let { onRefreshPage, classData = null, action } = $props();

	// Reactive form state
	let formData: ClassInputType = $state({ name: "", sectionIds: [] });
	let touched: Partial<Record<keyof ClassInputType, boolean>> = $state({ name: false, sectionIds: false });
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({ name: "" });
	});

	// Form reset handler
	function handleResetForm() {
		populateFormData();
		// Reset form errors and touched state
		formErrors.set({});
		formSubmitted = false;
		touched = { name: false, sectionIds: false };
	}

	// Handle field changes
	function handleChange(field: keyof ClassInputType, value: string | string[]): void {
		if (field === "name" && typeof value === "string") {
			formData.name = value;
		} else if (field === "sectionIds" && Array.isArray(value)) {
			formData.sectionIds = value;
		}
		touched = { ...touched, [field]: true };
		validateForm(classFormSchema, formData);

		// formErrors.update(() => {
		// 	if (!result.success) {
		// 		const fieldErrors = result.error.flatten().fieldErrors as Record<string, string[]>;
		// 		const errorMap: Partial<Record<keyof ClassFormData, string>> = {};
		// 		for (const key in fieldErrors) {
		// 			errorMap[key as keyof ClassFormData] = fieldErrors[key]?.[0] ?? "";
		// 		}
		// 		return errorMap;
		// 	}
		// 	return {};
		// });
	}

	// Populate form data based on action
	function populateFormData() {
		if (action === "update") {
			formData = {
				name: classData.name,
				sectionIds: classData.sectionIds.map((section: { _id: string }) => section._id) || [],
			};
		} else {
			formData = { name: "", sectionIds: [] };
		}
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(classFormSchema, formData);
		if (!isValid) return;

		if (action === "update"  && classData) {
            	// Check if the form data is unchanged before updating
			const isUnChanged = areFieldsUnchanged(classData, formData, ["name", "sectionIds"]);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: "warning" });
				return;
			}
            
			await updateClass(classData._id, formData);
			showSnackbar({ message: MESSAGES.CLASS.UPDATED, type: "success" });
		} else {
			await createClass(formData);
			showSnackbar({ message: MESSAGES.CLASS.CREATED, type: "success" });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Name *</label>
		<input id="name" 
        type="text" 
        name="name" 
        placeholder="Enter class name" 
        class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? "input-error" : ""}`} 
        bind:value={formData.name} 
        oninput={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
        onblur={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
    />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<!-- svelte-ignore a11y_label_has_associated_control -->
		<label>Sections *</label>
		<div class="checkbox-section" class:has-error={$formErrors.sectionIds && formSubmitted}>
			{#each allSections as section}
				<div class="checkbox-item">
					<label class="checkbox-label">
						<input
							type="checkbox"
							class="checkbox-input"
							value={section._id}
							checked={formData.sectionIds.includes(section._id)}
							onchange={(e) => {
								const checked = (e.target as HTMLInputElement).checked;
								if (checked) {
									formData.sectionIds = [...formData.sectionIds, section._id];
								} else {
									formData.sectionIds = formData.sectionIds.filter((id) => id !== section._id);
								}
								// handleChange("sectionIds", formData.sectionIds);
							}}
							
						/>
                        <!-- onblur={() => handleChange("sectionIds", formData.sectionIds)} -->
						<span class="checkbox-custom"></span>
						<span class="checkbox-text">{section.name}</span>
					</label>
				</div>
			{/each}
		</div>
		{#if $formErrors.sectionIds && (formSubmitted || touched.sectionIds)}
			<p class="error-text">{$formErrors.sectionIds}</p>
		{/if}
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
				Update Class
			{:else}
				Save Class
			{/if}
		</button>
	</div>
</form>

<style>
	.checkbox-section {
		display: flex;
		flex-direction: column;
		gap: 12px;
		padding: 16px;
		background: #f8f9fa;
		border-radius: 8px;
		max-height: 300px;
		overflow-y: auto;
	}

	.checkbox-item {
		display: flex;
		align-items: center;
	}

	.checkbox-label {
		display: flex;
		align-items: center;
		cursor: pointer;
		gap: 8px;
		font-size: 14px;
		color: #333;
		transition: all 0.2s ease;
	}

	.checkbox-label:hover {
		color: #0066cc;
	}

	.checkbox-input {
		position: absolute;
		opacity: 0;
		cursor: pointer;
		height: 0;
		width: 0;
	}

	.checkbox-custom {
		position: relative;
		height: 18px;
		width: 18px;
		background-color: #fff;
		border: 2px solid #ddd;
		border-radius: 4px;
		transition: all 0.2s ease;
	}

	.checkbox-input:checked ~ .checkbox-custom {
		background-color: #0066cc;
		border-color: #0066cc;
	}

	.checkbox-input:checked ~ .checkbox-custom::after {
		content: "";
		position: absolute;
		left: 5px;
		top: 1px;
		width: 5px;
		height: 10px;
		border: solid white;
		border-width: 0 2px 2px 0;
		transform: rotate(45deg);
	}

	.checkbox-text {
		margin-left: 4px;
	}

	.has-error {

		padding: 15px;
		border-radius: 4px;
		box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3);
	}


</style>
