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
	const pageTitle = `${schoolName} - Student Details - ${action === 'view' ? ' View' : 'New'}`;

	// State Management
	const studentData = page.data.studentData?.data.student || null;
	const feeAssignments = page.data.studentData?.data.feeAssignments || null;
	const feeMasterData = page.data.feeMasters?.data || [];

	let classList = page.data?.classList || [];
	let classSections: { _id: string; name: string }[] = $state([]);

	let selectedFeeMasterAssignmentIds: string[] = $state([]);

	let student = {
		name: 'Emma Thomas',
		admissionNo: '0202',
		rollNumber: '2150',
		class: 'Class 3 (2025-26)',
		section: 'B',
		gender: 'Female',
		rte: 'No',
		barcode: '0202',
		qrCode: 'sample-qr.png',
		behaviorScore: 10,
		admissionDate: '04/05/2024',
		dob: '07/14/2016',
		category: 'General',
		mobile: '6881016512',
		caste: 'Thomas',
		religion: 'Christen',
		email: 'thomas01@gmail.com',
		medical: '',
		note: '',
		address: '56 Main Street, Suite 3, Brooklyn, NY 11210-0000',
		parentGuardian: {
			name: 'N/A',
		},
	};

	// onMount(() => {
	// 	formErrors.set({});
	// 	// Initialize form data based on action
	// 	if (action === 'update' && studentData) {
	// 		formData = { studentData: { ...studentData }, userData: { ...studentData.userId }, feeMasterAssignments: studentData?.feeMasterAssignments || [] };
	// 		classSections = studentData.classId ? classList.find((cls: any) => cls._id === studentData.classId)?.sectionIds || [] : [];
	// 		formData.studentData.selectedFeeDiscountIds = studentData.selectedFeeDiscountIds || [];
	// 		formData.feeMasterAssignments = studentData.feeMasterAssignments || [];
	// 		selectedFeeMasterAssignmentIds = feeAssignments?.map((assignment: any) => assignment.feeMasterId._id) || [];
	// 		// console.log('Form Data on Mount:', formData);
	// 	}
	// 	touched = {};
	// });
</script>

<svelte:head>
	<title>{pageTitle}</title>
</svelte:head>

<div class="card-wrapper">
    <div class="class-container">
        <div class="sidebar-info">
            <!-- <div class="student-card">
                <div class="profile-pic"></div>
                <div class="top-section">
                    <img src="/default-avatar.png" alt="Profile" class="avatar" />
                    <div class="info">
                        <h2>{name}</h2>
                        <p>Admission No <span class="blue">234245234</span></p>
                        <p>Roll Number <span class="blue">456457</span></p>
                    </div>
                </div>
        
                <div class="actions">
                    <button title="Print"><i class="icon">🖨️</i></button>
                    <button title="Edit"><i class="icon">✏️</i></button>
                    <button title="Fee"><i class="icon">₹</i></button>
                    <button title="View"><i class="icon">🔍</i></button>
                    <button title="Deactivate"><i class="icon">👎</i></button>
                    <button title="More"><i class="icon">⋮</i></button>
                </div>
            </div> -->
            <div class="flex-items-center">
                <div class="profile-pic"></div>
                <div>
                    <h2>{student.name}</h2>
                    <p><strong>Class:</strong> <span class="link">{student.class}</span></p>
                    <p><strong>Section:</strong> <span class="link">{student.section}</span></p>
                </div>
            </div>
    
            <div class="info">
                <p class="info-row"><strong>Admission No</strong><span class="link">{student.admissionNo}</span></p>
                <p class="info-row"><strong>Roll Number</strong><span class="link">{student.rollNumber}</span></p>
                <p class="info-row"><strong>Class</strong><span class="link">{student.class}</span></p>
                <p class="info-row"><strong>Section</strong><span>{student.section}</span></p>
                <p class="info-row"><strong>Gender</strong><span>{student.gender}</span></p>
                <p class="info-row"><strong>RTE</strong><span>{student.rte}</span></p>
                <p class="info-row"><strong>Barcode</strong> <span class="barcode">|| ||| | |||</span></p>
                <p class="info-row"><strong>QR Code</strong><span> <img class="qr-code" src={student.qrCode} alt="QR Code" /></span></p>
                <p class="info-row"><strong>Behavior Score</strong><span>{student.behaviorScore}</span></p>
            </div>
        </div>
    
        <div class="main-content">
            <div class="tabs">
                <div class="tab active">Profile</div>
                <div class="tab">Fees</div>
                <div class="tab">Exam</div>
                <div class="tab">CBSE Examination</div>
                <div class="tab">Attendance</div>
                <div class="tab">Documents</div>
                <div class="tab">Timeline</div>
                <div class="tab">Student Behaviour</div>
            </div>
    
            <div class="section">
                <h3>Basic Information</h3>
                <div class="info-pair">
                    <span class="label">Admission Date</span>
                    <span class="colon">:</span>
                    <span class="value">{student.admissionDate}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Date of Birth</span>
                    <span class="colon">:</span>
                    <span class="value">{student.dob}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Category</span>
                    <span class="colon">:</span>
                    <span class="value">{student.category}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Mobile Number</span>
                    <span class="colon">:</span>
                    <span class="value">{student.mobile}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Caste</span>
                    <span class="colon">:</span>
                    <span class="value">{student.caste}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Religion</span>
                    <span class="colon">:</span>
                    <span class="value">{student.religion}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Email</span>
                    <span class="colon">:</span>
                    <span class="value">{student.email}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Medical History</span>
                    <span class="colon">:</span>
                    <span class="value">{student.medical}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Note</span>
                    <span class="colon">:</span>
                    <span class="value">{student.note}</span>
                </div>
            </div>
    
            <div class="section">
                <h3>Address</h3>
    
                <div class="info-pair">
                    <span class="label">Current Address</span>
                    <span class="colon">:</span>
                    <span class="value">{student.address}</span>
                </div>
    
                <div class="info-pair">
                    <span class="label">Permanent Address</span>
                    <span class="colon">:</span>
                    <span class="value">{student.address}</span>
                </div>
            </div>
    
            <div class="section">
                <h3>Parent Guardian Detail</h3>
                <div class="info-pair">
                    <span class="label">Name</span>
                    <span class="colon">:</span>
                    <span class="value">{student.parentGuardian.name}</span>
                </div>
            </div>
    
            <div class="section">
                <h3>Parent Guardian Detail</h3>
                <div class="info-pair">
                    <span class="label">Name</span>
                    <span class="colon">:</span>
                    <span class="value">{student.parentGuardian.name}</span>
                </div>
            </div>
    
    
        </div>
    </div>
</div>


<style>
    	.card-wrapper {background-color: #ffffff; border-radius: 10px; box-shadow: var(--shadow-sm); margin-top: 6px; margin-bottom: 10px; }
	.flex-items-center {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		justify-items: center;
		align-items: center;
		gap: 1rem;
		border-bottom: 1px solid #c9c8c8;
	}
	.student-view {
		display: flex;
		font-family: Arial, sans-serif;
		color: #333;
	}

	.sidebar-info {
		width: 350px;

		padding: 10px;
		border-right: 1px solid #ccc;
		border-radius: 8px;
	}

	.profile-pic {
		width: 90px;
		height: 90px;
		background: #ddd;
		border-radius: 50%;
		margin-bottom: 10px;
	}

	.sidebar-info h2 {
		font-size: 18px;
		margin: 5px 0;
	}

	.link {
		color: #2196f3;
	}

	.info {
		margin-top: 20px;
		font-size: 14px;
	}

	.info-row {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 6px 0;
		color: #555;
		border-bottom: 1px solid #ebebeb;
		margin: 10px;
		/* line-height: 1.4; */
	}

	.link {
		color: #2196f3;
		font-weight: 400;
	}

	.barcode {
		height: 40px;
		background: repeating-linear-gradient(to right, black 0px, black 2px, white 2px, white 4px);
		width: 100px;
		margin-bottom: 10px;
	}

	.qr-code {
		width: 60px;
		height: 60px;
		margin-bottom: 10px;
	}

	.main-content {
		flex: 1;
		padding: 15px;
		padding-top: 5px;
	}

	.tabs {
		display: flex;
		gap: 16px;
		border-bottom: 2px solid #f0f0f0;
		margin-bottom: 20px;
	}

	.tab {
		padding: 10px;
		cursor: pointer;
		border-bottom: 2px solid transparent;
	}

	.tab.active {
		border-bottom-color: #ffc107;
		font-weight: bold;
	}

	.section {
		margin-bottom: 20px;
	}

	.section h3 {
		font-size: 16px;
		margin-bottom: 10px;
		border-bottom: 1px solid #eee;
		padding-bottom: 5px;
	}

	.row {
		margin: 5px 0;

	}

	.info-pair {
		display: flex;
		align-items: center;
		font-size: 14px;
		color: #444;
		padding: 0.5rem 0;
	}

	.icon {
		width: 20px;
		display: inline-block;
		text-align: center;
		margin-right: 6px;
		color: #555;
	}

	.label {
		min-width: 150px;
		font-weight: 500;
	}

	.colon {
		margin: 0 15px;
	}

	.value {
		font-weight: 400;
		color: #222;
	}
</style>
