<script lang="ts">
	import { z } from "zod";
	import { get, writable } from "svelte/store";
	import { isLoading } from "$lib/stores/loading";
	import { validateForm } from "$lib/utils/validate";
	import { showSnackbar } from "$lib/components/snackbar/store";
	import { closeModal, isUpdate } from "$lib/stores/modalStore";
	import { createSection, updateSection } from "$lib/services/section";
	import { generateAdmissionNo, getCurrentAcademicSession } from "$lib/utils/utils";
	import DatePicker from "$lib/components/DatePicker.svelte";

	export let classesWithSections: any;
	$: sectionsForSelectedClass = classesWithSections.find((cls: any) => cls.name === formData.class)?.sections ?? [];
	let availableSections: { _id: string; name: string }[] = [];

	// import DatePicker from './DatePicker.svelte';

	let selectedDate: Date | null = null;
    let selectedDateOfBirth: Date | null = null;

    let expandedSections = {
        academic: true,
        personal: false,
        contact: false,
        medical: false
    };
    function toggleSection(section: keyof typeof expandedSections) {
        expandedSections[section] = !expandedSections[section];
    }

	function handleDateChange(date: Date | null) {
		// console.log("Date selected:", date);
		selectedDate = date!;
        formData.academicSession =  getCurrentAcademicSession(selectedDate);
	}

    function handleBirthDateChange(date: Date | null) {
		// console.log("Date selected:", date);
		selectedDateOfBirth = date!;
        formData.dateOfBirth =  String(selectedDateOfBirth);
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
		academicSession: z.string(),
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
        academicSession: getCurrentAcademicSession(),
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
	}

	// function toggleSection(id: string) {
	// 	const el = document.getElementById(id);
	// 	if (el) el.classList.toggle("collapsed");
	// }

	function onSubmit(e: Event) {
        // console.log(formData);
		e.preventDefault();
		submitAttempted.set(true);
		validate();
		if (Object.keys(get(formErrors)).length === 0) {
			alert("Student registered successfully!");
			// console.log(formData);
		}
	}

	let academicExpanded = true;

	// function toggleSection() {
	// 	academicExpanded = !academicExpanded;
	// }
</script>

<form on:submit={onSubmit}>
    <!-- Academic Details Section -->
    <div class="section">
        <div class="section-header" on:click={() => toggleSection('academic')}>
            <span>Academic Details</span>
            <svg
                class="arrow-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style:transform={expandedSections.academic ? "rotate(0deg)" : "rotate(-90deg)"}
            >
                <path d="M8 9L12 13L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>

        <div class={`section-body grid-5 ${expandedSections.academic ? 'expanded' : 'collapsed'}`}>
            <!-- Academic fields here (keep your existing fields) -->
            <div class="input-wrapper">
                <label for="admissionNo">Admission No</label>
                <input id="admissionNo" type="text" name="admissionNo" class="w-full" bind:value={formData.admissionNo} readonly />
            </div>

            <div class="input-wrapper">
                <label for="admissionDate">Admission Date</label>
                <DatePicker bind:value={selectedDate} onChange={handleDateChange} defaultToday={true}/>
            </div>

            <div class="input-wrapper">
                <label for="rollNo">Roll Number</label>
                <input id="rollNo" type="text" name="rollNo" class="w-full" bind:value={formData.rollNo} />
            </div>

            <div class="input-wrapper">
                <label for="class">Class <span class="required">*</span></label>
                <select
                    id="class"
                    class={`w-full ${$formErrors.class && ($touched.class || $submitAttempted) ? 'input-error' : ''}`}
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

            <div class="input-wrapper">
                <label for="section">Section <span class="required">*</span></label>
                <select
                    id="section"
                    bind:value={formData.section}
                    disabled={!availableSections.length}
                    class={`w-full ${$formErrors.section && ($touched.section || $submitAttempted) ? 'input-error' : ''}`}
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

    <!-- Personal Details Section -->
    <div class="section">
        <div class="section-header" on:click={() => toggleSection('personal')}>
            <span>Personal Details</span>
            <svg
                class="arrow-icon"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style:transform={expandedSections.personal ? "rotate(0deg)" : "rotate(-90deg)"}
            >
                <path d="M8 9L12 13L16 9" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        </div>

        <div class={`section-body grid-5 ${expandedSections.personal ? 'expanded' : 'collapsed'}`}>
            <!-- Personal details fields -->
            <div class="input-wrapper">
                <label for="firstName">First Name <span class="required">*</span></label>
                <input
                    id="firstName"
                    type="text"
                    name="firstName"
                    class={`w-full ${$formErrors.firstName && ($touched.firstName || $submitAttempted) ? 'input-error' : ''}`}
                    bind:value={formData.firstName}
                />
                {#if $formErrors.firstName && $submitAttempted}
                    <p class="error-text">{$formErrors.firstName}</p>
                {/if}
            </div>

            <div class="input-wrapper">
                <label for="lastName">Last Name</label>
                <input id="lastName" type="text" name="lastName" class="w-full" bind:value={formData.lastName} />
            </div>

            <div class="input-wrapper">
                <label for="gender">Gender <span class="required">*</span></label>
                <select
                    id="gender"
                    class={`w-full ${$formErrors.gender && ($touched.gender || $submitAttempted) ? 'input-error' : ''}`}
                    bind:value={formData.gender}
                >
                    <option value="" disabled selected>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
                {#if $formErrors.gender && $submitAttempted}
                    <p class="error-text">{$formErrors.gender}</p>
                {/if}
            </div>

            <div class="input-wrapper">
                <label for="dateOfBirth">Date of Birth </label>
                <DatePicker bind:value={selectedDateOfBirth} onChange={handleBirthDateChange} />
                {#if $formErrors.dateOfBirth && $submitAttempted}
                <p class="error-text">{$formErrors.dateOfBirth}</p>
            {/if}
            </div>
<!-- 
            <div class="input-wrapper">
                <label for="dateOfBirth">Date of Birth <span class="required">*</span></label>
                <input
                    id="dateOfBirth"
                    type="date"
                    name="dateOfBirth"
                    class={`w-full ${$formErrors.dateOfBirth && ($touched.dateOfBirth || $submitAttempted) ? 'input-error' : ''}`}
                    bind:value={formData.dateOfBirth}
                    max={new Date().toISOString().split('T')[0]}
                />
                {#if $formErrors.dateOfBirth && $submitAttempted}
                    <p class="error-text">{$formErrors.dateOfBirth}</p>
                {/if}
            </div> -->

            <div class="input-wrapper">
                <label for="studentPhoto">Student Photo</label>
                <input id="studentPhoto" type="file" name="studentPhoto" class="w-full" />
            </div>
        </div>
    </div>

    <!-- Add similar sections for Contact and Medical details -->

    <div class="form-actions">
        <button class="btn btn-secondary" type="button" on:click={clearForm} disabled={$isLoading}>
            Clear
        </button>
        <button class="btn btn-primary" type="submit" disabled={$isLoading}>
            {#if $isLoading}
                {#if $isUpdate}Updating...{:else}Saving...{/if}
            {:else if $isUpdate}Update{:else}Save{/if}
        </button>
    </div>
</form>

<style>
    /* Base styles */
    /* .input-wrapper {
        margin-bottom: 1rem;
    } */

    label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: var(--text-primary);
    }

    .required {
        color: var(--error);
    }

    /* input, select {
        width: 100%;
        padding: 0.75rem;
        border: 1px solid var(--border);
        border-radius: 0.375rem;
        font-size: 0.875rem;
        transition: border-color 0.2s;
    } */

    /* input:focus, select:focus {
        outline: none;
        border-color: var(--primary);
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
    } */

    /* .input-error {
        border-color: var(--error);
    } */

    .error-text {
        color: var(--error);
        font-size: 0.75rem;
        margin-top: 0.25rem;
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
        margin-top: 2rem;
    }

    .btn {
        padding: 0.75rem 1.5rem;
        border-radius: 0.375rem;
        font-weight: 500;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .btn-primary {
        background-color: var(--primary);
        color: white;
        border: none;
    }

    .btn-primary:hover {
        background-color: var(--primary-dark);
    }

    .btn-primary:disabled {
        background-color: var(--primary-light);
        cursor: not-allowed;
    }

    .btn-secondary {
        background-color: white;
        color: var(--text-primary);
        border: 1px solid var(--border);
    }

    .btn-secondary:hover {
        background-color: var(--bg-secondary);
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
</style>


<div class="container">
    <div class="box box1"></div> <!-- Large box left -->
    <div class="box box2"></div> <!-- Top middle -->
    <div class="box box3"></div> <!-- Top right -->
    <div class="box box4"></div> <!-- Bottom middle -->
    <div class="box box5"></div> <!-- Bottom right -->
    <div class="box box6"></div> <!-- Full width bottom -->
    <div class="box box7"></div> <!-- Full width bottom -->
</div>

<!-- <style>
    .container {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
        grid-template-rows: auto auto;
        gap: 10px;
        border: 3px solid black;
        padding: 10px;
    
        box-sizing: border-box;
    }

    .box {
        border: 3px solid black;
        background-color: white;
    }

    .box1 {
        grid-row: span 2;
    }

    .box6 {
        grid-column: span 2;
    }
</style> -->
