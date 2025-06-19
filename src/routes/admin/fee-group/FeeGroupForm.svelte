<script lang="ts">
	import { feeGroupFormSchema, type FeeGroupPayload } from '$lib/utils/schemas';
	import { formErrors } from '$lib/stores/formStore';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { createFeeGroup, updateFeeGroup } from '$lib/services/fee-group';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { isLoading } from '$lib/stores/loading';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { page } from '$app/state';

	let { onRefreshPage, feeGroupData = null, action } = $props();
	let feeTypeData = page.data?.feeTypeData || [];

	export function initializeFeeGroupFormData(): FeeGroupPayload {
		return { name: '', code: '', description: '', active: true };
	}

	let formData: FeeGroupPayload = $state(initializeFeeGroupFormData());
	let touched: Partial<Record<keyof FeeGroupPayload, boolean>> = $state({});
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
		if (action === 'update' && feeGroupData) {
			formData = { ...feeGroupData };
		} else {
			formData = initializeFeeGroupFormData();
		}
	}

	function handleChange(field: keyof FeeGroupPayload, value: any) {
		formData[field] = value as never;
		touched = { ...touched, [field]: true };
		validateForm(feeGroupFormSchema, formData);
		console.log('formData:', formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(feeGroupFormSchema, formData);
		if (!isValid) return;

		if (action === 'update' && feeGroupData) {
			const isUnChanged = isEqual(feeGroupData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateFeeGroup(feeGroupData._id, formData);
			showSnackbar({ message: 'Fee head updated successfully', type: 'success' });
		} else {
			await createFeeGroup(formData);
			showSnackbar({ message: 'Fee head created successfully', type: 'success' });
		}

		// closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="grid-12">
		<div class="col-6">
			<label for="name">Name <span class="required">*</span></label>
			<input id="name" type="text" name="name" placeholder="Fee group name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={() => handleChange('name', formData.name)} />
			{#if $formErrors.name && (touched.name || formSubmitted)}
				<p class="error-text">{$formErrors.name}</p>
			{/if}
		</div>
        <div class="col-6">
			<label for="code">Code</label>
			<input id="code" type="text" name="code" placeholder="Fee group code"  bind:value={formData.code} oninput={(e) => handleChange('code', (e.target as HTMLInputElement).value)} />
		</div>
		<!-- <div class="col-6">
			<label for="categoryId">Category <span class="required">*</span></label>
			<select id="categoryId" name="categoryId" class={`w-full ${$formErrors.categoryId && (touched.categoryId || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.categoryId} onchange={(e) => handleChange('categoryId', (e.target as HTMLInputElement).value)} onblur={() => handleChange('categoryId', formData.categoryId)}>
				<option value="" selected>Select Category</option>
				{#each feeTypeData as feeType}
					<option value={feeType._id}>{feeType.name}</option>
				{/each}
			</select>
			{#if $formErrors.categoryId && (touched.categoryId || formSubmitted)}
				<p class="error-text">{$formErrors.categoryId}</p>
			{/if}
		</div> -->
		<!-- <div class="col-6">
			<label for="value">Amount <span class="required">*</span></label>
			<input
				id="amount"
				type="number"
				name="amount"
				placeholder={'0.00'}
				min="0"
				step={'0.01'}
				inputmode="decimal"
				class={`w-full ${$formErrors.amount && (touched.amount || formSubmitted) ? 'input-error' : ''}`}
				bind:value={formData.amount}
				oninput={(e) => {
					const amount = (e.target as HTMLInputElement).value;
					handleChange('amount', amount === '' ? '' : parseFloat(amount));
				}}
				onblur={() => handleChange('amount', formData.amount)} />
			{#if $formErrors.amount && (touched.amount || formSubmitted)}
				<p class="error-text">{$formErrors.amount}</p>
			{/if}
		</div> -->
		<div class="col-12">
			<label for="description">Description</label>
			<textarea id="description" name="description" class="w-full" placeholder="Optional description" bind:value={formData.description} oninput={(e) => handleChange('description', (e.target as HTMLInputElement).value)}></textarea>
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
						Update Fee Group
					{:else}
						Create Fee Group
					{/if}
				</button>
			</div>
		</div>
	</div>
</form>
