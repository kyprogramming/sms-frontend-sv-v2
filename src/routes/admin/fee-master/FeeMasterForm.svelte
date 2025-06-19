<script lang="ts">
	import { formErrors } from '$lib/stores/formStore';
	import { slide } from 'svelte/transition';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { createFeeMaster, updateFeeMaster } from '$lib/services/fee-master';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { isLoading } from '$lib/stores/loading';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { page } from '$app/state';
	import { feeMasterFormSchema, type FeeMasterPayload } from '$lib/utils/schemas';
	import DatePicker2 from '$lib/components/common/DatePicker2.svelte';
	import ToggleSwitch from '$lib/components/common/ToggleSwitch.svelte';

	let { onRefreshPage, feeMasterData = null, action } = $props();
	let feeGroups = page.data?.feeGroups?.data || [];
	let feeTypes = page.data?.feeTypes?.data || [];

	export function initializeFeeMasterFormData(): FeeMasterPayload {
		return {
			feeGroupId: '',
			feeTypeId: '',
			amount: '',
			dueDate: '',
			fineType: 'None',
			fineValue: '',
			perDay: false,
			active: true,
		};
	}

	let formData = $state(initializeFeeMasterFormData());
	let touched = $state<Record<string, boolean>>({});
	let formSubmitted = $state(false);
	let selectedPlan = $state('');

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
		if (action === 'update' && feeMasterData) {
			formData = {
				...feeMasterData,
				feeGroupId: feeMasterData.feeGroupId._id || feeMasterData.feeGroupId,
				feeTypeId: feeMasterData.feeTypeId._id || feeMasterData.feeTypeId,
				dueDate: feeMasterData.dueDate || '',
			};
		} else {
			formData = initializeFeeMasterFormData();
		}
	}

	function handleDueDateChange(dateString: string) {
		formData.dueDate = dateString;
		validateForm(feeMasterFormSchema, formData);
	}

	function handleDatePickerBlur(field: keyof FeeMasterPayload, isOpen: boolean) {
		setTimeout(() => {
			if (!isOpen) {
				touched = { ...touched, [field]: true };
				validateForm(feeMasterFormSchema, formData);
			}
		}, 100);
	}

	function handleChange(field: keyof FeeMasterPayload, value: any) {
		formData[field] = value as never;
		touched = { ...touched, [field]: true };
		validateForm(feeMasterFormSchema, formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		const isValid = validateForm(feeMasterFormSchema, formData);
		// console.log("isValid:", isValid);
		// console.log("formData:", formData);
		if (!isValid) return;

		try {
			if (action === 'update' && feeMasterData) {
				const isUnChanged = isEqual(feeMasterData, formData);
				if (isUnChanged) {
					showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
					return;
				}
				await updateFeeMaster(feeMasterData._id, formData);
				showSnackbar({ message: 'Fee master updated successfully', type: 'success' });
			} else {
				await createFeeMaster(formData);
				showSnackbar({ message: 'Fee master created successfully', type: 'success' });
			}
			onRefreshPage();
		} catch (error: any) {
			showSnackbar({ message: error.message, type: 'error' });
		}
	}
</script>

<form onsubmit={onSubmit}>
	<div class="grid-12">
		<!-- Fee Group Dropdown -->
		<div class="col-6">
			<label for="feeGroupId">Fee Group <span class="required">*</span></label>
			<select
				id="feeGroupId"
				bind:value={formData.feeGroupId}
				class={`w-full ${$formErrors.feeGroupId && (touched.feeGroupId || formSubmitted) ? 'input-error' : ''}`}
				onchange={(e) => handleChange('feeGroupId', (e.target as HTMLSelectElement).value)}
				onblur={() => handleChange('feeGroupId', formData.feeGroupId)}>
				<option value="">Select fee group</option>
				{#each feeGroups as group}
					<option value={group._id}>{group.name}</option>
				{/each}
			</select>
			{#if $formErrors.feeGroupId && (touched.feeGroupId || formSubmitted)}
				<p class="error-text">{$formErrors.feeGroupId}</p>
			{/if}
		</div>

		<!-- Fee Type Dropdown -->
		<div class="col-6">
			<label for="feeTypeId">Fee Type <span class="required">*</span></label>
			<select
				id="feeTypeId"
				bind:value={formData.feeTypeId}
				class={`w-full ${$formErrors.feeTypeId && (touched.feeTypeId || formSubmitted) ? 'input-error' : ''}`}
				onchange={(e) => handleChange('feeTypeId', (e.target as HTMLSelectElement).value)}
				onblur={() => handleChange('feeTypeId', formData.feeTypeId)}>
				<option value="">Select fee type</option>
				{#each feeTypes as type}
					<option value={type._id}>{type.name}</option>
				{/each}
			</select>
			{#if $formErrors.feeTypeId && (touched.feeTypeId || formSubmitted)}
				<p class="error-text">{$formErrors.feeTypeId}</p>
			{/if}
		</div>

		<!-- Amount -->
		<div class="col-6">
			<label for="amount">Amount <span class="required">*</span></label>
			<input
				id="amount"
				type="number"
				min="0.01"
				step="0.01"
				placeholder={'0.00'}
				bind:value={formData.amount}
				class={`w-full ${$formErrors.amount && (touched.amount || formSubmitted) ? 'input-error' : ''}`}
				oninput={(e) => handleChange('amount', parseFloat((e.target as HTMLInputElement).value) || '')}
				onblur={() => handleChange('amount', formData.amount)} />
			{#if $formErrors.amount && (touched.amount || formSubmitted)}
				<p class="error-text">{$formErrors.amount}</p>
			{/if}
		</div>

		<!-- Due Date -->
		<div class="col-6">
			<label for="dueDate">Due Date <span class="required">*</span></label>
			<DatePicker2
				id="dueDate"
				title="due date"
				bind:value={formData.dueDate}
				cls={`w-full ${$formErrors.dueDate && (touched.dueDate || formSubmitted) ? 'input-error' : ''}`}
				onDateSelect={handleDueDateChange}
				onBlur={(isOpen) => handleDatePickerBlur('dueDate', isOpen)} />
			{#if $formErrors['dueDate'] && (touched['dueDate'] || formSubmitted)}
				<p class="error-text">{$formErrors['dueDate']}</p>
			{/if}
		</div>

		<!-- Fine Type -->
		<div class="col-12">
			<label for="fineType">Fine Type</label>
			<select
				id="fineType"
				bind:value={formData.fineType}
				class={`w-full ${$formErrors.fineType && (touched.fineType || formSubmitted) ? 'input-error' : ''}`}
				onchange={(e) => handleChange('fineType', (e.target as HTMLSelectElement).value)}>
				<option value="None">None</option>
				<option value="Fix">Fixed Amount</option>
				<option value="Percentage">Percentage</option>
				<option value="Cumulative">Cumulative</option>
			</select>
		</div>
		<div class="col-12">
			<!-- Fine Value (Conditional) -->
			{#if formData.fineType !== 'None'}
				<div class="grid-12" transition:slide>
					<div class="col-6">
						<div class="input-wrapper">
							<label for="fineValue">
								{formData.fineType === 'Percentage' ? 'Fine Percentage' : 'Fine Amount'}
								<span class="required">*</span>
							</label>
							<input
								id="fineValue"
								type="number"
								min="0"
								step={formData.fineType === 'Percentage' ? '0.01' : '0.01'}
                                placeholder={'0.00'}
								bind:value={formData.fineValue}
								class={`w-full ${$formErrors.fineValue && (touched.fineValue || formSubmitted) ? 'input-error' : ''}`}
								oninput={(e) => handleChange('fineValue', parseFloat((e.target as HTMLInputElement).value) || '')} />
							{#if $formErrors.fineValue && (touched.fineValue || formSubmitted)}
								<p class="error-text">{$formErrors.fineValue}</p>
							{/if}
						</div>
					</div>
					<div class="col-6">
						<!-- Apply Per Day Switch (Conditional) -->
						{#if formData.fineType === 'Fix' || formData.fineType === 'Percentage'}
							<label for="perDay">Apply Per Day</label>
							<!-- <ToggleSwitch bind:checked={formData.perDay} onchange={(e) => handleChange('perDay', formData.perDay)}  required/> -->
							<ToggleSwitch bind:checked={formData.perDay} />
						{/if}
					</div>
				</div>
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
						Update Fee Master
					{:else}
						Create Fee Master
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Form Actions -->
</form>

<!-- prettier-ignore -->
<style>

</style>
