<script lang="ts">
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal } from "$lib/stores/modalStore";

	import { BrushCleaning, Save } from "@lucide/svelte";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";

	import { feeCategoryFormSchema, type FeeCategoryFormDataType } from "$lib/utils/schemas";
	import { formErrors } from "$lib/stores/formStore";
	import { onMount } from "svelte";
	import { isEqual } from "$lib/utils/utils";
	import { MESSAGES } from "$lib/utils/messages";
	import { createFeeCategory, updateFeeCategory } from "$lib/services/fee-category.service";

	let { onRefreshPage, feeCategoryData = null, action } = $props();

	export function initializeFeeCategoryFormData(): FeeCategoryFormDataType {
		return { name: "", description: "", active: true };
	}

	// Reactive form state
	let formData: FeeCategoryFormDataType = $state(initializeFeeCategoryFormData());
	let touched: Partial<Record<keyof FeeCategoryFormDataType, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({ name: "", description: "" });
	});

	// Form reset handler
	function handleResetForm() {
		populateFormData();
		formErrors.set({});
		formSubmitted = false;
		touched = { name: false, description: false };
	}

	// Populate form data based on action
	function populateFormData() {
		if (action === "update" && feeCategoryData) {
			formData = { ...feeCategoryData };
		} else {
			formData = initializeFeeCategoryFormData();
		}
	}

	// Handle field changes
	function handleChange(field: keyof FeeCategoryFormDataType, value: string | boolean): void {
		formData[field] = value as never;
		touched = { ...touched, [field]: true };
		validateForm(feeCategoryFormSchema, formData);
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(feeCategoryFormSchema, formData);
		if (!isValid) return;

		if (action === "update" && feeCategoryData) {
			const isUnChanged = isEqual(feeCategoryData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: "warning" });
				return;
			}
			await updateFeeCategory(feeCategoryData._id, formData);
			showSnackbar({ message: "Fee category updated successfully", type: "success" });
		} else {
			await createFeeCategory(formData);
			showSnackbar({ message: "Fee category created successfully", type: "success" });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Fee Category Name <span class="required">*</span></label>
		<input id="name" type="text" name="name" placeholder="Fee category name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? "input-error" : ""}`} bind:value={formData.name} oninput={(e) => handleChange("name", (e.target as HTMLInputElement).value)} onblur={() => handleChange("name", formData.name)} />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="description">Description</label>
		<textarea id="description" name="description" class={`w-full`} placeholder="Fee category description" bind:value={formData.description} oninput={(e) => handleChange("description", (e.target as HTMLInputElement).value)} onblur={() => handleChange("description", formData.description || "")}></textarea>
	</div>

	<div class="input-wrapper">
		<label class="checkbox-label">
			<input type="checkbox" class="checkbox-input" bind:checked={formData.active} onchange={(e) => handleChange("active", (e.target as HTMLInputElement).checked)} />
			<span class="checkbox-custom"></span>
			<span class="checkbox-text">Active</span>
		</label>
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
				Update Fee Category
			{:else}
				Save Fee Category
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

	.checkbox-label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.checkbox-input {
		display: none;
	}

	.checkbox-custom {
		width: 1.25rem;
		height: 1.25rem;
		border: 2px solid #ccc;
		border-radius: 4px;
		position: relative;
		background-color: #f5f5f5;
	}

	.checkbox-input:checked + .checkbox-custom::after {
		content: "✓";
        font-size: 20px;
		color: #00bd23;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}
</style>
