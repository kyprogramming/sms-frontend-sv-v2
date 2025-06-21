<script lang="ts">
	import { isLoading } from '$lib/stores/loading';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { closeModal } from '$lib/stores/modalStore';

	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';

	import { formErrors } from '$lib/stores/formStore';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { createFeeType, updateFeeType } from '$lib/services/fee-type.service';
	import { feeTypeFormSchema, type FeeTypePayload } from '$lib/schemas/academic-year.schema';

	let { onRefreshPage, feeTypeData = null, action } = $props();

	export function initializeFeeTypeFormData(): FeeTypePayload {
		return { name: '', code: '', description: '', active: true };
	}

	// Reactive form state
	let formData: FeeTypePayload = $state(initializeFeeTypeFormData());
	let touched: Partial<Record<keyof FeeTypePayload, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({ name: '', code: '', description: '' });
	});

	// Form reset handler
	function handleResetForm() {
		populateFormData();
		formErrors.set({});
		formSubmitted = false;
		touched = { name: false };
	}

	// Populate form data based on action
	function populateFormData() {
		if (action === 'update' && feeTypeData) {
			formData = { ...feeTypeData };
		} else {
			formData = initializeFeeTypeFormData();
		}
	}

	// Handle field changes
	function handleChange(field: keyof FeeTypePayload, value: string | boolean): void {
		formData[field] = value as never;
		touched = { ...touched, [field]: true };
		validateForm(feeTypeFormSchema, formData);
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		console.log(formData);
		const isValid = validateForm(feeTypeFormSchema, formData);
		if (!isValid) return;

		if (action === 'update' && feeTypeData) {
			const isUnChanged = isEqual(feeTypeData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateFeeType(feeTypeData._id, formData);
			showSnackbar({ message: 'Fee Type updated successfully', type: 'success' });
		} else {
			await createFeeType(formData);
			showSnackbar({ message: 'Fee Type created successfully', type: 'success' });
		}
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="grid-12">
		<div class="col-6">
			<label for="name">Name <span class="required">*</span></label>
			<input id="name" type="text"  name="name" maxlength="50" placeholder="Fee Type name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={() => handleChange('name', formData.name)} />
			{#if $formErrors.name && (touched.name || formSubmitted)}
				<p class="error-text">{$formErrors.name}</p>
			{/if}
		</div>
		<div class="col-6">
			<label for="code">Code</label>
			<input id="code" type="text" name="code" maxlength="20" placeholder="Fee type code" bind:value={formData.code} />
		</div>
		<div class="col-12">
			<label for="description">Description</label>
			<textarea id="description" name="description" maxlength="200" class={`w-full`} placeholder="Fee Type description" bind:value={formData.description} oninput={(e) => handleChange('description', (e.target as HTMLInputElement).value)} onblur={() => handleChange('description', formData.description || '')}></textarea>
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
						Update Fee Type
					{:else}
						Save Fee Type
					{/if}
				</button>
			</div>
		</div>
	</div>
	<div class="input-wrapper"></div>
</form>
