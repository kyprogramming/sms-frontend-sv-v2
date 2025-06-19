<script lang="ts">
	import { formErrors } from '$lib/stores/formStore';
	import { slide } from 'svelte/transition';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { createFeeAssignment, updateFeeAssignment } from '$lib/services/fee-assignment';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { isLoading } from '$lib/stores/loading';
	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { page } from '$app/state';

	import DatePicker2 from '$lib/components/common/DatePicker2.svelte';
	import { createFeeAssignmentSchema, type FeeAssignmentPayload } from '$lib/utils/schemas';

	let { onRefreshPage, assignmentData = null, action } = $props();
	let students = page.data?.students?.data || [];
	let feeMasters = page.data?.feeMasters?.data || [];

	export function initializeAssignmentFormData(): any {
		return {
			studentId: '',
			feeMasterId: '',
			amount: '',
			isPaid: false,
			dueDate: '',
			paidDate: '',
			fineApplied: 0,
			academicYear: '',
		};
	}

	let formData = $state(initializeAssignmentFormData());
	let touched = $state<Record<string, boolean>>({});
	let formSubmitted = $state(false);

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
		if (action === 'update' && assignmentData) {
			formData = {
				...assignmentData,
				studentId: assignmentData.studentId._id || assignmentData.studentId,
				feeMasterId: assignmentData.feeMasterId._id || assignmentData.feeMasterId,
				dueDate: assignmentData.dueDate || '',
				paidDate: assignmentData.paidDate || '',
			};
		} else {
			formData = initializeAssignmentFormData();
		}
	}

	function handleDueDateChange(dateString: string) {
		formData.dueDate = dateString;
		validateForm(createFeeAssignmentSchema, formData);
	}

	function handlePaidDateChange(dateString: string) {
		formData.paidDate = dateString;
		validateForm(createFeeAssignmentSchema, formData);
	}

	function handleDatePickerBlur(field: string, isOpen: boolean) {
		setTimeout(() => {
			if (!isOpen) {
				touched = { ...touched, [field]: true };
				validateForm(createFeeAssignmentSchema, formData);
			}
		}, 100);
	}

	function handleChange(field: string, value: any) {
		formData[field] = value;
		touched = { ...touched, [field]: true };
		validateForm(createFeeAssignmentSchema, formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(createFeeAssignmentSchema, formData);
		if (!isValid) return;

		try {
			if (action === 'update' && assignmentData) {
				const isUnChanged = isEqual(assignmentData, formData);
				if (isUnChanged) {
					showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
					return;
				}
				await updateFeeAssignment(assignmentData._id, formData);
				showSnackbar({ message: 'Assignment updated successfully', type: 'success' });
			} else {
				await createFeeAssignment(formData);
				showSnackbar({ message: 'Assignment created successfully', type: 'success' });
			}
			onRefreshPage();
		} catch (error: any) {
			showSnackbar({ message: error.message, type: 'error' });
		}
	}
</script>

<form onsubmit={onSubmit}>
	<div class="grid-12">
		<!-- Student Dropdown -->
		<div class="col-6">
			<label for="studentId">Student <span class="required">*</span></label>
			<select
				id="studentId"
				bind:value={formData.studentId}
				class={`w-full ${$formErrors.studentId && (touched.studentId || formSubmitted) ? 'input-error' : ''}`}
				onchange={(e) => handleChange('studentId', (e.target as HTMLSelectElement).value)}>
				<option value="">Select student</option>
				{#each students as student}
					<option value={student._id}>
						{student.firstName}
						{student.lastName} ({student.admissionNo})
					</option>
				{/each}
			</select>
			{#if $formErrors.studentId && (touched.studentId || formSubmitted)}
				<p class="error-text">{$formErrors.studentId}</p>
			{/if}
		</div>

		<!-- Fee Master Dropdown -->
		<div class="col-6">
			<label for="feeMasterId">Fee Master <span class="required">*</span></label>
			<select
				id="feeMasterId"
				bind:value={formData.feeMasterId}
				class={`w-full ${$formErrors.feeMasterId && (touched.feeMasterId || formSubmitted) ? 'input-error' : ''}`}
				onchange={(e) => handleChange('feeMasterId', (e.target as HTMLSelectElement).value)}>
				<option value="">Select fee master</option>
				{#each feeMasters as feeMaster}
					<option value={feeMaster._id}>
						{feeMaster.feeTypeId?.name} - ₹{feeMaster?.amount?.toFixed(2)}
					</option>
				{/each}
			</select>
			{#if $formErrors.feeMasterId && (touched.feeMasterId || formSubmitted)}
				<p class="error-text">{$formErrors.feeMasterId}</p>
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
				placeholder="0.00"
				bind:value={formData.amount}
				class={`w-full ${$formErrors.amount && (touched.amount || formSubmitted) ? 'input-error' : ''}`}
				oninput={(e) => handleChange('amount', parseFloat((e.target as HTMLInputElement).value) || '')} />
			{#if $formErrors.amount && (touched.amount || formSubmitted)}
				<p class="error-text">{$formErrors.amount}</p>
			{/if}
		</div>

		<!-- Academic Year -->
		<div class="col-6">
			<label for="academicYear">Academic Year <span class="required">*</span></label>
			<input
				id="academicYear"
				type="text"
				placeholder="e.g. 2023-2024"
				bind:value={formData.academicYear}
				class={`w-full ${$formErrors.academicYear && (touched.academicYear || formSubmitted) ? 'input-error' : ''}`}
				oninput={(e) => handleChange('academicYear', (e.target as HTMLInputElement).value)} />
			{#if $formErrors.academicYear && (touched.academicYear || formSubmitted)}
				<p class="error-text">{$formErrors.academicYear}</p>
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
			{#if $formErrors.dueDate && (touched.dueDate || formSubmitted)}
				<p class="error-text">{$formErrors.dueDate}</p>
			{/if}
		</div>

		<!-- Payment Status -->
		<div class="col-6">
			<label class="checkbox-container">
				<input type="checkbox" class="checkbox-input" bind:checked={formData.isPaid} onchange={(e) => handleChange('isPaid', e.currentTarget.checked)} />
				<span class="checkbox-custom"></span>
				<span class="checkbox-text">Paid</span>
			</label>
		</div>

		<!-- Paid Date (Conditional) -->
		{#if formData.isPaid}
			<div class="col-6" transition:slide>
				<label for="paidDate">Paid Date</label>
				<DatePicker2
					id="paidDate"
					title="paid date"
					bind:value={formData.paidDate}
					cls={`w-full ${$formErrors.paidDate && (touched.paidDate || formSubmitted) ? 'input-error' : ''}`}
					onDateSelect={handlePaidDateChange}
					onBlur={(isOpen) => handleDatePickerBlur('paidDate', isOpen)} />
				{#if $formErrors.paidDate && (touched.paidDate || formSubmitted)}
					<p class="error-text">{$formErrors.paidDate}</p>
				{/if}
			</div>
		{/if}

		<!-- Fine Applied -->
		<div class="col-6">
			<label for="fineApplied">Fine Applied</label>
			<input
				id="fineApplied"
				type="number"
				min="0"
				step="0.01"
				placeholder="0.00"
				bind:value={formData.fineApplied}
				class={`w-full ${$formErrors.fineApplied && (touched.fineApplied || formSubmitted) ? 'input-error' : ''}`}
				oninput={(e) => handleChange('fineApplied', parseFloat((e.target as HTMLInputElement).value) || 0)} />
			{#if $formErrors.fineApplied && (touched.fineApplied || formSubmitted)}
				<p class="error-text">{$formErrors.fineApplied}</p>
			{/if}
		</div>

		<!-- Form Actions -->
		<div class="col-12">
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
						Update Assignment
					{:else}
						Create Assignment
					{/if}
				</button>
			</div>
		</div>
	</div>
</form>
