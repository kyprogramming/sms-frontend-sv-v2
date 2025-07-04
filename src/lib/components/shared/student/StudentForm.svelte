<script lang="ts">
	// Import statements grouped by type
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';

	import { goto } from '$app/navigation';
	import { env } from '$env/dynamic/public';

	// UI Components
	import DatePicker from '$lib/components/common/DatePicker.svelte';
	import DatePicker2 from '$lib/components/common/DatePicker2.svelte';
	import TagInput from '$lib/components/common/TagInput.svelte';
	import LoaderIcon from '$lib/components/common/LoaderIcon.svelte';
	import ImageUploader from '$lib/components/common/ImageUploader.svelte';
	import UploadDocument from '$lib/components/common/UploadDocument.svelte';

	// Icons
	import { BrushCleaning, PlusCircle, Save } from '@lucide/svelte';

	// Constants and Config
	import { BLOOD_GROUPS, CASTE_CATEGORIES, GENDERS, GUARDIAN_TYPE } from '$lib/utils/constants';
	import { MESSAGES } from '$lib/utils/messages';

	// Services and Utilities
	import { createStudent, updateStudent } from '$lib/services/student';
	import { initializeStudentFormPayload, validateStudentForm } from './studentValidation';
	import { isEqual } from '$lib/utils/utils';

	// Stores
	import { isLoading } from '$lib/stores/loading';
	import { formErrors } from '$lib/stores/formStore';
	import { showSnackbar } from '$lib/components/snackbar/store';

	// Types
	import type { StudentFormPayload } from '$lib/schemas/student.schema';
	import { page } from '$app/state';

	// Component Props
	let { action } = $props();

	// Derived Data
	const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	const pageTitle = `${schoolName} - Student Registration - ${action === 'update' ? ' Update' : 'New'}`;

	// State Management
	const studentData = page.data.studentData?.data.student || null;
	const feeAssignments = page.data.studentData?.data.feeAssignments || null;
	const feeMasterData = page.data.feeMasters?.data || [];

	let classList = page.data?.classList || [];
	let classSections: { _id: string; name: string }[] = $state([]);

	let selectedFeeMasterAssignmentIds: string[] = $state([]);

    // console.log('StudentForm - studentData:', $state.snapshot(studentData));

	let selectedFile: File | null = $state(null);

	let formData: StudentFormPayload = $state(initializeStudentFormPayload());
	let touched: Record<string, boolean> = $state({});
	let formSubmitted = $state(false);

	onMount(() => {
		formErrors.set({});
		// Initialize form data based on action
		if (action === 'update' && studentData) {
			formData = { studentData: { ...studentData }, userData: { ...studentData.userId }, feeMasterAssignments: studentData?.feeMasterAssignments || [] };
			classSections = studentData.classId ? classList.find((cls: any) => cls._id === studentData.classId._id)?.sectionIds || [] : [];
            formData.studentData.classId = studentData.classId._id || '';
            formData.studentData.sectionId = studentData.sectionId._id || '';
			formData.feeMasterAssignments = studentData.feeMasterAssignments || [];
			selectedFeeMasterAssignmentIds = feeAssignments?.map((assignment: any) => assignment.feeMasterId._id) || [];
			// console.log('Form Data on Mount:', formData);
		}
		touched = {};
	});

	function handleResetForm() {
		if (action === 'update' && studentData) {
			formData = { studentData: { ...studentData }, userData: { ...studentData.userId }, feeMasterAssignments: studentData?.feeMasterAssignments || [] };
			classSections = studentData.classId ? classList.find((cls: any) => cls._id === studentData.classId._id)?.sectionIds || [] : [];
			formData.studentData.selectedFeeDiscountIds = studentData.selectedFeeDiscountIds || [];
			selectedFeeMasterAssignmentIds = feeAssignments?.map((assignment: any) => assignment.feeMasterId._id) || [];
		} else {
			formData = initializeStudentFormPayload();
			classSections = [];
		}

		formErrors.set({});
		formSubmitted = false;
		touched = {};
	}

	function handleGuardianTypeChange(type: any) {
		formData.studentData.parentGuardianDetails.primaryGuardian = type;
		$formErrors['studentData.parentGuardianDetails.primaryGuardian'] = '';
		if (type === 'Other' && action === 'update') {
			formData.studentData.parentGuardianDetails = studentData.parentGuardianDetails;
		}
		validateStudentForm(formData);
	}

	function handleClassChange(e: Event) {
		const selected = (e.target as HTMLSelectElement).value || '';
		formData.studentData.classId = selected;
		formData.studentData.sectionId = '';
		const selectedClass = classList.find((cls: any) => cls._id === selected);
		classSections = selectedClass?.sectionIds || [];
		handleBlur('studentData.classId');
	}

	function handleSectionChange(e: Event) {
		formData.studentData.sectionId = (e.target as HTMLSelectElement).value || '';
	}

	function handleBlur(field: keyof any) {
		touched = { ...touched, [field]: true };
		validateStudentForm(formData);
	}

	function handleDatePickerBlur(field: keyof any, isOpen: boolean) {
		// Only validate if the date picker isn't open
		setTimeout(() => {
			if (!isOpen) {
				touched = { ...touched, [field]: true };
				validateStudentForm(formData);
			}
		}, 100);
	}

	function handleImageSelect(file: File | null) {
		selectedFile = file;
	}

	function generateFeeAssignments(options?: { studentId?: string; academicYear?: string }): FeeAssignment[] {
        return selectedFeeMasterAssignmentIds.map((id) => {
			const matched = feeMasterData.find((feeMaster:any) => feeMaster._id === id);

			if (!matched) {
				throw new Error(`FeeMaster with ID ${id} not found in feeMastData.`);
			}

			return {
				studentId: options?.studentId,
				feeMasterId: matched._id,
				amount: matched.amount,
				dueDate: matched.dueDate,
				isPaid: false,
				academicYear: options?.academicYear,
			};
		});
	}

	async function onSubmit(event: Event) {
		event.preventDefault();
		formSubmitted = true;

        const isValid = validateStudentForm(formData);
		const feeMasterAssignments = generateFeeAssignments( {
			studentId: formData.studentData._id || '',
			academicYear: formData.studentData.academicYear,
		});

		formData.feeMasterAssignments = feeMasterAssignments;
		console.log('formData', formData);
		if (!isValid) return;

		if (action === 'update' && studentData) {
			const isUnChanged = isEqual(studentData, formData);
			if (isUnChanged) {
				showSnackbar({ message: MESSAGES.FORM.NO_CHANGES, type: 'warning' });
				return;
			}
			await updateStudent(studentData._id, formData);
			showSnackbar({ message: 'Student updated successfully', type: 'success' });
			await goto('/admin/student/list');
		} else {
			await createStudent(formData);
			showSnackbar({ message: 'Student created successfully', type: 'success' });
			await goto('/admin/student/list');
		}
	}

	function removeDocument(index: number) {
		formData.studentData.documents = formData.studentData.documents?.filter((_, i) => i !== index);
	}

	function updateDocument(index: number, data: { category: string; photoUrl: string }) {
		formData.studentData.documents = formData.studentData.documents?.map((section, i) => (i === index ? data : section));
	}

	function addNewDocument(e: MouseEvent) {
		if (formData.studentData.documents?.length! < 12) {
			formData.studentData.documents = [...(formData.studentData.documents ?? []), { title: '', category: '', url: '' }];
		} else {
			showSnackbar({ message: 'Can not add more than 12 documents', type: 'info' });
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<form onsubmit={onSubmit}>
	<!-- Student Academic Detail -->
	<div class="card-wrapper">
		<h1>Academic Detail</h1>
		<div class="grid-12">
			<!-- Academic Year -->
			<div class="col-2">
				<label for="academicYear">Academic Year</label>
				<input id="academicYear" type="text" bind:value={formData.studentData.academicYear} readonly disabled />
			</div>
			<!-- Admission No -->
			<div class="col-2">
				<label for="admissionNo">Admission No</label>
				<input id="admissionNo" type="text" bind:value={formData.studentData.admissionNo} />
			</div>
			<!-- Admission Date -->
			<div class="col-2">
				<label for="studentData.admissionDate">Admission Date</label>
				<DatePicker2
					id="studentData.admissionDate"
					title="date of joining"
					bind:value={formData.studentData.admissionDate}
					onBlur={(isOpen) => handleDatePickerBlur('staffData.profile.dateOfJoining', isOpen)}
					defaultToday={true} />
			</div>
			<!-- Student Class -->
			<div class="col-2">
				<label for="classId">Class <span class="required">*</span></label>
				<select
					id="classId"
					class={`w-full ${formData.studentData.classId === '' ? 'placeholder-gray' : ''} ${$formErrors['studentData.classId'] && (touched['studentData.classId'] || formSubmitted) ? 'input-error' : ''}`}
					bind:value={formData.studentData.classId}
					onchange={handleClassChange}
					onblur={handleClassChange}>
					<option value="" selected>Select class</option>
					{#each classList as cls}
						<option value={cls._id}>{cls.name}</option>
					{/each}
				</select>
				{#if $formErrors['studentData.classId'] && (touched['studentData.classId'] || formSubmitted)}
					<p class="error-text">{$formErrors['studentData.classId']}</p>
				{/if}
			</div>
			<!-- Student Section -->
			<div class="col-2">
				<label for="sectionId">Section <span class="required">*</span></label>
				<select
					id="sectionId"
					bind:value={formData.studentData.sectionId}
					disabled={!classSections.length}
					class={`w-full ${formData.studentData.sectionId === '' ? 'placeholder-gray' : ''} ${$formErrors['studentData.sectionId'] && (touched['studentData.sectionId'] || formSubmitted) ? 'input-error' : ''}`}
					onchange={handleSectionChange}
					onblur={() => handleBlur('studentData.sectionId')}>
					<option value="" selected>Select section</option>
					{#each classSections as section}
						<option value={section._id}>{section.name}</option>
					{/each}
				</select>
				{#if $formErrors['studentData.sectionId'] && (touched['studentData.sectionId'] || formSubmitted)}
					<p class="error-text">{$formErrors['studentData.sectionId']}</p>
				{/if}
			</div>
			<!-- Student Roll No -->
			<div class="col-2">
				{@render renderInput('studentData.rollNo', 'Roll Number', false, 'text', formData.studentData.rollNo ?? '', (val) => (formData.studentData.rollNo = val), 20)}
			</div>
		</div>
	</div>

	<!-- Student Profile Details-->
	<div class="card-wrapper">
		<h1>Student Profile</h1>
		<div class="grid-12">
			<!-- Student First Name-->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.firstName',
					'First Name',
					true,
					'text',
					formData.studentData.profile.firstName,
					(val) => (formData.studentData.profile.firstName = val),
					20,
				)}
			</div>
			<!-- Student Middle Name-->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.middleName',
					'Middle Name',
					false,
					'text',
					formData.studentData.profile.middleName ?? '',
					(val) => (formData.studentData.profile.middleName = val),
					20,
				)}
			</div>
			<!-- Student Last Name-->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.lastName',
					'Last Name',
					true,
					'text',
					formData.studentData.profile.lastName ?? '',
					(val) => (formData.studentData.profile.lastName = val),
					20,
				)}
			</div>
			<!-- Gender -->
			<div class="col-2">
				<label for="gender">Gender <span class="required">*</span></label>
				<select
					class={`w-full ${formData.studentData.profile.gender === '' ? 'placeholder-gray' : ''} ${$formErrors['studentData.profile.gender'] && (touched['studentData.profile.gender'] || formSubmitted) ? 'input-error' : ''}`}
					bind:value={formData.studentData.profile.gender}
					onblur={() => handleBlur('studentData.profile.gender')}
					onchange={() => handleBlur('studentData.profile.gender')}>
					<option value="" selected>Select gender</option>
					{#each GENDERS as gender}
						<option value={gender.name}>{gender.name}</option>
					{/each}
				</select>
				{#if $formErrors['studentData.profile.gender'] && (touched['studentData.profile.gender'] || formSubmitted)}
					<p class="error-text">{$formErrors['studentData.profile.gender']}</p>
				{/if}
			</div>
			<!-- Date of Birth -->
			<div class="col-2">
				<label for="studentData.profile.dob">Date of Birth <span class="required">*</span></label>
				<DatePicker2
					id="studentData.profile.dob"
					title="date of birth"
					bind:value={formData.studentData.profile.dob}
					onBlur={(isOpen) => handleDatePickerBlur('studentData.profile.dob', isOpen)}
					cls={`w-full ${$formErrors['studentData.profile.dob'] && (touched['studentData.profile.dob'] || formSubmitted) ? 'input-error' : ''}`} />
				{#if $formErrors['studentData.profile.dob'] && (touched['studentData.profile.dob'] || formSubmitted)}
					<p class="error-text">{$formErrors['studentData.profile.dob']}</p>
				{/if}
			</div>
			<!-- Category -->
			<div class="col-2">
				<label for="category">Category</label>
				<select id="category" class={`w-full ${formData.studentData.profile.category === '' ? 'placeholder-gray' : ''}`} bind:value={formData.studentData.profile.category}>
					<option value="" selected>Select category</option>
					{#each CASTE_CATEGORIES as category}
						<option value={category.name}>{category.name}</option>
					{/each}
				</select>
			</div>
			<!-- Religion -->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.religion',
					'Religion',
					false,
					'text',
					formData.studentData.profile.religion ?? '',
					(val) => (formData.studentData.profile.religion = val),
					20,
				)}
			</div>
			<!-- Caste -->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.caste',
					'Caste',
					false,
					'text',
					formData.studentData.profile.caste ?? '',
					(val) => (formData.studentData.profile.caste = val),
					20,
				)}
			</div>
			<!-- Mobile No -->
			<div class="col-2">
				{@render renderInput('userData.mobile', 'Mobile No', false, 'tel', formData.userData.mobile ?? '', (val) => (formData.userData.mobile = val), 10)}
			</div>
			<!-- Email -->
			<div class="col-2">
				{@render renderInput('userData.email', 'Email', false, 'text', formData.userData.email ?? '', (val) => (formData.userData.email = val), 50)}
			</div>
		</div>
	</div>

	<!-- Student Address Details -->
	<div class="card-wrapper">
		<h1>Student Address</h1>
		<div class="grid-12">
			<!-- House No/Street -->
			<div class="col-4">
				{@render renderInput(
					'studentData.profile.address.street',
					'House No/Street',
					true,
					'text',
					formData.studentData.profile.address.street ?? '',
					(val) => (formData.studentData.profile.address.street = val),
					100,
				)}
			</div>
			<!-- City -->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.address.city',
					'City',
					true,
					'text',
					formData.studentData.profile.address.city ?? '',
					(val) => (formData.studentData.profile.address.city = val),
					20,
				)}
			</div>
			<!-- State -->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.address.state',
					'State',
					true,
					'text',
					formData.studentData.profile.address.state ?? '',
					(val) => (formData.studentData.profile.address.state = val),
					20,
				)}
			</div>
			<!-- Postal Code -->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.address.postalCode',
					'Postal Code',
					true,
					'text',
					formData.studentData.profile.address.postalCode ?? '',
					(val) => (formData.studentData.profile.address.postalCode = val),
					10,
				)}
			</div>
			<!-- Country -->
			<div class="col-2">
				{@render renderInput(
					'studentData.profile.address.country',
					'Country',
					true,
					'text',
					formData.studentData.profile.address.country ?? '',
					(val) => (formData.studentData.profile.address.country = val),
					20,
				)}
			</div>
		</div>
	</div>

	<!-- Student Medical Detail -->
	<div class="card-wrapper">
		<h1>Medical Detail</h1>
		<div class="grid-12">
			<!-- Blood Group -->
			<div class="col-1">
				<label for="bloodGroup">Blood Group</label>
				<select
					id="bloodGroup"
					class={`w-full ${formData.studentData.medicalDetails.bloodGroup === '' ? 'placeholder-gray' : ''}`}
					bind:value={formData.studentData.medicalDetails.bloodGroup}>
					<option value="" selected>Select B/G</option>
					{#each BLOOD_GROUPS as group}
						<option value={group.name}>{group.name}</option>
					{/each}
				</select>
			</div>
			<!-- Height (CM) -->
			<div class="col-1">
				{@render renderInput(
					'studentData.medicalDetails.height',
					'Height (CM)',
					false,
					'text',
					formData.studentData.medicalDetails.height ?? '',
					(val) => (formData.studentData.medicalDetails.height = val),
					3,
				)}
			</div>
			<!-- Weight (KG) -->
			<div class="col-1">
				{@render renderInput(
					'studentData.medicalDetails.weight',
					'Weight (KG)',
					false,
					'text',
					formData.studentData.medicalDetails.weight ?? '',
					(val) => (formData.studentData.medicalDetails.weight = val),
					3,
				)}
			</div>
			<!-- Eye Sight -->
			<div class="col-1">
				{@render renderInput(
					'studentData.medicalDetails.eyeSight',
					'Eye Sight',
					false,
					'text',
					formData.studentData.medicalDetails.eyeSight ?? '',
					(val) => (formData.studentData.medicalDetails.eyeSight = val),
					10,
				)}
			</div>
			<!-- Measurement Date -->
			<div class="col-2">
				<label for="measurementDate">Measurement Date</label>
				<DatePicker
					id="measurementDate"
					bind:value={formData.studentData.medicalDetails.measurementDate}
					onClear={() => {
						formData.studentData.medicalDetails.measurementDate = '';
					}} />
			</div>
			<!-- Medical History -->
			<div class="col-6">
				{@render renderInput(
					'studentData.medicalDetails.medicalHistory',
					'Medical History',
					false,
					'text',
					formData.studentData.medicalDetails.medicalHistory ?? '',
					(val) => (formData.studentData.medicalDetails.medicalHistory = val),
					50,
				)}
			</div>
			<!-- Allergies -->
			<div class="col-6">
				<label for="allergies">Allergies</label>
				<TagInput id="allergies" fieldName={'allergies'} bind:tags={formData.studentData.medicalDetails.allergies} />
			</div>
			<!-- Medical Conditions -->
			<div class="col-6">
				<label for="medicalConditions">Medical Conditions</label>
				<TagInput id="medicalConditions" fieldName={'medical conditions'} bind:tags={formData.studentData.medicalDetails.medicalConditions} />
			</div>
		</div>
	</div>

	<!-- Student Parent/Guardian Detail -->
	<div class="card-wrapper">
		<h1>Parent/Guardian Detail</h1>
		<div class="grid-12">
			<!-- Father First Name -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.fatherDetails.fatherFirstName',
					'Father First Name',
					true,
					'text',
					formData.studentData.parentGuardianDetails.fatherDetails.fatherFirstName ?? '',
					(val) => (formData.studentData.parentGuardianDetails.fatherDetails.fatherFirstName = val),
					20,
				)}
			</div>
			<!-- Father Last Name -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.fatherDetails.fatherLastName',
					'Father Last Name',
					true,
					'text',
					formData.studentData.parentGuardianDetails.fatherDetails.fatherLastName ?? '',
					(val) => (formData.studentData.parentGuardianDetails.fatherDetails.fatherLastName = val),
					20,
				)}
			</div>
			<!-- Father Phone -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.fatherDetails.fatherPhone',
					'Father Phone',
					true,
					'text',
					formData.studentData.parentGuardianDetails.fatherDetails.fatherPhone ?? '',
					(val) => (formData.studentData.parentGuardianDetails.fatherDetails.fatherPhone = val),
					10,
				)}
			</div>
			<!-- Father Email -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.fatherDetails.fatherEmail',
					'Father Email',
					false,
					'text',
					formData.studentData.parentGuardianDetails.fatherDetails.fatherEmail ?? '',
					(val) => (formData.studentData.parentGuardianDetails.fatherDetails.fatherEmail = val),
					30,
				)}
			</div>
			<!-- Father Occupation -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.fatherDetails.fatherOccupation',
					'Father Occupation',
					false,
					'text',
					formData.studentData.parentGuardianDetails.fatherDetails.fatherOccupation ?? '',
					(val) => (formData.studentData.parentGuardianDetails.fatherDetails.fatherOccupation = val),
					30,
				)}
			</div>
			<!-- Father Education -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.fatherDetails.fatherEducation',
					'Father Education',
					false,
					'text',
					formData.studentData.parentGuardianDetails.fatherDetails.fatherEducation ?? '',
					(val) => (formData.studentData.parentGuardianDetails.fatherDetails.fatherEducation = val),
					20,
				)}
			</div>
			<!-- Mother First Name -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.motherDetails.motherFirstName',
					'Mother First Name',
					true,
					'text',
					formData.studentData.parentGuardianDetails.motherDetails.motherFirstName ?? '',
					(val) => (formData.studentData.parentGuardianDetails.motherDetails.motherFirstName = val),
					20,
				)}
			</div>
			<!-- Mother Last Name -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.motherDetails.motherLastName',
					'Mother Last Name',
					true,
					'text',
					formData.studentData.parentGuardianDetails.motherDetails.motherLastName ?? '',
					(val) => (formData.studentData.parentGuardianDetails.motherDetails.motherLastName = val),
					20,
				)}
			</div>
			<!-- Mother Phone -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.motherDetails.motherPhone',
					'Mother Phone',
					true,
					'tel',
					formData.studentData.parentGuardianDetails.motherDetails.motherPhone ?? '',
					(val) => (formData.studentData.parentGuardianDetails.motherDetails.motherPhone = val),
					10,
				)}
			</div>
			<!-- Mother Email -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.motherDetails.motherEmail',
					'Mother Email',
					false,
					'email',
					formData.studentData.parentGuardianDetails.motherDetails.motherEmail ?? '',
					(val) => (formData.studentData.parentGuardianDetails.motherDetails.motherEmail = val),
					30,
				)}
			</div>
			<!-- Mother Occupation -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.motherDetails.motherEmail',
					'Mother Occupation',
					false,
					'text',
					formData.studentData.parentGuardianDetails.motherDetails.motherOccupation ?? '',
					(val) => (formData.studentData.parentGuardianDetails.motherDetails.motherOccupation = val),
					20,
				)}
			</div>
			<!-- Mother Education -->
			<div class="col-2">
				{@render renderInput(
					'studentData.parentGuardianDetails.motherDetails.motherEducation',
					'Mother Education',
					false,
					'text',
					formData.studentData.parentGuardianDetails.motherDetails.motherEducation ?? '',
					(val) => (formData.studentData.parentGuardianDetails.motherDetails.motherEducation = val),
					20,
				)}
			</div>
			<!-- Parent Current Address -->
			<div class="col-6">
				{@render renderTextarea(
					'studentData.parentGuardianDetails.parentCurrentAddress',
					'Parent Current Address',
					true,
					formData.studentData.parentGuardianDetails.parentCurrentAddress ?? '',
					(val) => (formData.studentData.parentGuardianDetails.parentCurrentAddress = val),
					300,
				)}
			</div>
			<div class="col-6">
				{@render renderTextarea(
					'studentData.parentGuardianDetails.parentPermanentAddress',
					'Parent Permanent Address',
					false,
					formData.studentData.parentGuardianDetails.parentPermanentAddress ?? '',
					(val) => (formData.studentData.parentGuardianDetails.parentPermanentAddress = val),
					300,
				)}
			</div>

			<!-- Primary Guardian Selection -->
			<div class="col-6">
				<label for="primaryGuardian">Primary Guardian <span class="required">*</span></label>
				<div class="radio-section" class:has-error={$formErrors['studentData.parentGuardianDetails.primaryGuardian'] && formSubmitted}>
					{#each GUARDIAN_TYPE as type}
						<div class="radio-item">
							<label class="radio-label">
								<input
									name="type"
									type="radio"
									class="radio-input"
									value={type.name}
									checked={formData?.studentData?.parentGuardianDetails?.primaryGuardian === type.name}
									onchange={() => handleGuardianTypeChange(type.name)} />
								<span class="radio-custom"></span>
								<span class="radio-text">{type.name}</span>
							</label>
						</div>
					{/each}
				</div>
				{#if $formErrors['studentData.parentGuardianDetails.primaryGuardian'] && formSubmitted}
					<p class="error-text">
						{$formErrors['studentData.parentGuardianDetails.primaryGuardian']}
					</p>
				{/if}
			</div>
			<div class="col-6"></div>

			{#if formData.studentData.parentGuardianDetails.primaryGuardian === 'Other'}
				<div class="col-12" transition:slide>
					<div class="grid-12">
						<!-- Guardian First Name -->
						<div class="col-2">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianFirstName',
								'Guardian First Name',
								true,
								'text',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianFirstName ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianFirstName = val),
								20,
							)}
						</div>
						<!-- Guardian Last Name -->
						<div class="col-2">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianLastName',
								'Guardian Last Name',
								true,
								'text',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianLastName ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianLastName = val),
								20,
							)}
						</div>
						<!-- Guardian Phone -->
						<div class="col-2">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianPhone',
								'Guardian Phone',
								true,
								'tel',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianPhone ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianPhone = val),
								10,
							)}
						</div>
						<!-- Guardian Email -->
						<div class="col-2">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianEmail',
								'Guardian Email',
								true,
								'email',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianEmail ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianEmail = val),
								30,
							)}
						</div>
						<!-- Guardian Relation -->
						<div class="col-2">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianRelation',
								'Guardian Relation',
								true,
								'text',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianRelation ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianRelation = val),
								20,
							)}
						</div>
						<!-- Guardian Occupation -->
						<div class="col-1">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianOccupation',
								'Occupation',
								false,
								'text',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianOccupation ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianOccupation = val),
								20,
							)}
						</div>
						<!-- Guardian Education -->
						<div class="col-1">
							{@render renderInput(
								'studentData.parentGuardianDetails.guardianDetails.guardianEducation',
								'Education',
								false,
								'text',
								formData.studentData.parentGuardianDetails.guardianDetails.guardianEducation ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianEducation = val),
								20,
							)}
						</div>
						<!-- Guardian Current Address -->
						<div class="col-6">
							{@render renderTextarea(
								'studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress',
								'Guardian Current Address',
								true,
								formData.studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianCurrentAddress = val),
								300,
							)}
						</div>
						<div class="col-6">
							{@render renderTextarea(
								'studentData.parentGuardianDetails.guardianDetails.guardianPermanentAddress',
								'Guardian Permanent Address',
								false,
								formData.studentData.parentGuardianDetails.guardianDetails.guardianPermanentAddress ?? '',
								(val) => (formData.studentData.parentGuardianDetails.guardianDetails.guardianPermanentAddress = val),
								300,
							)}
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<!-- Fee Details -->
	<div class="card-wrapper">
		<h1>Fee Details</h1>
		<div class="grid-12">
			<div class="col-12">
				{#await import('../fee/FeeDetails.svelte') then { default: FeeDetails }}
					<FeeDetails bind:selectedFeeMasterAssignmentIds bind:selectedFeeDiscountIds={formData.studentData.selectedFeeDiscountIds} />
				{/await}
			</div>
		</div>
	</div>

	<!-- Upload Photo -->
	<div class="card-wrapper">
		<h1>Upload Photo</h1>
		<div class="grid-12">
			<div class="col-2">
				<ImageUploader label="Student Photo" title={''} bind:url={formData.studentData.profile.photo} onSelect={handleImageSelect} action/>
			</div>
			<div class="col-2">
				<ImageUploader label="Father Photo" title={''} bind:url={formData.studentData.parentGuardianDetails.fatherDetails.fatherPhoto} onSelect={handleImageSelect}  action/>
			</div>
			<div class="col-2">
				<ImageUploader label="Mother Photo" title={''} bind:url={formData.studentData.parentGuardianDetails.motherDetails.motherPhoto} onSelect={handleImageSelect}  action/>
			</div>

			{#if formData.studentData.parentGuardianDetails?.primaryGuardian === 'Other'}
				<div class="col-2">
					<ImageUploader label="Guardian Photo" title={''} bind:url={formData.studentData.parentGuardianDetails.guardianDetails.guardianPhoto} onSelect={handleImageSelect}  action/>
				</div>
			{/if}
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
			{#each formData.studentData.documents! as document, index (`${index}_${document.title}`)}
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
				Update Student
			{:else}
				Save Student
			{/if}
		</button>
	</div>
</form>

{#snippet renderInput(fieldName: string, title: string, isRequired = true, type = 'text', value: string, onInput: (val: string) => void, length = 100)}
	<label for={fieldName}>
		{title}
		{#if isRequired}<span class="required">*</span>{/if}
	</label>
	<input
		id={fieldName}
		{type}
		name={fieldName}
		class={`w-full ${$formErrors[fieldName] && (touched[fieldName] || formSubmitted) ? 'input-error' : ''}`}
		{value}
		oninput={(e) => {
			onInput((e.target as HTMLInputElement).value);
			validateStudentForm(formData);
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
			validateStudentForm(formData);
		}}
		onblur={() => handleBlur(fieldName)}
		maxLength={length}
		placeholder="Enter {title.toLowerCase()}"></textarea>

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

	.card-wrapper {padding: 15px; background-color: #ffffff; border-radius: 10px; box-shadow: var(--shadow-sm); margin-bottom: 10px;}
	.radio-group {display: flex; flex-direction: row; gap: 1rem;}
	input[type='radio'] {cursor: pointer;}
	.radio-section {display: flex; flex-wrap: wrap; gap: 1rem;}
	.radio-item {display: flex; align-items: center;}
	.radio-label {display: flex; align-items: center; cursor: pointer;}
	.radio-input {display: none;}
	.radio-custom {width: 1rem; height: 1rem; border: 2px solid #ccc; border-radius: 50%; margin-right: 0.5rem; position: relative;}
	.radio-input:checked + .radio-custom::after {content: ''; width: 0.6rem; height: 0.6rem; background: #007bff; border-radius: 50%; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);}
	.has-error .radio-custom {border-color: red;}
	.placeholder-gray {color: gray;}

    .plus-button,
	.remove-button {color: green; background-color: rgb(238, 237, 237); border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: start; align-self: center; padding: 9px; margin: 0px;}
	.remove-button {color: red;}
	.plus-button:hover,
	.remove-button:hover {background-color: rgb(204, 202, 202);}
	.header-bar {display: flex; justify-content: flex-start; align-items: center; gap: 1rem; margin:0px 0px 15px 0px}
	.header-bar h1 {margin: 0;}

    /* Responsive styles */
    @media (max-width: 1024px) {.grid-5 { grid-template-columns: repeat(3, 1fr);}}
    @media (max-width: 768px) {.grid-5 { grid-template-columns: repeat(2, 1fr);}}
    @media (max-width: 480px) { .grid-5 { grid-template-columns: 1fr;} .form-actions {flex-direction: column;} .btn {width: 100%;}
    }
</style>
