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
	import { Printer, Pencil, IndianRupee, Search, ThumbsDown, MoreVertical } from '@lucide/svelte';

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

	import StudentTabs from './StudentTabs.svelte';

	// Component Props
	let { action } = $props();

	// Derived Data
	// const schoolName = env.PUBLIC_SCHOOL_NAME || 'Default School';
	// const pageTitle = `${schoolName} - Student Details - ${action === 'view' ? ' View' : 'New'}`;

	// State Management
	const studentData = page.data.studentData?.data.student || null;
	const feeAssignments = page.data.studentData?.data.feeAssignments || null;
	const feeMasterData = page.data.feeMasters?.data || [];

	let classList = page.data?.classList || [];
	let classSections: { _id: string; name: string }[] = $state([]);

	let selectedFeeMasterAssignmentIds: string[] = $state([]);

	let student = {
		name: 'Emmaniasdfa Thomas Kumari yadav',
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

<!-- <svelte:head>
	<title>{pageTitle}</title>
</svelte:head> -->

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
			<div class="student-header">
				<div class="info">
					<h2>{student.name}</h2>
				</div>
				<div class="top">
					<div class="profile-pic"></div>
					<div class="info-class">
						<p><strong>Class:</strong> <span class="link">{student.class}</span></p>
						<p><strong>Section:</strong> <span class="link">{student.section}</span></p>
					</div>
				</div>

				<div class="actions">
					<button title="Print" class="action-btn">
						<Printer class="icon" size={20} />
					</button>
					<button title="Edit" class="action-btn">
						<Pencil class="icon" size={20} />
					</button>
					<button title="Fee" class="action-btn">
						<IndianRupee class="icon" size={20} />
					</button>
					<button title="View" class="action-btn">
						<Search class="icon" size={20} />
					</button>
					<button title="Deactivate" class="action-btn warning">
						<ThumbsDown class="icon" size={20} />
					</button>
					<button title="More" class="action-btn more">
						<MoreVertical class="icon" size={20} />
					</button>
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
			<StudentTabs />
			<!-- <div class="tabs">
				<div class="tab active">Profile</div>
				<div class="tab">Fees</div>
				<div class="tab">Exam</div>
				<div class="tab">Attendance</div>
				<div class="tab">Documents</div>
				<div class="tab">Timeline</div>
			</div> -->
		</div>
	</div>
</div>

<style>
	.card-wrapper {
		background-color: #ffffff;
		border-radius: 10px;
		box-shadow: var(--shadow-sm);
		margin-top: 6px;
		margin-bottom: 10px;
	}

	.student-header {
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
		padding: 0.5rem;
		padding-top: 0;
		border: 1px solid #ccc;
		border-radius: 8px;
		background: #f8f8f8;
        margin-bottom: 1rem;
	}

	.top {
		display: flex;
		align-items: center;
		gap: 1rem;
	}

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
		width: 360px;
		padding: 0.5rem;
		padding-top: 0;
		border-right: 1px solid #ccc;
	}

	.profile-pic {
		width: 90px;
		height: 90px;
		background: #ddd;
		border-radius: 50%;
		margin-bottom: 10px;
	}

	.info-class {
		margin-top: 0px;
		justify-content: start;
	}

	.sidebar-info h2 {
		font-size: 18px;
		margin: 5px 0;
	}

	.link {
		color: #2196f3;
	}

	.info {
		margin-top: 0.5rem;
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
		padding-top: 0px;
	}

	.actions {
		display: flex;
		justify-content: space-between;
		gap: 8px;
	}

	.action-btn {
		background: none;
		border: none;
		width: 40px;
		height: 40px;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		cursor: pointer;
		color: #64748b;
		transition: all 0.2s ease;
	}

	.action-btn:hover,
	.action-btn.more:hover {
		background-color: #cbd1d6;
		color: #3b82f6;
	}

	.action-btn.warning:hover {
		color: #ef4444;
	}

	.action-btn.more {
		background-color: #ececec;
	}

	.icon {
		stroke-width: 1.5;
	}
</style>
