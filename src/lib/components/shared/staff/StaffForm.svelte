<script lang="ts">
	import DatePicker from "$lib/components/common/DatePicker.svelte";
	import TagInput from "$lib/components/common/TagInput.svelte";
	import {
		BLOOD_GROUPS,
		CASTE_CATEGORIES,
		GENDERS,
		GUARDIAN_TYPE,
	} from "$lib/utils/constants";
	import { isLoading } from "$lib/stores/loading";

	import {
		initializeStaffFormData,
		staffSchema,
		type StaffFormData,
	} from "./staffValidation";
	import { slide } from "svelte/transition";
	import { createStaff, updateStaff } from "$lib/services/staff";
	import FileUpload from "$lib/components/common/FileUpload.svelte";
	import { BrushCleaning, Save } from "@lucide/svelte";

	import { showSnackbar } from "$lib/components/snackbar/store";
	import { goto } from "$app/navigation";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";
	import { formErrors } from "$lib/stores/formStore";
	import { onMount } from "svelte";
	import { env } from "$env/dynamic/public";
	import { isEqual } from "$lib/utils/utils";
	import { MESSAGES } from "$lib/utils/messages";
	import { formatLocalDate } from "$lib/utils/formatDate";
	import { validateForm } from "$lib/utils/validate";

	// Props
	let { staffData = null, action } = $props();
	const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
	const pageTitle = `${schoolName} - Staff Registration - ${action === "update" ? " Update" : "New"}`;

	let formData: StaffFormData = $state(initializeStaffFormData());
	formErrors.set({});
	let touched: any = $state({});
	let formSubmitted: boolean = $state(false);

	// console.log("staffData:", action, staffData);

	onMount(() => {
		formErrors.set({});
		// Initialize form data based on action
		if (action === "update" && staffData) {
			formData = {
				staffData: { ...staffData.data },
				userData: { ...staffData.data.userId },
			};
		}
		touched = {};
	});

	function handleResetForm() {
		if (action === "update" && staffData) {
			formData = {
				staffData: { ...staffData.data },
				userData: { ...staffData.data.userId },
			};
		} else {
			formData = initializeStaffFormData();
		}

		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	function handleBirthDateChange(date: Date | null) {
		if (date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
			const day = String(date.getDate()).padStart(2, "0");
			formData.staffData.profile.dob = `${year}-${month}-${day}`;
		} else {
			formData.staffData.profile.dob = "";
		}
		validateForm(staffSchema, formData);
	}

	function handleOnClear(date: Date | null) {
		formData.staffData.profile.dob = "";
	}

	function handleBlur(field: keyof any) {
		touched = { ...touched, [field]: true };
		validateForm(staffSchema, formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateForm(staffSchema, formData);
		if (!isValid) return;

		if (action === "update" && staffData) {
			// Check if the form data is unchanged before updating
			const isUnChanged = isEqual(staffData.data, formData.staffData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: "warning" });
				return;
			}
			await updateStaff(staffData.data._id, formData);
			showSnackbar({ message: "Staff updated successfully", type: "success" });
			await goto("/admin/staff/list");
		} else {
			await createStaff(formData);
			showSnackbar({ message: "Staff created successfully", type: "success" });
			await goto("/admin/staff/list");
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<form onsubmit={onSubmit}>
	<!-- Staff Academic Detail -->
	<div class="card-wrapper">
		<h1>Profile Details</h1>
		<div class="grid-12">
			<!-- Staff ID -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.staffId",
					"Staff ID",
					true,
					"text",
					formData.staffData.profile.staffId,
					(val) => (formData.staffData.profile.firstName = val),
					20,
				)}
			</div>

			<!-- Role -->
			<div class="col-2">
				<label for="classId">Role <span class="required">*</span></label>
				<select
					id="classId"
					class={`w-full ${formData.staffData.profile.role === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.profile.role"] && (touched["staffData.profile.role"] || formSubmitted) ? "input-error" : ""}`}
					bind:value={formData.staffData.profile.role}
				>
					<option value="" selected>Select role</option>
					<!-- {#each classData as cls}
						<option value={cls._id}>{cls.name}</option>
					{/each} -->
				</select>
				{#if $formErrors["staffData.profile.role"] && (touched["staffData.profile.role"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.profile.role"]}</p>
				{/if}
			</div>

			<!-- Designation -->
			<div class="col-2">
				<label for="designation"
					>Designation <span class="required">*</span></label
				>
				<select
					id="designation"
					class={`w-full ${formData.staffData.profile.designation === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.profile.designation"] && (touched["staffData.profile.designation"] || formSubmitted) ? "input-error" : ""}`}
					bind:value={formData.staffData.profile.designation}
				>
					<option value="" selected>Select designation</option>
					<!-- {#each classData as cls}
						<option value={cls._id}>{cls.name}</option>
					{/each} -->
				</select>
				{#if $formErrors["staffData.profile.designation"] && (touched["staffData.profile.designation"] || formSubmitted)}
					<p class="error-text">
						{$formErrors["staffData.profile.designation"]}
					</p>
				{/if}
			</div>

			<!-- Department -->
			<div class="col-2">
				<label for="designation"
					>Department <span class="required">*</span></label
				>
				<select
					id="designation"
					class={`w-full ${formData.staffData.profile.department === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.profile.department"] && (touched["staffData.profile.department"] || formSubmitted) ? "input-error" : ""}`}
					bind:value={formData.staffData.profile.department}
				>
					<option value="" selected>Select department</option>
					<!-- {#each classData as cls}
						<option value={cls._id}>{cls.name}</option>
					{/each} -->
				</select>
				{#if $formErrors["staffData.profile.department"] && (touched["staffData.profile.department"] || formSubmitted)}
					<p class="error-text">
						{$formErrors["staffData.profile.department"]}
					</p>
				{/if}
			</div>

			<!-- Date of Joining -->
			<div class="col-2">
				<label for="dateOfJoining">Date of Joining</label>
				<DatePicker
					id={"dateOfJoining"}
					bind:value={formData.staffData.profile.dateOfJoining}
					onChange={() => {}}
					defaultToday={true}
				/>
			</div>

			<!-- Qualification -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.qualification",
					"Qualification",
					false,
					"text",
					formData.staffData.profile.qualification ?? "",
					(val) => (staffData.profile.qualification = val),
					20,
				)}
			</div>

			<!-- First Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.firstName",
					"First Name",
					true,
					"text",
					formData.staffData.profile.firstName ?? "",
					(val) => (staffData.profile.firstName = val),
					20,
				)}
			</div>

			<!-- Middle Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.middleName",
					"Middle Name",
					false,
					"text",
					formData.staffData.profile.middleName ?? "",
					(val) => (staffData.profile.middleName = val),
					20,
				)}
			</div>

			<!-- Last Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.lastName",
					"Last Name",
					true,
					"text",
					formData.staffData.profile.lastName ?? "",
					(val) => (staffData.profile.lastName = val),
					20,
				)}
			</div>

			<!-- Date of Birth -->
			<div class="col-2">
				<label for="dob">Date of Birth <span class="required">*</span></label>
				<DatePicker
					bind:value={formData.staffData.profile.dob}
					onChange={handleBirthDateChange}
					onClear={handleOnClear}
					cls={`w-full ${$formErrors["staffData.profile.dob"] && (touched["staffData.profile.dob"] || formSubmitted) ? "input-error" : ""}`}
				/>
				{#if $formErrors["staffData.profile.dob"] && (touched["staffData.profile.dob"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.profile.dob"]}</p>
				{/if}
			</div>

			<!-- Gender -->
			<div class="col-2">
				<label for="gender">Gender <span class="required">*</span></label>
				<select
					class={`w-full ${formData.staffData.profile.gender === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.profile.gender"] && (touched["staffData.profile.gender"] || formSubmitted) ? "input-error" : ""}`}
					bind:value={formData.staffData.profile.gender}
				>
					<option value="" selected>Select gender</option>
					{#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each}
				</select>
				{#if $formErrors["staffData.profile.gender"] && (touched["staffData.profile.gender"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.profile.gender"]}</p>
				{/if}
			</div>

			<!--  Marital Status -->
			<div class="col-2">
				<label for="maritalStatus">
					Marital Status <span class="required">*</span></label
				>
				<select
					class={`w-full`}
					bind:value={formData.staffData.profile.maritalStatus}
				>
					<option value="" selected>Select Marital Status</option>
					<!-- {#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each} -->
				</select>
			</div>

			<!-- Email -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.email",
					"Email",
					false,
					"text",
					formData.staffData.profile.email ?? "",
					(val) => (formData.staffData.profile.email = val),
					50,
				)}
			</div>

			<!-- Contact No -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.contactNo",
					"Contact No",
					false,
					"tel",
					formData.staffData.profile.contactNo ?? "",
					(val) => (formData.staffData.profile.contactNo = val),
					10,
				)}
			</div>

			<!-- Emergency Contact -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.emergencyNo",
					"Emergency Contact",
					false,
					"tel",
					formData.staffData.profile.emergencyNo ?? "",
					(val) => (formData.staffData.profile.emergencyNo = val),
					10,
				)}
			</div>

			<!-- Father Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.fatherName",
					"Father Name",
					false,
					"text",
					formData.staffData.profile.fatherName ?? "",
					(val) => (staffData.profile.fatherName = val),
					20,
				)}
			</div>

			<!-- Mother Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.motherName",
					"Mother Name",
					false,
					"text",
					formData.staffData.profile.motherName ?? "",
					(val) => (staffData.profile.motherName = val),
					20,
				)}
			</div>

			<!-- Spouse Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.motherName",
					"Spouse Name",
					false,
					"text",
					formData.staffData.profile.motherName ?? "",
					(val) => (staffData.profile.motherName = val),
					20,
				)}
			</div>

			<!-- Pan -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.panNumber",
					"PAN No",
					false,
					"text",
					formData.staffData.profile.panNumber ?? "",
					(val) => (staffData.profile.panNumber = val),
					20,
				)}
			</div>

			<!-- Work Experience -->
			<div class="col-4">
				{@render renderInput(
					"staffData.profile.workExperience",
					"Work Experience",
					false,
					"text",
					formData.staffData.profile.workExperience ?? "",
					(val) => (staffData.profile.workExperience = val),
					20,
				)}
			</div>

			<!-- Note -->
			<div class="col-6">
				{@render renderInput(
					"staffData.profile.note",
					"Note",
					false,
					"text",
					formData.staffData.profile.note ?? "",
					(val) => (staffData.profile.note = val),
					20,
				)}
			</div>

			<!-- Current Address -->
			<div class="col-6">
				{@render renderTextarea(
					"staffData.profile.address",
					"Current Address",
					true,
					formData.staffData.profile.address ?? "",
					(val) => (formData.staffData.profile.address = val),
					300,
				)}
			</div>
			<!-- Permanent Address -->
			<div class="col-6">
				{@render renderTextarea(
					"staffData.profile.permanentAddress",
					"Permanent Address",
					false,
					formData.staffData.profile.permanentAddress ?? "",
					(val) => (formData.staffData.profile.permanentAddress = val),
					300,
				)}
			</div>
		</div>
	</div>

	<!-- Upload Photo -->
	<div class="card-wrapper">
		<h1>Upload Photos</h1>
		<div class="grid-12">
			<div class="col-3">
				<label for="street">Staff Photo</label>
				<FileUpload id="staffPhoto" />
			</div>

			<div class="col-3">
				<!-- <label for="city">Father Photo</label>
				<FileUpload id="fatherPhoto" /> -->
			</div>

			<div class="col-3">
				<!-- <label for="city">Mother Photo</label>
				<FileUpload id="motherPhoto" /> -->
			</div>

			<div class="col-3">
				<!-- <label for="city">Guardian Photo</label>
				<FileUpload id="guardianPhoto" /> -->
			</div>
		</div>
	</div>

	<!-- Upload Documents -->
	<!-- <div class="card-wrapper">
		<h1>Upload Documents</h1>
		<div class="grid-12">
			<div class="col-12">
				<table>
					<thead>
						<tr>
							<th style="width:5%;">#</th>
							<th style="width:20%;">Title</th>
							<th style="width:25%;">Document</th>
							<th>Url</th>
						</tr>
					</thead>
					<tbody>
						{#each documents as doc, index}
							<tr>
								<td>{index + 1}</td>
								<td><input id="" type="text" /></td>
								<td>
									<FileUpload id="staffPhoto" />
								</td>
								<td>{doc.title}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div> -->

	<!-- Form Actions -->
	<div class="form-actions">
		<button
			type="button"
			class="btn ripple btn-secondary"
			onclick={handleResetForm}
			disabled={$isLoading}
		>
			<BrushCleaning />
			<span>Reset Form</span>
		</button>

		<button class="btn ripple" type="submit" disabled={$isLoading}>
			<LoaderIcon />
			{#if !$isLoading}
				<Save />
			{/if}
			{#if action === "update"}
				Update Staff
			{:else}
				Save Staff
			{/if}
		</button>
	</div>
</form>

{#snippet renderInput(
	fieldName: string,
	title: string,
	isRequired = true,
	type = "text",
	value: string,
	onInput: (val: string) => void,
	length = 100,
)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<input
		id={fieldName}
		{type}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? "input-error" : ""}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateForm(staffSchema, formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"
	/>

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

{#snippet renderTextarea(
	fieldName: string,
	title: string,
	isRequired = true,
	value: string,
	onInput: (val: string) => void,
	length = 100,
)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<textarea
		id={fieldName}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? "input-error" : ""}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateForm(staffSchema, formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"
	></textarea>

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

<style>
	/* Base styles */
	label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 500;
		color: var(--text-primary);
	}

	/* Section styles */
	.section {
		border: 1px solid var(--border);
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		/* overflow: hidden; */
	}

	.section-header {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 1rem;
		background-color: var(--clr-bg-2);
		font-weight: 600;
		transition: background-color 0.2s;
	}

	.section-header:hover {
		background-color: var(--clr-bg-3);
	}

	.arrow-icon {
		transition: transform 0.2s ease;
	}

	.section-body {
		padding: 1rem;
		transition: all 0.2s ease;
	}

	.section-body.collapsed {
		display: none;
	}

	/* Grid layout */
	.grid-5 {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1.5rem;
	}

	/* Responsive styles */
	@media (max-width: 1024px) {
		.grid-5 {
			grid-template-columns: repeat(3, 1fr);
		}
	}

	@media (max-width: 768px) {
		.grid-5 {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 480px) {
		.grid-5 {
			grid-template-columns: 1fr;
		}

		.form-actions {
			flex-direction: column;
		}

		.btn {
			width: 100%;
		}
	}

	.card-wrapper {
		padding: 15px;
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: var(--shadow-sm);
		margin-bottom: 10px;
	}

	.radio-group {
		display: flex;
		flex-direction: row;
		gap: 1rem;
	}
	input[type="radio"] {
		cursor: pointer;
	}

	.radio-section {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.radio-item {
		display: flex;
		align-items: center;
	}

	.radio-label {
		display: flex;
		align-items: center;
		cursor: pointer;
	}

	.radio-input {
		display: none;
	}

	.radio-custom {
		width: 1rem;
		height: 1rem;
		border: 2px solid #ccc;
		border-radius: 50%;
		margin-right: 0.5rem;
		position: relative;
	}

	.radio-input:checked + .radio-custom::after {
		content: "";
		width: 0.6rem;
		height: 0.6rem;
		background: #007bff;
		border-radius: 50%;
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
	}

	.has-error .radio-custom {
		border-color: red;
	}

	.placeholder-gray {
		color: gray;
	}
</style>
