<script lang="ts">
	import { z } from "zod";
	import { derived, get, writable } from "svelte/store";
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

	function handleDateChange(date: Date | null) {
		selectedDate = date!;
		// formData.medicalDetails.measurementDate = date?.toISOString().split("T")[0] || "";
	}

	function handleBirthDateChange(date: Date | null) {
		selectedDateOfBirth = date!;
		formData.studentProfile.dob = date?.toISOString().split("T")[0] || "";
		validate();
	}

	function handleOnClear(date: Date | null) {
		formData.studentProfile.dob = "";
		// formData.studentProfile.dob = "";
	}

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
				.optional().or(z.literal("")),
			email: z.string().email("Invalid email format").optional().or(z.literal("")),
			studentPhoto: z.any().optional(),
			address: z.object({
				street: z.string().min(1, "Street is required").min(2, "Street must be at least 2 characters"),
				city: z.string().min(1, "City is required").min(2, "City must be at least 2 characters"),
				state: z.string().min(1, "State is required").min(2, "State must be at least 2 characters"),
				postalCode: z.string().min(1, "Postal Code is required").min(2, "Postal Code must be at least 2 characters"),
				country: z.string().min(1, "Country is required").min(2, "Country must be at least 2 characters"),
			}),
		}),
	});

	type StudentFormData = z.infer<typeof studentSchema>;

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
	};

	function clearForm() {
		submitAttempted.set(false);
		selectedDateOfBirth = null;
		formData = {
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
		};
		formErrors.set({});
		touched.set({});
	}

	type FormErrors = Partial<Record<any, any>>;
	const formErrors = writable<FormErrors>({});

	type TouchedFields = Partial<Record<any, any>>;
	const touched = writable<TouchedFields>({});

	const submitAttempted = writable(false);

	function flattenErrors<T>(error: z.ZodFormattedError<T>): FormErrors {
		const result: FormErrors = {};

		function recurse(err: z.ZodFormattedError<any> | { _errors: any[] }, path: any[] = []) {
			// Only proceed with objects
			if (typeof err !== "object" || err === null) return;

			for (const key in err) {
				if (key === "_errors") {
					const messages = (err as { _errors: any[] })._errors;
					if (messages.length > 0) {
						const fullPath = path.join(".");
						result[fullPath] = messages[0]; // Only take the first error
					}
				} else {
					// Safely recurse into nested fields
					recurse((err as Record<string, any>)[key], [...path, key]);
				}
			}
		}
		recurse(error);
		return result;
	}

	function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value || "";
		formData.class = selected;
		formData.section = "";
		$touched["class"] = true;
		$formErrors["class"] = "";
		const selectedClass = classesWithSections.find((cls: any) => cls.name === selected);
		availableSections = selectedClass?.sectionIds || [];
	}

	function handleSectionChange(e: Event) {
		formData.section = (e.target as HTMLSelectElement).value || "";
		$touched["section"] = true;
		$formErrors["section"] = "";
	}

	function validate() {
		const result = studentSchema.safeParse(formData);
		if (!result.success) {
			const mapped = flattenErrors(result.error.format());
			formErrors.set(mapped);
		} else {
			formErrors.set({});
		}
		return result.success;
	}

	function onSubmit(e: Event) {
		validate();
		console.log(formData);
		e.preventDefault();
		submitAttempted.set(true);
		if (Object.keys(get(formErrors)).length === 0) {
			console.log("Student registered successfully!");
		}
	}

	function handleBlur(field: keyof any) {
		$touched = { ...$touched, [field]: true };
		validate();
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
					class={`w-full ${$formErrors["class"] && ($touched["class"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.class}
					on:change={handleClassChange}
					on:blur={() => handleBlur("class")}
				>
					<option value="" disabled selected>Select Class</option>
					{#each classesWithSections as cls}
						<option value={cls.name}>{cls.name}</option>
					{/each}
				</select>
				{#if $formErrors["class"] && ($touched["class"] || $submitAttempted)}
					<p class="error-text">{$formErrors["class"]}</p>
				{/if}
			</div>
			<div class="col-2">
				<label for="section">Section <span class="required">*</span></label>
				<select
					id="section"
					bind:value={formData.section}
					disabled={!availableSections.length}
					class={`w-full ${$formErrors["section"] && ($touched["section"] || $submitAttempted) ? "input-error" : ""}`}
					on:change={handleSectionChange}
					on:blur={() => handleBlur("section")}
				>
					<option value="" disabled selected>Select Section</option>
					{#each availableSections as section}
						<option value={section._id}>{section.name}</option>
					{/each}
				</select>
				{#if $formErrors["section"] && ($touched["section"] || $submitAttempted)}
					<p class="error-text">{$formErrors["section"]}</p>
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
					class={`w-full ${$formErrors["studentProfile.firstName"] && ($touched["studentProfile.firstName"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.firstName}
					on:blur={() => handleBlur("studentProfile.firstName")}
					on:input={() => handleBlur("studentProfile.firstName")}
				/>
				{#if $formErrors["studentProfile.firstName"] && ($touched["studentProfile.firstName"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.firstName"]}</p>
				{/if}
			</div>
			<div class="col-2">
				<label for="middleName">Middle Name</label>
				<input id="middleName" type="text" name="middleName" class="w-full" bind:value={formData.studentProfile.middleName} />
			</div>
			<div class="col-2">
				<label for="lastName">Last Name</label>
				<input id="lastName" type="text" name="lastName" class="w-full" bind:value={formData.studentProfile.lastName} />
			</div>

			<div class="col-2">
				<label for="gender">Gender <span class="required">*</span></label>
				<select
					id="gender"
					class={`w-full ${$formErrors["studentProfile.gender"] && ($touched["studentProfile.gender"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.gender}
					on:blur={() => handleBlur("gender")}
                    on:change={() => handleBlur("gender")}
				>
					<option value="" disabled selected>Select Gender</option>
					{#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each}
				</select>
				{#if $formErrors["studentProfile.gender"] && ($touched["studentProfile.gender"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.gender"]}</p>
				{/if}
			</div>

            <div class="col-2">
				<label for="dob">Date of Birth <span class="required">*</span></label>
				<DatePicker
					bind:value={selectedDateOfBirth}
					onChange={handleBirthDateChange}
					onClear={handleOnClear}
					cls={`w-full ${$formErrors["studentProfile.dob"] && ($touched["studentProfile.dob"] || $submitAttempted) ? "input-error" : ""}`}
				/>
				{#if $formErrors["studentProfile.dob"] && ($touched["studentProfile.dob"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.dob"]}</p>
				{/if}
			</div>

            <div class="col-2">
				<label for="category">Category</label>
				<select id="category" bind:value={formData.studentProfile.category}>
					<option value="" disabled selected>Select Category</option>
					{#each CASTE_CATEGORIES as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</div>

			<div class="col-2">
				<label for="religion">Religion</label>
				<input id="religion" type="text" name="religion" class="w-full" bind:value={formData.studentProfile.religion} />
			</div>

			<div class="col-2">
				<label for="caste">Caste</label>
				<input id="caste" type="text" name="caste" class="w-full" bind:value={formData.studentProfile.caste} />
			</div>

			<div class="col-2">
				<label for="mobileNumber">Mobile No</label>
				<input
					id="mobileNumber"
					type="tel"
					name="mobileNumber"
					class={`w-full ${$formErrors["studentProfile.mobileNumber"] && ($touched["studentProfile.mobileNumber"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.mobileNumber}
					on:blur={() => handleBlur("studentProfile.mobileNumber")}
                    on:input={() => handleBlur("studentProfile.mobileNumber")}
					maxlength="10"
				/>
				{#if $formErrors["studentProfile.mobileNumber"] && ($touched["studentProfile.mobileNumber"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.mobileNumber"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="email">Email</label>
				<input id="email" type="text" name="email"
					class={`w-full ${$formErrors["studentProfile.email"] && ($touched["studentProfile.email"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.email}
					on:blur={() => handleBlur("email")}
				/>
				{#if $formErrors["studentProfile.email"] && ($touched["studentProfile.email"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.email"]}</p>
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
				<input id="street" type="text" name="street"
					class={`w-full ${$formErrors["studentProfile.address.street"] && ($touched["studentProfile.address.street"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.address.street}
					on:blur={() => handleBlur("studentProfile.address.street")}
					on:input={() => handleBlur("studentProfile.address.street")}
				/>
				{#if $formErrors["studentProfile.address.street"] && ($touched["studentProfile.address.street"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.address.street"]}</p>
				{/if}
			</div>

            <div class="col-2">
				<label for="city">City</label>
				<input id="city" type="text" name="city"
					class={`w-full ${$formErrors["studentProfile.address.city"] && ($touched["studentProfile.address.city"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.address.city}
					on:blur={() => handleBlur("studentProfile.address.city")}
					on:input={() => handleBlur("studentProfile.address.city")}
				/>
				{#if $formErrors["studentProfile.address.city"] && ($touched["studentProfile.address.city"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.address.city"]}</p>
				{/if}
			</div>

            <div class="col-2">
				<label for="state">State</label>
				<input id="state" type="text" name="state"
					class={`w-full ${$formErrors["studentProfile.address.state"] && ($touched["studentProfile.address.state"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.address.state}
					on:blur={() => handleBlur("studentProfile.address.state")}
					on:input={() => handleBlur("studentProfile.address.state")}
				/>
				{#if $formErrors["studentProfile.address.state"] && ($touched["studentProfile.address.state"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.address.state"]}</p>
				{/if}
			</div>

            <div class="col-2">
				<label for="postalCode">Postal Code</label>
				<input id="postalCode" type="text" name="postalCode"
					class={`w-full ${$formErrors["studentProfile.address.postalCode"] && ($touched["studentProfile.address.postalCode"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.address.postalCode}
					on:blur={() => handleBlur("studentProfile.address.postalCode")}
					on:input={() => handleBlur("studentProfile.address.postalCode")}
				/>
				{#if $formErrors["studentProfile.address.postalCode"] && ($touched["studentProfile.address.postalCode"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.address.postalCode"]}</p>
				{/if}
			</div>

            <div class="col-2">
				<label for="country">Country</label>
				<input id="country" type="text" name="country"
					class={`w-full ${$formErrors["studentProfile.address.country"] && ($touched["studentProfile.address.country"] || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.studentProfile.address.country}
					on:blur={() => handleBlur("studentProfile.address.country")}
					on:input={() => handleBlur("studentProfile.address.country")}
				/>
				{#if $formErrors["studentProfile.address.country"] && ($touched["studentProfile.address.country"] || $submitAttempted)}
					<p class="error-text">{$formErrors["studentProfile.address.country"]}</p>
				{/if}
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
