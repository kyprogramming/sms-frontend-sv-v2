<script lang="ts">
	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createSection, updateSection } from "$lib/services/section";
	import { generateAdmissionNo } from "$lib/utils/utils";
	import DatePicker from "$lib/components/DatePicker.svelte";

	export let classesWithSections: any;
	$: sectionsForSelectedClass = classesWithSections.find((cls: any) => cls.name === formData.class)?.sections ?? [];
	let availableSections: { _id: string; name: string }[] = [];

	// import DatePicker from './DatePicker.svelte';

	let selectedDate: Date | null = null;

	function handleDateChange(date: Date | null) {
		console.log("Date selected:", date);
		selectedDate = date;
	}

	// Props
	// export let onRefreshPage: () => void;
	// export let dataToUpdate: { _id: string; name: string } | null = null;

	// Zod schema
	// Validation schema
	const studentSchema = z.object({
		admissionNo: z.string().nonempty("Admission No is required"), //
		rollNo: z.string().optional(), //
		class: z.string().nonempty("Class is required"), //
		section: z.string().nonempty("Section is required"), //
		firstName: z.string().nonempty("First Name is required"),
		lastName: z.string().optional(),
		gender: z.string().nonempty("Gender is required"),
		dateOfBirth: z.string().nonempty("Date of Birth is required"),
		category: z.string().optional(),
		religion: z.string().optional(),
		caste: z.string().optional(),
		mobileNumber: z.string().optional(),
		email: z.string().email("Invalid email").optional(),
		admissionDate: z.string(),
		studentPhoto: z.any().optional(),
		bloodGroup: z.string().optional(),
		house: z.string().optional(),
		height: z.string().optional(),
		weight: z.string().optional(),
		measurementDate: z.string(),
		medicalHistory: z.string().optional(),
	});

	type StudentFormData = z.infer<typeof studentSchema>;

	// Reactive form state
	let formData: StudentFormData = {
		admissionNo: generateAdmissionNo(),
		rollNo: "",
		class: "",
		section: "",
		firstName: "",
		lastName: "",
		gender: "",
		dateOfBirth: "",
		category: "",
		religion: "",
		caste: "",
		mobileNumber: "",
		email: "",
		admissionDate: new Date().toISOString().split("T")[0],
		studentPhoto: null,
		bloodGroup: "",
		house: "",
		height: "",
		weight: "",
		measurementDate: new Date().toISOString().split("T")[0],
		medicalHistory: "",
	};

	function clearForm() {
		formData = {
			...formData,
			rollNo: "",
			class: "",
			section: "",
			firstName: "",
			lastName: "",
			gender: "",
			dateOfBirth: "",
			category: "",
			religion: "",
			caste: "",
			mobileNumber: "",
			email: "",
			admissionDate: new Date().toISOString().split("T")[0],
			studentPhoto: null,
			bloodGroup: "",
			house: "",
			height: "",
			weight: "",
			measurementDate: new Date().toISOString().split("T")[0],
			medicalHistory: "",
		};
	}
	let error = "";

	const formErrors = writable<Partial<Record<keyof StudentFormData, string>>>({});
	const touched = writable<Partial<Record<keyof StudentFormData, boolean>>>({});
	const submitAttempted = writable(false);
	// Prefill data if editing
	// function populateFormData() {
	// 	if (dataToUpdate) {
	// 		formData = {
	// 			name: dataToUpdate.name,
	// 		};
	// 	}
	// }
	// $: populateFormData();

	function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement)?.value || "";
		formData.class = selected;
		formData.section = ""; // Mark class as touched
		$touched.class = true; // Clear error for class
		$formErrors.class = "";
		const selectedClass = classesWithSections.find((cls: any) => cls.name === selected);
		availableSections = selectedClass?.sectionIds || [];
		console.log("availableSections:", availableSections);
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
	}

	// function toggleSection(id: string) {
	// 	const el = document.getElementById(id);
	// 	if (el) el.classList.toggle("collapsed");
	// }

	function onSubmit(e: Event) {
		e.preventDefault();
		submitAttempted.set(true);
		validate();
		if (Object.keys(get(formErrors)).length === 0) {
			alert("Student registered successfully!");
			console.log(formData);
		}
	}

	let academicExpanded = true;

	function toggleSection() {
		academicExpanded = !academicExpanded;
	}
</script>

<form on:submit={onSubmit}>
	<!-- Section: Academic Info -->

	<DatePicker value={new Date(2023, 5, 15)} onChange={handleDateChange}  />
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<div class="section">
		<!-- Section Header with toggle and arrow -->
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div class="section-header" on:click={toggleSection}>
			<span>Academic Details</span>
			<svg
				class="arrow-icon"
				width="20"
				height="20"
				viewBox="0 0 24 24"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				style:transform={academicExpanded ? "rotate(0deg)" : "rotate(-90deg)"}
			>
				<path d="M8 9L12 13L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</div>

		<!-- Collapsible body -->
		<div class={`section-body grid-5 ${academicExpanded ? "expanded" : "collapsed"}`}>
			<div class="input-wrapper">
				<label for="admissionNo">Admission No</label>
				<input id="admissionNo" type="text" name="admissionNo" class={`w-full`} bind:value={formData.admissionNo} readonly />
			</div>

			<div class="input-wrapper">
				<label for="admissionDate">Admission Date</label>
				<input
					id="admissionDate"
					type="date"
					name="admissionDate"
					bind:value={formData.admissionDate}
					class="w-full styled-date-input"
					max={new Date().toISOString().split("T")[0]}
				/>
			</div>

            <div class="input-wrapper">
				<label for="admissionDate">Admission Date</label>
				<DatePicker bind:value={selectedDate} onChange={handleDateChange}/>
			</div>

			

			<!-- Or with a default date -->

			<div class="input-wrapper">
				<label for="rollNo">Roll Number</label>
				<input id="rollNo" type="text" name="rollNo" class={`w-full`} bind:value={formData.rollNo} />
			</div>
			<!-- Class Dropdown -->
			<div class="input-wrapper">
				<label for="class">Class <span class="required">*</span></label>
				<select
					id="class"
					class={`w-full ${$formErrors.class && ($touched.class || $submitAttempted) ? "input-error" : ""}`}
					bind:value={formData.class}
					on:change={handleClassChange}
				>
					<option value="" disabled selected>Select Class</option>
					{#each classesWithSections as cls}
						<option value={cls.name}>{cls.name}</option>
					{/each}
				</select>
				{#if $formErrors.class && $submitAttempted}
					<p class="error-text">{$formErrors.class}</p>
				{/if}
			</div>

			<!-- Section Dropdown -->
			<div class="input-wrapper">
				<label for="section">Section <span class="required">*</span></label>
				<select
					id="section"
					bind:value={formData.section}
					disabled={!availableSections.length}
					class={`w-full ${$formErrors.section && ($touched.section || $submitAttempted) ? "input-error" : ""}`}
					on:change={handleSectionChange}
				>
					<option value="" disabled selected>Select Section</option>
					{#each availableSections as section}
						<option value={section._id}>{section.name}</option>
					{/each}
				</select>
				{#if $formErrors.section && $submitAttempted}
					<p class="error-text">{$formErrors.section}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Section: Personal Info -->
	<!-- <div class="section">
		<div class="section-header" on:click={() => toggleSection("personal")}>Personal Info</div>
		<div class="section-body" id="personal">
			<div class="input-wrapper">
				<label>First Name *</label>
				<input bind:value={formData.firstName} on:input={(e) => handleChange("firstName", e.target.value)} />
				{#if $formErrors.firstName && $submitAttempted}<p class="error-text">{$formErrors.firstName}</p>{/if}
			</div>
			<div class="input-wrapper">
				<label>Last Name</label>
				<input bind:value={formData.lastName} on:input={(e) => handleChange("lastName", e.target.value)} />
			</div>
			<div class="input-group">
				<label>Gender *</label>
				<select bind:value={formData.gender} on:change={(e) => handleChange("gender", e.target.value)}>
					<option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option>
				</select>
				{#if $formErrors.gender && $submitAttempted}<p class="error-text">{$formErrors.gender}</p>{/if}
			</div>
			<div class="input-group">
				<label>Date of Birth *</label>
				<input type="date" bind:value={formData.dateOfBirth} on:input={(e) => handleChange("dateOfBirth", e.target.value)} />
				{#if $formErrors.dateOfBirth && $submitAttempted}<p class="error-text">{$formErrors.dateOfBirth}</p>{/if}
			</div>
			<div class="input-group">
				<label>Category</label>
				<input bind:value={formData.category} on:input={(e) => handleChange("category", e.target.value)} />
			</div>
			<div class="input-group">
				<label>Religion</label>
				<input bind:value={formData.religion} on:input={(e) => handleChange("religion", e.target.value)} />
			</div>
			<div class="input-group">
				<label>Caste</label>
				<input bind:value={formData.caste} on:input={(e) => handleChange("caste", e.target.value)} />
			</div>
			<div class="input-group">
				<label>Mobile</label>
				<input bind:value={formData.mobileNumber} on:input={(e) => handleChange("mobileNumber", e.target.value)} />
			</div>
			<div class="input-group">
				<label>Email</label>
				<input type="email" bind:value={formData.email} on:input={(e) => handleChange("email", e.target.value)} />
				{#if $formErrors.email && $submitAttempted}<p class="error-text">{$formErrors.email}</p>{/if}
			</div>
		</div>
	</div> -->

	<!-- Section: Medical Info -->
	<!-- <div class="section">
		<div class="section-header" on:click={() => toggleSection("medical")}>Medical Info</div>
		<div class="section-body" id="medical">
			<div class="input-group"><label>Height</label><input bind:value={formData.height} /></div>
			<div class="input-group"><label>Weight</label><input bind:value={formData.weight} /></div>
			<div class="input-group">
				<label>Blood Group</label>
				<select bind:value={formData.bloodGroup}><option value="">Select</option><option value="A+">A+</option><option value="B+">B+</option></select>
			</div>
			<div class="input-group"><label>Medical History</label><textarea bind:value={formData.medicalHistory}></textarea></div>
		</div>
	</div> -->

	<div class="flex-items-center" style="justify-content:end;">
		<button class="btn ripple" type="button" on:click={clearForm} disabled={$isLoading} style="background-color: var(--primary-light); align-self: right;"> Clear </button>
		<button class="btn ripple" type="submit" disabled={$isLoading}>
			{#if $isLoading}
				{#if $isUpdate}Updating...{:else}Saving...{/if}
			{:else if $isUpdate}Update{:else}Save{/if}
		</button>
	</div>
</form>

<!-- <div class="input-wrapper">
                <label for="name">Subject Name <span class="required">*</span></label>
                <input
                    id="name"
                    type="text"
                    name="name"
                    placeholder="Enter subject name"
                    class={`w-full ${$formErrors.name && ($touched.name || $submitAttempted) ? "input-error" : ""}`}
                    bind:value={formData.name}
                    on:input={(e) => handleChange("name", (e.target as HTMLInputElement).value)}
                    on:blur={() => handleChange("name", formData.name)}
                />
                {#if $formErrors.name && ($touched.name || $submitAttempted)}
                    <p class="error-text">{$formErrors.name}</p>
                {/if}
            </div> -->

<!-- <div class="input-group">
				<label>Admission No *</label>
				<input bind:value={formData.admissionNo} readonly />
			</div> -->

<!-- <div class="input-group">
				<label>Roll Number</label>
				<input bind:value={formData.rollNo} on:input={(e) => handleChange("rollNo", e.target.value)} />
			</div>
             -->

<style>
	.input-group {
		margin-bottom: 12px;
	}
	label {
		display: block;
		margin-bottom: 5px;
	}

	.error-text {
		color: red;
		font-size: 0.85em;
		margin-top: 4px;
	}

	.section {
		border: 1px solid #ccc;
		border-radius: 8px;
		margin-bottom: 1rem;
		/* overflow: hidden; */
	}

	/* Header styles */
	.section-header {
		cursor: pointer;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.6rem;
		background-color: var(--gray1);
		font-weight: bold;
		transition: background-color 0.3s;
	}

	.section-header:hover {
		background-color: #e0e0e0;
	}

	/* Arrow icon */
	.arrow-icon {
		transition: transform 0.3s ease;
	}

	/* Body animation */
	.section-body {
		max-height: 1000px;
		/* overflow: hidden; */
		transition:
			max-height 0.4s ease-in-out,
			opacity 0.3s ease;
		opacity: 1;
		padding: 1rem;
	}

	.section-body.collapsed {
		max-height: 0;
		opacity: 0;
		padding: 0 1rem;
	}

	/* .styled-date-input {
  width: 100%;
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  color: #333;
} */

	/* Grid layout */
	.grid-5 {
		display: grid;
		grid-template-columns: repeat(5, 1fr);
		gap: 1rem;
	}

	@media (max-width: 1024px) {
		.section-body.grid-4 {
			grid-template-columns: repeat(2, 1fr);
		}
	}

	@media (max-width: 600px) {
		.section-body.grid-4 {
			grid-template-columns: 1fr;
		}
	}

	.section-body.collapsed {
		display: none;
	}

	.btn-group {
		text-align: right;
		margin-top: 20px;
	}
	@media (max-width: 600px) {
		.form-container {
			padding: 10px;
		}
		.input-group {
			margin-bottom: 16px;
		}
	}
</style>
