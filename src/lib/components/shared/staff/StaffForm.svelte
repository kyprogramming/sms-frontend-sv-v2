<script lang="ts">
	import DatePicker from '$lib/components/common/DatePicker.svelte';
	import { CONTRACT_TYPE, GENDERS, MARITAL_STATUS, SHIFT, STAFF_DEPARTMENTS, STAFF_DESIGNATIONS, STAFF_ROLES } from '$lib/utils/constants';
	import { isLoading } from '$lib/stores/loading';
	import { initializeStaffFormPayload} from './staffValidation';
	import { createStaff, updateStaff } from '$lib/services/staff';
	import { BrushCleaning, PlusCircle, Save } from '@lucide/svelte';
	import { showSnackbar } from '$lib/components/snackbar/store';
	import { goto } from '$app/navigation';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import { formErrors } from '$lib/stores/formStore';
	import { onMount } from 'svelte';
	import { env } from '$env/dynamic/public';
	import { isEqual } from '$lib/utils/utils';
	import { MESSAGES } from '$lib/utils/messages';
	import { formatLocalDate } from '$lib/utils/formatDate';
	import { validateForm } from '$lib/utils/validateHelper';
	import ImageUploader from '$lib/components/common/ImageUploader.svelte';
	import FileUpload from '$lib/components/common/FileUpload.svelte';
	import UploadDocument from '$lib/components/common/UploadDocument.svelte';
	import DatePicker2 from '$lib/components/common/DatePicker2.svelte';
	import { staffSchema, type StaffFormPayload } from '$lib/schemas/staff.schema';

	// Props
	let { staffData = null, action } = $props();
	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	const pageTitle = `${schoolName} - Staff Registration - ${action === 'update' ? ' Update' : 'New'}`;

	let formData: StaffFormPayload = $state(initializeStaffFormPayload());
	formErrors.set({});
	let touched: any = $state({});
	let formSubmitted: boolean = $state(false);
	let selectedFile: File | null = null;

	// console.log("staffData:", action, staffData);

	onMount(() => {
		formErrors.set({});
		if (action === 'update' && staffData) {
			formData = {
				staffData: { ...staffData.data },
				userData: { ...staffData.data.userId },
			};
		}
		touched = {};
	});

	function handleResetForm() {
		if (action === 'update' && staffData) {
			formData = {
				staffData: { ...staffData.data },
				userData: { ...staffData.data.userId },
			};
		} else {
			formData = initializeStaffFormPayload();
		}

		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	function handleBirthDateChange(date: Date | null) {
		if (date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
			const day = String(date.getDate()).padStart(2, '0');
			formData.staffData.profile.dob = `${year}-${month}-${day}`;
		} else {
			formData.staffData.profile.dob = '';
		}
		validateForm(staffSchema, formData);
	}

	function handleBlur(field: keyof any) {
		touched = { ...touched, [field]: true };
		validateForm(staffSchema, formData);
	}

	function handleDatePickerBlur(field: keyof any, isOpen: boolean) {
		// Only validate if the date picker isn't open
		setTimeout(() => {
			if (!isOpen) {
				touched = { ...touched, [field]: true };
				validateForm(staffSchema, formData);
			}
		}, 100);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;
		const isValid = validateForm(staffSchema, formData);
		// console.log("isValid", isValid);
		// console.log("formData", formData);
		if (!isValid) return;

		if (action === 'update' && staffData) {
			// Check if the form data is unchanged before updating
			const isUnChanged = isEqual(staffData.data, formData.staffData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateStaff(staffData.data._id, formData);
			showSnackbar({ message: 'Staff updated successfully', type: 'success' });
			await goto('/admin/staff/list');
		} else {
			await createStaff(formData);
			showSnackbar({ message: 'Staff created successfully', type: 'success' });
			await goto('/admin/staff/list');
		}
	}

	function handleImageSelect(file: File | null) {
		selectedFile = file;
		console.log('Selected file object:', file);
	}

	let uploadSections = $state([{ category: '', photoUrl: '' }]);

	const categories = ['Student ID Proof', 'Parent ID Proof', 'Teacher Certificate', 'Staff Resume', 'Marksheet', 'Transfer Certificate', 'Medical Record', 'Passport Size Photo', 'Others'];

	function removeDocument(index: number) {
		formData.staffData.documents = formData.staffData.documents?.filter((_, i) => i !== index);
	}

	function updateDocument(index: number, data: { category: string; photoUrl: string }) {
		formData.staffData.documents = formData.staffData.documents?.map((section, i) => (i === index ? data : section));
	}

	function addNewDocument(e: MouseEvent) {
		if (formData.staffData.documents?.length! < 12) {
			formData.staffData.documents = [...(formData.staffData.documents ?? []), { title: '', category: '', url: '' }];
			console.log('uploadSections', formData.staffData.documents);
		} else {
			showSnackbar({ message: 'Can not add more than 12 documents', type: 'info' });
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
				{@render renderInput('staffData.profile.staffId', 'Staff ID', true, 'text', formData.staffData.profile.staffId, (val) => (formData.staffData.profile.staffId = String(val)), 20)}
			</div>

			<!-- Role -->
			<div class="col-2">
				{@render renderSelect('staffData.profile.role', 'Role', true, STAFF_ROLES, formData.staffData.profile.role, (val) => (formData.staffData.profile.role = val))}
			</div>

			<!-- Designation -->
			<div class="col-2">
				{@render renderSelect('staffData.profile.designation', 'Designation', true, STAFF_DESIGNATIONS, formData.staffData.profile.designation, (val) => (formData.staffData.profile.designation = val))}
			</div>

			<!-- Department -->
			<div class="col-2">
				{@render renderSelect('staffData.profile.department', 'Department', true, STAFF_DEPARTMENTS, formData.staffData.profile.department, (val) => (formData.staffData.profile.department = val))}
			</div>

			<!-- Date of Joining -->
			<div class="col-2">
				<!-- <label for="dateOfJoining">Date of Joining</label>
				<DatePicker id={"dateOfJoining"} bind:value={formData.staffData.profile.dateOfJoining} onChange={() => {}} onBlur={() => handleBlur("staffData.profile.dateOfJoining")} defaultToday={true} />
			 -->
				<label for="dateOfJoining">Date of Joining</label>
				<DatePicker2 id="startDate" title="date of joining" bind:value={formData.staffData.profile.dateOfJoining} onBlur={(isOpen) => handleDatePickerBlur('staffData.profile.dateOfJoining', isOpen)} />
			</div>

			<!-- Qualification -->
			<div class="col-2">
				{@render renderInput('staffData.profile.qualification', 'Highest Qualification', false, 'text', formData.staffData.profile.qualification ?? '', (val) => (formData.staffData.profile.qualification = String(val)), 20)}
			</div>

			<!-- First Name -->
			<div class="col-2">
				{@render renderInput('staffData.profile.firstName', 'First Name', true, 'text', formData.staffData.profile.firstName ?? '', (val) => (formData.staffData.profile.firstName = String(val)), 20)}
			</div>

			<!-- Middle Name -->
			<div class="col-2">
				{@render renderInput('staffData.profile.middleName', 'Middle Name', false, 'text', formData.staffData.profile.middleName ?? '', (val) => (formData.staffData.profile.middleName = String(val)), 20)}
			</div>

			<!-- Last Name -->
			<div class="col-2">
				{@render renderInput('staffData.profile.lastName', 'Last Name', true, 'text', formData.staffData.profile.lastName ?? '', (val) => (formData.staffData.profile.lastName = String(val)), 20)}
			</div>

			<!-- Date of Birth -->
			<div class="col-2">
				<!-- <label for="dob">Date of Birth <span class="required">*</span></label>
				<DatePicker
					bind:value={formData.staffData.profile.dob}
					onChange={handleBirthDateChange}
					onClear={() => {
						formData.staffData.profile.dob = "";
					}}
					onBlur={() => handleBlur("staffData.profile.dob")}
					cls={`w-full ${$formErrors["staffData.profile.dob"] && (touched["staffData.profile.dob"] || formSubmitted) ? "input-error" : ""}`}
				/>
				{#if $formErrors["staffData.profile.dob"] && (touched["staffData.profile.dob"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.profile.dob"]}</p>
				{/if} -->

				<label for="staffData.profile.dob">Date of Birth <span class="required">*</span></label>
				<DatePicker2 id="staffData.profile.dob" title="date of birth" bind:value={formData.staffData.profile.dob} onBlur={(isOpen) => handleDatePickerBlur('staffData.profile.dob', isOpen)} cls={`w-full ${$formErrors['staffData.profile.dob'] && (touched['staffData.profile.dob'] || formSubmitted) ? 'input-error' : ''}`} />
				{#if $formErrors['staffData.profile.dob'] && (touched['staffData.profile.dob'] || formSubmitted)}
					<p class="error-text">{$formErrors['staffData.profile.dob']}</p>
				{/if}
			</div>

			<!-- Gender -->
			<div class="col-2">
				{@render renderSelect('staffData.profile.gender', 'Gender', true, GENDERS, formData.staffData.profile.gender, (val) => (formData.staffData.profile.gender = val))}
			</div>

			<!--  Marital Status -->
			<div class="col-2">
				{@render renderSelect('staffData.profile.maritalStatus', 'Marital Status', true, MARITAL_STATUS, formData.staffData.profile.maritalStatus, (val) => (formData.staffData.profile.maritalStatus = val))}
			</div>

			<!-- Email -->
			<div class="col-2">
				{@render renderInput('staffData.profile.email', 'Email', true, 'text', formData.staffData.profile.email ?? '', (val) => (formData.staffData.profile.email = String(val)), 50)}
			</div>

			<!-- Contact No -->
			<div class="col-2">
				{@render renderInput('staffData.profile.contactNo', 'Contact No', true, 'tel', formData.staffData.profile.contactNo ?? '', (val) => (formData.staffData.profile.contactNo = String(val)), 10)}
			</div>

			<!-- Emergency Contact -->
			<div class="col-2">
				{@render renderInput('staffData.profile.emergencyNo', 'Emergency Contact', false, 'tel', formData.staffData.profile.emergencyNo ?? '', (val) => (formData.staffData.profile.emergencyNo = String(val)), 10)}
			</div>

			<!-- Father Name -->
			<div class="col-2">
				{@render renderInput('staffData.profile.fatherName', 'Father Name', false, 'text', formData.staffData.profile.fatherName ?? '', (val) => (formData.staffData.profile.fatherName = String(val)), 20)}
			</div>

			<!-- Mother Name -->
			<div class="col-2">
				{@render renderInput('staffData.profile.motherName', 'Mother Name', false, 'text', formData.staffData.profile.motherName ?? '', (val) => (formData.staffData.profile.motherName = String(val)), 20)}
			</div>

			<!-- Spouse Name -->
			<div class="col-2">
				{@render renderInput('staffData.profile.spouseName', 'Spouse Name', false, 'text', formData.staffData.profile.spouseName ?? '', (val) => (formData.staffData.profile.spouseName = String(val)), 20)}
			</div>

			<!-- Pan -->
			<div class="col-2">
				{@render renderInput('staffData.profile.panNumber', 'PAN No', false, 'text', formData.staffData.profile.panNumber ?? '', (val) => (formData.staffData.profile.panNumber = String(val)), 20)}
			</div>

			<!-- Work Experience -->
			<div class="col-4">
				{@render renderInput('staffData.profile.workExperience', 'Work Experience', false, 'text', formData.staffData.profile.workExperience ?? '', (val) => (formData.staffData.profile.workExperience = String(val)), 20)}
			</div>

			<!-- Note -->
			<div class="col-6">
				{@render renderInput('staffData.profile.note', 'Note', false, 'text', formData.staffData.profile.note ?? '', (val) => (formData.staffData.profile.note = String(val)), 20)}
			</div>

			<!-- Current Address -->
			<div class="col-6">
				{@render renderTextarea('staffData.profile.address', 'Current Address', true, formData.staffData.profile.address ?? '', (val) => (formData.staffData.profile.address = val), 300)}
			</div>
			<!-- Permanent Address -->
			<div class="col-6">
				{@render renderTextarea('staffData.profile.permanentAddress', 'Permanent Address', false, formData.staffData.profile.permanentAddress ?? '', (val) => (formData.staffData.profile.permanentAddress = val), 300)}
			</div>
		</div>
	</div>

	<!--Payroll Details -->
	<div class="card-wrapper">
		<h1>Payroll Details</h1>
		<div class="grid-12">
			<div class="col-2">
				{@render renderInput('staffData.payroll.epfNo', 'EPF No', false, 'text', formData.staffData.payroll.epfNo ?? '', (val) => (formData.staffData.payroll.epfNo = String(val)), 20)}
			</div>

			<div class="col-2">
				{@render renderInput('staffData.payroll.basicSalary', 'Basic Salary', false, 'text', formData.staffData.payroll.basicSalary ?? 0, (val) => (formData.staffData.payroll.basicSalary = Number(val)), 10)}
			</div>

			<div class="col-2">
				{@render renderSelect('staffData.payroll.contractType', 'Contract Type', false, CONTRACT_TYPE, formData.staffData.payroll.contractType, (val) => (formData.staffData.payroll.contractType = val))}
			</div>

			<div class="col-2">
				{@render renderSelect('staffData.payroll.shift', 'Shift', false, SHIFT, formData.staffData.payroll.shift, (val) => (formData.staffData.payroll.shift = val))}
			</div>

			<div class="col-4">
				{@render renderInput('staffData.payroll.workLocation', 'Location', false, 'text', formData.staffData.payroll.workLocation ?? '', (val) => (formData.staffData.payroll.workLocation = String(val)), 20)}
			</div>
		</div>
	</div>

	<!-- Leave Allotments -->
	<div class="card-wrapper">
		<h1>Leave Allotments</h1>
		<div class="grid-12">
			<div class="col-2">
				{@render renderInput('staffData.leaveAllotments.medicalLeave', 'Medical Leave', false, 'text', formData.staffData.leaveAllotments.medicalLeave ?? 0, (val) => (formData.staffData.leaveAllotments.medicalLeave = Number(val)), 10)}
			</div>

			<div class="col-2">
				{@render renderInput('staffData.leaveAllotments.casualLeave', 'Casual Leave', false, 'text', formData.staffData.leaveAllotments.casualLeave ?? 0, (val) => (formData.staffData.leaveAllotments.casualLeave = Number(val)), 10)}
			</div>
			<div class="col-2">
				{@render renderInput('staffData.leaveAllotments.maternityLeave', 'Maternity Leave', false, 'text', formData.staffData.leaveAllotments.maternityLeave ?? 0, (val) => (formData.staffData.leaveAllotments.maternityLeave = Number(val)), 10)}
			</div>
			<div class="col-2">
				{@render renderInput('staffData.leaveAllotments.sickLeave', 'Sick Leave', false, 'text', formData.staffData.leaveAllotments.sickLeave ?? 0, (val) => (formData.staffData.leaveAllotments.sickLeave = Number(val)), 10)}
			</div>
		</div>
	</div>

	<!-- Bank Details -->
	<div class="card-wrapper">
		<h1>Bank Details</h1>
		<div class="grid-12">
			<div class="col-2">
				{@render renderInput('staffData.bankDetails.accountTitle', 'Account Title', false, 'text', formData.staffData.bankDetails.accountTitle ?? '', (val) => (formData.staffData.bankDetails.accountTitle = String(val)), 50)}
			</div>

			<div class="col-2">
				{@render renderInput('staffData.bankDetails.bankAccountNo', 'Bank Account No', false, 'text', formData.staffData.bankDetails.bankAccountNo ?? '', (val) => (formData.staffData.bankDetails.bankAccountNo = String(val)), 30)}
			</div>
			<div class="col-2">
				{@render renderInput('staffData.bankDetails.bankName', 'Bank Name', false, 'text', formData.staffData.bankDetails.bankName ?? '', (val) => (formData.staffData.bankDetails.bankName = String(val)), 50)}
			</div>
			<div class="col-2">
				{@render renderInput('staffData.bankDetails.ifscCode', 'IFSC Code', false, 'text', formData.staffData.bankDetails.ifscCode ?? '', (val) => (formData.staffData.bankDetails.ifscCode = String(val)), 20)}
			</div>
			<div class="col-4">
				{@render renderInput('staffData.bankDetails.bankBranch', 'Bank Branch', false, 'text', formData.staffData.bankDetails.bankBranch ?? '', (val) => (formData.staffData.bankDetails.bankBranch = String(val)), 50)}
			</div>
		</div>
	</div>

	<!-- Bank Details -->
	<div class="card-wrapper">
		<h1>Social Links</h1>
		<div class="grid-12">
			<div class="col-3">
				{@render renderInput('staffData.socialLinks.facebook', 'Facebook URL', false, 'text', formData.staffData.socialLinks.facebook ?? '', (val) => (formData.staffData.socialLinks.facebook = String(val)), 100)}
			</div>

			<div class="col-3">
				{@render renderInput('staffData.socialLinks.twitter', 'Twitter URL', false, 'text', formData.staffData.socialLinks.twitter ?? '', (val) => (formData.staffData.socialLinks.twitter = String(val)), 100)}
			</div>
			<div class="col-3">
				{@render renderInput('staffData.socialLinks.linkedin', 'LinkedIn URL', false, 'text', formData.staffData.socialLinks.linkedin ?? '', (val) => (formData.staffData.socialLinks.linkedin = String(val)), 100)}
			</div>
			<div class="col-3">
				{@render renderInput('staffData.socialLinks.instagram', 'Instagram URL', false, 'text', formData.staffData.socialLinks.instagram ?? '', (val) => (formData.staffData.socialLinks.instagram = String(val)), 100)}
			</div>
		</div>
	</div>

	<!-- Upload Photo -->
	<div class="card-wrapper">
		<h1>Upload Photo</h1>
		<div class="grid-12">
			<div class="col-2">
				<ImageUploader label="Staff Photo" title={''} bind:url={formData.staffData.profile.photoUrl} onSelect={handleImageSelect} />
			</div>
			<div class="col-10"></div>
		</div>
	</div>

	<!-- Upload Documents -->
	<div class="card-wrapper">
		<div class="header-bar">
			<h1>Upload Documents</h1>
			<button class="plus-button" type="button" onclick={addNewDocument}>
				<PlusCircle />
			</button>
		</div>
		<div class="grid-12">
			{#each formData.staffData.documents! as document, index (`${index}_${document.title}`)}
				<UploadDocument {index} {document} onRemove={removeDocument} onUpdate={updateDocument} />
			{/each}
		</div>
	</div>

	<!-- Form Actions -->
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
				Update Staff
			{:else}
				Save Staff
			{/if}
		</button>
	</div>
</form>

{#snippet renderInput(fieldName: string, title: string, isRequired = true, type = 'text', value: string | number | undefined, onInput: (val: string | number) => void, length = 100)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<input
		id={fieldName}
		{type}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? 'input-error' : ''}`}
		value={value !== undefined ? String(value) : ''}
		oninput={(e) => {
			const inputValue = (e.target as HTMLInputElement).value;
			onInput(type === 'number' ? Number(inputValue) : inputValue);
			validateForm(staffSchema, formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}" />

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

{#snippet renderTextarea(fieldName: string, title: string, isRequired = true, value: string, onInput: (val: string) => void, length = 100)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<textarea
		id={fieldName}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? 'input-error' : ''}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateForm(staffSchema, formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"></textarea>

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

{#snippet renderSelect(fieldName: string, title: string, isRequired = true, options: { name: string }[], value: string | undefined, onChange: (val: string) => void)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<select
		id={fieldName}
		name={fieldName}
		class={`w-full ${value === '' ? 'placeholder-gray' : ''} ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? 'input-error' : ''}`}
		{value}
		onchange={(e) => {
			onChange((e.target as HTMLSelectElement).value);
			validateForm(staffSchema, formData);
		}}
		onblur={() => handleBlur(fieldName)}>
		<option value="" selected>Select {title.toLowerCase()}</option>
		{#each options as opt}
			<option value={opt.name}>{opt.name}</option>
		{/each}
	</select>

	{#if $formErrors[fieldName] && (touched[fieldName] || formSubmitted)}
		<p class="error-text">{$formErrors[fieldName]}</p>
	{/if}
{/snippet}

<!-- prettier-ignore -->
<style>

	/* Base styles */
	label {display: block; margin-bottom: 0.5rem; font-weight: 500; color: var(--text-primary);}

	/* Section styles */
	.section {border: 1px solid var(--border); border-radius: 0.5rem; margin-bottom: 1.5rem; /* overflow: hidden; */}

	.section-header {cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 1rem; background-color: var(--clr-bg-2); font-weight: 600; transition: background-color 0.2s;}

	.section-header:hover {background-color: var(--clr-bg-3);}

	.arrow-icon {transition: transform 0.2s ease;}

	.section-body {padding: 1rem; transition: all 0.2s ease;}

	.section-body.collapsed {display: none;}

	/* Grid layout */
	.grid-5 {display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem;}

	/* Responsive styles */
	@media (max-width: 1024px) {.grid-5 { grid-template-columns: repeat(3, 1fr);}}

	@media (max-width: 768px) {.grid-5 { grid-template-columns: repeat(2, 1fr);}}

	@media (max-width: 480px) {
        .grid-5 { grid-template-columns: 1fr;}
		.form-actions {flex-direction: column;}
		.btn {width: 100%;}
	}

	.card-wrapper {padding: 15px; background-color: #ffffff; border-radius: 10px; box-shadow: var(--shadow-sm); margin-bottom: 10px;}
	.card-wrapper h1 {color: #000000; /* font-size: 15 px; */ /* text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2); */}

	.radio-group {display: flex; flex-direction: row; gap: 1rem;}
	input[type='radio'] {cursor: pointer;}
	.radio-section {display: flex; flex-wrap: wrap; gap: 1rem;}
	.radio-item {display: flex; align-items: center;}
	.radio-label {display: flex; align-items: center; cursor: pointer;}
	.radio-input {display: none;}
	.radio-custom {width: 1rem; height: 1rem; border: 2px solid #ccc; border-radius: 50%; margin-right: 0.5rem; position: relative;}
	.placeholder-gray {color: gray;}

	.plus-button,
	.remove-button {color: green; background-color: rgb(238, 237, 237); border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: start; align-self: center; padding: 9px; margin: 0px;}
	.remove-button {color: red;}
	.plus-button:hover,
	.remove-button:hover {background-color: rgb(204, 202, 202);}
	.header-bar {display: flex; justify-content: space-between; align-items: center; gap: 1rem;}
	.header-bar h1 {margin: 0;}

</style>
