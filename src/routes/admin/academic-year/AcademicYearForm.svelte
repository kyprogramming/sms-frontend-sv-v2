<!-- console.log("academicYearData", $state.snapshot(academicYearData)); -->
<script lang="ts">
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal } from "$lib/stores/modalStore";

	import { BrushCleaning, Save } from "@lucide/svelte";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";
	import { createAcademicYear, updateAcademicYear } from "$lib/services/academic-year";

	import { academicYearFormSchema, type AcademicYearFormDataType } from "$lib/utils/schemas";
	import { formErrors } from "$lib/stores/formStore";
	import { onMount } from "svelte";
	import { isEqual } from "$lib/utils/utils";
	import { MESSAGES } from "$lib/utils/messages";
	import DatePicker from "$lib/components/common/DatePicker.svelte";
	import DateRangePicker from "$lib/components/common/DateRangePicker.svelte";
	import DatePicker2 from "$lib/components/common/DatePicker2.svelte";
	import { formatDate } from "$lib/utils/formatDate";
	let selectedDate: Date | null = null;
	const defaultDate = new Date(2025, 6, 15); // July 15, 2025

	let { onRefreshPage, academicYearData = null, action } = $props();

	export function initializeAcademicYearFormData(): AcademicYearFormDataType {
		return { name: "", startDate: "", endDate: "" };
	}
	// Reactive form state
	let formData: AcademicYearFormDataType = $state(initializeAcademicYearFormData());
	let touched: Partial<Record<keyof AcademicYearFormDataType, boolean>> = $state({});
	let formSubmitted: boolean = $state(false);

	onMount(() => {
		populateFormData();
		formErrors.set({ name: "", code: "", type: "" });
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
		if (action === "update") {
			formData = { ...academicYearData };
		} else {
			formData = initializeAcademicYearFormData();
		}
	}

	function handleStartDateChange(date: Date | null) {
		if (date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
			const day = String(date.getDate()).padStart(2, "0");
			formData.startDate = `${year}-${month}-${day}`;
		} else {
			formData.startDate = "";
		}
		validateForm(academicYearFormSchema, formData);
	}

	function handleEndDateChange(date: Date | null) {
		if (date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
			const day = String(date.getDate()).padStart(2, "0");
			formData.endDate = `${year}-${month}-${day}`;
		} else {
			formData.endDate = "";
		}
		validateForm(academicYearFormSchema, formData);
	}

	// Handle field changes
	function handleChange<K extends keyof AcademicYearFormDataType>(field: K, value: AcademicYearFormDataType[K]) {
		formData[field] = value;
		touched = { ...touched, [field]: true };
		validateForm(academicYearFormSchema, formData);
	}

	// function handleBlur(field: keyof any) {
	// 	touched = { ...touched, [field]: true };
	// 	validateForm(academicYearFormSchema, formData);
	// }

	function handleBlur(field: keyof any) {
		touched = { ...touched, [field]: true };
		// Add your validation logic here
		// if (!formData.startDate) {
		// 	$formErrors = { ...$formErrors, startDate: "Start date is required" };
		// }
		// if (!formData.endDate) {
		// 	$formErrors = { ...$formErrors, endDate: "End date is required" };
		// }
	}

	function handleStartDateSelect(date: Date) {
		formData.startDate = formatDate(date);
		// validateForm(academicYearFormSchema, formData);
	}
	function handleEndDateSelect(date: Date) {
		formData.endDate = formatDate(date);
		// validateForm(academicYearFormSchema, formData);
	}

	// Form submission handler
	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(academicYearFormSchema, formData);
		if (!isValid) return;

		if (action === "update" && academicYearData) {
			const isUnChanged = isEqual(academicYearData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: "warning" });
				return;
			}
			await updateAcademicYear(academicYearData._id, formData);
			showSnackbar({ message: "AcademicYear updated successfully", type: "success" });
		} else {
			await createAcademicYear(formData);
			showSnackbar({ message: "AcademicYear created successfully", type: "success" });
		}

		closeModal();
		onRefreshPage();
	}
</script>

<form onsubmit={onSubmit}>
	<div class="input-wrapper">
		<label for="name">Academic Year Name <span class="required"> *</span></label>
		<input id="name" type="text" name="name" placeholder="Academic year name" class={`w-full ${$formErrors.name && (touched.name || formSubmitted) ? "input-error" : ""}`} bind:value={formData.name} oninput={(e) => handleChange("name", (e.target as HTMLInputElement).value)} onblur={() => handleChange("name", formData.name)} />
		{#if $formErrors.name && (touched.name || formSubmitted)}
			<p class="error-text">{$formErrors.name}</p>
		{/if}
	</div>

	<div class="form-row">
		<div class="input-wrapper">
			<label for="startDate">Start Date<span class="required"> *</span></label>
			<DatePicker2 id="startDate" title="start date" defaultValue={defaultDate} {selectedDate} bind:value={formData.startDate} onBlur={() => handleBlur("startDate")} onDateSelect={handleStartDateChange} cls={`w-full ${$formErrors["startDate"] && (touched["startDate"] || formSubmitted) ? "input-error" : ""}`} />
			{#if $formErrors["startDate"] && (touched["startDate"] || formSubmitted)}
				<p class="error-text">{$formErrors["endDate"]}</p>
			{/if}
		</div>

		<!-- End Date -->
		<div class="input-wrapper">
			<label for="endDate">End Date<span class="required"> *</span></label>
			<DatePicker2 id="endDate" title="end date" defaultValue={defaultDate} {selectedDate} bind:value={formData.endDate} onBlur={() => handleBlur("endDate")} onDateSelect={handleEndDateChange} cls={`w-full ${$formErrors["endDate"] && (touched["endDate"] || formSubmitted) ? "input-error" : ""}`} />
			{#if $formErrors["endDate"] && (touched["endDate"] || formSubmitted)}
				<p class="error-text">{$formErrors["endDate"]}</p>
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
			{#if action === "update"}
				Update Academic Year
			{:else}
				Save Academic Year
			{/if}
		</button>
	</div>
</form>

<style>
	.form-row {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
		gap: 1.5rem;
		margin-bottom: 1rem;
	}

	.form-error {
		margin-top: 2px;
		color: #e53e3e;
	}
</style>
