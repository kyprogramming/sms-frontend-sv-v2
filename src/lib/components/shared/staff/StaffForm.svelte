<script lang="ts">
	import DatePicker from "$lib/components/common/DatePicker.svelte";
	import TagInput from "$lib/components/common/TagInput.svelte";
	import {
		BLOOD_GROUPS,
		CASTE_CATEGORIES,
		CONTRACT_TYPE,
		GENDERS,
		GUARDIAN_TYPE,
		MARITAL_STATUSES,
		SHIFT,
		STAFF_DEPARTMENTS,
		STAFF_DESIGNATIONS,
		STAFF_ROLES,
	} from "$lib/utils/constants";
	import { isLoading } from "$lib/stores/loading";

	import {
		flattenErrors,
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
		console.log("touched", touched);
		validateForm(staffSchema, formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		const isValid = validateForm(staffSchema, formData);
		console.log("isValid", isValid);
		console.log("formData", formData);
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
					(val) => (formData.staffData.profile.staffId = String(val)),
					20,
				)}
			</div>

			<!-- Role -->
			<div class="col-2">
				{@render renderSelect(
					"staffData.profile.role",
					"Role",
					true,
					STAFF_ROLES,
					formData.staffData.profile.role,
					(val) => (formData.staffData.profile.role = val),
				)}
			</div>

			<!-- Designation -->
			<div class="col-2">
				{@render renderSelect(
					"staffData.profile.designation",
					"Designation",
					true,
					STAFF_DESIGNATIONS,
					formData.staffData.profile.designation,
					(val) => (formData.staffData.profile.designation = val),
				)}
			</div>

			<!-- Department -->
			<div class="col-2">
				{@render renderSelect(
					"staffData.profile.department",
					"Department",
					true,
					STAFF_DEPARTMENTS,
					formData.staffData.profile.department,
					(val) => (formData.staffData.profile.department = val),
				)}
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
					"Highest Qualification",
					false,
					"text",
					formData.staffData.profile.qualification ?? "",
					(val) => (formData.staffData.profile.qualification = String(val)),
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
					(val) => (formData.staffData.profile.firstName = String(val)),
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
					(val) => (formData.staffData.profile.middleName = String(val)),
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
					(val) => (formData.staffData.profile.lastName = String(val)),
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
				{@render renderSelect(
					"staffData.profile.gender",
					"Gender",
					true,
					GENDERS,
					formData.staffData.profile.gender,
					(val) => (formData.staffData.profile.gender = val),
				)}
			</div>

			<!--  Marital Status -->
			<div class="col-2">
				{@render renderSelect(
					"staffData.profile.maritalStatus",
					"Marital Status",
					true,
					MARITAL_STATUSES,
					formData.staffData.profile.maritalStatus,
					(val) => (formData.staffData.profile.maritalStatus = val),
				)}
			</div>

			<!-- Email -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.email",
					"Email",
					true,
					"text",
					formData.staffData.profile.email ?? "",
					(val) => (formData.staffData.profile.email = String(val)),
					50,
				)}
			</div>

			<!-- Contact No -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.contactNo",
					"Contact No",
					true,
					"tel",
					formData.staffData.profile.contactNo ?? "",
					(val) => (formData.staffData.profile.contactNo = String(val)),
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
					(val) => (formData.staffData.profile.emergencyNo = String(val)),
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
					(val) => (formData.staffData.profile.fatherName = String(val)),
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
					(val) => (formData.staffData.profile.motherName = String(val)),
					20,
				)}
			</div>

			<!-- Spouse Name -->
			<div class="col-2">
				{@render renderInput(
					"staffData.profile.spouseName",
					"Spouse Name",
					false,
					"text",
					formData.staffData.profile.spouseName ?? "",
					(val) => (formData.staffData.profile.spouseName = String(val)),
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
					(val) => (formData.staffData.profile.panNumber = String(val)),
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
					(val) => (formData.staffData.profile.workExperience = String(val)),
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
					(val) => (formData.staffData.profile.note = String(val)),
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

	<!--Payroll Details -->
	<div class="card-wrapper">
		<h1>Payroll Details</h1>
		<div class="grid-12">
			<div class="col-2">
				{@render renderInput(
					"staffData.payroll.epfNo",
					"EPF No",
					false,
					"text",
					formData.staffData.payroll.epfNo ?? "",
					(val) => (formData.staffData.payroll.epfNo = String(val)),
					20,
				)}
			</div>

			<div class="col-2">
				{@render renderInput(
					"staffData.payroll.basicSalary",
					"Basic Salary",
					false,
					"text",
					formData.staffData.payroll.basicSalary ?? 0,
					(val) => (formData.staffData.payroll.basicSalary = Number(val)),
					10,
				)}
			</div>

			<div class="col-2">
				{@render renderSelect(
					"staffData.payroll.contractType",
					"Contract Type",
					false,
					CONTRACT_TYPE,
					formData.staffData.payroll.contractType,
					(val) => (formData.staffData.payroll.contractType = val),
				)}
			</div>

			<div class="col-2">
				{@render renderSelect(
					"staffData.payroll.shift",
					"Shift",
					false,
					SHIFT,
					formData.staffData.payroll.shift,
					(val) => (formData.staffData.payroll.shift = val),
				)}
			</div>

			<div class="col-4">
				{@render renderInput(
					"staffData.payroll.workLocation",
					"Location",
					false,
					"text",
					formData.staffData.payroll.workLocation ?? "",
					(val) => (formData.staffData.payroll.workLocation = String(val)),
					20,
				)}
			</div>
		</div>
	</div>

	<!-- Leave Allotments -->
	<div class="card-wrapper">
		<h1>Leave Allotments</h1>
		<div class="grid-12">
			<div class="col-2">
				{@render renderInput(
					"staffData.leaveAllotments.medicalLeave",
					"Medical Leave",
					false,
					"text",
					formData.staffData.leaveAllotments.medicalLeave ?? 0,
					(val) =>
						(formData.staffData.leaveAllotments.medicalLeave = Number(val)),
					10,
				)}
			</div>

			<div class="col-2">
				{@render renderInput(
					"staffData.leaveAllotments.casualLeave",
					"Casual Leave",
					false,
					"text",
					formData.staffData.leaveAllotments.casualLeave ?? 0,
					(val) =>
						(formData.staffData.leaveAllotments.casualLeave = Number(val)),
					10,
				)}
			</div>
			<div class="col-2">
				{@render renderInput(
					"staffData.leaveAllotments.maternityLeave",
					"Maternity Leave",
					false,
					"text",
					formData.staffData.leaveAllotments.maternityLeave ?? 0,
					(val) =>
						(formData.staffData.leaveAllotments.maternityLeave = Number(val)),
					10,
				)}
			</div>
			<div class="col-2">
				{@render renderInput(
					"staffData.leaveAllotments.sickLeave",
					"Sick Leave",
					false,
					"text",
					formData.staffData.leaveAllotments.sickLeave ?? 0,
					(val) => (formData.staffData.leaveAllotments.sickLeave = Number(val)),
					10,
				)}
			</div>
		</div>
	</div>

	<!-- Bank Details -->
	<div class="card-wrapper">
		<h1>Bank Details</h1>
		<div class="grid-12">
			<div class="col-2">
				{@render renderInput(
					"staffData.bankDetails.accountTitle",
					"Account Title",
					false,
					"text",
					formData.staffData.bankDetails.accountTitle ?? "",
					(val) => (formData.staffData.bankDetails.accountTitle = String(val)),
					50,
				)}
			</div>

			<div class="col-2">
				{@render renderInput(
					"staffData.bankDetails.bankAccountNo",
					"Bank Account No",
					false,
					"text",
					formData.staffData.bankDetails.bankAccountNo ?? "",
					(val) => (formData.staffData.bankDetails.bankAccountNo = String(val)),
					30,
				)}
			</div>
			<div class="col-2">
				{@render renderInput(
					"staffData.bankDetails.bankName",
					"Bank Name",
					false,
					"text",
					formData.staffData.bankDetails.bankName ?? "",
					(val) => (formData.staffData.bankDetails.bankName = String(val)),
					50,
				)}
			</div>
			<div class="col-2">
				{@render renderInput(
					"staffData.bankDetails.ifscCode",
					"IFSC Code",
					false,
					"text",
					formData.staffData.bankDetails.ifscCode ?? "",
					(val) => (formData.staffData.bankDetails.ifscCode = String(val)),
					20,
				)}
			</div>
			<div class="col-4">
				{@render renderInput(
					"staffData.bankDetails.bankBranch",
					"Bank Branch",
					false,
					"text",
					formData.staffData.bankDetails.bankBranch ?? "",
					(val) => (formData.staffData.bankDetails.bankBranch = String(val)),
					50,
				)}
			</div>
		</div>
	</div>

	<!-- Bank Details -->
	<div class="card-wrapper">
		<h1>Social Links</h1>
		<div class="grid-12">
			<div class="col-3">
				{@render renderInput(
					"staffData.socialLinks.facebook",
					"Facebook URL",
					false,
					"text",
					formData.staffData.socialLinks.facebook ?? "",
					(val) => (formData.staffData.socialLinks.facebook = String(val)),
					100,
				)}
			</div>

			<div class="col-3">
				{@render renderInput(
					"staffData.socialLinks.twitter",
					"Twitter URL",
					false,
					"text",
					formData.staffData.socialLinks.twitter ?? "",
					(val) => (formData.staffData.socialLinks.twitter = String(val)),
					100,
				)}
			</div>
			<div class="col-3">
				{@render renderInput(
					"staffData.socialLinks.linkedin",
					"LinkedIn URL",
					false,
					"text",
					formData.staffData.socialLinks.linkedin ?? "",
					(val) => (formData.staffData.socialLinks.linkedin = String(val)),
					100,
				)}
			</div>
			<div class="col-3">
				{@render renderInput(
					"staffData.socialLinks.instagram",
					"Instagram URL",
					false,
					"text",
					formData.staffData.socialLinks.instagram ?? "",
					(val) => (formData.staffData.socialLinks.instagram = String(val)),
					100,
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
	value: string | number | undefined,
	onInput: (val: string | number) => void,
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
		value={value !== undefined ? String(value) : ""}
		oninput={(e) => {
			const inputValue = (e.target as HTMLInputElement).value;
			onInput(type === "number" ? Number(inputValue) : inputValue);
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

{#snippet renderSelect(
	fieldName: string,
	title: string,
	isRequired = true,
	options: { name: string }[],
	value: string | undefined,
	onChange: (val: string) => void,
)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<select
		id={fieldName}
		name={fieldName}
		class={`w-full ${value === "" ? "placeholder-gray" : ""} ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? "input-error" : ""}`}
		{value}
		onchange={(e) => {
			onChange((e.target as HTMLSelectElement).value);
			validateForm(staffSchema, formData);
		}}
		onblur={() => handleBlur(fieldName)}
	>
		<option value="" selected>Select {title.toLowerCase()}</option>
		{#each options as opt}
			<option value={opt.name}>{opt.name}</option>
		{/each}
	</select>

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
