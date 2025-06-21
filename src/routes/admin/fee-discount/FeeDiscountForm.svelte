<script lang="ts">
	import { feeDiscountFormSchema, type FeeDiscountPayload } from '$lib/utils/schemas';
	import { formErrors } from '$lib/stores/formStore';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { createFeeDiscount, updateFeeDiscount } from '$lib/services/fee-discount';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { isLoading } from '$lib/stores/loading';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import DatePicker2 from '$lib/components/common/DatePicker2.svelte';

	let { onRefreshPage, feeDiscountData = null, action } = $props();

	export function initializeFeeDiscountFormData(): FeeDiscountPayload {
		return {
			name: '',
			code: '',
			amount: '',
			discountType: '',
			applicableTo: '',
			expiryDate: '',
			active: true,
		};
	}

	let formData: FeeDiscountPayload = $state(initializeFeeDiscountFormData());
	let touched: Partial<Record<keyof FeeDiscountPayload, boolean>> = $state({});
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
        console.log("feeDiscountData.expiryDate", feeDiscountData);
		if (action === 'update' && feeDiscountData) {
            const expiry = feeDiscountData.expiryDate
			? new Date(feeDiscountData.expiryDate)
			: null;
			formData = {...feeDiscountData};
		} else {
			formData = initializeFeeDiscountFormData();
		}
	}

	function handleChange(field: keyof FeeDiscountPayload, value: any) {
		formData[field] = value as never;
		touched = { ...touched, [field]: true };
		validateForm(feeDiscountFormSchema, formData);
	}

	function handleApplicableToChange(value: string) {
		formData.applicableTo = value as 'student' | 'class' | 'all';
		touched = { ...touched, applicableTo: true };
		validateForm(feeDiscountFormSchema, formData);
	}

	function handleExpiryDateChange(dateString: string) {
		formData.expiryDate = dateString;
		validateForm(feeDiscountFormSchema, formData);
	}

	function handleDatePickerBlur(field: keyof FeeDiscountPayload, isOpen: boolean) {
		setTimeout(() => {
			if (!isOpen) {
				touched = { ...touched, [field]: true };
				validateForm(feeDiscountFormSchema, formData);
			}
		}, 100);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(feeDiscountFormSchema, formData);
		if (!isValid) return;

		try {
			if (action === 'update' && feeDiscountData) {

				const isUnChanged = isEqual(feeDiscountData, formData);
				console.log('isUnChanged', isUnChanged);
                console.log('feeDiscountData', feeDiscountData);
                console.log('formData', formData);
                if (isUnChanged) {
					showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
					return;
				}
				await updateFeeDiscount(feeDiscountData._id, formData);
				showSnackbar({ message: 'Fee discount updated successfully', type: 'success' });
			} else {
				await createFeeDiscount(formData);
				showSnackbar({ message: 'Fee discount created successfully', type: 'success' });
			}
			onRefreshPage();
		} catch (error: any) {
			showSnackbar({ message: error.message, type: 'error' });
		}
	}
</script>

<form onsubmit={onSubmit}>
	<div class="grid-12">
		<div class="col-6">
			<label for="name">Name <span class="required">*</span></label>
			<input id="name" type="text" name="name" placeholder="Discount name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={() => handleChange('name', formData.name)} />
			{#if $formErrors.name && (touched.name || formSubmitted)}
				<p class="error-text">{$formErrors.name}</p>
			{/if}
		</div>
		<div class="col-6">
			<label for="code">Discount Code</label>
			<input id="code" type="text" name="code" placeholder="Discount code" class={`w-full ${$formErrors.code && (touched.code || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.code} oninput={(e) => handleChange('code', (e.target as HTMLInputElement).value)} onblur={() => handleChange('code', formData.code)} />
			{#if $formErrors.code && (touched.code || formSubmitted)}
				<p class="error-text">{$formErrors.code}</p>
			{/if}
		</div>
		<div class="col-6">
			<label for="discountType">Discount Type <span class="required">*</span></label>
			<select id="discountType" name="discountType" class={`w-full ${$formErrors.discountType && (touched.discountType || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.discountType} onchange={(e) => handleChange('discountType', (e.target as HTMLInputElement).value)} onblur={() => handleChange('discountType', formData.discountType)}>
				<option value="" selected>Select Discount Type</option>
				<option value="fixed">Fixed Amount</option>
				<option value="percentage">Percentage</option>
			</select>
			{#if $formErrors.discountType && (touched.discountType || formSubmitted)}
				<p class="error-text">{$formErrors.discountType}</p>
			{/if}
		</div>
		<div class="col-6">
			<label for="amount">Amount <span class="required">*</span></label>
			<input
				id="amount"
				type="number"
				name="amount"
				placeholder={formData.discountType === 'percentage' ? '0-100' : '0.00'}
				min="0"
				step={formData.discountType === 'percentage' ? '1' : '0.01'}
				inputmode="decimal"
				class={`w-full ${$formErrors.value && (touched.amount || formSubmitted) ? 'input-error' : ''}`}
				bind:value={formData.amount}
				oninput={(e) => {
					const value = (e.target as HTMLInputElement).value;
					handleChange('amount', value === '' ? '' : parseFloat(value));
				}}
				onblur={() => handleChange('amount', formData.amount)} />
			{#if $formErrors.amount && (touched.amount || formSubmitted)}
				<p class="error-text">{$formErrors.amount}</p>
			{/if}
		</div>

		<div class="col-6">
			<label for="applicableTo">Applicable To <span class="required">*</span></label>
			<select id="applicableTo" name="applicableTo" class={`w-full ${$formErrors.applicableTo && (touched.applicableTo || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.applicableTo} onchange={(e) => handleApplicableToChange((e.target as HTMLInputElement).value)} onblur={() => handleChange('applicableTo', formData.applicableTo)}>
				<option value="">Applicable To</option>
				<option value="all">All</option>
				<option value="student">Student</option>
				<option value="class">Class</option>
			</select>
			{#if $formErrors.applicableTo && (touched.applicableTo || formSubmitted)}
				<p class="error-text">{$formErrors.applicableTo}</p>
			{/if}
		</div>
		<div class="col-6">
			<label for="expiryDate">Expiry Date<span class="required"> *</span></label>
			<DatePicker2 id="expiryDate" title="Expiry Date" bind:value={formData.expiryDate} onDateSelect={handleExpiryDateChange} onBlur={(isOpen) => handleDatePickerBlur('expiryDate', isOpen)} cls={`w-full ${$formErrors.expiryDate && (touched.expiryDate || formSubmitted) ? 'input-error' : ''}`} />
			{#if $formErrors['expiryDate'] && (touched['expiryDate'] || formSubmitted)}
				<p class="error-text">{$formErrors['expiryDate']}</p>
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
						Update Discount
					{:else}
						Create Discount
					{/if}
				</button>
			</div>
		</div>
	</div>
</form>
