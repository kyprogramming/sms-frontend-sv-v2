<script lang="ts">
	import DatePicker from "$lib/components/common/DatePicker.svelte";
	import TagInput from "$lib/components/common/TagInput.svelte";
	import { BLOOD_GROUPS, CASTE_CATEGORIES, GENDERS, GUARDIAN_TYPE } from "$lib/constants";
	import { isLoading } from "$lib/stores/loading";
	import { isUpdate } from "$lib/stores/modalStore";
	import { get } from "svelte/store";
	import { formErrors, initializeStudentFormData, submitAttempted, touched, validateStudentForm, type StudentFormData } from "./studentValidation";
	import { slide } from "svelte/transition";
	import { createStudent } from "$lib/services/student";
	import FileUpload from "$lib/components/common/FileUpload.svelte";
	import Tabs from "$lib/components/common/Tabs.svelte";
	import { BrushCleaning, Save } from "@lucide/svelte";

	interface Props {
		classesWithSections: any;
	}

	let { classesWithSections }: Props = $props();

	let availableSections: { _id: string; name: string }[] = $state([]);
	let selectedDate: Date | null = $state(null);
	let selectedDateOfBirth: Date | null = $state(null);

	let formData: StudentFormData = $state(initializeStudentFormData());
	function clearForm() {
		submitAttempted.set(false);
		selectedDateOfBirth = null;
		formData = initializeStudentFormData();
		formErrors.set({});
		touched.set({});
	}

	function handleDateChange(date: Date | null) {
		selectedDate = date!;
	}

	function handleBirthDateChange(date: Date | null) {
		selectedDateOfBirth = date!;

		if (date) {
			const year = date.getFullYear();
			const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
			const day = String(date.getDate()).padStart(2, "0");
			formData.studentData.profile.dob = `${year}-${month}-${day}`;
		} else {
			formData.studentData.profile.dob = "";
		}

		console.log("formData.studentData.profile.dob:", formData.studentData.profile.dob);
		validateStudentForm(formData);
	}

	function handleOnClear(date: Date | null) {
		formData.studentData.profile.dob = "";
	}

	function guardianTypeChange(type: any) {
		formData.studentData.parentGuardianDetails.primaryGuardian = type;
		$formErrors["studentData.parentGuardianDetails.primaryGuardian"] = "";
		validateStudentForm(formData);
	}

	function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value || "";
		formData.studentData.classId = selected;
		formData.studentData.sectionId = "";
		const selectedClass = classesWithSections.find((cls: any) => cls._id === selected);
		availableSections = selectedClass?.sectionIds || [];
		handleBlur("studentData.classId");
	}

	function handleSectionChange(e: Event) {
		formData.studentData.sectionId = (e.target as HTMLSelectElement).value || "";
		$touched["studentData.sectionId"] = true;
		$formErrors["studentData.sectionId"] = "";
	}

	async function onSubmit(e: Event) {
		validateStudentForm(formData);
		console.log(formData);
		console.log(Object.keys(get(formErrors)).length);
		e.preventDefault();
		submitAttempted.set(true);
		if (Object.keys(get(formErrors)).length === 0) {
			console.log("Student registered successfully!");
			await createStudent(formData);
		}
	}

	function handleBlur(field: keyof any) {
		$touched = { ...$touched, [field]: true };
		validateStudentForm(formData);
	}

	let documents = [
		{ id: 1, title: "ID Proof", file: null },
		{ id: 2, title: "Address Proof", file: null },
		{ id: 3, title: "Birth Certificate", file: null },
	];

	function handleFileChange(event: Event, index: number) {
		const target = event.target as HTMLInputElement;
		if (target.files && target.files.length > 0) {
			// documents[index].file = target.files[0];
		}
	}
</script>

<form onsubmit={onSubmit}>
	<!-- Academic Detail -->
	<div class="card-wrapper">
		<h1>Academic Detail</h1>
		<div class="grid-12">
			<div class="col-2">
				<label for="academicYear">Academic Year</label>
				<input id="academicYear" type="text" bind:value={formData.studentData.academicYear} readonly disabled />
			</div>
			<div class="col-2">
				<label for="admissionNo">Admission No</label>
				<input id="admissionNo" type="text" bind:value={formData.studentData.admissionNo} />
			</div>
			<div class="col-2">
				<label for="admissionDate">Admission Date</label>
				<DatePicker bind:value={selectedDate} onChange={handleDateChange} defaultToday={true} />
			</div>
			<div class="col-2">
				<label for="classId">Class <span class="required">*</span></label>
				<select
					id="classId"
					class={`w-full ${$formErrors["class"] && ($touched["class"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.classId}
					onchange={handleClassChange}
					onblur={handleClassChange}
				>
					<option value="" disabled selected>Select Class</option>
					{#each classesWithSections as cls}
						<option value={cls._id}>{cls.name}</option>
					{/each}
				</select>
				{#if $formErrors["studentData.classId"] && ($touched["studentData.classId"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.classId"]}</p>
				{/if}
			</div>
			<div class="col-2">
				<label for="sectionId">Section <span class="required">*</span></label>
				<select
					id="sectionId"
					bind:value={formData.studentData.sectionId}
					disabled={!availableSections.length}
					class={`w-full ${$formErrors["studentData"] && ($touched["studentData.sectionId"] || $submitAttempted) ? "input-error" : ""}`}
					onchange={handleSectionChange}
					onblur={() => handleBlur("studentData.sectionId")}
				>
					<option value="" disabled selected>Select Section</option>
					{#each availableSections as section}
						<option value={section._id}>{section.name}</option>
					{/each}
				</select>
				{#if $formErrors["studentData.sectionId"] && ($touched["studentData.sectionId"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.sectionId"]}</p>
				{/if}
			</div>
			<div class="col-2">
				<label for="rollNo">Roll Number</label>
				<input id="rollNo" type="text" name="rollNo" class="w-full" bind:value={formData.studentData.rollNo} />
			</div>
		</div>
	</div>

	<!-- Student Profile -->
	<div class="card-wrapper">
		<h1>Student Profile</h1>
		<div class="grid-12">
			<div class="col-2">
				<label for="firstName">First Name <span class="required">*</span></label>
				<input
					id="firstName"
					type="text"
					name="firstName"
					class={`w-full ${$formErrors["studentData.profile.firstName"] && ($touched["studentData.profile.firstName"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.firstName}
					onblur={() => handleBlur("studentData.profile.firstName")}
					oninput={() => handleBlur("studentData.profile.firstName")}
				/>
				{#if $formErrors["studentData.profile.firstName"] && ($touched["studentData.profile.firstName"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.firstName"]}</p>
				{/if}
			</div>
			<div class="col-2">
				<label for="middleName">Middle Name</label>
				<input id="middleName" type="text" name="middleName" class="w-full" bind:value={formData.studentData.profile.middleName} />
			</div>

			<div class="col-2">
				<label for="lastName">Last Name <span class="required">*</span></label>
				<input
					id="lastName"
					type="text"
					name="lastName"
					class={`w-full ${$formErrors["studentData.profile.lastName"] && ($touched["studentData.profile.lastName"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.lastName}
					onblur={() => handleBlur("studentData.profile.lastName")}
					oninput={() => handleBlur("studentData.profile.lastName")}
				/>
				{#if $formErrors["studentData.profile.lastName"] && ($touched["studentData.profile.lastName"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.lastName"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="gender">Gender <span class="required">*</span></label>
				<select
					id="gender"
					class={`w-full ${$formErrors["studentData.profile.gender"] && ($touched["studentData.profile.gender"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.gender}
					onblur={() => handleBlur("gender")}
					onchange={() => handleBlur("gender")}
				>
					<option value="" disabled selected>Select Gender</option>
					{#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each}
				</select>
				{#if $formErrors["studentData.profile.gender"] && ($touched["studentData.profile.gender"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.gender"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="dob">Date of Birth <span class="required">*</span></label>
				<DatePicker
					bind:value={selectedDateOfBirth}
					onChange={handleBirthDateChange}
					onClear={handleOnClear}
					cls={`w-full ${$formErrors["studentData.profile.dob"] && ($touched["studentData.profile.dob"] || $submitAttempted) ? "input-error" : ""}`}
				/>
				{#if $formErrors["studentData.profile.dob"] && ($touched["studentData.profile.dob"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.dob"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="category">Category</label>
				<select id="category" bind:value={formData.studentData.profile.category}>
					<option value="" disabled selected>Select Category</option>
					{#each CASTE_CATEGORIES as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="col-2">
				<label for="religion">Religion</label>
				<input id="religion" type="text" name="religion" class="w-full" bind:value={formData.studentData.profile.religion} />
			</div>

			<div class="col-2">
				<label for="caste">Caste</label>
				<input id="caste" type="text" name="caste" class="w-full" bind:value={formData.studentData.profile.caste} />
			</div>

			<!-- User Data -->
			<div class="col-2">
				<label for="mobile">Mobile No</label>
				<input
					id="mobile"
					type="tel"
					name="mobile"
					class={`w-full ${$formErrors["userData.mobile"] && ($touched["userData.mobile"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.userData.mobile}
					onblur={() => handleBlur("userData.mobile")}
					oninput={() => handleBlur("userData.mobile")}
					maxlength="10"
				/>
				{#if $formErrors["userData.mobile"] && ($touched["userData.mobile"] || $submitAttempted)}
					<p class="error-text">{$formErrors["userData.mobile"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="email">Email</label>
				<input
					id="email"
					type="text"
					name="email"
					class={`w-full ${$formErrors["userData.email"] && ($touched["userData.email"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.userData.email}
					onblur={() => handleBlur("userData.email")}
					oninput={() => handleBlur("userData.email")}
				/>
				{#if $formErrors["userData.email"] && ($touched["userData.email"] || $submitAttempted)}
					<p class="error-text">{$formErrors["userData.email"]}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Student Address -->
	<div class="card-wrapper">
		<h1>Student Address</h1>
		<div class="grid-12">
			<div class="col-4">
				<label for="street">House No/Street</label>
				<input
					id="street"
					type="text"
					name="street"
					class={`w-full ${$formErrors["studentData.profile.address.street"] && ($touched["studentData.profile.address.street"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.address.street}
					onblur={() => handleBlur("studentData.profile.address.street")}
					oninput={() => handleBlur("studentData.profile.address.street")}
				/>
				{#if $formErrors["studentData.profile.address.street"] && ($touched["studentData.profile.address.street"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.address.street"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="city">City</label>
				<input
					id="city"
					type="text"
					name="city"
					class={`w-full ${$formErrors["studentData.profile.address.city"] && ($touched["studentData.profile.address.city"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.address.city}
					onblur={() => handleBlur("studentData.profile.address.city")}
					oninput={() => handleBlur("studentData.profile.address.city")}
				/>
				{#if $formErrors["studentData.profile.address.city"] && ($touched["studentData.profile.address.city"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.address.city"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="state">State</label>
				<input
					id="state"
					type="text"
					name="state"
					class={`w-full ${$formErrors["studentData.profile.address.state"] && ($touched["studentData.profile.address.state"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.address.state}
					onblur={() => handleBlur("studentData.profile.address.state")}
					oninput={() => handleBlur("studentData.profile.address.state")}
				/>
				{#if $formErrors["studentData.profile.address.state"] && ($touched["studentData.profile.address.state"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.address.state"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="postalCode">Postal Code</label>
				<input
					id="postalCode"
					type="text"
					name="postalCode"
					class={`w-full ${$formErrors["studentData.profile.address.postalCode"] && ($touched["studentData.profile.address.postalCode"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.address.postalCode}
					onblur={() => handleBlur("studentData.profile.address.postalCode")}
					oninput={() => handleBlur("studentData.profile.address.postalCode")}
				/>
				{#if $formErrors["studentData.profile.address.postalCode"] && ($touched["studentData.profile.address.postalCode"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.address.postalCode"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="country">Country</label>
				<input
					id="country"
					type="text"
					name="country"
					class={`w-full ${$formErrors["studentData.profile.address.country"] && ($touched["studentData.profile.address.country"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.profile.address.country}
					onblur={() => handleBlur("studentData.profile.address.country")}
					oninput={() => handleBlur("studentData.profile.address.country")}
				/>
				{#if $formErrors["studentData.profile.address.country"] && ($touched["studentData.profile.address.country"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentData.profile.address.country"]}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Medical Detail -->
	<div class="card-wrapper">
		<h1>Medical Detail</h1>
		<div class="grid-12">
			<div class="col-1">
				<label for="bloodGroup">Blood Group</label>
				<select id="bloodGroup" bind:value={formData.studentData.medicalDetails.bloodGroup}>
					<option value="" disabled selected>Select</option>
					{#each BLOOD_GROUPS as group}
						<option value={group.name}>{group.name}</option>
					{/each}
				</select>
			</div>
			<div class="col-1">
				<label for="height">Height (CM)</label>
				<input
					id="height"
					name="height"
					type="text"
					class={`w-full ${$formErrors[".medicalDetails.height"] && ($touched[".medicalDetails.height"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.medicalDetails.height}
					onblur={() => handleBlur("medicalDetails.height")}
					oninput={() => handleBlur("medicalDetails.height")}
				/>
				{#if $formErrors["medicalDetails.height"] && ($touched["medicalDetails.height"] || $submitAttempted)}
					<p class="error-text">{$formErrors["medicalDetails.height"]}</p>
				{/if}
			</div>
			<div class="col-1">
				<label for="weight">Weight (KG)</label>
				<input
					id="weight"
					name="weight"
					type="text"
					class={`w-full ${$formErrors[".medicalDetails.weight"] && ($touched[".medicalDetails.weight"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentData.medicalDetails.weight}
					onblur={() => handleBlur("medicalDetails.weight")}
					oninput={() => handleBlur("medicalDetails.weight")}
				/>
				{#if $formErrors["medicalDetails.weight"] && ($touched["medicalDetails.weight"] || $submitAttempted)}
					<p class="error-text">{$formErrors["medicalDetails.weight"]}</p>
				{/if}
			</div>

			<div class="col-1">
				<label for="eyeSight">Eye Sight</label>
				<input id="eyeSight" type="text" bind:value={formData.studentData.medicalDetails.eyeSight} class={`w-full`} onblur={() => handleBlur("eyeSight")} />
			</div>

			<div class="col-2">
				<label for="measurementDate">Measurement Date</label>
				<DatePicker id="measurementDate" bind:value={formData.studentData.medicalDetails.measurementDate} onClear={() => console.log("Date cleared")} />
			</div>
			<div class="col-6">
				<label for="medicalHistory">Medical History</label>
				<input id="medicalHistory" type="text" bind:value={formData.studentData.medicalDetails.medicalHistory} class="w-full" />
			</div>
			<div class="col-6">
				<label for="allergies">Allergies</label>
				<TagInput id="allergies" bind:tags={formData.studentData.medicalDetails.allergies} />
			</div>
			<div class="col-6">
				<label for="medicalConditions">Medical Conditions</label>
				<TagInput id="medicalConditions" bind:tags={formData.studentData.medicalDetails.medicalConditions} />
			</div>
		</div>
	</div>

	<!-- Parent Detail -->
	<div class="card-wrapper">
		<h1>Parent/Guardian Detail</h1>
		<div class="grid-12">
			<div class="col-2">
				<label for="fatherFirstName">Father First Name <span class="required">*</span></label>
				<input
					id="fatherFirstName"
					type="tel"
					name="fatherFirstName"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherFirstName"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherFirstName}
					onblur={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherFirstName")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherFirstName")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.fatherDetails.fatherFirstName"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherFirstName"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="fatherLastName">Father Last Name <span class="required">*</span></label>
				<input
					id="fatherLastName"
					type="tel"
					name="fatherLastName"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherLastName"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherLastName}
					onblur={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherLastName")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherLastName")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.fatherDetails.fatherLastName"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherLastName"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="fatherPhone">Father Phone <span class="required">*</span></label>
				<input
					id="fatherPhone"
					type="tel"
					name="fatherPhone"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherPhone"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherPhone}
					onblur={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherPhone")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherPhone")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.fatherDetails.fatherPhone"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherPhone"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="fatherEmail">Father Email </label>
				<input
					id="fatherEmail"
					name="fatherEmail"
					type="text"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherEmail"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherEmail}
					onblur={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherEmail")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherEmail")}
				/>
				{#if $formErrors["studentData.parentGuardianDetails.fatherDetails.fatherEmail"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherEmail"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="fatherOccupation">Father Occupation</label>
				<input id="fatherOccupation" type="text" bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherOccupation} />
			</div>
			<div class="col-2">
				<label for="fatherEducation">Father Education</label>
				<input id="fatherEducation" type="text" bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherEducation} />
			</div>

			<div class="col-2">
				<label for="motherFirstName">Mother First Name</label>
				<input
					id="motherFirstName"
					type="tel"
					name="motherFirstName"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.motherDetails.motherFirstName"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherFirstName}
					onblur={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherFirstName")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherFirstName")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.motherDetails.motherFirstName"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.motherDetails.motherFirstName"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherLastName">Mother Last Name</label>
				<input
					id="motherLastName"
					type="tel"
					name="motherLastName"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.motherDetails.motherLastName"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherLastName}
					onblur={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherLastName")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherLastName")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.motherDetails.motherLastName"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.motherDetails.motherLastName"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherPhone">Mother Phone</label>
				<input
					id="fatherPhone"
					type="tel"
					name="fatherPhone"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.motherDetails.motherPhone"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherPhone}
					onblur={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherPhone")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherPhone")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.motherDetails.motherPhone"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.motherDetails.motherPhone"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherEmail">Mother Email </label>
				<input
					id="motherEmail"
					name="motherEmail"
					type="text"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.motherDetails.motherEmail"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherEmail}
					onblur={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherEmail")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherEmail")}
				/>
				{#if $formErrors["studentData.parentGuardianDetails.motherDetails.motherEmail"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.motherDetails.motherEmail"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherOccupation">Mother Occupation</label>
				<input id="motherOccupation" type="text" bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherOccupation} />
			</div>
			<div class="col-2">
				<label for="motherEducation">Mother Education</label>
				<input id="motherEducation" type="text" bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherEducation} />
			</div>

			<div class="col-6">
				<label for="parentCurrentAddress">Parent Current Address</label>
				<textarea
					id="parentCurrentAddress"
					name="parentCurrentAddress"
					placeholder="Write current address.."
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.parentCurrentAddress"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.parentCurrentAddress}
					onblur={() => handleBlur("studentData.parentGuardianDetails.parentCurrentAddress")}
					oninput={() => handleBlur("studentData.parentGuardianDetails.parentCurrentAddress")}
					maxlength="250"
				>
				</textarea>
				{#if $formErrors["studentData.parentGuardianDetails.parentCurrentAddress"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.parentCurrentAddress"]}</p>
				{/if}
			</div>
			<div class="col-6">
				<label for="parentPermanentAddress">Parent Permanent Address</label>
				<textarea id="permanentAddress" bind:value={formData.studentData.parentGuardianDetails.parentPermanentAddress} placeholder="Write permanent address.."></textarea>
			</div>

			<div class="col-6">
				<label for="primaryGuardian">Primary Guardian <span class="required">*</span></label>
				<div class="radio-section" class:has-error={$formErrors["studentData.parentGuardianDetails.primaryGuardian"] && $submitAttempted}>
					{#each GUARDIAN_TYPE as type}
						<div class="radio-item">
							<label class="radio-label">
								<input
									name="type"
									type="radio"
									class="radio-input"
									value={type.name}
									checked={formData?.studentData?.parentGuardianDetails?.primaryGuardian === type.name}
									onchange={() => guardianTypeChange(type.name)}
								/>
								<span class="radio-custom"></span>
								<span class="radio-text">{type.name}</span>
							</label>
						</div>
					{/each}
				</div>
				{#if $formErrors["studentData.parentGuardianDetails.primaryGuardian"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.primaryGuardian"]}</p>
				{/if}
			</div>

			<div class="col-6"></div>

			{#if formData.studentData.parentGuardianDetails.primaryGuardian === "Other"}
				<div class="col-12" transition:slide>
					<div class="grid-12">
						<div class="col-2">
							<label for="guardianFirstName">Guardian First Name <span class="required">*</span></label>
							<input
								id="guardianFirstName"
								type="text"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianFirstName}
								onblur={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianFirstName")}
								oninput={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianFirstName")}
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianFirstName"] && $submitAttempted ? "input-error" : ""}`}
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianFirstName"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianFirstName"]}</p>
							{/if}
						</div>

						<div class="col-2">
							<label for="guardianLastName">Guardian Last Name <span class="required">*</span></label>
							<input
								id="guardianLastName"
								type="text"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianLastName}
								onblur={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianLastName")}
								oninput={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianLastName")}
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianLastName"] && $submitAttempted ? "input-error" : ""}`}
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianLastName"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianLastName"]}</p>
							{/if}
						</div>

						<div class="col-2">
							<label for="guardianPhone">Guardian Phone <span class="required">*</span></label>
							<input
								id="guardianPhone"
								type="tel"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianPhone}
								onblur={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianPhone")}
								oninput={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianPhone")}
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianPhone"] && $submitAttempted ? "input-error" : ""}`}
								maxlength="10"
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianPhone"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianPhone"]}</p>
							{/if}
						</div>

						<div class="col-2">
							<label for="guardianEmail">Guardian Email <span class="required">*</span></label>
							<input
								id="guardianEmail"
								type="email"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianEmail}
								onblur={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianEmail")}
								oninput={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianEmail")}
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianEmail"] && $submitAttempted ? "input-error" : ""}`}
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianEmail"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianEmail"]}</p>
							{/if}
						</div>

						<div class="col-2">
							<label for="guardianRelation">Guardian Relation <span class="required">*</span></label>
							<input
								id="guardianRelation"
								type="text"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianRelation}
								onblur={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianRelation")}
								oninput={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianRelation")}
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianRelation"] && $submitAttempted ? "input-error" : ""}`}
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianRelation"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianRelation"]}</p>
							{/if}
						</div>

						<div class="col-1">
							<label for="guardianOccupation">Occupation</label>
							<input id="guardianOccupation" type="text" bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianOccupation} />
						</div>

						<div class="col-1">
							<label for="guardianEducation">Guardian Education</label>
							<input id="guardianEducation" type="text" bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianEducation} />
						</div>

						<div class="col-6">
							<label for="guardianCurrentAddress">Guardian Current Address <span class="required">*</span></label>
							<textarea
								id="guardianCurrentAddress"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress}
								onblur={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress")}
								oninput={() => handleBlur("studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress")}
								placeholder="Write current address.."
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress"] && $submitAttempted ? "input-error" : ""}`}
							></textarea>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress"]}</p>
							{/if}
						</div>

						<div class="col-6">
							<label for="guardianPermanentAddress">Guardian Permanent Address</label>
							<textarea
								id="guardianPermanentAddress"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianPermanentAddress}
								placeholder="Write permanent address.."
							></textarea>
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
				<label for="street">Student Photo</label>
				<FileUpload id="studentPhoto" />
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
	<div class="card-wrapper">
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
									<FileUpload id="studentPhoto" />
								</td>
								<td>{doc.title}</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- Form Actions -->
	<div class="form-actions">
		<button type="button" class="btn ripple btn-secondary" onclick={clearForm} disabled={$isLoading}>
			<BrushCleaning size={16} />
			<span>Clear Form</span>
		</button>

		<button class="btn ripple" type="submit" disabled={$isLoading}>
			<Save size={16} />
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update Student{:else}Save Student{/if}
		</button>
	</div>
</form>

<Tabs />

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

	/* Form actions */
	.form-actions {
		display: flex;
		justify-content: flex-end;
		gap: 1rem;
	}

	/* .btn {
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary:hover {
		background-color: var(--clr-pri-dark);
	}

	.btn-primary:disabled {
		background-color: var(--clr-pri-light);
		cursor: not-allowed;
	}

	.btn-secondary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	} */

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

	.error-text {
		color: red;
		font-size: 0.875rem;
		margin-top: 0.25rem;
	}

	th {
		padding: 0.65rem;
	}

	td {
		border: 1px solid #ccc;
		text-align: left;
	}
</style>
