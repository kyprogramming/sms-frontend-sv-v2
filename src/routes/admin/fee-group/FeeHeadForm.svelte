<script lang="ts">
	import { feeHeadFormSchema, type FeeHeadFormDataType } from '$lib/utils/schemas';
	import { formErrors } from '$lib/stores/formStore';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { createFeeHead, updateFeeHead } from '$lib/services/fee-group';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { isLoading } from '$lib/stores/loading';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { page } from '$app/state';

	let { onRefreshPage, feeHeadData = null, action } = $props();
	let feeCategoryData = page.data?.feeCategoryData || [];

	export function initializeFeeHeadFormData(): FeeHeadFormDataType {
		return { name: '', categoryId: '', amount: 0, description: '' };
	}

	let formData: FeeHeadFormDataType = $state(initializeFeeHeadFormData());
	let touched: Partial<Record<keyof FeeHeadFormDataType, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({});
	});

	function handleResetForm() {
		populateFormData();
		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	function populateFormData() {
		if (action === 'update' && feeHeadData) {
			formData = { ...feeHeadData };
		} else {
			formData = initializeFeeHeadFormData();
		}
	}

	function handleChange(field: keyof FeeHeadFormDataType, value: string | number) {
		formData[field] = value as never;
		touched = { ...touched, [field]: true };
		validateForm(feeHeadFormSchema, formData);
		console.log('formData:', formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(feeHeadFormSchema, formData);
		if (!isValid) return;

		if (action === 'update' && feeHeadData) {
			const isUnChanged = isEqual(feeHeadData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateFeeHead(feeHeadData._id, formData);
			showSnackbar({ message: 'Fee head updated successfully', type: 'success' });
		} else {
			await createFeeHead(formData);
			showSnackbar({ message: 'Fee head created successfully', type: 'success' });
		}

		// closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Name <span class="required">*</span></label>
		<input id="name" type="text" name="name" placeholder="Fee head name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={() => handleChange('name', formData.name)} />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="categoryId">Category <span class="required">*</span></label>
		<select id="categoryId" name="categoryId" class={`w-full ${$formErrors.categoryId && (touched.categoryId || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.categoryId} onchange={(e) => handleChange('categoryId', (e.target as HTMLInputElement).value)} onblur={() => handleChange('categoryId', formData.categoryId)}>
			<option value="" selected>Select Category</option>
			{#each feeCategoryData as feeCategory}
				<option value={feeCategory._id}>{feeCategory.name}</option>
			{/each}
		</select>
		{#if $formErrors.categoryId && (touched.categoryId || formSubmitted)}
			<p class="error-text">{$formErrors.categoryId}</p>
		{/if}
	</div>

	<div class="input-wrapper">
		<label for="amount">Amount <span class="required">*</span></label>
		<input
			id="amount"
			type="number"
			name="amount"
			placeholder="0.00"
			min="0"
			step="0.01"
			class={`w-full ${$formErrors.amount && (touched.amount || formSubmitted) ? 'input-error' : ''}`}
			bind:value={formData.amount}
			oninput={(e) => {
				const value = (e.target as HTMLInputElement).value;
				// Handle both integer and decimal inputs
				handleChange('amount', value === '' ? 0 : parseFloat(value));
			}}
			onblur={() => handleChange('amount', formData.amount)} />
		{#if $formErrors.amount && (touched.amount || formSubmitted)}
			<p class="error-text">{$formErrors.amount}</p>
		{/if}
	</div>
	<div class="input-wrapper">
		<label for="description">Description</label>
		<textarea id="description" name="description" class="w-full" placeholder="Optional description" bind:value={formData.description} oninput={(e) => handleChange('description', (e.target as HTMLInputElement).value)}></textarea>
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
				Update Fee Head
			{:else}
				Create Fee Head
			{/if}
		</button>
	</div>
</form>

<!-- prettier-ignore -->
<style>
    label {display: block; font-weight: bold; margin-bottom: 0.5rem}
	.required {color: red}
	.checkbox-label {display: flex; align-items: center; cursor: pointer}
	.checkbox-input {display: none}
	.checkbox-custom {width: 1.25rem; height: 1.25rem; border: 2px solid #ccc; border-radius: 4px; position: relative; background-color: #f5f5f5}
	.checkbox-input:checked + .checkbox-custom::after {content: "✓"; font-size: 20px; color: #00bd23; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)}
</style>
