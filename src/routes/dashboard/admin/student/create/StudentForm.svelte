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

	const studentSchema = z.object({
		admissionNo: z.string().min(1, "Admission number is required"),
		admissionDate: z.string().min(1, "Admission date is required"),
		academicSession: z.string().min(1, "Academic session is required"),
		rollNo: z.string().optional(),
		class: z.string().min(1, "Class is required"),
		section: z.string().min(1, "Section is required"),
		studentProfile: z.object({
			firstName: z.string().min(1, "First name is required").min(2, "First name must be at least 2 characters"),
			address: z.object({
				street: z.string().optional(),
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
			address: {
				street: "",
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
				address: {
					street: "",
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

	function handleDateChange(date: Date | null) {
		selectedDate = date!;
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
		</div>
	</div>

	<!-- Student Address -->
	<div class="card-wrapper">
		<h1>Student Address</h1>
		<div class="grid-12">
			<div class="col-4">
				<label for="street">House No/Street</label>
				<input id="street" type="text" name="street" class="w-full" bind:value={formData.studentProfile.address.street} />
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
