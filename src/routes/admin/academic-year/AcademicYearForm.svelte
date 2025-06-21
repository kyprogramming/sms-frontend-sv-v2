<!-- console.log("academicYearData", $state.snapshot(academicYearData)); -->
<script lang="ts">
	import { isLoading } from '$lib/stores/loading';
	import { validateForm } from '$lib/utils/validate';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { closeModal } from '$lib/stores/modalStore';

	import { BrushCleaning, Save } from '@lucide/svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { createAcademicYear, updateAcademicYear } from '$lib/services/academic-year';


	import { formErrors } from '$lib/stores/formStore';
	import { onMount } from 'svelte';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import DatePicker2 from '$lib/components/common/DatePicker2.svelte';
	import { academicYearFormSchema, type AcademicYearPayload } from '$lib/schemas/academic-year.schema';

	let { onRefreshPage, academicYearData = null, action } = $props();

	export function initializeAcademicYearFormData(): AcademicYearPayload {
		return { name: '', startDate: '', endDate: '' };
	}
	// Reactive form state
	let formData: AcademicYearPayload = $state(initializeAcademicYearFormData());
	let touched: Partial<Record<keyof AcademicYearPayload, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({});
	});

	// Form reset handler
	function handleResetForm() {
		populateFormData();
		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	// Populate form data based on action
	function populateFormData() {
		if (action === 'update') {
			formData = { ...academicYearData };
		} else {
			formData = initializeAcademicYearFormData();
		}
	}

	function handleStartDateChange(dateString: string) {
		formData.startDate = dateString;
		validateForm(academicYearFormSchema, formData);
	}

	function handleEndDateChange(dateString: string) {
		formData.endDate = dateString;
		validateForm(academicYearFormSchema, formData);
	}

	// Handle field changes
	function handleChange<K extends keyof AcademicYearPayload>(field: K, value: AcademicYearPayload[K]) {
		formData[field] = value;
		touched = { ...touched, [field]: true };
		validateForm(academicYearFormSchema, formData);
	}

	// Update blur handler
	function handleBlur(field: keyof AcademicYearPayload) {
		touched = { ...touched, [field]: true };
		validateForm(academicYearFormSchema, formData);
	}
	function handleDatePickerBlur(field: keyof AcademicYearPayload, isOpen: boolean) {
		// Only validate if the date picker isn't open
		setTimeout(() => {
			if (!isOpen) {
				touched = { ...touched, [field]: true };
				validateForm(academicYearFormSchema, formData);
			}
		}, 100);
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		console.log(formData);
		const isValid = validateForm(academicYearFormSchema, formData);
		if (!isValid) return;

		if (action === 'update' && academicYearData) {
			const isUnChanged = isEqual(academicYearData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateAcademicYear(academicYearData._id, formData);
			showSnackbar({ message: 'AcademicYear updated successfully', type: 'success' });
		} else {
			await createAcademicYear(formData);
			showSnackbar({ message: 'AcademicYear created successfully', type: 'success' });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Academic Year Name <span class="required"> *</span></label>
		<input id="name" type="text" name="name" placeholder="Academic year name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? 'input-error' : ''}`} bind:value={formData.name} oninput={(e) => handleChange('name', (e.target as HTMLInputElement).value)} onblur={() => handleBlur('name')} />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="form-row">
		<div class="input-wrapper">
			<label for="startDate">Start Date<span class="required"> *</span></label>
			<DatePicker2 id="startDate" title="Start Date" bind:value={formData.startDate} onDateSelect={handleStartDateChange} onBlur={(isOpen) => handleDatePickerBlur('startDate', isOpen)} cls={`w-full ${$formErrors.startDate && (touched.startDate || formSubmitted) ? 'input-error' : ''}`} />
			{#if $formErrors['startDate'] && (touched['startDate'] || formSubmitted)}
				<p class="error-text">{$formErrors['startDate']}</p>
			{/if}
		</div>

		<div class="input-wrapper">
			<label for="endDate">End Date<span class="required"> *</span></label>
			<DatePicker2 id="endDate" title="Start Date" bind:value={formData.endDate} onDateSelect={handleEndDateChange} onBlur={(isOpen) => handleDatePickerBlur('endDate', isOpen)} cls={`w-full ${$formErrors.endDate && (touched.endDate || formSubmitted) ? 'input-error' : ''}`} />
			{#if $formErrors['endDate'] && (touched['endDate'] || formSubmitted)}
				<p class="error-text">{$formErrors['endDate']}</p>
			{/if}
		</div>
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
				Update Academic Year
			{:else}
				Save Academic Year
			{/if}
		</button>
	</div>
</form>

<!-- prettier-ignore -->
<style>
    .form-row {display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 1.5rem; margin-bottom: 1rem}
    .form-error {margin-top: 2px; color: #e53e3e}
</style>
