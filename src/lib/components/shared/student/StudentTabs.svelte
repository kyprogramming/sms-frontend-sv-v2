<script lang="ts">
	import { page } from '$app/state';
	import { formatDate } from '$lib/utils/formatDate';

	const student = page.data.studentData?.data.student || null;
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

	// let student = {
	// 	name: 'Emmartinses Thomas Kumar Yadav',
	// 	admissionNo: '0202',
	// 	rollNumber: '2150',
	// 	class: 'Class 3 (2025-26)',
	// 	section: 'B',
	// 	gender: 'Female',
	// 	rte: 'No',
	// 	barcode: '0202',
	// 	qrCode: 'sample-qr.png',
	// 	behaviorScore: 10,
	// 	admissionDate: '04/05/2024',
	// 	dob: '07/14/2016',
	// 	category: 'General',
	// 	mobile: '6881016512',
	// 	caste: 'Thomas',
	// 	religion: 'Christen',
	// 	email: 'thomas01@gmail.com',
	// 	medical: '',
	// 	note: '',
	// 	address: '56 Main Street, Suite 3, Brooklyn, NY 11210-0000',
	// 	parentGuardian: {
	// 		name: 'N/A',
	// 	},
	// };
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
						{@render renderInfo('Email', student.userId.email, false)}
						{@render renderInfo('Mobile Number', student.userId.mobile)}
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
		<p>This is the Fees content.</p>
	{:else if activeTab === 'tab3'}
		<p>This is the Exam content.</p>
	{:else if activeTab === 'tab4'}
		<p>This is the Attendance content.</p>
	{:else if activeTab === 'tab5'}
		<p>This is the Documents content.</p>
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
		font-size: 16px;
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
</style>
