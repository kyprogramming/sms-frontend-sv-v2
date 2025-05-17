<script lang="ts">
	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { isUpdate } from "$lib/stores/modalStore";
	import { generateAdmissionNo, getCurrentAcademicSession } from "$lib/utils/utils";
	import DatePicker from "$lib/components/DatePicker.svelte";
	import { BLOOD_GROUPS, CASTE_CATEGORIES, GENDERS } from "$lib/constants";
	import TagInput from "$lib/components/TagInput.svelte";

	export let classesWithSections: any;
	$: sectionsForSelectedClass = classesWithSections.find((cls: any) => cls.name === formData.class)?.sections ?? [];
	let availableSections: { _id: string; name: string }[] = [];

	let selectedDate: Date | null = null;
	let selectedDateOfBirth: Date | null = null;
	let uploadedPath = "";

	function handleDateChange(date: Date | null) {
		// console.log("Date selected:", date);
		selectedDate = date!;
		formData.academicSession = getCurrentAcademicSession(selectedDate);
	}

	function handleBirthDateChange(date: Date | null) {
		selectedDateOfBirth = date!;
		formData.studentProfile.dob = String(selectedDateOfBirth);
		validate();
	}
	function handleOnClear(date: Date | null) {
		selectedDateOfBirth = null!;
		formData.studentProfile.dob = String(selectedDateOfBirth);
	}

	// Validation schema
	// Enhanced Validation schema
	const studentSchema = z.object({
		admissionNo: z.string().min(1, "Admission number is required"),
		admissionDate: z.string().min(1, "Admission date is required"),
		academicSession: z.string().min(1, "Academic session is required"),
		rollNo: z.string().optional(),
		class: z.string().min(1, "Class is required"),
		section: z.string().min(1, "Section is required"),

		studentProfile: z.object({
			firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
			middleName: z.string().optional(),
			lastName: z.string().optional(),
			dob: z.string().min(1, "Date of birth is required"),
			gender: z.string().min(1, "Gender is required"),
			category: z.string().optional(),
			religion: z.string().optional(),
			caste: z.string().optional(),
			mobileNumber: z
				.string()
				.regex(/^[0-9]{10}$/, "Invalid mobile number (10 digits required)")
				.optional(),
			email: z.string().email("Invalid email format").optional(),
			studentPhoto: z.any().optional(),

			address: z.object({
				street: z.string().optional(),
				city: z.string().optional(),
				state: z.string().optional(),
				postalCode: z.string().optional(),
				country: z.string().optional(),
			}),
		}),

		medicalDetails: z.object({
			bloodGroup: z.string().optional(),
			height: z.string().regex(/^\d+$/, "Height must be a number").optional(),
			weight: z.string().regex(/^\d+$/, "Weight must be a number").optional(),
			medicalHistory: z.string().optional(),
			measurementDate: z.string().optional(),
		}),

		parentDetails: z.object({
			fatherDetails: z.object({
				fatherName: z.string().optional(),
				fatherPhone: z
					.string()
					.regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)")
					.optional(),
				fatherOccupation: z.string().optional(),
				fatherEducation: z.string().optional(),
				fatherEmail: z.string().email("Invalid email format").optional(),
				fatherPhoto: z.any().optional(),
			}),

			motherDetails: z.object({
				motherName: z.string().optional(),
				motherPhone: z
					.string()
					.regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)")
					.optional(),
				motherOccupation: z.string().optional(),
				motherEducation: z.string().optional(),
				motherEmail: z.string().email("Invalid email format").optional(),
				motherPhoto: z.any().optional(),
			}),

			guardianDetails: z.object({
				guardianName: z.string().optional(),
				guardianPhone: z
					.string()
					.regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)")
					.optional(),
				guardianOccupation: z.string().optional(),
				guardianEducation: z.string().optional(),
				guardianRelation: z.string().optional(),
				guardianEmail: z.string().email("Invalid email format").optional(),
				guardianCurrentAddress: z.string().optional(),
				guardianPermanentAddress: z.string().optional(),
			}),

			primaryGuardian: z.string().optional(),
			parentCurrentAddress: z.string().optional(),
			parentPermanentAddress: z.string().optional(),
		}),
	});

	type StudentFormData = z.infer<typeof studentSchema>;

	// Reactive form state
	let formData: StudentFormData = {
		admissionNo: generateAdmissionNo(),
		admissionDate: new Date().toISOString().split("T")[0],
		academicSession: getCurrentAcademicSession(),
		rollNo: "",
		class: "",
		section: "",
		studentProfile: {
			firstName: "",
			middleName: "",
			lastName: "",
			dob: "",
			gender: "",
			category: "",
			religion: "",
			caste: "",
			mobileNumber: "",
			email: "",
			studentPhoto: null,
			address: {
				street: "",
				city: "",
				state: "",
				postalCode: "",
				country: "",
			},
		},
		medicalDetails: {
			bloodGroup: "",
			height: "",
			weight: "",
			medicalHistory: "",
			measurementDate: new Date().toISOString().split("T")[0],
		},
		parentDetails: {
			fatherDetails: { fatherName: "", fatherPhone: "", fatherOccupation: "", fatherEducation: "", fatherEmail: "", fatherPhoto: "" },
			motherDetails: { motherName: "", motherPhone: "", motherOccupation: "", motherEducation: "", motherEmail: "", motherPhoto: "" },
			guardianDetails: {
				guardianName: "",
				guardianPhone: "",
				guardianOccupation: "",
				guardianEducation: "",
				guardianRelation: "",
				guardianEmail: "",
				guardianCurrentAddress: "",
				guardianPermanentAddress: "",
			},
			primaryGuardian: "",
			parentCurrentAddress: "",
			parentPermanentAddress: "",
		},
	};

	function clearForm() {
		submitAttempted.set(false);
		selectedDateOfBirth = null;
		formData.dob = String(selectedDateOfBirth);

		formData = {
			...formData,
			rollNo: "",
			class: "",
			section: "",
			firstName: "",
			middleName: "",
			lastName: "",
			gender: "",
			dob: "",
			category: "",
			religion: "",
			caste: "",
			mobileNumber: "",
			phoneNumber: "",
			email: "",
			admissionDate: new Date().toISOString().split("T")[0],
			studentPhoto: null,
			bloodGroup: "",
			house: "",
			height: "",
			weight: "",
			measurementDate: new Date().toISOString().split("T")[0],
			medicalHistory: "",
			address: {
				street: "",
				city: "",
				state: "",
				postalCode: "",
				country: "",
			},
			parentDetails: {
				fatherName: "",
				fatherPhone: "",
				fatherOccupation: "",
				fatherEducation: "",
				fatherEmail: "",
				motherName: "",
				motherPhone: "",
				motherOccupation: "",
				motherEducation: "",
				motherEmail: "",
				guardianName: "",
				guardianPhone: "",
				guardianOccupation: "",
				guardianEducation: "",
				guardianRelation: "",
				guardianEmail: "",
				primaryGuardian: "",
				currentAddress: "",
				permanentAddress: "",
			},
		};
	}
	let error = "";

	const formErrors = writable<Partial<Record<keyof StudentFormData, any>>>({});
	const touched = writable<Partial<Record<keyof StudentFormData, boolean>>>({});
	const submitAttempted = writable(false);

	function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement)?.value || "";
		formData.class = selected;
		formData.section = ""; // Mark class as touched
		$touched.class = true; // Clear error for class
		$formErrors.class = "";
		const selectedClass = classesWithSections.find((cls: any) => cls.name === selected);
		availableSections = selectedClass?.sectionIds || [];
		// console.log("availableSections:", availableSections);
	}

	function handleSectionChange(e: Event) {
		formData.section = (e.target as HTMLSelectElement)?.value || "";
		$touched.section = true;
		$formErrors.section = "";
	}

	function validate() {
		const result = studentSchema.safeParse(formData);
		if (!result.success) {
			const fieldErrors = result.error.flatten().fieldErrors;
			const mapped = Object.fromEntries(Object.entries(fieldErrors).map(([k, v]) => [k, v?.[0]])) as Partial<Record<keyof StudentFormData, string>>;
			formErrors.set(mapped);
		} else {
			formErrors.set({});
		}
		return result.success;
	}

	function onSubmit(e: Event) {
		console.log(formData);
		e.preventDefault();
		submitAttempted.set(true);
		validate();
		if (Object.keys(get(formErrors)).length === 0) {
			alert("Student registered successfully!");
			// console.log(formData);
		}
	}

	// Helper function to mark field as touched
	function handleBlur(field: keyof StudentFormData) {
		$touched = { ...$touched, [field]: true };
	}
</script>

<form on:submit={onSubmit}>
	<!-- Academic Detail -->
	<div class="card-wrapper">
		<h1>Academic Detail</h1>
		<div class="grid-12">
			<div class="col-2">
				<label for="academicSession">Academic Year</label>
				<input id="academicSession" type="text" bind:value={formData.academicSession} readonly disabled />
			</div>

			<div class="col-2">
				<label for="admissionNo">Admission No</label>
				<input id="admissionNo" type="text" bind:value={formData.admissionNo} readonly disabled />
			</div>

			<div class="col-2">
				<label for="admissionDate">Admission Date</label>
				<DatePicker bind:value={selectedDate} onChange={handleDateChange} defaultToday={true} />
			</div>

			<div class="col-2">
				<label for="class">Class <span class="required">*</span></label>
				<select
					id="class"
					class={`w-full ${$formErrors.class && ($touched.class || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.class}
					on:change={handleClassChange}
					on:blur={() => handleBlur("class")}
				>
					<option value="" disabled selected>Select Class</option>
					{#each classesWithSections as cls}
						<option value={cls.name}>{cls.name}</option>
					{/each}
				</select>
				{#if $formErrors.class && ($touched.class || $submitAttempted)}
					<p class="error-text">{$formErrors.class}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="section">Section <span class="required">*</span></label>
				<select
					id="section"
					bind:value={formData.section}
					disabled={!availableSections.length}
					class={`w-full ${$formErrors.section && ($touched.section || $submitAttempted) ? "input-error" : ""}`}
					on:change={handleSectionChange}
					on:blur={() => handleBlur("section")}
				>
					<option value="" disabled selected>Select Section</option>
					{#each availableSections as section}
						<option value={section._id}>{section.name}</option>
					{/each}
				</select>
				{#if $formErrors.section && ($touched.section || $submitAttempted)}
					<p class="error-text">{$formErrors.section}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="rollNo">Roll Number</label>
				<input id="rollNo" type="text" name="rollNo" class="w-full" bind:value={formData.rollNo} />
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
					class={`w-full ${$formErrors.firstName && ($touched.firstName || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.firstName}
					on:blur={() => handleBlur("firstName")}
				/>
				{#if $formErrors.firstName && ($touched.firstName || $submitAttempted)}
					<p class="error-text">{$formErrors.firstName}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="middleName">Middle Name</label>
				<input id="middleName" type="text" name="middleName" class="w-full" bind:value={formData.middleName} />
			</div>

			<div class="col-2">
				<label for="lastName">Last Name</label>
				<input id="lastName" type="text" name="lastName" class="w-full" bind:value={formData.lastName} />
			</div>

			<div class="col-2">
				<label for="gender">Gender <span class="required">*</span></label>
				<select
					id="gender"
					class={`w-full ${$formErrors.gender && ($touched.gender || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.gender}
					on:blur={() => handleBlur("gender")}
				>
					<option value="" disabled selected>Select Gender</option>
					{#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each}
				</select>
				{#if $formErrors.gender && ($touched.gender || $submitAttempted)}
					<p class="error-text">{$formErrors.gender}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="dob">Date of Birth <span class="required">*</span></label>
				<DatePicker
					bind:value={selectedDateOfBirth}
					onChange={handleBirthDateChange}
					onClear={handleOnClear}
					cls={`w-full ${$formErrors.dob && ($touched.dob || $submitAttempted) ? "input-error" : ""}`}
				/>
				{#if $formErrors.dob && ($touched.dob || $submitAttempted)}
					<p class="error-text">{$formErrors.dob}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="category">Category</label>
				<select id="category" bind:value={formData.category}>
					<option value="" disabled selected>Select Category</option>
					{#each CASTE_CATEGORIES as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="col-2">
				<label for="religion">Religion</label>
				<input id="religion" type="text" name="religion" class="w-full" bind:value={formData.religion} />
			</div>

			<div class="col-2">
				<label for="caste">Caste</label>
				<input id="caste" type="text" name="caste" class="w-full" bind:value={formData.caste} />
			</div>

			<div class="col-2">
				<label for="email">Email</label>
				<input
					id="email"
					type="email"
					name="email"
					class={`w-full ${$formErrors.email && ($touched.email || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.email}
					on:blur={() => handleBlur("email")}
				/>
				{#if $formErrors.email && ($touched.email || $submitAttempted)}
					<p class="error-text">{$formErrors.email}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="mobileNumber">Mobile No</label>
				<input
					id="mobileNumber"
					type="tel"
					name="mobileNumber"
					class={`w-full ${$formErrors.mobileNumber && ($touched.mobileNumber || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.mobileNumber}
					on:blur={() => handleBlur("mobileNumber")}
					maxlength="10"
				/>
				{#if $formErrors.mobileNumber && ($touched.mobileNumber || $submitAttempted)}
					<p class="error-text">{$formErrors.mobileNumber}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="phoneNumber">Phone No</label>
				<input
					id="phoneNumber"
					type="tel"
					name="phoneNumber"
					class={`w-full ${$formErrors.phoneNumber && ($touched.phoneNumber || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.phoneNumber}
					on:blur={() => handleBlur("phoneNumber")}
					maxlength="10"
				/>
				{#if $formErrors.phoneNumber && ($touched.phoneNumber || $submitAttempted)}
					<p class="error-text">{$formErrors.phoneNumber}</p>
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
				<input id="street" type="text" name="street" class="w-full" bind:value={formData.address!.street} />
			</div>

			<div class="col-2">
				<label for="city">City</label>
				<input id="city" type="text" name="city" class="w-full" bind:value={formData.address!.city} />
			</div>

			<div class="col-2">
				<label for="state">State</label>
				<input id="state" type="text" name="state" class="w-full" bind:value={formData.address!.state} />
			</div>

			<div class="col-2">
				<label for="postalCode">Postal Code</label>
				<input id="postalCode" type="text" name="postalCode" class="w-full" bind:value={formData.address!.postalCode} />
			</div>

			<div class="col-2">
				<label for="country">Country</label>
				<input id="country" type="text" name="country" class="w-full" bind:value={formData.address!.country} />
			</div>
		</div>
	</div>

	<!-- Medical Detail -->
	<div class="card-wrapper">
		<h1>Medical Detail</h1>
		<div class="grid-12">
			<div class="col-1">
				<label for="bloodGroup">Blood Group</label>
				<select id="bloodGroup" bind:value={formData.bloodGroup}>
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
					type="text"
					bind:value={formData.height}
					class={`w-full ${$formErrors.height && ($touched.height || $submitAttempted) ? "input-error" : ""}`}
					on:blur={() => handleBlur("height")}
				/>
				{#if $formErrors.height && ($touched.height || $submitAttempted)}
					<p class="error-text">{$formErrors.height}</p>
				{/if}
			</div>

			<div class="col-1">
				<label for="weight">Weight (KG)</label>
				<input
					id="weight"
					type="text"
					bind:value={formData.weight}
					class={`w-full ${$formErrors.weight && ($touched.weight || $submitAttempted) ? "input-error" : ""}`}
					on:blur={() => handleBlur("weight")}
				/>
				{#if $formErrors.weight && ($touched.weight || $submitAttempted)}
					<p class="error-text">{$formErrors.weight}</p>
				{/if}
			</div>

			<div class="col-1">
				<label for="eyeSight">Eye Sight</label>
				<input id="eyeSight" type="text" class="w-full" />
			</div>

			<div class="col-2">
				<label for="measurementDate">Measurement Date</label>
				<DatePicker bind:value={selectedDate} onChange={handleDateChange} defaultToday={true} />
			</div>

			<div class="col-6">
				<label for="allergies">Allergies</label>
				<TagInput />
			</div>

			<div class="col-6">
				<label for="medicalConditions">Medical Conditions</label>
				<TagInput />
			</div>

			<div class="col-6">
				<label for="medicalHistory">Medical History</label>
				<textarea id="medicalHistory" class="w-full" bind:value={formData.medicalHistory}></textarea>
			</div>
		</div>
	</div>

	<!-- Parent Detail -->
	<div class="card-wrapper">
		<h1>Parent/Guardian Detail</h1>
		<div class="grid-12">
			<div class="col-2">
				<label for="fatherName">Father Name</label>
				<input id="fatherName" type="text" bind:value={formData.parentDetails!.fatherName} />
			</div>

			<div class="col-2">
				<label for="fatherPhone">Father Phone</label>
				<input
					id="fatherPhone"
					type="tel"
					bind:value={formData.parentDetails!.fatherPhone}
					class={`w-full ${$formErrors.parentDetails?.fatherPhone && $submitAttempted ? "input-error" : ""}`}
					maxlength="10"
				/>
				{#if $formErrors.parentDetails?.fatherPhone && $submitAttempted}
					<p class="error-text">{$formErrors.parentDetails.fatherPhone}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="fatherOccupation">Father Occupation</label>
				<input id="fatherOccupation" type="text" bind:value={formData.parentDetails!.fatherOccupation} />
			</div>

			<div class="col-2">
				<label for="fatherEducation">Father Education</label>
				<input id="fatherEducation" type="text" bind:value={formData.parentDetails!.fatherEducation} />
			</div>

			<div class="col-4">
				<label for="fatherEmail">Father Email</label>
				<input
					id="fatherEmail"
					type="email"
					bind:value={formData.parentDetails!.fatherEmail}
					class={`w-full ${$formErrors.parentDetails?.fatherEmail && $submitAttempted ? "input-error" : ""}`}
				/>
				{#if $formErrors.parentDetails?.fatherEmail && $submitAttempted}
					<p class="error-text">{$formErrors.parentDetails.fatherEmail}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherName">Mother Name</label>
				<input id="motherName" type="text" bind:value={formData.parentDetails!.motherName} />
			</div>

			<div class="col-2">
				<label for="motherPhone">Mother Phone</label>
				<input
					id="motherPhone"
					type="tel"
					bind:value={formData.parentDetails.motherPhone}
					class={`w-full ${$formErrors.parentDetails?.motherPhone && $submitAttempted ? "input-error" : ""}`}
					maxlength="10"
				/>
				{#if $formErrors.parentDetails?.motherPhone && $submitAttempted}
					<p class="error-text">{$formErrors.parentDetails.motherPhone}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherOccupation">Mother Occupation</label>
				<input id="motherOccupation" type="text" bind:value={formData.parentDetails!.motherOccupation} />
			</div>

			<div class="col-2">
				<label for="motherEducation">Mother Education</label>
				<input id="motherEducation" type="text" bind:value={formData.parentDetails!.motherEducation} />
			</div>
			<div class="col-4">
				<label for="motherEmail">Mother Email</label>
				<input
					id="motherEmail"
					type="email"
					bind:value={formData.parentDetails!.motherEmail}
					class={`w-full ${$formErrors.parentDetails?.motherEmail && $submitAttempted ? "input-error" : ""}`}
				/>
				{#if $formErrors.parentDetails?.motherEmail && $submitAttempted}
					<p class="error-text">{$formErrors.parentDetails.motherEmail}</p>
				{/if}
			</div>

			<div class="col-6">
				<label for="currentAddress">Parent Current Address</label>
				<textarea id="currentAddress" bind:value={formData.parentDetails!.currentAddress} placeholder="Write current address.."></textarea>
			</div>

			<div class="col-6">
				<label for="permanentAddress">Parent Permanent Address</label>
				<textarea id="permanentAddress" bind:value={formData.parentDetails!.permanentAddress} placeholder="Write permanent address.."></textarea>
			</div>

			<div class="col-2">
				<label for="primaryGuardian">Primary Guardian</label>
				<div class="radio-group">
					<label><input type="radio" bind:group={formData.parentDetails!.primaryGuardian} value="Father" /> Father </label>
					<label><input type="radio" bind:group={formData.parentDetails!.primaryGuardian} value="Mother" /> Mother </label>
					<label> <input type="radio" bind:group={formData.parentDetails!.primaryGuardian} value="Other" /> Other </label>
				</div>
			</div>
			<div class="col-10"></div>

			<div class="col-12">
				<div class="grid-12">
					<div class="col-2">
						<label for="guardianName">Guardian Name</label>
						<input id="guardianName" type="text" bind:value={formData.parentDetails!.guardianName} />
					</div>

					<div class="col-2">
						<label for="guardianPhone">Guardian Phone</label>
						<input
							id="guardianPhone"
							type="tel"
							bind:value={formData.parentDetails!.guardianPhone}
							class={`w-full ${$formErrors.parentDetails?.guardianPhone && $submitAttempted ? "input-error" : ""}`}
							maxlength="10"
						/>
						{#if $formErrors.parentDetails?.guardianPhone && $submitAttempted}
							<p class="error-text">{$formErrors.parentDetails.guardianPhone}</p>
						{/if}
					</div>

					<div class="col-2">
						<label for="guardianOccupation">Guardian Occupation</label>
						<input id="guardianOccupation" type="text" bind:value={formData.parentDetails!.guardianOccupation} />
					</div>

					<div class="col-2">
						<label for="guardianEducation">Guardian Education</label>
						<input id="guardianEducation" type="text" bind:value={formData.parentDetails!.guardianEducation} />
					</div>

					<div class="col-2">
						<label for="guardianRelation">Guardian Relation</label>
						<input id="guardianRelation" type="text" bind:value={formData.parentDetails!.guardianRelation} />
					</div>

					<div class="col-2">
						<label for="guardianEmail">Guardian Email</label>
						<input
							id="guardianEmail"
							type="email"
							bind:value={formData.parentDetails!.guardianEmail}
							class={`w-full ${$formErrors.parentDetails?.guardianEmail && $submitAttempted ? "input-error" : ""}`}
						/>
						{#if $formErrors.parentDetails?.guardianEmail && $submitAttempted}
							<p class="error-text">{$formErrors.parentDetails.guardianEmail}</p>
						{/if}
					</div>

					<div class="col-6">
						<label for="guardianCurrentAddress">Guardian Current Address</label>
						<textarea id="guardianCurrentAddress" bind:value={formData.parentDetails!.currentAddress} placeholder="Write current address.."></textarea>
					</div>

					<div class="col-6">
						<label for="guardianPermanentAddress">Guardian Permanent Address</label>
						<textarea id="guardianPermanentAddress" bind:value={formData.parentDetails!.permanentAddress} placeholder="Write permanent address.."></textarea>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- Form Actions -->
	<div class="form-actions">
		<button class="btn" type="button" on:click={clearForm} disabled={$isLoading}> Clear </button>
		<button class="btn" type="submit" disabled={$isLoading}>
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update{:else}Save{/if}
		</button>
	</div>
</form>

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
		background-color: var(--gray1);
		font-weight: 600;
		transition: background-color 0.3s;
	}

	.section-header:hover {
		background-color: var(--gray2);
	}

	.arrow-icon {
		transition: transform 0.3s ease;
	}

	.section-body {
		padding: 1rem;
		transition: all 0.3s ease;
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

	.btn {
		padding: 0.75rem 1.5rem;
		border-radius: 0.375rem;
		font-weight: 500;
		font-size: 0.875rem;
		cursor: pointer;
		transition: all 0.2s;
	}

	.btn-primary:hover {
		background-color: var(--primary-dark);
	}

	.btn-primary:disabled {
		background-color: var(--primary-light);
		cursor: not-allowed;
	}

	.btn-secondary:disabled {
		opacity: 0.7;
		cursor: not-allowed;
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
</style>
