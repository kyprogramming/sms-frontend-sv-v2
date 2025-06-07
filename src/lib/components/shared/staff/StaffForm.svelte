<script lang="ts">
	import DatePicker from "$lib/components/common/DatePicker.svelte";
	import TagInput from "$lib/components/common/TagInput.svelte";
	import { BLOOD_GROUPS, CASTE_CATEGORIES, GENDERS, GUARDIAN_TYPE } from "$lib/utils/constants";
	import { isLoading } from "$lib/stores/loading";

	import { initializeStaffFormData, validateStaffForm, type DeepBoolean, type StaffFormData } from "./staffValidation";
	import { slide } from "svelte/transition";
	import { createStaff, updateStaff } from "$lib/services/staff";
	import FileUpload from "$lib/components/common/FileUpload.svelte";
	import { BrushCleaning, Save } from "@lucide/svelte";
	import { page } from "$app/state";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { goto } from "$app/navigation";
	import LoaderIcon from "$lib/components/common/LoaderIcon.svelte";
	import { formErrors } from "$lib/stores/formStore";
	import { onMount } from "svelte";
	import { env } from "$env/dynamic/public";
	import { isEqual } from "$lib/utils/utils";
	import { MESSAGES } from "$lib/utils/messages";
	import { formatLocalDate } from "$lib/utils/formatDate";

	// Props
	let { staffData = null, action } = $props();
	const schoolName = env.PUBLIC_SCHOOL_NAME || "Default School";
	const pageTitle = `${schoolName} - Staff Registration - ${action === "update" ? " Update" : "New"}`;

	let classData = page.data?.classData || [];
	let classSections: { _id: string; name: string }[] = $state([]);

	let formData: StaffFormData = $state(initializeStaffFormData());
	formErrors.set({});
	let touched: any = $state({});
	let formSubmitted: boolean = $state(false);

	// console.log("staffData:", action, staffData);

	onMount(() => {
		formErrors.set({});
		// Initialize form data based on action
		if (action === "update" && staffData) {
			formData = { staffData: { ...staffData.data }, userData: { ...staffData.data.userId } };
			classSections = staffData.data.classId ? classData.find((cls: any) => cls._id === staffData.data.classId)?.sectionIds || [] : [];
		}
		touched = {};
	});

	function handleResetForm() {
		if (action === "update" && staffData) {
			formData = { staffData: { ...staffData.data }, userData: { ...staffData.data.userId } };
			classSections = staffData.data.classId ? classData.find((cls: any) => cls._id === staffData.data.classId)?.sectionIds || [] : [];
		} else {
			formData = initializeStaffFormData();
			classSections = [];
		}

		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	function handleAdmissionDateChange(date: Date | null) {
		if (!date) {
			formData.staffData.admissionDate = "";
			return;
		}
		formData.staffData.admissionDate = formatLocalDate(date);
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
		validateStaffForm(formData);
	}

	function handleOnClear(date: Date | null) {
		formData.staffData.profile.dob = "";
	}

	function handleGuardianTypeChange(type: any) {
		formData.staffData.parentGuardianDetails.primaryGuardian = type;
		$formErrors["staffData.parentGuardianDetails.primaryGuardian"] = "";
		if (type === "Other" && action === "update") {
			formData.staffData.parentGuardianDetails = staffData.data.parentGuardianDetails;
		}
		validateStaffForm(formData);
	}

	function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value || "";
		formData.staffData.classId = selected;
		formData.staffData.sectionId = "";
		const selectedClass = classData.find((cls: any) => cls._id === selected);
		classSections = selectedClass?.sectionIds || [];
		handleBlur("staffData.classId");
	}

	function handleSectionChange(e: Event) {
		formData.staffData.sectionId = (e.target as HTMLSelectElement).value || "";
	}

	function handleBlur(field: keyof any) {
		touched = { ...touched, [field]: true };
		validateStaffForm(formData);
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

		const isValid = validateStaffForm(formData);
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

	let documents = [
		{ id: 1, title: "ID Proof", file: null },
		{ id: 2, title: "Address Proof", file: null },
		{ id: 3, title: "Birth Certificate", file: null },
	];

	// function handleFileChange(event: Event, index: number) {
	// 	const target = event.target as HTMLInputElement;
	// 	if (target.files && target.filsScriptPath > 0) {
	// 		// documents[index].file = target.files[0];
	// 	}
	// }
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<form onsubmit={onSubmit}>
	<!-- Staff Academic Detail -->
	<div class="card-wrapper">
		<h1>Academic Detail</h1>
		<div class="grid-12">
			<!-- Academic Year -->
			<div class="col-2">
				<label for="academicYear">Academic Year</label>
				<input id="academicYear" type="text" bind:value={formData.staffData.academicYear} readonly disabled />
			</div>
			<!-- Admission No -->
			<div class="col-2">
				<label for="admissionNo">Admission No</label>
				<input id="admissionNo" type="text" bind:value={formData.staffData.admissionNo} />
			</div>
			<!-- Admission Date -->
			<div class="col-2">
				<label for="admissionDate">Admission Date</label>
				<DatePicker bind:value={formData.staffData.admissionDate} onChange={handleAdmissionDateChange} defaultToday={true} />
			</div>
			<!-- Staff Class -->
			<div class="col-2">
				<label for="classId">Class <span class="required">*</span></label>
				<select id="classId" class={`w-full ${formData.staffData.classId === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.classId"] && (touched["staffData.classId"] || formSubmitted) ? "input-error" : ""}`} bind:value={formData.staffData.classId} onchange={handleClassChange} onblur={handleClassChange}>
					<option value="" selected>Select class</option>
					{#each classData as cls}
						<option value={cls._id}>{cls.name}</option>
					{/each}
				</select>
				{#if $formErrors["staffData.classId"] && (touched["staffData.classId"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.classId"]}</p>
				{/if}
			</div>
			<!-- Staff Section -->
			<div class="col-2">
				<label for="sectionId">Section <span class="required">*</span></label>
				<select id="sectionId" bind:value={formData.staffData.sectionId} disabled={!classSections.length} class={`w-full ${formData.staffData.sectionId === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.sectionId"] && (touched["staffData.sectionId"] || formSubmitted) ? "input-error" : ""}`} onchange={handleSectionChange} onblur={() => handleBlur("staffData.sectionId")}>
					<option value="" selected>Select section</option>
					{#each classSections as section}
						<option value={section._id}>{section.name}</option>
					{/each}
				</select>
				{#if $formErrors["staffData.sectionId"] && (touched["staffData.sectionId"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.sectionId"]}</p>
				{/if}
			</div>
			<!-- Staff Roll No -->
			<div class="col-2">
				{@render renderInput("staffData.rollNo", "Roll Number", false, "text", formData.staffData.rollNo ?? "", (val) => (formData.staffData.rollNo = val), 20)}
			</div>
		</div>
	</div>

	<!-- Staff Profile Details-->
	<div class="card-wrapper">
		<h1>Staff Profile</h1>
		<div class="grid-12">
			<!-- Staff First Name-->
			<div class="col-2">
				{@render renderInput("staffData.profile.firstName", "First Name", true, "text", formData.staffData.profile.firstName, (val) => (formData.staffData.profile.firstName = val), 20)}
			</div>
			<!-- Staff Middle Name-->
			<div class="col-2">
				{@render renderInput("staffData.profile.middleName", "Middle Name", false, "text", formData.staffData.profile.middleName ?? "", (val) => (formData.staffData.profile.middleName = val), 20)}
			</div>
			<!-- Staff Last Name-->
			<div class="col-2">
				{@render renderInput("staffData.profile.lastName", "Last Name", true, "text", formData.staffData.profile.lastName ?? "", (val) => (formData.staffData.profile.lastName = val), 20)}
			</div>
			<!-- Gender -->
			<div class="col-2">
				<label for="gender">Gender <span class="required">*</span></label>
				<select class={`w-full ${formData.staffData.profile.gender === "" ? "placeholder-gray" : ""} ${$formErrors["staffData.profile.gender"] && (touched["staffData.profile.gender"] || formSubmitted) ? "input-error" : ""}`} bind:value={formData.staffData.profile.gender} onblur={() => handleBlur("staffData.profile.gender")} onchange={() => handleBlur("staffData.profile.gender")}>
					<option value="" selected>Select gender</option>
					{#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each}
				</select>
				{#if $formErrors["staffData.profile.gender"] && (touched["staffData.profile.gender"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.profile.gender"]}</p>
				{/if}
			</div>
			<!-- Date of Birth -->
			<div class="col-2">
				<label for="dob">Date of Birth <span class="required">*</span></label>
				<DatePicker bind:value={formData.staffData.profile.dob} onChange={handleBirthDateChange} onClear={handleOnClear} cls={`w-full ${$formErrors["staffData.profile.dob"] && (touched["staffData.profile.dob"] || formSubmitted) ? "input-error" : ""}`} />
				{#if $formErrors["staffData.profile.dob"] && (touched["staffData.profile.dob"] || formSubmitted)}
					<p class="error-text">{$formErrors["staffData.profile.dob"]}</p>
				{/if}
			</div>
			<!-- Category -->
			<div class="col-2">
				<label for="category">Category</label>
				<select id="category" class={`w-full ${formData.staffData.profile.category === "" ? "placeholder-gray" : ""}`} bind:value={formData.staffData.profile.category}>
					<option value="" selected>Select category</option>
					{#each CASTE_CATEGORIES as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</div>
			<!-- Religion -->
			<div class="col-2">
				{@render renderInput("staffData.profile.religion", "Religion", false, "text", formData.staffData.profile.religion ?? "", (val) => (formData.staffData.profile.religion = val), 20)}
			</div>
			<!-- Caste -->
			<div class="col-2">
				{@render renderInput("staffData.profile.caste", "Caste", false, "text", formData.staffData.profile.caste ?? "", (val) => (formData.staffData.profile.caste = val), 20)}
			</div>
			<!-- Mobile No -->
			<div class="col-2">
				{@render renderInput("userData.mobile", "Mobile No", false, "tel", formData.userData.mobile ?? "", (val) => (formData.userData.mobile = val), 10)}
			</div>
			<!-- Email -->
			<div class="col-2">
				{@render renderInput("userData.email", "Email", false, "text", formData.userData.email ?? "", (val) => (formData.userData.email = val), 50)}
			</div>
		</div>
	</div>

	<!-- Staff Address Details -->
	<div class="card-wrapper">
		<h1>Staff Address</h1>
		<div class="grid-12">
			<!-- House No/Street -->
			<div class="col-4">
				{@render renderInput("staffData.profile.address.street", "House No/Street", true, "text", formData.staffData.profile.address.street ?? "", (val) => (formData.staffData.profile.address.street = val), 100)}
			</div>
			<!-- City -->
			<div class="col-2">
				{@render renderInput("staffData.profile.address.city", "City", true, "text", formData.staffData.profile.address.city ?? "", (val) => (formData.staffData.profile.address.city = val), 20)}
			</div>
			<!-- State -->
			<div class="col-2">
				{@render renderInput("staffData.profile.address.state", "State", true, "text", formData.staffData.profile.address.state ?? "", (val) => (formData.staffData.profile.address.state = val), 20)}
			</div>
			<!-- Postal Code -->
			<div class="col-2">
				{@render renderInput("staffData.profile.address.postalCode", "Postal Code", true, "text", formData.staffData.profile.address.postalCode ?? "", (val) => (formData.staffData.profile.address.postalCode = val), 10)}
			</div>
			<!-- Country -->
			<div class="col-2">
				{@render renderInput("staffData.profile.address.country", "Country", true, "text", formData.staffData.profile.address.country ?? "", (val) => (formData.staffData.profile.address.country = val), 20)}
			</div>
		</div>
	</div>

	<!-- Staff Medical Detail -->
	<div class="card-wrapper">
		<h1>Medical Detail</h1>
		<div class="grid-12">
			<!-- Blood Group -->
			<div class="col-1">
				<label for="bloodGroup">Blood Group</label>
				<select id="bloodGroup" class={`w-full ${formData.staffData.medicalDetails.bloodGroup === "" ? "placeholder-gray" : ""}`} bind:value={formData.staffData.medicalDetails.bloodGroup}>
					<option value="" selected>Select B/G</option>
					{#each BLOOD_GROUPS as group}
						<option value={group.name}>{group.name}</option>
					{/each}
				</select>
			</div>
			<!-- Height (CM) -->
			<div class="col-1">
				{@render renderInput("staffData.medicalDetails.height", "Height (CM)", false, "text", formData.staffData.medicalDetails.height ?? "", (val) => (formData.staffData.medicalDetails.height = val), 3)}
			</div>
			<!-- Weight (KG) -->
			<div class="col-1">
				{@render renderInput("staffData.medicalDetails.weight", "Weight (KG)", false, "text", formData.staffData.medicalDetails.weight ?? "", (val) => (formData.staffData.medicalDetails.weight = val), 3)}
			</div>
			<!-- Eye Sight -->
			<div class="col-1">
				{@render renderInput("staffData.medicalDetails.eyeSight", "Eye Sight", false, "text", formData.staffData.medicalDetails.eyeSight ?? "", (val) => (formData.staffData.medicalDetails.eyeSight = val), 10)}
			</div>
			<!-- Measurement Date -->
			<div class="col-2">
				<label for="measurementDate">Measurement Date</label>
				<DatePicker id="measurementDate" bind:value={formData.staffData.medicalDetails.measurementDate} onClear={() => console.log("Date cleared")} />
			</div>
			<!-- Medical History -->
			<div class="col-6">
				{@render renderInput("staffData.medicalDetails.medicalHistory", "Medical History", false, "text", formData.staffData.medicalDetails.medicalHistory ?? "", (val) => (formData.staffData.medicalDetails.medicalHistory = val), 50)}
			</div>
			<!-- Allergies -->
			<div class="col-6">
				<label for="allergies">Allergies</label>
				<TagInput id="allergies" fieldName={"allergies"} bind:tags={formData.staffData.medicalDetails.allergies} />
			</div>
			<!-- Medical Conditions -->
			<div class="col-6">
				<label for="medicalConditions">Medical Conditions</label>
				<TagInput id="medicalConditions" fieldName={"medical conditions"} bind:tags={formData.staffData.medicalDetails.medicalConditions} />
			</div>
		</div>
	</div>

	<!-- Staff Parent/Guardian Detail -->
	<div class="card-wrapper">
		<h1>Parent/Guardian Detail</h1>
		<div class="grid-12">
			<!-- Father First Name -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.fatherDetails.fatherFirstName", "Father First Name", true, "text", formData.staffData.parentGuardianDetails.fatherDetails.fatherFirstName ?? "", (val) => (formData.staffData.parentGuardianDetails.fatherDetails.fatherFirstName = val), 20)}
			</div>
			<!-- Father Last Name -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.fatherDetails.fatherLastName", "Father Last Name", true, "text", formData.staffData.parentGuardianDetails.fatherDetails.fatherLastName ?? "", (val) => (formData.staffData.parentGuardianDetails.fatherDetails.fatherLastName = val), 20)}
			</div>
			<!-- Father Phone -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.fatherDetails.fatherPhone", "Father Phone", true, "text", formData.staffData.parentGuardianDetails.fatherDetails.fatherPhone ?? "", (val) => (formData.staffData.parentGuardianDetails.fatherDetails.fatherPhone = val), 10)}
			</div>
			<!-- Father Email -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.fatherDetails.fatherEmail", "Father Email", false, "text", formData.staffData.parentGuardianDetails.fatherDetails.fatherEmail ?? "", (val) => (formData.staffData.parentGuardianDetails.fatherDetails.fatherEmail = val), 30)}
			</div>
			<!-- Father Occupation -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.fatherDetails.fatherOccupation", "Father Occupation", false, "text", formData.staffData.parentGuardianDetails.fatherDetails.fatherOccupation ?? "", (val) => (formData.staffData.parentGuardianDetails.fatherDetails.fatherOccupation = val), 30)}
			</div>
			<!-- Father Education -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.fatherDetails.fatherEducation", "Father Education", false, "text", formData.staffData.parentGuardianDetails.fatherDetails.fatherEducation ?? "", (val) => (formData.staffData.parentGuardianDetails.fatherDetails.fatherEducation = val), 20)}
			</div>
			<!-- Mother First Name -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.motherDetails.motherFirstName", "Mother First Name", true, "text", formData.staffData.parentGuardianDetails.motherDetails.motherFirstName ?? "", (val) => (formData.staffData.parentGuardianDetails.motherDetails.motherFirstName = val), 20)}
			</div>
			<!-- Mother Last Name -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.motherDetails.motherLastName", "Mother Last Name", true, "text", formData.staffData.parentGuardianDetails.motherDetails.motherLastName ?? "", (val) => (formData.staffData.parentGuardianDetails.motherDetails.motherLastName = val), 20)}
			</div>
			<!-- Mother Phone -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.motherDetails.motherPhone", "Mother Phone", true, "tel", formData.staffData.parentGuardianDetails.motherDetails.motherPhone ?? "", (val) => (formData.staffData.parentGuardianDetails.motherDetails.motherPhone = val), 10)}
			</div>
			<!-- Mother Email -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.motherDetails.motherEmail", "Mother Email", false, "email", formData.staffData.parentGuardianDetails.motherDetails.motherEmail ?? "", (val) => (formData.staffData.parentGuardianDetails.motherDetails.motherEmail = val), 30)}
			</div>
			<!-- Mother Occupation -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.motherDetails.motherEmail", "Mother Occupation", false, "text", formData.staffData.parentGuardianDetails.motherDetails.motherOccupation ?? "", (val) => (formData.staffData.parentGuardianDetails.motherDetails.motherOccupation = val), 20)}
			</div>
			<!-- Mother Education -->
			<div class="col-2">
				{@render renderInput("staffData.parentGuardianDetails.motherDetails.motherEducation", "Mother Education", false, "text", formData.staffData.parentGuardianDetails.motherDetails.motherEducation ?? "", (val) => (formData.staffData.parentGuardianDetails.motherDetails.motherEducation = val), 20)}
			</div>
			<!-- Parent Current Address -->
			<div class="col-6">
				{@render renderTextarea("staffData.parentGuardianDetails.parentCurrentAddress", "Parent Current Address", true, formData.staffData.parentGuardianDetails.parentCurrentAddress ?? "", (val) => (formData.staffData.parentGuardianDetails.parentCurrentAddress = val), 300)}
			</div>
			<div class="col-6">
				{@render renderTextarea("staffData.parentGuardianDetails.parentPermanentAddress", "Parent Permanent Address", false, formData.staffData.parentGuardianDetails.parentPermanentAddress ?? "", (val) => (formData.staffData.parentGuardianDetails.parentPermanentAddress = val), 300)}
			</div>

			<!-- Primary Guardian Selection -->
			<div class="col-6">
				<label for="primaryGuardian">Primary Guardian <span class="required">*</span></label>
				<div class="radio-section" class:has-error={$formErrors["staffData.parentGuardianDetails.primaryGuardian"] && formSubmitted}>
					{#each GUARDIAN_TYPE as type}
						<div class="radio-item">
							<label class="radio-label">
								<input name="type" type="radio" class="radio-input" value={type.name} checked={formData?.staffData?.parentGuardianDetails?.primaryGuardian === type.name} onchange={() => handleGuardianTypeChange(type.name)} />
								<span class="radio-custom"></span>
								<span class="radio-text">{type.name}</span>
							</label>
						</div>
					{/each}
				</div>
				{#if $formErrors["staffData.parentGuardianDetails.primaryGuardian"] && formSubmitted}
					<p class="error-text">{$formErrors["staffData.parentGuardianDetails.primaryGuardian"]}</p>
				{/if}
			</div>
			<div class="col-6"></div>

			{#if formData.staffData.parentGuardianDetails.primaryGuardian === "Other"}
				<div class="col-12" transition:slide>
					<div class="grid-12">
						<!-- Guardian First Name -->
						<div class="col-2">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianFirstName", "Guardian First Name", true, "text", formData.staffData.parentGuardianDetails.guardianDetails.guardianFirstName ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianFirstName = val), 20)}
						</div>
						<!-- Guardian Last Name -->
						<div class="col-2">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianLastName", "Guardian Last Name", true, "text", formData.staffData.parentGuardianDetails.guardianDetails.guardianLastName ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianLastName = val), 20)}
						</div>
						<!-- Guardian Phone -->
						<div class="col-2">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianPhone", "Guardian Phone", true, "tel", formData.staffData.parentGuardianDetails.guardianDetails.guardianPhone ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianPhone = val), 10)}
						</div>
						<!-- Guardian Email -->
						<div class="col-2">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianEmail", "Guardian Email", true, "email", formData.staffData.parentGuardianDetails.guardianDetails.guardianEmail ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianEmail = val), 30)}
						</div>
						<!-- Guardian Relation -->
						<div class="col-2">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianRelation", "Guardian Relation", true, "text", formData.staffData.parentGuardianDetails.guardianDetails.guardianRelation ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianRelation = val), 20)}
						</div>
						<!-- Guardian Occupation -->
						<div class="col-1">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianOccupation", "Occupation", false, "text", formData.staffData.parentGuardianDetails.guardianDetails.guardianOccupation ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianOccupation = val), 20)}
						</div>
						<!-- Guardian Education -->
						<div class="col-1">
							{@render renderInput("staffData.parentGuardianDetails.guardianDetails.guardianEducation", "Education", false, "text", formData.staffData.parentGuardianDetails.guardianDetails.guardianEducation ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianEducation = val), 20)}
						</div>
						<!-- Guardian Current Address -->
						<div class="col-6">
							{@render renderTextarea("staffData.parentGuardianDetails.guardianDetails.guardianCurrentAddress", "Guardian Current Address", true, formData.staffData.parentGuardianDetails.guardianDetails.guardianCurrentAddress ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianCurrentAddress = val), 300)}
						</div>
						<div class="col-6">
							{@render renderTextarea("staffData.parentGuardianDetails.guardianDetails.guardianPermanentAddress", "Guardian Permanent Address", false, formData.staffData.parentGuardianDetails.guardianDetails.guardianPermanentAddress ?? "", (val) => (formData.staffData.parentGuardianDetails.guardianDetails.guardianPermanentAddress = val), 300)}
						</div>
					</div>
				</div>
			{/if}
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
				<label for="city">Father Photo</label>
				<FileUpload id="fatherPhoto" />
			</div>

			<div class="col-3">
				<label for="city">Mother Photo</label>
				<FileUpload id="motherPhoto" />
			</div>

			<div class="col-3">
				<label for="city">Guardian Photo</label>
				<FileUpload id="guardianPhoto" />
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
				Update Staff
			{:else}
				Save Staff
			{/if}
		</button>
	</div>
</form>

{#snippet renderInput(fieldName: string, title: string, isRequired = true, type = "text", value: string, onInput: (val: string) => void, length = 100)}
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
			validateStaffForm(formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"
	/>

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
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? "input-error" : ""}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateStaffForm(formData);
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
