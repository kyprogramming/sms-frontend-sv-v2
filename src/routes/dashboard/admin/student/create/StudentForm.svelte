<script lang="ts">
	import DatePicker from "$lib/components/DatePicker.svelte";
	import TagInput from "$lib/components/TagInput.svelte";
	import { BLOOD_GROUPS, CASTE_CATEGORIES, GENDERS, GUARDIAN_TYPE } from "$lib/constants";
	import { isLoading } from "$lib/stores/loading";
	import { isUpdate } from "$lib/stores/modalStore";
	import { generateAdmissionNo, getCurrentAcademicYear } from "$lib/utils/utils";
	import { get, writable } from "svelte/store";
	import { z } from "zod";

	export let classesWithSections: any;

	// $: sectionsForSelectedClass = classesWithSections.find((cls: any) => cls.name === formData.studentData.classId)?.sections ?? [];
	let availableSections: { _id: string; name: string }[] = [];
	let selectedDate: Date | null = null;
	let selectedDateOfBirth: Date | null = null;

	// let allergyTags: string[] = [];
	// let medicalConditions: string[] = [];

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
		validate();
	}
	function handleOnClear(date: Date | null) {
		formData.studentData.profile.dob = "";
	}

	function guardianTypeChange(type: any) {
		formData.studentData.parentGuardianDetails.primaryGuardian = type;
		$formErrors["studentData.parentGuardianDetails.primaryGuardian"] = "";
	}

	const studentSchema = z.object({
		userData: z.object({
			email: z.string().email("Invalid email format").optional().or(z.literal("")),
			mobile: z
				.string()
				.regex(/^[0-9]{10}$/, "Invalid mobile number (10 digits required)")
				.optional()
				.or(z.literal("")),
		}),
		studentData: z.object({
			admissionNo: z.string().min(1, "Admission number is required"),
			admissionDate: z.string().min(1, "Admission date is required"),
			academicYear: z.string().min(1, "Academic session is required"),
			rollNo: z.string().optional(),
			classId: z.string().min(1, "Class is required"),
			sectionId: z.string().min(1, "Section is required"),
			profile: z.object({
				firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
				middleName: z.string().optional(),
				lastName: z.string().min(1, "Last name is required").min(2, "Last name must be at least 2 characters"),
				dob: z.string().min(1, "Date of birth is required"),
				gender: z.string().min(1, "Gender is required"),
				category: z.string().optional(),
				religion: z.string().optional(),
				caste: z.string().optional(),
				studentPhoto: z.any().optional(),
				address: z.object({
					street: z.string().min(1, "Street is required").min(2, "Street must be at least 2 characters"),
					city: z.string().min(1, "City is required").min(2, "City must be at least 2 characters"),
					state: z.string().min(1, "State is required").min(2, "State must be at least 2 characters"),
					postalCode: z.string().min(1, "Postal Code is required").min(2, "Postal Code must be at least 2 characters"),
					country: z.string().min(1, "Country is required").min(2, "Country must be at least 2 characters"),
				}),
			}),
			medicalDetails: z.object({
				bloodGroup: z.string().optional(),
				height: z.string().regex(/^\d+$/, "Height must be a number").optional().or(z.literal("")),
				weight: z.string().regex(/^\d+$/, "Weight must be a number").optional().or(z.literal("")),
				eyeSight: z.string().optional(),
				measurementDate: z.string().optional(),
				allergies: z.array(z.string()).optional(),
				medicalConditions: z.array(z.string()).optional(),
				medicalHistory: z.string().optional(),
			}),
			parentGuardianDetails: z.object({
				fatherDetails: z.object({
					fatherName: z.string().min(1, "Father name is required").min(2, "Father name must be at least 2 characters"),
					fatherPhone: z
						.string()
						.regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)")
						.optional(),
					fatherOccupation: z.string().optional(),
					fatherEducation: z.string().optional(),
					fatherEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
					fatherPhoto: z.any().optional(),
				}),
				motherDetails: z.object({
					motherName: z.string().min(1, "Mother name is required").min(2, "Mother name must be at least 2 characters"),
					motherPhone: z
						.string()
						.regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)")
						.optional(),
					motherOccupation: z.string().optional(),
					motherEducation: z.string().optional(),
					motherEmail: z.string().email("Invalid email format").optional().or(z.literal("")),
					motherPhoto: z.any().optional(),
				}),
				guardianDetails: z.object({
                    guardianName: z.string().min(1, "Guardian name is required").min(2, "Guardian name must be at least 2 characters"),
					guardianPhone: z
						.string()
						.regex(/^[0-9]{10}$/, "Invalid phone number (10 digits required)")
						.optional(),
					guardianOccupation: z.string().optional(),
					guardianEducation: z.string().optional(),
                    guardianRelation: z.string().min(1, "Guardian relation is required").min(2, "Guardian relation must be at least 2 characters"),
					guardianEmail: z.string().email("Invalid email format").optional(),
                    guardianCurrentAddress: z.string().min(1, "Guardian current address is required").min(2, "Parent current address must be at least 2 characters"),
					guardianPermanentAddress: z.string().optional(),
				}),
				primaryGuardian: z.string().refine((val) => ["Father", "Mother", "Other"].includes(val), {
					message: "Primary guardian must be selected",
				}),
				parentCurrentAddress: z.string().min(1, "Parent current address is required").min(2, "Parent current address must be at least 2 characters"),
				parentPermanentAddress: z.string().optional(),
			}),
			// .superRefine((data, ctx) => {
			// 	if (data.primaryGuardian === "Other") {
			// 		const guardian = data.guardianDetails;
			// 		// Check required fields (including optional ones when primaryGuardian is "Other")
			// 		if (!guardian.guardianName) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianName"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian name is required",
			// 			});
			// 		}
			// 		if (!guardian.guardianRelation) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianRelation"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian relation is required",
			// 			});
			// 		}
			// 		if (!guardian.guardianCurrentAddress) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianCurrentAddress"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian current address is required",
			// 			});
			// 		}
			// 		if (!guardian.guardianPhone) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianPhone"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian phone is required",
			// 			});
			// 		} else if (!/^[0-9]{10}$/.test(guardian.guardianPhone)) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianPhone"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian phone must be a valid 10-digit number",
			// 			});
			// 		}
			// 		// Email validation
			// 		if (!guardian.guardianEmail) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianEmail"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian email is required",
			// 			});
			// 		} else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(guardian.guardianEmail)) {
			// 			ctx.addIssue({
			// 				path: ["guardianDetails", "guardianEmail"],
			// 				code: z.ZodIssueCode.custom,
			// 				message: "Guardian email must be a valid email address",
			// 			});
			// 		}
			// 	}
			// }),
		}),
	});

	type StudentFormData = z.infer<typeof studentSchema>;

	let formData: StudentFormData = {
		userData: {
			email: "",
			mobile: "",
		},
		studentData: {
			admissionNo: generateAdmissionNo(),
			admissionDate: new Date().toISOString().split("T")[0],
			academicYear: getCurrentAcademicYear(),
			rollNo: "",
			classId: "",
			sectionId: "",
			profile: {
				firstName: "",
				middleName: "",
				lastName: "",
				dob: "",
				gender: "",
				category: "",
				religion: "",
				caste: "",
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
				measurementDate: "",
				allergies: [],
				medicalConditions: [],
				medicalHistory: "",
			},
			parentGuardianDetails: {
				fatherDetails: {
					fatherName: "",
					fatherPhone: "",
					fatherOccupation: "",
					fatherEducation: "",
					fatherEmail: "",
					fatherPhoto: null,
				},
				motherDetails: {
					motherName: "",
					motherPhone: "",
					motherOccupation: "",
					motherEducation: "",
					motherEmail: "",
					motherPhoto: null,
				},
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
		},
	};

	function clearForm() {
		submitAttempted.set(false);
		selectedDateOfBirth = null;
		formData = {
			userData: {
				email: "",
				mobile: "",
			},
			studentData: {
				admissionNo: generateAdmissionNo(),
				admissionDate: new Date().toISOString().split("T")[0],
				academicYear: getCurrentAcademicYear(),
				rollNo: "",
				classId: "",
				sectionId: "",
				profile: {
					firstName: "",
					middleName: "",
					lastName: "",
					dob: "",
					gender: "",
					category: "",
					religion: "",
					caste: "",
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
					allergies: [],
					medicalConditions: [],
					measurementDate: "",
					medicalHistory: "",
				},
				parentGuardianDetails: {
					fatherDetails: {
						fatherName: "",
						fatherPhone: "",
						fatherOccupation: "",
						fatherEducation: "",
						fatherEmail: "",
						fatherPhoto: null,
					},
					motherDetails: {
						motherName: "",
						motherPhone: "",
						motherOccupation: "",
						motherEducation: "",
						motherEmail: "",
						motherPhoto: null,
					},
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

	function validate() {
		let schema;

		const primary = formData.studentData.parentGuardianDetails.primaryGuardian;

		if (primary === "Father" || primary === "Mother") {
			// Step 1: Get the nested parentGuardianDetails schema
			const parentGuardianDetailsSchema = studentSchema.shape.studentData.shape.parentGuardianDetails;

			// Step 2: Omit guardianDetails from parentGuardianDetails
			const modifiedParentGuardianDetails = parentGuardianDetailsSchema.omit({
				guardianDetails: true,
			});

			// Step 3: Create new studentData schema with modified parentGuardianDetails
			const modifiedStudentData = studentSchema.shape.studentData.extend({
				parentGuardianDetails: modifiedParentGuardianDetails,
			});

			// Step 4: Extend root schema with new studentData
			schema = studentSchema.extend({
				studentData: modifiedStudentData,
			});
		} else {
			// Use full schema when "Other" or any other value
			schema = studentSchema;
		}

		const result = schema.safeParse(formData);

		if (!result.success) {
			const mapped = flattenErrors(result.error.format());
			formErrors.set(mapped);
		} else {
			formErrors.set({});
		}

		return result.success;
	}

	async function onSubmit(e: Event) {
		validate();
		console.log(formData);
		console.log(Object.keys(get(formErrors)).length);
		e.preventDefault();
		submitAttempted.set(true);
		if (Object.keys(get(formErrors)).length === 0) {
			console.log("Student registered successfully!");
			// await createStudent(formData);
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
					on:change={handleClassChange}
					on:blur={handleClassChange}
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
					on:change={handleSectionChange}
					on:blur={() => handleBlur("studentData.sectionId")}
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
					on:blur={() => handleBlur("studentData.profile.firstName")}
					on:input={() => handleBlur("studentData.profile.firstName")}
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
					on:blur={() => handleBlur("studentData.profile.lastName")}
					on:input={() => handleBlur("studentData.profile.lastName")}
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
					on:blur={() => handleBlur("gender")}
					on:change={() => handleBlur("gender")}
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
					on:blur={() => handleBlur("userData.mobile")}
					on:input={() => handleBlur("userData.mobile")}
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
					on:blur={() => handleBlur("userData.email")}
					on:input={() => handleBlur("userData.email")}
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
					on:blur={() => handleBlur("studentData.profile.address.street")}
					on:input={() => handleBlur("studentData.profile.address.street")}
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
					on:blur={() => handleBlur("studentData.profile.address.city")}
					on:input={() => handleBlur("studentData.profile.address.city")}
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
					on:blur={() => handleBlur("studentData.profile.address.state")}
					on:input={() => handleBlur("studentData.profile.address.state")}
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
					on:blur={() => handleBlur("studentData.profile.address.postalCode")}
					on:input={() => handleBlur("studentData.profile.address.postalCode")}
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
					on:blur={() => handleBlur("studentData.profile.address.country")}
					on:input={() => handleBlur("studentData.profile.address.country")}
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
					on:blur={() => handleBlur("medicalDetails.height")}
					on:input={() => handleBlur("medicalDetails.height")}
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
					on:blur={() => handleBlur("medicalDetails.weight")}
					on:input={() => handleBlur("medicalDetails.weight")}
				/>
				{#if $formErrors["medicalDetails.weight"] && ($touched["medicalDetails.weight"] || $submitAttempted)}
					<p class="error-text">{$formErrors["medicalDetails.weight"]}</p>
				{/if}
			</div>

			<div class="col-1">
				<label for="eyeSight">Eye Sight</label>
				<input id="eyeSight" type="text" bind:value={formData.studentData.medicalDetails.eyeSight} class={`w-full`} on:blur={() => handleBlur("eyeSight")} />
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
				<label for="fatherName">Father Name <span class="required">*</span></label>
				<input
					id="fatherName"
					type="tel"
					name="fatherName"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherName"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherName}
					on:blur={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherName")}
					on:input={() => handleBlur("studentData.parentGuardianDetails.fatherDetails.fatherName")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.fatherDetails.fatherName"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherName"]}</p>
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
				/>
				{#if $formErrors["studentData.parentGuardianDetails.fatherDetails.fatherEmail"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.fatherDetails.fatherEmail"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="fatherOccupation">Father Occupation</label>
				<input id="fatherOccupation" type="text" bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherOccupation} />
			</div>
			<div class="col-4">
				<label for="fatherEducation">Father Education</label>
				<input id="fatherEducation" type="text" bind:value={formData.studentData.parentGuardianDetails.fatherDetails.fatherEducation} />
			</div>

			<div class="col-2">
				<label for="motherName">Mother Name</label>
				<input
					id="motherName"
					type="tel"
					name="motherName"
					class={`w-full ${$formErrors["studentData.parentGuardianDetails.motherDetails.motherName"] && $submitAttempted ? "input-error" : ""}`}
					bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherName}
					on:blur={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherName")}
					on:input={() => handleBlur("studentData.parentGuardianDetails.motherDetails.motherName")}
					maxlength="10"
				/>
				{#if $formErrors["studentData.parentGuardianDetails.motherDetails.motherName"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.motherDetails.motherName"]}</p>
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
				/>
				{#if $formErrors["studentData.parentGuardianDetails.motherDetails.motherEmail"] && $submitAttempted}
					<p class="error-text">{$formErrors["studentData.parentGuardianDetails.motherDetails.motherEmail"]}</p>
				{/if}
			</div>

			<div class="col-2">
				<label for="motherOccupation">Mother Occupation</label>
				<input id="motherOccupation" type="text" bind:value={formData.studentData.parentGuardianDetails.motherDetails.motherOccupation} />
			</div>
			<div class="col-4">
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
					on:blur={() => handleBlur("studentData.parentGuardianDetails.parentCurrentAddress")}
					on:input={() => handleBlur("studentData.parentGuardianDetails.parentCurrentAddress")}
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
									on:change={() => guardianTypeChange(type.name)}
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
				<div class="col-12">
					<div class="grid-12">
						<div class="col-2">
							<label for="guardianName">Guardian Name <span class="required">*</span></label>
							<input
								id="guardianName"
								type="text"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianName}
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianName"] && $submitAttempted ? "input-error" : ""}`}
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianName"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianName"]}</p>
							{/if}
						</div>

						<div class="col-2">
							<label for="guardianPhone">Guardian Phone <span class="required">*</span></label>
							<input
								id="guardianPhone"
								type="tel"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianPhone}
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
								class={`w-full ${$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianRelation"] && $submitAttempted ? "input-error" : ""}`}
							/>
							{#if $formErrors["studentData.parentGuardianDetails.guardianDetails.guardianRelation"] && $submitAttempted}
								<p class="error-text">{$formErrors["studentData.parentGuardianDetails.guardianDetails.guardianRelation"]}</p>
							{/if}
						</div>

						<div class="col-2">
							<label for="guardianOccupation">Guardian Occupation</label>
							<input id="guardianOccupation" type="text" bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianOccupation} />
						</div>

						<div class="col-2">
							<label for="guardianEducation">Guardian Education</label>
							<input id="guardianEducation" type="text" bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianEducation} />
						</div>

						<div class="col-6">
							<label for="guardianCurrentAddress">Guardian Current Address <span class="required">*</span></label>
							<textarea
								id="guardianCurrentAddress"
								bind:value={formData.studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress}
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

		<!-- Form Actions -->
		<div class="form-actions">
			<button class="btn" type="button" on:click={clearForm} disabled={$isLoading}> Clear </button>
			<button class="btn" type="submit" disabled={$isLoading}>
				{#if $isLoading}
					{#if $isUpdate}Updating...{:else}Saving...{/if}
				{:else if $isUpdate}Update{:else}Save{/if}
			</button>
		</div>
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
</style>
