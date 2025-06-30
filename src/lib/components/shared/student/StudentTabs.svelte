<script lang="ts">
	import { page } from '$app/state';
	import UploadDocument from '$lib/components/common/UploadDocument.svelte';
	import { formatDate } from '$lib/utils/formatDate';
	import { any } from 'zod';
	import FeeDetails from '../fee/FeeDetails.svelte';
	import DropdownCategory from '$lib/components/common/DropdownCategory.svelte';
	import ImageUploader from '$lib/components/common/ImageUploader.svelte';
	import FeeTable from '../fee/FeeTable.svelte';

	const student = page.data.studentData?.data.student || null;
	const assignments = page.data.studentData?.data.feeAssignments || null;
	console.log('StudentTabs - studentData:', student);

	let activeTab: string = $state('tab1');

	// const student = page.data.studentData?.data.student || null;

	const tabs = [
		{ id: 'tab1', label: 'Profile' },
		{ id: 'tab2', label: 'Fees' },
		{ id: 'tab3', label: 'Exam' },
		{ id: 'tab4', label: 'Attendance' },
		{ id: 'tab5', label: 'Documents' },
		{ id: 'tab6', label: 'Timeline' },
	];

	function selectTab(id: string) {
		activeTab = id;
	}

	const groupedDocuments = student.documents.reduce((acc: any, doc: any) => {
		if (!acc[doc.category]) {
			acc[doc.category] = [];
		}
		acc[doc.category].push(doc);
		return acc;
	}, {});

	// Check if file is an image
	function isImage(fileName: any) {
		return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
	}
</script>

<div class="tab-header">
	{#each tabs as tab}
		<button class="tab-button {activeTab === tab.id ? 'active' : ''}" onclick={() => selectTab(tab.id)}>
			{tab.label}
		</button>
	{/each}
</div>

<div class="tab-panel">
	{#if activeTab === 'tab1'}
		<div class="card-wrapper">
			<div class="grid-12">
				<div class="col-5">
					<div class="section">
						<h3>Basic Information</h3>
						{@render renderInfo('Full Name', student.profile.fullName)}
						{@render renderInfo('Role', student.userId.role)}
						{@render renderInfo('Class Name', student.classId.name)}
						{@render renderInfo('Section Name', student.sectionId.name)}
						{@render renderInfo('Roll Number', student.rollNo)}
						{@render renderInfo('First Name', student.profile.firstName)}
						{@render renderInfo('Middle Name', student.profile.middleName)}
						{@render renderInfo('Last Name', student.profile.lastName)}
						{@render renderInfo('Admission Date', formatDate(student.admissionDate))}
						{@render renderInfo('Date of Birth', formatDate(student.profile.dob))}
						{@render renderInfo('Category', student.profile.category)}
						{@render renderInfo('Caste', student.profile.caste)}
						{@render renderInfo('Gender', student.profile.gender)}
						{@render renderInfo('Category', student.profile.category)}
						{@render renderInfo('Religion', student.profile.religion)}
						{@render renderInfo('Active', student.userId.isActive ? 'Yes' : 'No')}
					</div>
				</div>

				<div class="col-7">
					<div class="section">
						<h3>Contact Details</h3>
						{@render renderInfo('Student Email', student.userId.email, false)}
						{@render renderInfo('Student Mobile Number', student.userId.mobile)}
						{@render renderInfo('Father Email', student.parentGuardianDetails.fatherDetails.fatherEmail, false)}
						{@render renderInfo('Father Mobile Number', student.parentGuardianDetails.fatherDetails.fatherPhone)}
						{@render renderInfo('Mother Email', student.parentGuardianDetails.motherDetails.motherEmail, false)}
						{@render renderInfo('Mother Mobile Number', student.parentGuardianDetails.motherDetails.motherPhone)}
						{#if student.parentGuardianDetails.primaryGuardian === 'Other'}
							{@render renderInfo('Guardian Email', student.parentGuardianDetails.guardianDetails.guardianEmail, false)}
							{@render renderInfo('Guardian Mobile Number', student.parentGuardianDetails.guardianDetails.guardianPhone)}
						{/if}
					</div>

					<div class="section">
						<h3>Address Details</h3>

						<div class="info-pair">
							<span class="label">Student Address</span>
							<span class="colon">:</span>
							<address class=" value address-block">
								<p>{student.profile.address.street}</p>
								<p>{student.profile.address.city}, {student.profile.address.state} {student.profile.address.postalCode}</p>
								<p>{student.profile.address.country}</p>
							</address>
						</div>

						<div class="info-pair">
							<span class="label">Parent Current Address</span>
							<span class="colon">:</span>
							<address class="value address-block">
								<p>{student.parentGuardianDetails.parentCurrentAddress}</p>
							</address>
						</div>

						<div class="info-pair">
							<span class="label">Parent Permanent Address</span>
							<span class="colon">:</span>
							<address class="value address-block">
								<p>{student.parentGuardianDetails.parentPermanentAddress}</p>
							</address>
						</div>
					</div>
				</div>
			</div>
			<div class="grid-12">
				<div class="col-12">
					<div class="section">
						<h3>Parent Details</h3>
						<div class="grid-12">
							<div class="col-5">
								{@render renderInfo('Father Name', student.parentGuardianDetails.fatherDetails.fatherFirstName + ' ' + student.parentGuardianDetails.fatherDetails.fatherLastName)}
								{@render renderInfo('Father Email', student.parentGuardianDetails.fatherDetails.fatherEmail, false)}
								{@render renderInfo('Father Phone', student.parentGuardianDetails.fatherDetails.fatherPhone)}
								{@render renderInfo('Father Education', student.parentGuardianDetails.fatherDetails.fatherEducation)}
								{@render renderInfo('Father Occupation', student.parentGuardianDetails.fatherDetails.fatherOccupation)}
							</div>
							<div class="col-7">
								{@render renderInfo('Mother Name', student.parentGuardianDetails.motherDetails.motherFirstName + ' ' + student.parentGuardianDetails.motherDetails.motherLastName)}
								{@render renderInfo('Mother Email', student.parentGuardianDetails.motherDetails.motherEmail, false)}
								{@render renderInfo('Mother Phone', student.parentGuardianDetails.motherDetails.motherPhone)}
								{@render renderInfo('Mother Education', student.parentGuardianDetails.motherDetails.motherEducation)}
								{@render renderInfo('Mother Occupation', student.parentGuardianDetails.motherDetails.motherOccupation)}
							</div>
						</div>
					</div>
					{#if student.parentGuardianDetails.primaryGuardian === 'Other'}
						<div class="section">
							<h3>Guardian Details ( Primary - {student.parentGuardianDetails.primaryGuardian})</h3>
							<div class="grid-12">
								<div class="col-5">
									{@render renderInfo(
										'Guardian Name',
										student.parentGuardianDetails.guardianDetails.guardianFirstName + ' ' + student.parentGuardianDetails.guardianDetails.guardianLastName,
									)}
									{@render renderInfo('Guardian Email', student.parentGuardianDetails.guardianDetails.guardianEmail, false)}
									{@render renderInfo('Guardian Phone', student.parentGuardianDetails.guardianDetails.guardianPhone)}
									{@render renderInfo('Guardian Education', student.parentGuardianDetails.guardianDetails.guardianEducation)}
									{@render renderInfo('Guardian Occupation', student.parentGuardianDetails.guardianDetails.guardianOccupation)}
								</div>
								<div class="col-7">
									<div class="info-pair">
										<span class="label">Guardian Current Address</span>
										<span class="colon">:</span>
										<address class="value address-block">
											<p>{student.parentGuardianDetails.guardianDetails.guardianCurrentAddress}</p>
										</address>
									</div>

									<div class="info-pair">
										<span class="label">Guardian Permanent Address</span>
										<span class="colon">:</span>
										<address class="value address-block">
											<p>{student.parentGuardianDetails.guardianDetails.guardianPermanentAddress}</p>
										</address>
									</div>
								</div>
							</div>
						</div>
					{/if}
				</div>
			</div>

			<!-- 	<div class="section">
				<h3>Address</h3>
				{@render renderInfo('Current Address', student.address)}
				{@render renderInfo('Permanent Address', student.address)}
			</div>

			<div class="section">
				<h3>Parent Guardian Detail</h3>
				{@render renderInfo('Name', student.parentGuardian.name)}
			</div>

			<div class="section">
				<h3>Parent Guardian Detail</h3>
				{@render renderInfo('Name', student.parentGuardian.name)}
			</div> -->
		</div>
	{:else if activeTab === 'tab2'}
		<!-- <FeeDetails /> -->
		<FeeTable {assignments} />
	{:else if activeTab === 'tab3'}
		<p>This is the Exam content.</p>
	{:else if activeTab === 'tab4'}
		<p>This is the Attendance content.</p>
	{:else if activeTab === 'tab5'}
		<div class="documents-container">
			{#if student.documents.length > 0}
				<div class="grid-12">
					{#each student.documents! as document, index (`${index}_${document.title}`)}
						<div class="col-2">
							<div class="header-bar">
								{document.category}
							</div>
							<ImageUploader label="" title={document.title} bind:url={document.url} action={'view'} />
							<span class="doc-title">
								{document.title?.split('.')[0]}
								<!-- {document.title} -->
							</span>
						</div>
					{/each}
				</div>
			{:else}
				<p>This is the Documents content.</p>
			{/if}
		</div>
	{:else if activeTab === 'tab6'}
		<p>This is the Timeline content.</p>
	{/if}
</div>

{#snippet renderInfo(label: string, value: string, capitalize: boolean = true)}
	<div class="info-pair">
		<span class="label">{label}</span>
		<span class="colon">:</span>
		<span class="value {capitalize ? 'capitalize' : ''}">{value}</span>
	</div>
{/snippet}

<!-- prettier-ignore -->
<style>
	.tab-header { display: flex; border-bottom: 2px solid #e2e8f0; margin-bottom: 1rem; }
	.tab-button { padding: 0.75rem 1.5rem; cursor: pointer; background: none; border: none; border-bottom: 2px solid transparent; font-weight: 500; color: #4a5568; }
	.tab-button.active { border-color: #3182ce; color: #2b6cb0; }
	.tab-panel { padding: 2px;  }
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
		font-size: 13px;
		margin-bottom: 10px;
		border-bottom: 1px solid #eee;
		padding-bottom: 5px;
        color: #696969;
	}

	.row {
		margin: 5px 0;
	}

	.info-pair {
		display: flex;
		align-items: center;
		font-size: 13px;
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
		min-width: 180px;
		font-weight: 500;
        color: #747373;
        align-self: self-start;
	}

	.colon {
		margin: 0 15px;
        align-self: self-start;
	}

	.value {
		font-weight: 400;
		color: #747373;
        
	}
    .capitalize {
        text-transform: capitalize;
    }
   
    /* documents */
    .documents-container {
    margin: 0 auto;
    padding: 20px;
  }

  .category-section {
    margin-bottom: 30px;
  }

  .category-title {
    font-size: 1.5rem;
    color: #2c3e50;
    margin-bottom: 15px;
    padding-bottom: 8px;
    border-bottom: 2px solid #e0e0e0;
  }

  .documents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
  }

  .document-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
    background: white;
  }

  .document-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }

  .document-preview {
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f5f5f5;
    position: relative;
  }

  .document-preview img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  .pdf-icon {
    font-size: 4rem;
    color: #e74c3c;
  }

  .document-info {
    padding: 15px;
  }

  .document-title {
    font-weight: 600;
    margin-bottom: 8px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .document-meta {
    font-size: 0.85rem;
    color: #7f8c8d;
  }

  .document-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #eee;
  }

  .action-button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.8rem;
    transition: background 0.2s;
  }

  .view-button {
    background: #3498db;
    color: white;
  }

  .view-button:hover {
    background: #2980b9;
  }

  .download-button {
    background: #2ecc71;
    color: white;
  }

  .download-button:hover {
    background: #27ae60;
  }

  .file-type-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 3px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    text-transform: uppercase;
  }








</style>
