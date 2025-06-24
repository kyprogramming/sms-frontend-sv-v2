<script lang="ts">
	import { isLoading } from '$lib/stores/loading';
	import { validateForm } from '$lib/utils/validateHelper';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { closeModal } from '$lib/stores/modalStore';
	import { createSection, updateSection } from '$lib/services/section';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import { formErrors } from '$lib/stores/formStore';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { onMount } from 'svelte';
	import { areFieldsUnchanged, isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { sectionFormSchema, type SectionFormPayload } from '$lib/schemas/section.schema';

	let { onRefreshPage, sectionList = null, action } = $props();

	// Reactive form state
	let formData: SectionFormPayload = $state({ name: '', active: true });
	let touched: Partial<Record<keyof SectionFormPayload, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		formErrors.set({ name: '' });
		// Initialize form data based on action
		if (action === 'update' && sectionList) {
			formData = { name: sectionList.name, active: sectionList.active };
		} else {
			formData = { name: '', active: true };
		}
		touched = { name: false };
	});

	// Form reset handler
	function handleResetForm() {
		if (action === 'update') formData = { name: sectionList.name, active: sectionList.active };
		else formData = { name: '' };

		formErrors.set({});
		formSubmitted = false;
		touched = { name: false };
	}

	function handleChange<K extends keyof SectionFormPayload>(field: K, value: SectionFormPayload[K]): void {
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

		if (action === 'update' && sectionList) {
			// Check if the form data is unchanged before updating
			const isUnChanged = isEqual(sectionList, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateSection(sectionList._id, formData);
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
	<div class="grid-12">
		<div class="col-12">
            <label for="name">Section Name <span class="required">*</span></label>
            <input id="name" type="text" name="name" placeholder="Enter section name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={(e) => handleChange('name', (e.target as HTMLInputElement).value)} />
            {#if $formErrors.name && (touched.name || formSubmitted)}
                <p class="error-text">{$formErrors.name}</p>
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
                        Update Section
                    {:else}
                        Save Section
                    {/if}
                </button>
            </div>
        </div>
    </div>
	
</form>
