<script lang="ts">
	import { isLoading } from '$lib/stores/loading';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { closeModal } from '$lib/stores/modalStore';
	import { createClass, updateClass } from '$lib/services/class';

	import { page } from '$app/state';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';

	import { formErrors } from '$lib/stores/formStore';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { classFormSchema, type ClassFormPayload } from '$lib/schemas/class.schema';

	let allSections = page.data?.sectionData || [];

	let { onRefreshPage, classData = null, action } = $props();

	// Reactive form state
	let formData: ClassFormPayload = $state(initializeClassFormData());

	export function initializeClassFormData(): ClassFormPayload {
		return {
			name: '',
			sectionIds: [],
			active: true,
		};
	}

	let touched: Partial<Record<keyof ClassFormPayload, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({ name: '' });
	});

	// Form reset handler
	function handleResetForm() {
		populateFormData();
		// Reset form errors and touched state
		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	// Populate form data based on action
	function populateFormData() {
		if (action === 'update') {
			formData = { ...classData };
		}
	}

	// Handle field changes
	function handleChange(field: keyof ClassFormPayload, value: any): void {
		if (field === 'name' && typeof value === 'string') {
			formData.name = value;
		} else if (field === 'sectionIds' && Array.isArray(value)) {
			formData.sectionIds = value;
		}
		touched = { ...touched, [field]: true };
		validateForm(classFormSchema, formData);
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(classFormSchema, formData);
		if (!isValid) return;

		if (action === 'update' && classData) {
			// Check if the form data is unchanged before updating
			const isUnChanged = isEqual(classData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateClass(classData._id, formData);
			showSnackbar({ message: MESSAGES.CLASS.UPDATED, type: 'success' });
		} else {
			await createClass(formData);
			showSnackbar({ message: MESSAGES.CLASS.CREATED, type: 'success' });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="grid-12">
		<div class="col-12">
			<label for="name">Name<span class="required">*</span></label>
			<input id="name" type="text" name="name" placeholder="Enter class name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={(e) => handleChange('name', (e.target as HTMLInputElement).value)} />
			{#if $formErrors.name && (touched.name || formSubmitted)}
				<p class="error-text">{$formErrors.name}</p>
			{/if}
		</div>
		<div class="col-12">
			<label for="checkbox-input">Sections<span class="required">*</span></label>
			<div class="checkbox-section" class:has-error={$formErrors.sectionIds && formSubmitted}>
				{#each allSections as section}
					<div class="checkbox-item">
						<label class="checkbox-label">
							<input
								id="checkbox-input"
								class="checkbox-input"
								type="checkbox"
								value={section._id}
								checked={formData.sectionIds.includes(section._id)}
								onchange={(e) => {
									const checked = (e.target as HTMLInputElement).checked;
									if (checked) {
										formData.sectionIds = [...formData.sectionIds, section._id];
									} else {
										formData.sectionIds = formData.sectionIds.filter((id) => id !== section._id);
									}
                                    formData.sectionIds.length > 0 ? $formErrors.sectionIds = '' :  $formErrors.sectionIds = 'Please select at least one section'
								}} />
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
		<div class="col-6">
			<label class="checkbox-container">
				<input type="checkbox" class="checkbox-input" bind:checked={formData.active} onchange={(e) => handleChange('active', e.currentTarget.checked)} />
				<span class="checkbox-custom"></span>
				<span class="checkbox-text">Active</span>
			</label>
		</div>
		<div class="col-6">
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
					{#if action === 'update'}
						Update Class
					{:else}
						Save Class
					{/if}
				</button>
			</div>
		</div>
	</div>
</form>

<!-- prettier-ignore -->
<style>
	.checkbox-section {display: flex; flex-direction: column; gap: 12px; padding: 16px; background-color: #f5f5f5; border: 1px solid #ccc; border-radius: 8px; max-height: 300px; overflow-y: auto}

    .checkbox-text {margin-left: 4px}
	.has-error { border-radius: 4px; box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.3)}
</style>
