<script lang="ts">
	import { isLoading } from '$lib/stores/loading';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { closeModal } from '$lib/stores/modalStore';
	import { createSection, updateSection } from '$lib/services/section';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import { sectionFormSchema, type SectionFormDataType } from '$lib/utils/schemas';
	import { formErrors } from '$lib/stores/formStore';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { onMount } from 'svelte';
	import { areFieldsUnchanged, isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';

	let { onRefreshPage, sectionData = null, action } = $props();

	// Reactive form state
	let formData: SectionFormDataType = $state({ name: '' });
	let touched: Partial<Record<keyof SectionFormDataType, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		formErrors.set({ name: '' });
		// Initialize form data based on action
		if (action === 'update' && sectionData) {
			formData = { name: sectionData.name };
		} else {
			formData = { name: '' };
		}
		touched = { name: false };
	});

	// Form reset handler
	function handleResetForm() {
		if (action === 'update') formData = { name: sectionData.name };
		else formData = { name: '' };

		formErrors.set({});
		formSubmitted = false;
		touched = { name: false };
	}

	// Field change handler
	function handleChange(field: keyof SectionFormDataType, value: string): void {
		formData[field] = value;
		touched = { ...touched, [field]: true };
		validateForm(sectionFormSchema, formData);
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		const isValid = validateForm(sectionFormSchema, formData);
		if (!isValid) return;

		if (action === 'update' && sectionData) {
			// Check if the form data is unchanged before updating
			const isUnChanged = isEqual(sectionData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateSection(sectionData._id, formData);
			showSnackbar({ message: MESSAGES.SECTION.UPDATED, type: 'success' });
		} else {
			await createSection(formData);
			showSnackbar({ message: MESSAGES.SECTION.CREATED, type: 'success' });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Section Name <span class="required">*</span></label>
		<input id="name" type="text" name="name" placeholder="Enter section name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={(e) => handleChange('name', (e.target as HTMLInputElement).value)} />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
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
			{#if action === 'update'}
				Update Section
			{:else}
				Save Section
			{/if}
		</button>
	</div>
</form>
